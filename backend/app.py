from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import requests
import pika
import os

import psycopg2

import dbManager

app = Flask(__name__)
CORS(app)

__database__ = "appdb"
__db_user__ = "appdb"
__db_password__ = "1234"
try:
    __db_host__ = os.environ["DB-HOST"]
except:
    __db_host__ = "localhost"
__db_port__ = "5432"


#__api_key__ = "AIzaSyCJ-vBZePh6EmsJQ7IeTyizy0dXwtVf79U"
try:
    __api_key__ = os.environ["API-KEY"]
except:
     __api_key__ = "AIzaSyCJ-vBZePh6EmsJQ7IeTyizy0dXwtVf79U"
try:
    __mq_host__ = os.environ["MQ-HOST"]
except:
    __mq_host__ = "localhost"



#send msg to mq
def sendMsg(queue,body):
    con = pika.BlockingConnection(pika.ConnectionParameters(host=__mq_host__))
    ch = con.channel()
    ch.queue_declare(queue= queue)

    ch.basic_publish(exchange='', routing_key=queue, body=body)

    con.close()




def __bad_input__(typ = None,msg = None):

    if typ == None:
        typ = "unknown"

    if msg == None:
        msg = "bad input"

    return {"code": 400, "type": str(typ), "message": str(msg)}







def get_ETA(origin, destination):

    try:
        r = requests.get('https://maps.googleapis.com/maps/api/directions/json?origin='+origin+'&destination='+destination+'&mode=driving&key='+__api_key__)


        ETA = r.json()["routes"][0]["legs"][0]["duration"]["text"]

        #return r.json()
        return ETA
    except:
        return {"ETA": "There were problems to calculate the address"}








@app.route('/restaurants/rating', methods=['PUT'])
def restRating():

    if (len(request.json) != 3) or ("user_id" not in request.json) or ("rest" not in request.json) or \
            ("rating" not in request.json):
        return jsonify(__bad_input__()), 400

    if type(request.json["user_id"]) is not int:
        return jsonify(__bad_input__("bad type","user_id should be a integer")), 400

    if type(request.json["rest"]) is not int:
        return jsonify(__bad_input__("bad type","rest should be a integer")), 400

    if type(request.json["rating"]) is not int:
        return jsonify(__bad_input__("bad type","rating should be a integer")), 400


    if request.json["rating"] > 5 or request.json["rating"] < 1:
        return jsonify(__bad_input__("Out of range","rating is between 1-5")), 400



    db = dbManager.dbManager(__database__, __db_user__, __db_password__, __db_host__, __db_port__)


    try:
        db.dbConect()
    except psycopg2.OperationalError:
        return jsonify({"code": 500, "type": "Database error", "message": "could not connect to the database"}), 500
    try:
        db.dbInsert(["user_id","rest","rating"],[request.json["user_id"],request.json["rest"],request.json["rating"]],"rating")
    except psycopg2.IntegrityError:
        return jsonify(__bad_input__("Duplicate key value","Key (user_id, rest) already exists")), 400




    try:
        db.dbConect()
    except psycopg2.OperationalError:
        return jsonify({"code": 500, "type": "Database error", "message": "could not connect to the database"}), 500



    rating = db.dbSelect(["avg(rating)"], "rating", "rest=" + str(request.json["rest"]))[0][0]
    rat = round(rating,0)


    #actualizar en la tabla rest los ratings



    try:
        db.dbConect()
    except psycopg2.OperationalError:
        return jsonify({"code": 500, "type": "Database error", "message": "could not connect to the database"}), 500


    db.dbUpdate("rating",str(rat), "restaurants", "rest=" + str(request.json["rest"]))

    ret ={
        "user_id": request.json["user_id"],
        "rest": request.json["rest"],
        "rating": request.json["rating"]
    }

    return jsonify(ret), 200





@app.route('/restaurants')
def getRestaurants():


    try:
        rating = "rating = " + str(request.args['rating'])
    except:
        rating = None

    try:
        if ("rating" in request.args) and (int(request.args["rating"]) > 5 or int(request.args["rating"]) < 1):
            return jsonify(__bad_input__("Out of range", "rating is between 1-5")), 400
    except ValueError:
        return jsonify(__bad_input__("rating NOT Integer","Rating must be a Integer")), 400


    db = dbManager.dbManager(__database__, __db_user__, __db_password__, __db_host__, __db_port__)

    try:
        db.dbConect()
    except psycopg2.OperationalError:
        return jsonify({"code": 500, "type": "Database error", "message": "could not connect to the database"}), 500


    resp = db.dbSelect(["rest","name", "image","rating"], "restaurants", rating)

    response = []

    for r in resp:
        ret = {
            "rest": r[0],
            "name": r[1].strip(" "),
            "image": r[2].strip(" "),
            "rating": r[3]
        }
        response.append(ret)
    return jsonify(response), 200



