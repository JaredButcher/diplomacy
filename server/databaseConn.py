import mysql.connector
import diplomacySecrets

def connect(funct):
    def decorator(self, *args, **kwargs):
        if not self._connInUse:
            self._connInUse = True
            try:
                self._conn = mysql.connector.connect(user=self.user, password=self.password, host=self.host, database=self.database)
                self._cursor = self._conn.cursor(dictionary=True)
                results = funct(self, *args, **kwargs)
                self._conn.commit()
            except Exception as e:
                print(e)
                return None
            finally:
                self._cursor.close()
                self._conn.close()
                self._connInUse = False
            return results
        else:
            return funct(self, *args, **kwargs)
    return decorator

class DatabaseConn:
    '''Class to be inherited from to handle interactions with the mysql database

        Args:
            user (stirng): username to login
            password (stirng): password to login
            host (string): address of database
            database (string): database to use on mysql server
    '''

    def __init__(self):
        self.user = diplomacySecrets.databaseUser
        self.password = diplomacySecrets.databasePassword
        self.host = diplomacySecrets.databaseHost
        self.database = diplomacySecrets.databaseName
        self._cursor = mysql.connector.cursor.MySQLCursor() #just to slilence the IDE syntax errors
        self._connInUse = False