import psycopg2

class dbManager:
    def __init__(self, database, user, password, host, port):
        self.database = database
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self.conn = None

    def dbConect(self):

        self.conn = psycopg2.connect(
           'dbname=' + self.database + ' user=' + self.user + ' password=' + self.password + ' host=' + self.host + ' port=' + self.port)

    def dbSelect(self,cols,table,where=None):
        cur = self.conn.cursor()

        columns = ",".join(cols)

        make_where = ""
        if where != None:
            make_where = " where " + where

        cur.execute("SELECT " + columns + " from " + table + make_where)
        rows = cur.fetchall()

        self.conn.close()

        return rows

    def dbInsert(self,cols,val,table):
        cur = self.conn.cursor()

        columns = ",".join(cols)

        values = str(val)[1:-1]

        cur.execute("insert into " + table + "(" + columns + ") values (" + values + ")")
        #if already exist


        self.conn.commit()
        self.conn.close()

    def dbUpdate(self, col, val, table, where=None):
        cur = self.conn.cursor()

        make_where = ""
        if where != None:
            make_where = " where " + where

        cur.execute("UPDATE " + table + " set " + col + " = " + val + " " + make_where)

        self.conn.commit()
        self.conn.close()
