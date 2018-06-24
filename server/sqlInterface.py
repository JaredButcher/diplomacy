import mysql.connector
import secrets
import hashlib

def connect(funct):
    def decorator(self, *args, **kwargs):
        self.conn = mysql.connector.connect(user=self.user, password=self.password, host=self.host, database=self.database)
        self.cursor = self.conn.cursor()
        funct(self, *args, **kwargs)
        self.cursor.close()
        self.conn.close()
    return decorator

class databaseConn:
    def __init__(self, user, password, host, database):
        self.user = user
        self.password = password
        self.host = host
        self.database = database

    @connect
    def addUser(self, username, password, name=None, email=None, phone=None):
        query='INSERT INTO user (username, hash, salt, name, email, phone) VALUES (%s, %s, %s, %s, %s, %s);'
        salt = secrets.randbits(128)
        hash = hashlib.sha512(bytes(password, 'utf-8') + salt.to_bytes(16, byteorder='big')).hexdigest()
        self.cursor.execute(query, username, hash, salt, name, email, phone)

    @connect
    def test(self, name):
         query='SELECT id, username, name FROM users WHERE name LIKE CONCAT(\'%\', %s, \'%\');'
         self.cursor.execute(query, (name,))
         for value in self.cursor:
             print(value)
