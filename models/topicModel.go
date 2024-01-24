package models

import "gorm.io/gorm"

type Topic struct {
	gorm.Model
	Name  string `json:"name" gorm:"unique;not null"`
	Users []User `gorm:"many2many:user_topics;"`
	Posts []Post `gorm:"many2many:post_topics;"`
}
