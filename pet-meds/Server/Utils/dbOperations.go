package Utils

import (
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
)


func (s* DBService) CreateMedicineEntry(req *CreateMedicineEntryRequest) (*MedicationEntry, error) {
	query := 
	`INSERT INTO "entries"
	("uuid", "date", "day_part", "user", "pet", "medication", "updated_at")
	VALUES ($1, $2, $3, $4, $5, $6, $7)
	RETURNING uuid, date, day_part, user, pet, medication, updated_at
	`

	uuid := uuid.New()
	currentTime := time.Now()

	log.Printf("Creating with ID: %v", uuid)

	var medicationEntry MedicationEntry

	err := s.db.QueryRow(query, uuid, req.Date, req.DayPart, req.User, req.Pet, req.Medication, currentTime).Scan(
		&medicationEntry.ID,
		&medicationEntry.Date,
		&medicationEntry.DayPart,
		&medicationEntry.User,
		&medicationEntry.Pet,
		&medicationEntry.Medication,
		&medicationEntry.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create entry: %w", err)
	}

	return &medicationEntry, nil
}


func (s* DBService) ReadMedicineEntry(date string) ([]MedicationEntry, error) {
	query :=
	`SELECT uuid, date, day_part, user, pet, medication, updated_at
	FROM entries
	WHERE date = $1
	`

	rows, err := s.db.Query(query, date)
	if err != nil {
		return nil, fmt.Errorf("failed to read entries: %w", err)
	}
	defer rows.Close()


	var entries []MedicationEntry

	for rows.Next() {
		var entry MedicationEntry
		err := rows.Scan(
            &entry.ID,
            &entry.Date,
            &entry.DayPart,
            &entry.User,
            &entry.Pet,
            &entry.Medication,
            &entry.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan entries: %w", err)
		}

		entries = append(entries, entry)
	}

	log.Printf("Read %v rows",len(entries))

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}
	
	return entries, nil
}


func (s* DBService) DeleteMedicineEntry(req *DeleteMedicineEntryRequest) error {
	query :=
	`DELETE FROM "entries"
	WHERE uuid = $1`

	log.Printf("Deleting with id: %v", req.ID)

	result, err := s.db.Exec(query, req.ID)
	if err != nil {
		return fmt.Errorf("failed to delete medicine entry: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to check result: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("entry with id %s not found", req.ID)
	}

	return nil
}


func (s* DBService) GetVersion() {
	var sqliteVersion string
	err := s.db.QueryRow("select sqlite_version()").Scan(&sqliteVersion)
    if err != nil {
        log.Println(err)
        return
    }

	log.Println(sqliteVersion)
}