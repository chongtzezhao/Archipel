package models

import "gorm.io/gorm"

type PostUpvote struct {
	gorm.Model
	UserID uint `gorm:"primaryKey;autoIncrement:false;not null"`
	PostID uint `gorm:"primaryKey;autoIncrement:false;"`
}

type CommentUpvote struct {
	gorm.Model
	UserID    uint `gorm:"primaryKey;autoIncrement:false;not null"`
	CommentID uint `gorm:"primaryKey;autoIncrement:false;"`
}
