package controllers

import (
	"fmt"

	"github.com/chongtzezhao/archipel/database"
	"github.com/chongtzezhao/archipel/models"
)

func CreateTopics(topicsData any) []models.Topic {
	topicIntf := topicsData.([]interface{})
	topics := make([]models.Topic, len(topicIntf))

	for i, topicName := range topicIntf {
		topics[i] = models.Topic{Name: fmt.Sprint(topicName)} // { interface -> string } -> topic
		database.DB.FirstOrCreate(&topics[i], topics[i])
	}

	return topics
}
