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

func NewComment(c *fiber.Ctx) error {
	user, err := auth.GetAuthUser(c)

	if err != nil {
		return err
	}

	var post models.Post

	if err := assertPostExists(c, &post); err != nil {
		return err
	}

	var data map[string]any

	if err := c.BodyParser(&data); err != nil {
		return helpers.StatusCustom(c, "Error in parsing request.body")
	}

	bodyText := data["bodyText"].(string)

	if bodyText == "" {
		return helpers.StatusCustom(c, "Comment cannot be empty")
	}

	postID, err := strconv.Atoi(data["postID"].(string))

	if err != nil {
		return helpers.StatusCustom(c, "Invalid Post ID")
	}

	comment := models.Comment{
		Body:     bodyText,
		Username: user.Username,
		PostID:   uint(postID),
	}

	result := database.DB.Create(&comment)

	if result.Error != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Database creation error",
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func assertCommentExists(c *fiber.Ctx, comment *models.Comment) error { // post request
	var data map[string]any

	if err := c.BodyParser(&data); err != nil {
		return helpers.StatusCustom(c, "error parsing request body")
	}

	// get post from DB using ID
	id, err := strconv.Atoi(data["commentID"].(string))

	if err != nil {
		return helpers.StatusCustom(c, "Invalid Comment ID")
	}

	if err := database.DB.First(&comment, id).Error; err != nil {
		return helpers.StatusCustom(c, "Comment not found")
	}

	fmt.Println("MY COMMENT: ")
	fmt.Println(comment)

	return nil
}

func assertCommentOwner(c *fiber.Ctx, comment *models.Comment) error {
	if err := assertCommentExists(c, comment); err != nil {
		return err
	}

	user, err := auth.GetAuthUser(c)

	if err != nil || user.Username != comment.Username {
		c.Status(fiber.StatusUnauthorized)
		return helpers.StatusCustom(c, "User not authorized")
	}

	return nil
}

func DeleteComment(c *fiber.Ctx) error {
	// assert comment belongs to user
	var comment models.Comment

	if err := assertCommentOwner(c, &comment); err != nil {
		return err
	}

	// successful authorization, delete comment
	comment.Status = "deleted"
	database.DB.Model(&comment).Updates(comment)

	return helpers.StatusSuccess(c)
}
