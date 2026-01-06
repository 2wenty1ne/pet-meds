package Utils

import (
	"github.com/gofiber/websocket/v2"
)

var clients = make(map[*websocket.Conn]bool)

func HandleWebSocket(c *websocket.Conn) {
	clients[c] = true
	defer func() {
		delete(clients, c)
		c.Close()
	}()

	for {
		_, _, err := c.ReadMessage()
		if err != nil {
			break
		}
	}
}

func BroadcastMessage(date string) {
	for client := range clients {
		client.WriteMessage(websocket.TextMessage, []byte(date))
	}
}