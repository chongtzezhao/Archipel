package models

import "gorm.io/gorm"

type Comment struct {
	gorm.Model
	Body        string          `json:"bodyText" gorm:"not null"`
	Username    string          `json:"username" gorm:"not null"`
	PostID      uint            `json:"postID"`
	Status      string          `json:"status" gorm:"not null;default:'draft'"`
	CommUpvotes []CommentUpvote `json:"upvotes" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	// Image blob
	// video blob
}