@app.route('/order', methods=['POST'])
def order():

    print(request.json)

    #validate data
    if (len(request.json) != 6) or \
            ("meals" not in request.json) or \
            ("total" not in request.json) or \
            ("addr" not in request.json) or \
            ("latlng" not in request.json) or \
            ("rest" not in request.json) or \
            ("phone" not in request.json):
        return jsonify(__bad_input__()), 400


    if (len(request.json["meals"]) == 0 ) or \
            (request.json["total"] == 0):
        return jsonify(__bad_input__("It is not an order", "there is nothing to order")), 400


    if type(request.json["meals"]) is not list:
        return jsonify(__bad_input__("bad type", "meals should be a list")), 400

    try:
        float(request.json["total"])
    except ValueError:
        return jsonify(__bad_input__("bad type", "total should be a number")), 400

    if type(request.json["addr"]) is not str:
        return jsonify(__bad_input__("bad type", "addr should be a string")), 400

    if type(request.json["rest"]) is not int:
        return jsonify(__bad_input__("bad type", "rest should be a integer")), 400

    if type(request.json["phone"]) is not str:
        return jsonify(__bad_input__("bad type", "phone should be a string")), 400

    if type(request.json["latlng"]) is not str:
        return jsonify(__bad_input__("bad type","latlng should be a string")), 400

    for m in request.json["meals"]:
        if len(m) != 2 or \
        ("quantity" not in m) or \
        ("meal" not in m) or \
        (type(m["quantity"]) is not int) or \
        (type(m["meal"]) is not int):
            return jsonify(__bad_input__()), 400



    #Save info in database


    db = dbManager.dbManager(__database__, __db_user__, __db_password__, __db_host__, __db_port__)


    try:
        db.dbConect()
    except psycopg2.OperationalError:
        return jsonify({"code": 500, "type": "Database error", "message": "could not connect to the database"}), 500

    db.dbInsert(["total","addr","latlng","phone","rest"], [request.json["total"], request.json["addr"],
                request.json["latlng"], request.json["phone"], request.json["rest"]], "orders")


    #get the new order_id
    try:
        db.dbConect()
    except psycopg2.OperationalError:
        return jsonify({"code": 500, "type": "Database error", "message": "could not connect to the database"}), 500
    order_id = db.dbSelect(["MAX(order_id)"],"orders")[0][0]




    #save the order meals in database
    for m in request.json["meals"]:
        try:
            db.dbConect()
        except psycopg2.OperationalError:
            return jsonify({"code": 500, "type": "Database error", "message": "could not connect to the database"}), 500

        db.dbInsert(["order_id","meal","quantity"], [order_id,m["meal"],m["quantity"]],"order_meal")


    #get restaurant latlng
    try:
        db.dbConect()
    except psycopg2.OperationalError:
        return jsonify({"code": 500, "type": "Database error", "message": "could not connect to the database"}), 500
    response = db.dbSelect(["latlng","email"],"restaurants","rest = "+ str(request.json["rest"]))

    rest_email =  response[0][1].replace(" ","")

    latlng_rest = response[0][0].replace(" ","")

    #calculate ETA

    ETA = get_ETA(request.json["latlng"],latlng_rest)




    #get meals description for send email
    email_meals = []
    for m in request.json["meals"]:
        try:
            db.dbConect()
        except psycopg2.OperationalError:
            return jsonify({"code": 500, "type": "Database error", "message": "could not connect to the database"}), 500
        __meal__ = db.dbSelect(["name"],"meals","meal="+str(m["meal"]))[0][0].strip(" ")
        email_meals.append({"quantity":m["quantity"],"meal":__meal__})



    #send msg to mq
    try:
        sendMsg("order_mq", rest_email+";"+request.json["addr"]+";"+str(email_meals))
    except pika.exceptions.ConnectionClosed:
        return jsonify({"code": 500, "type": "MQ error", "message": "could not connect to the MQ"}), 500
    try:
        sendMsg("noti_mq", request.json["phone"]+";"+str(email_meals))
    except pika.exceptions.ConnectionClosed:
        return jsonify({"code": 500, "type": "MQ error", "message": "could not connect to the MQ"}), 500


    response = {
        "ETA": str(ETA)
    }

    return jsonify(response),200





