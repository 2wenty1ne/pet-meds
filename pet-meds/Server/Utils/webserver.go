package Utils

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

type RequestHandler struct {
	dbService *DBService
}

func newRequestHandler(dbService *DBService) *RequestHandler {
	return &RequestHandler{dbService: dbService}
}

func SetupRoutes(app *fiber.App, dbService *DBService) {
	requestHandler := newRequestHandler(dbService)

	api := app.Group("/api/v1")

	api.Get("/medicine", requestHandler.ReadMedicineEntryHandler)
	api.Post("/medicine", requestHandler.CreateMedicineEntryHandler)
	api.Delete("/medicine", requestHandler.DeleteMedicineEntryHandler)
	api.Get("/template", requestHandler.ReadTemplateHandler)
	
	api.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}

		return fiber.ErrUpgradeRequired
	})

	api.Get("/ws", websocket.New(HandleWebSocket))
}
