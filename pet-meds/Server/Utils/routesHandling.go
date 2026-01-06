package Utils

import (
	"bytes"
	"encoding/json"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
)





func (h *RequestHandler) CreateMedicineEntryHandler(c *fiber.Ctx) error {
	var req CreateMedicineEntryRequest

	decoder := json.NewDecoder(bytes.NewReader(c.Body()))
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&req); err != nil {
		return h.sendErrorResponse(c, fiber.StatusBadRequest, "Invalid JSON format", err)
	}

	BroadcastMessage(req.Date)

	medicationEntry, err := h.dbService.CreateMedicineEntry(&req)
	if err != nil {
		log.Printf("Database error creating entry: %v", err)
		return h.sendErrorResponse(c, fiber.StatusInternalServerError, "Failed to create entry", nil)
	}


	response := APIResponse{
		Success: true,
		Message: "Medicine entry created successfully",
		Data: medicationEntry,
	}

	return c.Status(fiber.StatusCreated).JSON(response)
}


func (h *RequestHandler) ReadMedicineEntryHandler(c *fiber.Ctx) error {
	date := c.Query("date")

	medicationEntries, err := h.dbService.ReadMedicineEntry(date)
	if err != nil {
		log.Printf("Database error reading entries: %v", err)
		return h.sendErrorResponse(c, fiber.StatusInternalServerError, "Failed to read entries", nil)
	}

	response := APIResponse{
		Success: true,
		Message: "Read medicine entries",
		Data: medicationEntries,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}


func (h *RequestHandler) DeleteMedicineEntryHandler(c *fiber.Ctx) error {
	var req DeleteMedicineEntryRequest

	decoder := json.NewDecoder(bytes.NewReader(c.Body()))
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&req); err != nil {
		return h.sendErrorResponse(c, fiber.StatusBadRequest, "Invalid JSON format", err)
	}

	BroadcastMessage(req.Date)

	err := h.dbService.DeleteMedicineEntry(&req)
	if err != nil {
		log.Printf("Database error deleting entry: %v", err)
		return h.sendErrorResponse(c, fiber.StatusInternalServerError, "Failed to delete entry", nil)
	}

	response := APIResponse{
		Success: true,
		Message: "Deleted entry successfully",
	}

	return c.Status(fiber.StatusOK).JSON(response)
}


func (h *RequestHandler) ReadTemplateHandler(c *fiber.Ctx) error {
	data, err := os.ReadFile("template.json")
	if err != nil {
		log.Printf("Json template error: %v", err)
		return h.sendErrorResponse(c, fiber.StatusInternalServerError, "Failed to read file", nil)
	}
	
	var jsonData interface{}
	if err := json.Unmarshal(data, &jsonData); err != nil {
		log.Printf("Json parsing error: %v", err)
		return h.sendErrorResponse(c, fiber.StatusInternalServerError, "Failed to parse json", nil)
	}


	response := APIResponse{
		Success: true,
		Message: "Template found successfully",
		Data: jsonData,
	}

	return c.Status(fiber.StatusOK).JSON(response)
}



func (h *RequestHandler) sendErrorResponse(c *fiber.Ctx, statusCode int, message string, err error) error {
	response := APIError{
		Success: false,
		Message: message,
	}

	if err != nil && GetDevMode() {
		response.Error = err.Error()
	}

	log.Printf("Error: %s", response.Error)
	return c.Status(statusCode).JSON(response)
}


