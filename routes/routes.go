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
	app.Post("/api/deletepost/", controllers.DeletePost)
	app.Post("/api/editpost/", controllers.EditPost)

	app.Post("/api/newcomment/", controllers.NewComment)
	app.Post("/api/deletecomment/", controllers.DeleteComment)

	app.Use(controllers.Home)

}
