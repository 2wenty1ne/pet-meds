package Utils

// import "time"

type MedicationEntry struct {
	ID string `json:"id"`
	Date string `json:"date"`
	DayPart string `json:"day_part"`
	User string `json:"user"`
	Pet string `json:"pet"`
	Medication string `json:"medication"`
	UpdatedAt string `json:"updated_at"`
}


type CreateMedicineEntryRequest struct {
	Date string `json:"date"`
	DayPart string `json:"day_part"`
	User string `json:"user"`
	Pet string `json:"pet"`
	Medication string `json:"medication"`
}

type DeleteMedicineEntryRequest struct {
	ID string `json:"id"`
	Date string `json:"date"`
}


type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

type APIError struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}