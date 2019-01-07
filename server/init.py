import websocketServer
import protocol

def recHandle(client, message):
    if(message[protocol.FIELD.ACTION.value] == protocol.ACTION.LOGIN.value):
        res = {}
        res[protocol.FIELD.ACTION.value] = protocol.ACTION.LOGIN.value
        res[protocol.FIELD.PLAYER.value] = {}
        
        client.send(res)
    
ws = websocketServer.websocketServer(4543, recHandle)