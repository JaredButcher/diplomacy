import websocketServer
import httpServer
import protocol

def recHandle(client, message):
    print(message)
        

ws = websocketServer.websocketServer(4543, recHandle)
httpServer.start(4242, 2)