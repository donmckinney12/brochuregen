package main

import (
	"net/http"

	"github.com/donmckinney12/brochuregen/backend-go/services"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
			"service": "backend-go",
		})
	})

	// Scrape endpoint
	r.POST("/scrape", func(c *gin.Context) {
		var input struct {
			URL string `json:"url" binding:"required"`
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		result := services.ScrapeWebsite(input.URL)
		if result.Error != "" {
			c.JSON(http.StatusInternalServerError, result)
			return
		}

		c.JSON(http.StatusOK, result)
	})

	// Run the server on port 8080
	r.Run(":8080")
}
