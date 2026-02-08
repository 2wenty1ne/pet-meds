# Hosting
Docker-compose to host
```Dockerfile
services:
  frontend:
    image: 2wenty1ne/pet-meds-frontend:1.0
    container_name: pet-meds-frontend
    volumes:
      - static-files:/app/Frontend/dist
    restart: "no"

  backend:
    image: 2wenty1ne/pet-meds-server:1.0
    container_name: pet-meds-server
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

# Dev
Dev version of the docker-compose file
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
