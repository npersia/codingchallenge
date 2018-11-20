import pika
import threading
import smtplib
import os
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests

try:
    gmail_user = os.environ["GMAIL-USER"]
except:
    gmail_user = "truenorth.deliveryconfirm@gmail.com"

try:
    gmail_password = os.environ["GMAIL-PASS"]
except:
    gmail_password = "0okmju7ygvfr4"


try:
    __mq_host__ = os.environ["MQ-HOST"]
except:
    __mq_host__ = "localhost"

try:
    __sms_host__ = os.environ["SMS-HOST"]
except:
    __sms_host__ = "localhost"



def sendMail(to, subject, body):
    
    msg = MIMEMultipart() 
    msg['From'] = gmail_user
    msg['To'] =  to
    msg['Subject'] = subject 
    msg.attach(MIMEText(body, 'plain')) 

    text = msg.as_string()

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.ehlo()
        server.login(gmail_user, gmail_password)

        server.sendmail(gmail_user, to, text)
        server.close()
        print("Mail sended")
    except:
        pass
    



def sendSMS(to,body):
    payload = {"to":to,"body":body}
    headers = {'content-type': 'application/json'}
    r = requests.post('http://'+ __sms_host__ +':5001/sms',json=payload,headers=headers)




def getMsg(queue):
    con = pika.BlockingConnection(pika.ConnectionParameters(host=__mq_host__))
    ch = con.channel()
    # Declarar la cola
    ch.queue_declare(queue=queue)
    # Definir la función callback
    def recepcion(ch, method, properties, body):
        body = body.decode("utf-8")

        if queue == "order_mq":
            b = body.split(";")
            sendMail(b[0], "New Order", "A new order is in place\nAddress: "+b[1]+"\nOrder: "+b[2])
        if queue == "noti_mq":

            b = body.split(";")
            sendSMS(b[0],"Your order is on the way\nOrder:"+b[1])

    ch.basic_consume(recepcion, queue=queue, no_ack=True)

    ch.start_consuming()


time.sleep(30)

t = threading.Thread(target=getMsg, args=("order_mq",))
t.start()

t2 = threading.Thread(target=getMsg, args=("noti_mq",))
t2.start()
