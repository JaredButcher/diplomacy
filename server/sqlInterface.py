import mysql.connector

dbConn = mysql.connector.connect(user='', password='', host='192.168.1.2', database='')
cursor = dbConn.cursor()

query = 'SELECT username, name FROM users WHERE username=%s'

cursor.execute(query, ('bob',))

for value in cursor:
    print(value)

cursor.close()
dbConn.close()