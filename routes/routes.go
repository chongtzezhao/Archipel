package routes

import (
	"github.com/chongtzezhao/archipel/controllers"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	// backend api routes
	app.Get("/", controllers.Home)
	app.Post("/api/register", controllers.Register)
	app.Post("/api/login", controllers.Login)
	app.Post("/api/logout", controllers.Logout)
	app.Get("/api/user", controllers.User)

	app.Post("/api/newpost", controllers.NewPost)
	app.Get("/api/posts", controllers.GetPosts)
	app.Get("/api/singlepost/", controllers.GetSinglePost)

	app.Post("/api/newcomment/", controllers.NewComment)

	// frontend routes
	frontend := []string{"", "login", "register", "posts", "post/:id", "newpost", "werw/werrw"}

	for _, route := range frontend {
		app.Get("/"+route, controllers.Home)
	}

	app.Use(controllers.Home)

}
