package main

import (
	"os"

	"github.com/chongtzezhao/archipel/database"
	"github.com/chongtzezhao/archipel/initializers"
	"github.com/chongtzezhao/archipel/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/template/html/v2"
)

func main() {
	initializers.LoadEnvVariables()
	database.Connect()

	// Load templates
	engine := html.New("./views", ".tmpl")

	// Setup app
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	// Configure app
	app.Static("/", "./public")

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))

	routes.Setup(app)

	// Start app
	app.Listen(":" + os.Getenv("PORT"))
}
