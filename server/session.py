import secrets
import time

class Session:
    '''Handles sessions

    '''

    sessions = []
    SESSION_EXPERATION = 1 * 24 * 60 * 60

    def __init__(self):
        self._key = str(secrets.randbits(128))
        self._expires = time.time() + Session.SESSION_EXPERATION
        self._userId = None
        Session.sessions.append(self)

    def findSession(key):
        for session in Session.sessions:
            if session.getKey() == key:
                if session.isValid():
                    return session
                else:
                    return None
            session.isValid()
        return None

    def getKey(self):
        return self._key;

    def isValid(self):
        if self._expires > time.time():
            return True
        else:
            Session.sessions.remove(self)
            return False

    def getUserId(self):
        return self._userId

    def setUserId(self, userId):
        self._userId = userId