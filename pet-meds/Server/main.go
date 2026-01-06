package main

import (
	"log"

	"github.com/2wenty1ne/pet-medication-schedule/Utils"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	dbService := Utils.DBConnect()
	defer dbService.DBClose()

	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			
			return c.Status(code).JSON(Utils.APIError{
				Success: false,
				Message: err.Error(),
			})
		},
		BodyLimit: 1024 * 1024, // 1MB limit
	})

	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowMethods: "GET,POST,DELETE,OPTIONS",
		AllowHeaders: "Content-Type",
	}))

	Utils.SetupRoutes(app, dbService)

	app.Static("/", "../dist")

	
	port := Utils.GetWebserverPort()

	log.Printf("Webserver is listening on port %s", port)
	log.Fatal(app.Listen(":" + port))
}