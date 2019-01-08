import websocketServer
import protocol
import UserDatabase
import session

#Temp testing user handler
def recHandle(client, message):
    userDB = UserDatabase.UserDatabase()
    if(message[protocol.FIELD.ACTION.value] == protocol.ACTION.LOGIN.value):
        userInfo = message[protocol.FIELD.PLAYER.value]
        res = {}
        res[protocol.FIELD.ACTION.value] = protocol.ACTION.LOGIN.value
        user = None
        remember = None
        if(protocol.USER.USERNAME.value in userInfo and protocol.USER.PASSWORD.value in userInfo):
            user = userDB.authUser(userInfo[protocol.USER.USERNAME.value], userInfo[protocol.USER.PASSWORD.value])
            if protocol.USER.REMEMBER.value in userInfo and user:
                 remember = userDB.addRemember(user["id"])
        elif protocol.USER.REMEMBER.value in userInfo:
            user = userDB.checkRemember(userInfo[protocol.USER.REMEMBER.value])
        if user:
            res[protocol.FIELD.PLAYER.value] = {}
            res[protocol.FIELD.PLAYER.value][protocol.USER.ID.value] = user["id"]
            res[protocol.FIELD.PLAYER.value][protocol.USER.USERNAME.value] = user["username"]
            client.getSession().setUserId(user["id"])
            if remember:
                res[protocol.FIELD.PLAYER.value][protocol.USER.REMEMBER.value] = remember
        client.send(res)
    elif message[protocol.FIELD.ACTION.value] == protocol.ACTION.REGISTER.value:
        userInfo = message[protocol.FIELD.PLAYER.value]
        res = {}
        res[protocol.FIELD.ACTION.value] = protocol.ACTION.LOGIN.value
        if(protocol.USER.USERNAME.value in userInfo and protocol.USER.PASSWORD.value in userInfo):
            if userDB.addUser(userInfo[protocol.USER.USERNAME.value], userInfo[protocol.USER.PASSWORD.value]):
                user = userDB.authUser(userInfo[protocol.USER.USERNAME.value], userInfo[protocol.USER.PASSWORD.value])
                res[protocol.FIELD.PLAYER.value] = {}
                res[protocol.FIELD.PLAYER.value][protocol.USER.ID.value] = user["id"]
                res[protocol.FIELD.PLAYER.value][protocol.USER.USERNAME.value] = user["username"]
                client.getSession().setUserId(user["id"])
            else:
                res[protocol.FIELD.ERROR.value] = protocol.ERROR.USERNAME_TAKEN.value
        else:
            res[protocol.FIELD.ERROR.value] = protocol.ERROR.BAD_REQUEST.value
        client.send(res)
    elif message[protocol.FIELD.ACTION.value] == protocol.ACTION.LOGOUT.value:
        client.getSession().setUserId(None)
        #Remove the remember cookie if it is given
        if protocol.FIELD.PLAYER.value in message:
            userDB.rmRemember(message[protocol.FIELD.PLAYER.value])
    elif message[protocol.FIELD.ACTION.value] == protocol.ACTION.LIST_GAMES.value:
        res = {}
        res[protocol.FIELD.ACTION.value] = protocol.ACTION.LIST_GAMES.value
        game = {}
        game[protocol.GAME.ID.value] = 53
        game[protocol.GAME.NAME.value] = "GAME NAME"
        game[protocol.GAME.OWNER.value] = "JEFF"
        game[protocol.GAME.MAX_PLAYERS.value] = 7
        game[protocol.GAME.PLAYERS.value] = 4
        game[protocol.GAME.MAP.value] = "NOT EUROPE"
        game[protocol.GAME.TURN.value] = 3
        res[protocol.FIELD.GAME.value] = [game]
        client.send(res)




    
ws = websocketServer.websocketServer(4543, recHandle)