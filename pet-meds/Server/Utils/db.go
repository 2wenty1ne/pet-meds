package Utils

import (
	"database/sql"
	"log"

	_ "github.com/glebarez/go-sqlite"
)

type DBService struct {
	db *sql.DB
}

func DBConnect() *DBService {
	db, err := sql.Open("sqlite", "./my.db")
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to the SQLite database successfully.")

	return &DBService{db: db}
}


func (r *DBService) DBClose() {
	log.Printf("Closing connection to database")
	r.db.Close()
}
