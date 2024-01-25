package controllers

import (
	"fmt"
	"strconv"
	"time"

	"github.com/chongtzezhao/archipel/auth"
	"github.com/chongtzezhao/archipel/database"
	"github.com/chongtzezhao/archipel/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	passwordHash, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)

	fmt.Println(data["username"])
	fmt.Println(data["email"])
	fmt.Println(data["passwordHash"])

	user := models.User{
		Username:     data["username"],
		Email:        data["email"],
		PasswordHash: passwordHash,
	}

	database.DB.Create(&user)
	fmt.Println("created ok")

	return c.JSON(user)
}

func Login(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User

	database.DB.Where("email = ?", data["email"]).First(&user)

	fmt.Println(user)

	if user.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "User not found",
		})
	}

	if err := bcrypt.CompareHashAndPassword(user.PasswordHash, []byte(data["password"])); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Incorrect password",
		})
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), // 1 day
	})

	token := auth.GenerateToken(claims)

	if token == "error" {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Could not log in",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(user)
}

func User(c *fiber.Ctx) error {
	user, err := auth.GetAuthUser(c)
	if err != nil {
		return err
	}
	fmt.Println(user)
	return c.JSON(user)
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "Success",
	})
}
