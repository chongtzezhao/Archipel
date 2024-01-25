package models

import "gorm.io/gorm"

type Post struct {
	gorm.Model
	Title       string       `json:"title" gorm:"not null"`
	Body        string       `json:"bodyText" gorm:"not null"`
	Username    string       `json:"username" gorm:"not null"`
	Status      string       `json:"status" gorm:"not null;default:'published'"`
	PostUpvotes []PostUpvote `json:"upvotes" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Comments    []Comment    `json:"comments" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Topics      []Topic      `json:"topics" gorm:"many2many:post_topics;"`
	// Image blob
	// video blob
}
