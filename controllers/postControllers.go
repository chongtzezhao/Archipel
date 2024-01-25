package controllers

import (
	"fmt"
	"strconv"

	"github.com/chongtzezhao/archipel/auth"
	"github.com/chongtzezhao/archipel/database"
	"github.com/chongtzezhao/archipel/helpers"
	"github.com/chongtzezhao/archipel/models"
	"github.com/gofiber/fiber/v2"
)

func NewPost(c *fiber.Ctx) error {
	user, err := auth.GetAuthUser(c)

	if err != nil {
		return err
	}

	var data map[string]any

	if err := c.BodyParser(&data); err != nil {
		return helpers.StatusCustom(c, "Error in parsing request.body")
	}

	topics := CreateTopics(data["topics"])

	post := models.Post{
		Title:    data["title"].(string),
		Body:     data["bodyText"].(string),
		Username: user.Username,
		Status:   "published",
		Topics:   topics,
	}

	result := database.DB.Create(&post)

	if result.Error != nil {
		c.Status(fiber.StatusInternalServerError)
		return helpers.StatusCustom(c, "Record creation error [Post]")
	}

	return c.JSON(post)
}

func GetPosts(c *fiber.Ctx) error {
	var posts []models.Post

	getMode := c.Query("getMode")
	searchQuery := c.Query("searchQuery")

	if getMode == "user" {
		database.DB.Preload("Topics").Where("username = ?", searchQuery).Where("status = ?", "published").Find(&posts).Order("created_at desc")
	} else if getMode == "topic" {
		database.DB.Preload("Topics").Where("status = ?", "published").Where("topics.name = ?", searchQuery).Joins("JOIN post_topics ON post_topics.post_id = posts.id").Joins("JOIN topics ON topics.id = post_topics.topic_id").Find(&posts).Order("created_at desc")
	} else if getMode == "title" {
		database.DB.Preload("Topics").Where("status = ?", "published").Where("title LIKE ?", "%"+searchQuery+"%").Find(&posts).Order("created_at desc")
	} else {
		// get all posts
		database.DB.Preload("Topics").Where("status = ?", "published").Find(&posts).Order("created_at desc")
	}

	return c.JSON(posts)
}

func GetSinglePost(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Query("postID"))

	if err != nil {
		fmt.Println("Invalid Post ID: " + c.Query("postID"))
		return helpers.StatusCustom(c, "Invalid Post ID")
	}
	var post models.Post

	database.DB.Preload("Topics").Preload("Comments", "status = 'published'").First(&post, id) // PK
	fmt.Println("MY POST: " + c.Query("postID"))
	fmt.Println(post)

	return c.JSON(post)
}

func GetUserPosts(c *fiber.Ctx) error {
	var posts []models.Post

	username := c.Query("username")

	database.DB.Preload("Topics").Where("username = ?", username).Find(&posts).Order("created_at desc")

	return c.JSON(posts)
}

func assertPostExists(c *fiber.Ctx, post *models.Post) error {
	var data map[string]any

	if err := c.BodyParser(&data); err != nil {
		return helpers.StatusCustom(c, "error parsing request body")
	}

	// get post from DB using ID
	id, err := strconv.Atoi(data["postID"].(string))

	if err != nil {
		return helpers.StatusCustom(c, "Invalid Post ID")
	}

	if err := database.DB.First(&post, id).Error; err != nil {
		return helpers.StatusCustom(c, "Post not found")
	}

	return nil
}

func assertPostOwner(c *fiber.Ctx, post *models.Post) error {
	if err := assertPostExists(c, post); err != nil {
		return err
	}

	user, err := auth.GetAuthUser(c)

	if err != nil || user.Username != post.Username {
		c.Status(fiber.StatusUnauthorized)
		return helpers.StatusCustom(c, "User not authorized")
	}

	return nil
}

func DeletePost(c *fiber.Ctx) error {

	var post models.Post

	if err := assertPostOwner(c, &post); err != nil {
		return err
	}

	fmt.Println("DELETING POST")

	// successful authorization, delete post
	database.DB.Delete(&post)

	return helpers.StatusSuccess(c)
}

func EditPost(c *fiber.Ctx) error {

	var post models.Post

	if err := assertPostOwner(c, &post); err != nil {
		return helpers.StatusCustom(c, "user not authorized")
	}

	fmt.Println("EDITING POST")

	var data map[string]any
	if err := c.BodyParser(&data); err != nil {
		return helpers.StatusCustom(c, "error parsing request body")
	}

	post.Title = data["title"].(string)
	post.Body = data["bodyText"].(string)
	post.Topics = CreateTopics(data["topics"])

	// successful authorization, update post
	database.DB.Model(&post).Updates(post)

	return helpers.StatusSuccess(c)
}
