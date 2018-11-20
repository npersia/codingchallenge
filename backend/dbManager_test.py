import unittest
import dbManager
import psycopg2


class dbManagerTest(unittest.TestCase):

    def test_db_conexion(self):
        with self.assertRaises(psycopg2.OperationalError):
            psycopg2.connect(database="appdb", user="appdb", password="1234", host="localhost", port="5433")

        with self.assertRaises(psycopg2.OperationalError):
            psycopg2.connect(database="appd", user="appdb", password="1234", host="localhost", port="5432")

        with self.assertRaises(psycopg2.OperationalError):
            psycopg2.connect(database="appdb", user="apdb", password="1234", host="localhost", port="5432")

        with self.assertRaises(psycopg2.OperationalError):
            psycopg2.connect(database="appdb", user="appdb", password="124", host="localhost", port="5432")

        with self.assertRaises(psycopg2.OperationalError):
            psycopg2.connect(database="appdb", user="appdb", password="1234", host="locahost", port="5432")






    def test_db_select(self):
        conn = psycopg2.connect(database="appdb", user="appdb", password="1234", host="localhost", port="5432")
        cur = conn.cursor()

        cur.execute('''CREATE TABLE COMPANY
              (ID INT PRIMARY KEY     NOT NULL,
              NAME           TEXT    NOT NULL,
              AGE            INT     NOT NULL,
              ADDRESS        CHAR(50),
              SALARY         REAL);''')
        cur.execute("INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY) \
              VALUES (1, 'Paul', 32, 'California', 20000.00 )")
        conn.commit()
        conn.close()






        a = dbManager.dbManager("appdb", "appdb", "1234", "localhost", "5432")
        a.dbConect()

        resp = a.dbSelect(["ID","NAME","SALARY"], "COMPANY")
        self.assertEqual(resp, [(1, 'Paul', 20000.0)])






        conn = psycopg2.connect(database="appdb", user="appdb", password="1234", host="localhost", port="5432")
        cur = conn.cursor()
        cur.execute("DROP TABLE COMPANY")
        conn.commit()
        conn.close()







    def test_db_insert(self):
        conn = psycopg2.connect(database="appdb", user="appdb", password="1234", host="localhost", port="5432")
        cur = conn.cursor()

        cur.execute('''CREATE TABLE COMPANY
              (ID INT PRIMARY KEY     NOT NULL,
              NAME           TEXT    NOT NULL,
              AGE            INT     NOT NULL,
              ADDRESS        CHAR(50),
              SALARY         REAL);''')
        cur.execute("INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY) \
              VALUES (1, 'Paul', 32, 'California', 20000.00 )")
        conn.commit()
        conn.close()






        a = dbManager.dbManager("appdb", "appdb", "1234", "localhost", "5432")
        a.dbConect()
        with self.assertRaises(psycopg2.IntegrityError):
            a.dbInsert(["ID","NAME","AGE","ADDRESS","SALARY"], [1, 'Paul', 32, 'California', 20000.00], "COMPANY")

        a.dbConect()
        with self.assertRaises(psycopg2.ProgrammingError):
            a.dbInsert(["ID","NAME","AGE","ADDRESS","SALARY"], [1, 'Paul', 32, 'California', ],"COMPANY")

        a.dbConect()
        with self.assertRaises(psycopg2.ProgrammingError):
            a.dbInsert(["ID","NAME","AGE","ADDRESS","SALARY"], [1, ],"COMPANY")

        a.dbConect()
        with self.assertRaises(psycopg2.ProgrammingError):
            a.dbInsert(["ID","NAME","AGE","ADDRESS",], [1, 'Paul', 32, 'California', 20000.00],"COMPANY")

        a.dbConect()
        with self.assertRaises(TypeError):
            a.dbInsert(["ID","NAME","AGE","ADDRESS","SALARY"],"COMPANY")

        conn = psycopg2.connect(database="appdb", user="appdb", password="1234", host="localhost", port="5432")
        cur = conn.cursor()
        cur.execute("DROP TABLE COMPANY")
        conn.commit()
        conn.close()




    def test_db_update(self):
        conn = psycopg2.connect(database="appdb", user="appdb", password="1234", host="localhost", port="5432")
        cur = conn.cursor()

        cur.execute('''CREATE TABLE COMPANY
              (ID INT PRIMARY KEY     NOT NULL,
              NAME           TEXT    NOT NULL,
              AGE            INT     NOT NULL,
              ADDRESS        CHAR(50),
              SALARY         REAL);''')
        cur.execute("INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY) \
              VALUES (1, 'Paul', 32, 'California', 20000.00 )")
        conn.commit()
        conn.close()



        a = dbManager.dbManager("appdb", "appdb", "1234", "localhost", "5432")
        a.dbConect()
        a.dbUpdate("SALARY", "25000.00", "COMPANY", 'ID = 1')





        conn = psycopg2.connect(database="appdb", user="appdb", password="1234", host="localhost", port="5432")
        cur = conn.cursor()
        cur.execute("DROP TABLE COMPANY")
        conn.commit()
        conn.close()



if __name__ == '__main__':
    unittest.main()