@app.route('/meals')
def meals():
    rest = ""
    try:
        rest = "rest = " + str(request.args['rest'])
    except:
        rest = None


    db = dbManager.dbManager(__database__, __db_user__, __db_password__, __db_host__, __db_port__)

    try:
        db.dbConect()
    except psycopg2.OperationalError:
        return jsonify({"code": 500, "type": "Database error", "message": "could not connect to the database"}), 500

    resp = db.dbSelect(["meal", "name", "price", "rest"], "meals", rest)

    response = []

    for r in resp:
        ret = {
            "meal": r[0],
            "name": r[1].strip(" "),
            "price": float(r[2]),
            "rest": r[3]
        }
        response.append(ret)
    return jsonify(response), 200





@app.route('/address')
def address():
    salida = { \
        "results": [ \
            { \
                "address_components": [ \
                    { \
                        "long_name": "2790", \
                        "short_name": "2790", \
                        "types": ["street_number"] \
                        }, \
                    { \
                        "long_name": "Juramento", \
                        "short_name": "Juramento", \
                        "types": ["route"] \
                        }, \
                    { \
                        "long_name": "Belgrano", \
                        "short_name": "Belgrano", \
                        "types": ["political", "sublocality", "sublocality_level_1"] \
                        }, \
                    { \
                        "long_name": "Comuna 13", \
                        "short_name": "Comuna 13", \
                        "types": ["administrative_area_level_2", "political"] \
                        }, \
                    { \
                        "long_name": "Buenos Aires", \
                        "short_name": "CABA", \
                        "types": ["administrative_area_level_1", "political"] \
                        }, \
                    { \
                        "long_name": "Argentina", \
                        "short_name": "AR", \
                        "types": ["country", "political"] \
                        }, \
                    { \
                        "long_name": "C1428", \
                        "short_name": "C1428", \
                        "types": ["postal_code"] \
                        }, \
                    { \
                        "long_name": "DNV", \
                        "short_name": "DNV", \
                        "types": ["postal_code_suffix"] \
                        } \
                    ], \
                "formatted_address": "Juramento 2790, C1428DNV CABA, Argentina", \
                "geometry": { \
                    "location": { \
                        "lat": -34.5641679, \
                        "lng": -58.459922 \
                        }, \
                    "location_type": "ROOFTOP", \
                    "viewport": { \
                        "northeast": { \
                            "lat": -34.5628189197085, \
                            "lng": -58.4585730197085 \
                            }, \
                        "southwest": { \
                            "lat": -34.5655168802915, \
                            "lng": -58.4612709802915 \
                            } \
                        } \
                    }, \
                "place_id": "ChIJS4LYNNS1vJUR09IVsS1tlfg", \
                "plus_code": { \
                    "compound_code": "CGPR+82 Buenos Aires, Argentina", \
                    "global_code": "48Q3CGPR+82" \
                    }, \
                "types": ["street_address"] \
                } \
            ], \
        "status": "OK" \
        }

    return jsonify(salida)




@app.route('/restaurants', methods=['POST'])
def newRest():



    db = dbManager.dbManager(__database__, __db_user__, __db_password__, __db_host__, __db_port__)


    try:
        db.dbConect()
    except psycopg2.OperationalError:
        return jsonify({"code": 500, "type": "Database error", "message": "could not connect to the database"}), 500

    db.dbInsert(["name","image","rating","latlng","email"],[request.json["name"],"rest/rest001.jpg",1,request.json["latlng"],request.json["email"]],"restaurants")


    ret ={
        "msg": "Restaurant added"
    }

    return jsonify(ret), 200




@app.route('/meals', methods=['POST'])
def newMeal():



    db = dbManager.dbManager(__database__, __db_user__, __db_password__, __db_host__, __db_port__)


    try:
        db.dbConect()
    except psycopg2.OperationalError:
        return jsonify({"code": 500, "type": "Database error", "message": "could not connect to the database"}), 500

    db.dbInsert(["name","price","rest"],[request.json["name"],request.json["price"],request.json["rest"]],"meals")


    ret ={
        "msg": "Meal added"
    }

    return jsonify(ret), 200







if __name__ == "__main__":
    app.run(host='0.0.0.0')

