import mysql.connector

def connect(funct):
    def decorator(self, *args, **kwargs):
        if not self._connInUse:
            self._connInUse = True
            self._conn = mysql.connector.connect(user=self.user, password=self.password, host=self.host, database=self.database)
            self._cursor = self.conn.cursor(dictionary=True)
            funct(self, *args, **kwargs)
            self._cursor.close()
            self._conn.close()
            self._connInUser = False
        else:
            funct(self, *args, **kwargs)
    return decorator

class DatabaseConn:
    '''Class to be inherited from to handle interactions with the mysql database

        Args:
            user (stirng): username to login
            password (stirng): password to login
            host (string): address of database
            database (string): database to use on mysql server
    '''

    def __init__(self, user, password, host, database):
        self.user = user
        self.password = password
        self.host = host
        self.database = database
        self._cursor = mysql.connector.cursor.MySQLCursor() #just to slilence the IDE syntax errors
        self._connInUse = False