package Utils

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load("./../.env")
	if err != nil {
		log.Println("No .env file found (this is normal in production)")
	}
}


func GetDevMode() bool {
	key := "DEV_MODE"
	devModeString := readEnvValue(key, "false")

	devMode, err := strconv.ParseBool(devModeString)
	if err != nil {
		log.Fatal(err)
	}

	return devMode
}

func GetWebserverPort() string {
	key := "VITE_WEBSERVER_PORT"
	return readEnvValue(key, "8080")
}


func readEnvValue(key string, defaultString string, causeCrashPar ...bool) string {
	causeCrash := false
	if len(causeCrashPar) > 0 {
		causeCrash = causeCrashPar[0]
	}

	value := os.Getenv(key)
	if value != "" {
		return value
	}

	if (causeCrash) {
		errorMsg := fmt.Sprintf("Fatal Parameter %s missing", key)
		log.Fatal(errorMsg)
	}

	log.Printf("%s missing, defaulting to %s", key, defaultString)
	return defaultString
}