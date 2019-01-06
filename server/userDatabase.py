import DatabaseConn
import secrets
import hashlib

class UserDatabase(DatabaseConn.DatabaseConn):
    '''Class to handle user oriented database requests
    '''

    REMEMBER_USER_DURATION = 20 #How long remember user cookies will be valid

    def _hash(self, password, salt):
        '''Compute the password hash
        '''
        return hashlib.sha512(bytes(password, 'utf-8') + salt.to_bytes(16, byteorder='big')).hexdigest()
    
    @DatabaseConn.connect
    def addUser(self, username, password, name=None, email=None, phone=None):
        '''Add a new user to the database
        '''
        if len(self.findUser(username=username)) > 0:
            raise usernameTaken('Username already in use')
        query='INSERT INTO user (username, hash, salt, name, email, phone) VALUES (%s, %s, %s, %s, %s, %s);'
        salt = secrets.randbits(128)
        hash = self._hash(password, salt)
        self._cursor.execute(query, username, hash, salt, name, email, phone)

    @DatabaseConn.connect
    def findUser(self, like=False, **kwargs):
        '''Find or search for users in the database

            Args:
                like (bool): allow partial matches
                keyword args: column to search
                    acceped keywords: id(int), username(string), name(string), email(string), phone(string)

            Returns: [tuple]
                tuples contain key and value
                [id(int), hash(string), salt(string), username(string), name(string), email(string), phone(string)]
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

    @DatabaseConn.connect
    def authUser(self, username, password):
        '''Check if username and password match

            Returns:
                (bool) returns false on failure
                [tuple] tuples contain key and value on success
                    [id(int), hash(string), salt(string), username(string), name(string), email(string), phone(string)]
        '''
        user = self.findUser(username=username)[0]
        if user['hash'] == self._hash(password, user['salt']):
            return user
        else:
            return False

    @DatabaseConn.connect
    def removeUser(self, id):
        '''Delete a user from database

            Args:
                id (int): id of user to delete
        '''
        query = 'DELETE FROM user WHERE id = %s;'
        self._cursor.execute(query, (id,))

    @DatabaseConn.connect
    def modifyUser(self, id, **kwargs):
        '''Modify a user

            Args:
                id (int): user id
                keyword args: columns to change and new values
                    acceped keywords: id(int), username(string), name(string), email(string), phone(string)
        '''
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

    @DatabaseConn.connect
    def addRemember(self, id):
        '''Create and save new remember cookie

            Args:
                id (int): user id

            Returns: (int) the cookie to be used
        '''
        key = secrets.randbits(128)
        query = 'INSERT INTO rememberUser (user, cookie) VALUES (%s, %s);'
        self._cursor.execute(query, (id, key))
        return key

    @DatabaseConn.connect
    def checkRemember(self, key):
        '''Removes old remember user cookies then checks if remember user cookie is valid and if so returns the user

            Args:
                key (int): remember user cookie

            Returns: [tuple]
                tuples contain key and value for user upown success
                [id(int), hash(string), salt(string), username(string), name(string), email(string), phone(string)]
        '''
        query = 'DELETE FROM rememberUser WHERE created < SUBDATE(CURDATE(), INTERVAL ' + self.REMEMBER_USER_DURATION + ' DAY);'
        self._cursor.execute(query)
        query = 'SELECT * FROM user WHERE id IN (SELECT user FROM rememberUser WHERE cookie = %s);'
        self._cursor.execute(query, (key,))
        return self._cursor.fetchall()



class usernameTaken(Exception):
    '''The username for new user is already in use'''