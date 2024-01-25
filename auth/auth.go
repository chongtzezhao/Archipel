package auth

import (
	"github.com/chongtzezhao/archipel/database"
	"github.com/chongtzezhao/archipel/helpers"
	"github.com/chongtzezhao/archipel/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
)

const SecretKey = "secret"

func GenerateToken(claims *jwt.Token) string {
	token, err := claims.SignedString([]byte(SecretKey))

	if err != nil {
		return "error"
	}

	return token
}

func GetAuthUser(c *fiber.Ctx) (models.User, error) {
	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	var user models.User

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return user, helpers.StatusCustom(c, "Not logged in")
	}

	claims := token.Claims.(*jwt.StandardClaims)

	database.DB.Where("ID = ?", claims.Issuer).First(&user)

	return user, nil
}
