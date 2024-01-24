package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username     string          `json:"username" gorm:"unique;not null;size:20"`
	Email        string          `json:"email" gorm:"unique;not null"`
	PasswordHash []byte          `json:"-" gorm:"not null"`
	Posts        []Post          `gorm:"foreignKey:Username;references:Username;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Comments     []Comment       `gorm:"foreignKey:Username;references:Username;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	CommUpvotes  []CommentUpvote `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	PostUpvotes  []PostUpvote    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Topics       []Topic         `gorm:"many2many:user_topics;"`
}
