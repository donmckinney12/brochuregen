package services

import (
	"strings"
	"sync"

	"github.com/gocolly/colly/v2"
)

// ScrapeResult represents the data extracted from a website
type ScrapeResult struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Content     string `json:"content"`
	URL         string `json:"url"`
	Error       string `json:"error,omitempty"`
}

// ScrapeWebsite uses Colly to scrape a website concurrently
func ScrapeWebsite(url string) ScrapeResult {
	c := colly.NewCollector(
		colly.AllowedDomains(),
		colly.MaxDepth(1),
	)

	var result ScrapeResult
	result.URL = url

	var contentBuilder strings.Builder
	var mu sync.Mutex

	c.OnHTML("title", func(e *colly.HTMLElement) {
		result.Title = e.Text
	})

	c.OnHTML("meta[name=description]", func(e *colly.HTMLElement) {
		result.Description = e.Attr("content")
	})

	c.OnHTML("p, h1, h2, h3, li", func(e *colly.HTMLElement) {
		mu.Lock()
		contentBuilder.WriteString(e.Text + "\n")
		mu.Unlock()
	})

	err := c.Visit(url)
	if err != nil {
		result.Error = err.Error()
	}

	result.Content = strings.TrimSpace(contentBuilder.String())
	return result
}
