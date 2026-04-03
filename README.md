# Pet Meds Tracker

A self-hosted solution for tracking which medications your pet needs or has already received each day.  

> [!IMPORTANT]
> **Don't blindly trust this app with your pet's health. There is no guarantee the app will work without issues.**

## Features
- Track daily medications for your pets
- Mark medications as given
- Self-hosted - your data stays on your server


## Installation
This tool isn't available as a website. It needs to be hosted on a own server.  

### Prerequisites
- Docker and Docker Compose installed on your server
  - [Install Docker](https://docs.docker.com/get-docker/)

### Setup Steps

**1. Create docker-compose.yml**  
Create a new directory and a file called `docker-compose.yml` inside it:
```bash
mkdir pet-meds
cd pet-meds
nano docker-compose.yml  # or use your preferred text editor
```  

**2. Add configuration**  
Paste the following into `docker-compose.yml`:
```yaml
services:
  frontend:
    image: 2wenty1ne/pet-meds-frontend:latest
    container_name: pet-meds-frontend
    volumes:
      - static-files:/app/Frontend/dist
    restart: "no"

  backend:
    image: 2wenty1ne/pet-meds-server:latest
    container_name: pet-meds-server
    volumes:
      - static-files:/app/Server/dist:ro
      - sqlite-data:/app/Server/db
      - ./template.json:/app/Server/template.json:ro
    ports:
      - 80:80
    depends_on:
      - frontend
    command: >
      sh -c "
      if [ ! -f ./template.json ]; then
        echo '❌ ERROR: ./template.json not found in root directory.';
        exit 1;
      fi;
      /app/Server/validateJson /app/Server/template.json && ./server
      "

volumes:
  static-files:
  sqlite-data:
```  

**3. (Optional) Change the port**  
```yaml
backend:
  image: 2wenty1ne/pet-meds-server:latest
  container_name: pet-meds-server
  volumes:
    - static-files:/app/Server/dist:ro
    - sqlite-data:/app/Server/db
    - ./template.json:/app/Server/template.json:ro
  ports:
    - 8080:80  # Change 8080 to your desired port
  depends_on:
    - frontend
  command: >
    sh -c "/app/Server/validateJson /app/Server/template.json && ./server"
```  
Then access the application at:
- **Same machine:** http://localhost:8080
- **Different machine:** http://your-server-ip:8080  


**4. Start the application**  
Run the following command in the same directory:
```bash
docker compose up -d
```

**5. Access the application**  
Open your browser and navigate to:
- **Same machine:** http://localhost
- **Different machine on same network:** http://your-server-ip    

### Stopping the application
```bash
docker compose down
```

### Updating to a new version
```bash
docker compose pull
docker compose up -d
```  

## Tech Stack
- Frontend: React + Vite + TypeScript
- Backend: Go
- Database: SQLite
- Deployment: Docker

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

# Dev
Dev version of the docker-compose file
- add .env file for frontend and server
```Dockerfile
services:
  frontend:
    image: 2wenty1ne/pet-meds-frontend:1.0
    container_name: pet-meds-frontend
    build:
      context: ./Frontend
      dockerfile: Dockerfile
    volumes:
      - static-files:/app/Frontend/dist
    restart: "no"

  backend:
    image: 2wenty1ne/pet-meds-server:1.0
    container_name: pet-meds-server
    build:
      context: ./Server
      dockerfile: Dockerfile
    volumes:
      - static-files:/app/Server/dist:ro
      - sqlite-data:/app/Server/db
    ports:
      - 80:80
    depends_on:
      - frontend

volumes:
  static-files:
  sqlite-data:
```
