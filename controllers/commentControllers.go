package controllers

import (
	"strconv"

	"github.com/chongtzezhao/archipel/database"
	"github.com/chongtzezhao/archipel/models"
	"github.com/gofiber/fiber/v2"
)

func NewComment(c *fiber.Ctx) error {
	var data map[string]any

	if err := c.BodyParser(&data); err != nil {
		return c.JSON(fiber.Map{
			"message": "Error in parsing request.body",
		})
	}

	bodyText := data["bodyText"].(string)
	username := data["username"].(string)

	if bodyText == "" || username == "" {
		return c.JSON(fiber.Map{
			"message": "Error in parsing request.body",
		})
	}

	postID, err := strconv.Atoi(data["postID"].(string))

	if err != nil {
		return c.JSON(fiber.Map{
			"message": "Error in parsing request.body",
		})
	}

	comment := models.Comment{
		Body:     data["bodyText"].(string),
		Username: data["username"].(string),
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
