FROM golang:tip-trixie

RUN apt-get update && apt-get install -y npm && apt-get clean

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY Server/go.mod Server/go.sum ./Server/
WORKDIR /app/Server
RUN go mod download

WORKDIR /app

COPY . .

ARG VITE_WEBSERVER_IP=localhost
ARG VITE_WEBSERVER_PORT=8080
ENV VITE_WEBSERVER_IP=$VITE_WEBSERVER_IP
ENV VITE_WEBSERVER_PORT=$VITE_WEBSERVER_PORT

RUN npm run build

WORKDIR /app/Server
RUN go build -v -o server

EXPOSE 8080

CMD [ "./server" ]