package database

import (
	"fmt"
	"os"

	"github.com/chongtzezhao/archipel/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	var err error
	dsn := os.Getenv("DB_URL")
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Println("Failed to connect to database")
	}
	// use db variable
	DB.AutoMigrate(&models.User{})
	DB.AutoMigrate(&models.Post{})
	DB.AutoMigrate(&models.Topic{})
	DB.AutoMigrate(&models.Comment{})
	DB.AutoMigrate(&models.CommentUpvote{})
	DB.AutoMigrate(&models.PostUpvote{})
}
