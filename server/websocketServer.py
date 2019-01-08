import asyncio
import websockets
import threading
import json
import protocol
from session import Session
import UserDatabase

contentLocation = "server/website/"

class websocketServer:
    '''An instance of websocket server that will create and run in a seprate thread.

    Args:
        port (int): port to listen to
        receiveEvent (callbackFunction(client, message): called by client when a valid json message is received
            client (websocketClient): client of connection that received message
            message (dict): dictionary created by decoding the received json

    Attributes:
        clients (websocketClient[]): list of current websocket connections
    '''
    def __init__(self, port, receiveEvent):
        self.clients = []
        self._receiveEvent = receiveEvent
        receiveThread = threading.Thread(target=self._start, args=[port])
        receiveThread.start()

    def _start(self, port):
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
        try:
            server = self.loop.run_until_complete(websockets.server.serve(self._handleConn, host='', port=port, loop=self.loop))
        except OSError:
            print("Socket server failed")
        else:
            self.loop.run_forever()
            server.close()
            self.loop.run_until_complete(server.wait_closed())
            self.loop.close()

    def sendAll(self, message):
        '''Sends a message to all clients.

        Args:
            message (string or dict): message to be sent
        '''
        if type(message) is dict:
            message = json.dumps(message)
        for client in self.clients:
            client.send(message)
        
    async def _handleConn(self, conn, uri):
        print("Conn created")
        client = websocketClient(conn, self._receiveEvent, self)
        self.clients.append(client)
        await client.beginReceiveLoop()

class websocketClient:
    '''Each websocket connection is handled by an instance of this class, runs a recieve loop

    Only websocketServer should make instances of this class
    '''
    def __init__(self, conn, receiveEvent, socketServer):
        self._conn = conn
        self._alive = True
        self._open = False
        self._session = None
        self._receiveEvent = receiveEvent
        self._socketServer = socketServer
    async def beginReceiveLoop(self):
        while self._alive:
            try:
                message = await self._conn.recv()
            except websockets.exceptions.ConnectionClosed:
                print("Closed")
                self.destory()
                return
            if message != "":
                try:
                    print("REC:")
                    print(message)
                    message = json.loads(message)
                except ValueError:
                    print("invalid message")
                    return
            else:
                print("empty message")
                return
            if(not protocol.FIELD.ACTION.value in message):
                print(type(message))
                print(message['0'])
                print(message[protocol.FIELD.ACTION.value])
                print("actionless message")
                return
            if self._open:
                self._receiveEvent(self, message)
            else:
                if(message[protocol.FIELD.ACTION.value] == protocol.ACTION.SESSION.value):
                    self._open = True;
                    res = {}
                    res[protocol.FIELD.ACTION.value] = protocol.ACTION.SESSION.value
                    if protocol.FIELD.PLAYER.value in message:
                        self._session = Session.findSession(message[protocol.FIELD.PLAYER.value])
                        if self._session:
                            userId = self._session.getUserId()
                            if not userId is None:
                                userDB = UserDatabase.UserDatabase()
                                user = userDB.findUser(id=userId)
                                if len(user) == 1:
                                    user = user[0]
                                    sendUser = {}
                                    sendUser[protocol.USER.ID.value] = user["id"]
                                    sendUser[protocol.USER.USERNAME.value] = user["username"]
                                    sendUser[protocol.USER.NAME.value] = user["name"]
                                    sendUser[protocol.USER.EMAIL.value] = user["email"]
                                    sendUser[protocol.USER.PHONE.value] = user["phone"]
                                    res[protocol.FIELD.PLAYER.value] = sendUser
                    if self._session == None:
                        self._session = Session()
                        res[protocol.FIELD.PLAYER.value] = {}
                        res[protocol.FIELD.PLAYER.value][protocol.USER.SESSION.value] = self._session.getKey()
                    self.send(res)
                    
    def send(self, message):
        '''Asyncinously sends a message to this client.

        Args:
            message (string or dict): message to be sent
        '''
        if type(message) is dict:
            message = json.dumps(message)
        try:
            print("SEND:")
            print(message)
            asyncio.run_coroutine_threadsafe(self._conn.send(message), self._socketServer.loop)
        except websockets.exceptions.ConnectionClosed:
            self.destory()
    def destory(self):
        '''Closes websocket and removes client from websocketServer's list
        '''
        self._alive = False
        self._socketServer.clients.remove(self)
        self._conn.close()
    def getSession(self):
        return self._session
    
            