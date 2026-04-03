package main

import (
	"encoding/json"
	"fmt"
	"os"
)

// Data structures matching your JSON format
type Medication struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type DayPart struct {
	Part       string       `json:"part"`
	Medication []Medication `json:"medication"`
}

type Pet struct {
	Name     string   `json:"name"`
	Title    string   `json:"titleName"`
	DayParts []DayPart `json:"dayParts"`
}

type RootData struct {
	Pet []Pet `json:"pet"`
}

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: validate_json <path_to_json_file>")
		os.Exit(1)
	}

	filePath := os.Args[1]

	// 1. Read the file
	data, err := os.ReadFile(filePath)
	if err != nil {
		fmt.Printf("❌ Error reading file: %v\n", err)
		os.Exit(1)
	}

	// 2. Unmarshal into the struct
	var dataObj RootData
	if err := json.Unmarshal(data, &dataObj); err != nil {
		fmt.Printf("❌ Invalid JSON syntax: %v\n", err)
		os.Exit(1)
	}

	// 3. Validate Structure
	if err := validateStructure(dataObj); err != nil {
		fmt.Printf("❌ Validation failed: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("✅ JSON structure is valid.")
}

func validateStructure(data RootData) error {
	// Check root 'pet' array
	if len(data.Pet) == 0 {
		return fmt.Errorf("'pet' array cannot be empty")
	}

	for i, pet := range data.Pet {
		// Validate Pet fields
		if pet.Name == "" {
			return fmt.Errorf("pet[%d]: 'name' is missing or empty", i)
		}
		if pet.Title == "" {
			return fmt.Errorf("pet[%d]: 'titleName' is missing or empty", i)
		}

		// Validate DayParts
		if len(pet.DayParts) == 0 {
			return fmt.Errorf("pet[%d] '%s': 'dayParts' array cannot be empty", i, pet.Name)
		}

		for j, dayPart := range pet.DayParts {
			if dayPart.Part == "" {
				return fmt.Errorf("pet[%d] '%s': dayParts[%d]: 'part' is missing or empty", i, pet.Name, j)
			}

			// Validate Medications
			if len(dayPart.Medication) == 0 {
				return fmt.Errorf("pet[%d] '%s': dayParts[%d]: 'medication' array cannot be empty", i, pet.Name, j)
			}

			for k, med := range dayPart.Medication {
				if med.ID == "" {
					return fmt.Errorf("pet[%d] '%s': dayParts[%d]: medication[%d]: 'id' is missing or empty", i, pet.Name, j, k)
				}
				if med.Name == "" {
					return fmt.Errorf("pet[%d] '%s': dayParts[%d]: medication[%d]: 'name' is missing or empty", i, pet.Name, j, k)
				}
				if med.Description == "" {
					return fmt.Errorf("pet[%d] '%s': dayParts[%d]: medication[%d]: 'description' is missing or empty", i, pet.Name, j, k)
				}
			}
		}
	}

	return nil
}