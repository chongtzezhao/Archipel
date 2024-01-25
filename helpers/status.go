package helpers

import (
	"github.com/gofiber/fiber/v2"
)

func StatusSuccess(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func StatusCustom(c *fiber.Ctx, message string) error {
	return c.JSON(fiber.Map{
		"message": message,
	})
}
