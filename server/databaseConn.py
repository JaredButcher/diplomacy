import mysql.connector
import secrets
import hashlib

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

class databaseConn:
    '''Class to handle interactions with the mysql database

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

    def _hash(self, password, salt):
        return hashlib.sha512(bytes(password, 'utf-8') + salt.to_bytes(16, byteorder='big')).hexdigest()
    
    @connect
    def addUser(self, username, password, name=None, email=None, phone=None):
        '''Add a new user to the database
        '''
        if len(self.findUser(username=username)) > 0:
            raise usernameTaken('Username already in use')
        query='INSERT INTO user (username, hash, salt, name, email, phone) VALUES (%s, %s, %s, %s, %s, %s);'
        salt = secrets.randbits(128)
        hash = self._hash(password, salt)
        self._cursor.execute(query, username, hash, salt, name, email, phone)

    @connect
    def findUser(self, like=False, **kwargs):
        '''Find or search for users in the database

            Args:
                like (bool): allow partial matches
                keyword args: column to search
                    acceped keywords: id(int), username(string), name(string), email(string), phone(string)

            Returns: [tuple]
                list where each retured row is a tuple
                rows include every column
        '''
        query='SELECT * FROM users WHERE TRUE'
        values = []
        for key in kwargs:
            if not key in ['id', 'username', 'name', 'email', 'phone']:
                raise ValueError(msg="Key not in accepted list")
            if like:
                query += ' and ' + key + ' LIKE CONCAT(\'%\', %s, \'%\')'
            else:
                query += ' and ' + key + '=%s'
            values.append(kwargs[key])
        self._cursor.execute(query, values)
        return self._cursor.fetchall()

    @connect
    def authUser(self, username, password):
        user = self.findUser(username=username)[0]
        if user['hash'] == self._hash(password, user['salt']):
            return user
        else:
            return False

    @connect
    def removeUser(self, id):
        query = 'DELETE FROM user WHERE id = %s;'
        self._cursor.execute(query, (id,))

    @connect
    def modifyUser(self, id, **kwargs):
        query='UPDATE user SET'
        values = []
        for key in kwargs:
            if not key in ['username', 'name', 'email', 'phone', 'power', 'password']:
                raise ValueError(msg="Key not in accepted list")
            if values != {}:
                query += ','
            if key == 'username' and len(self.findUser(username=kwargs['username'])) > 0:
                raise usernameTaken('Username already in use')
            if key == 'password':
                salt = secrets.randbits(128)
                values.append(salt)
                values.append(self._hash(kwargs['password'], salt))
                query += 'salt=%s,hash=%s'
            else:
                values.append(kwargs[key])
                query += key + '=%s'
        self._cursor.execute(query, values)

    @connect
    def addRemember(self, id):
        key = secrets.randbits(128)
        query = 'INSERT INTO rememberUser (user, cookie) VALUES (%s, %s);'
        self._cursor.execute(query, (id, key))
        return key

    @connect
    def checkRemember(self, key):
        query = 'DELETE FROM rememberUser WHERE created < SUBDATE(CURDATE(), INTERVAL 20 DAY);'
        self._cursor.execute(query)
        query = 'SELECT * FROM user WHERE id IN (SELECT user FROM rememberUser WHERE cookie = %s);'
        self._cursor.execute(query, (key,))
        return self._cursor.fetchall()



class usernameTaken(Exception):
    '''The username for new user is already in use'''