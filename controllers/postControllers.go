package controllers

import (
	"fmt"
	"strconv"

	"github.com/chongtzezhao/archipel/database"
	"github.com/chongtzezhao/archipel/models"
	"github.com/gofiber/fiber/v2"
)

func NewPost(c *fiber.Ctx) error {
	var data map[string]any

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	topicIntr := data["topics"].([]interface{})
	topics := make([]models.Topic, len(topicIntr))

	for i, topicName := range topicIntr {
		topics[i] = models.Topic{Name: fmt.Sprint(topicName)} // { interface -> string } -> topic
		database.DB.FirstOrCreate(&topics[i], topics[i])
	}

	post := models.Post{
		Title:    data["title"].(string),
		Body:     data["bodyText"].(string),
		Username: data["username"].(string),
		Status:   "draft",
		Topics:   topics,
	}

	result := database.DB.Create(&post)

	if result.Error != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Something went wrong",
		})
	}

	return c.JSON(post)
}

func GetPosts(c *fiber.Ctx) error {
	var posts []models.Post

	database.DB.Preload("Topics").Find(&posts).Order("created_at desc")

	return c.JSON(posts)
}

func GetSinglePost(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Query("id"))

	if err != nil {
		return c.JSON(fiber.Map{
			"message": "Invalid ID",
		})
	}
	var post models.Post

	database.DB.Preload("Topics").Preload("Comments").First(&post, id) // PK
	fmt.Println("MY POST: " + c.Query("id"))
	fmt.Println(post)

	return c.JSON(post)
}

func GetUserPosts(c *fiber.Ctx) error {
	var posts []models.Post

	username := c.Query("username")

	database.DB.Preload("Topics").Where("username = ?", username).Find(&posts).Order("created_at desc")

	return c.JSON(posts)
}
