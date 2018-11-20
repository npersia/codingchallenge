from flask import Flask, jsonify, request
import os, logging


app = Flask(__name__)

@app.route('/sms', methods=['POST'])
def restRating():
    to = str(request.json["to"])
    body = str(request.json["body"])


    print(to+": "+body)


    ret ={
        "msg": "OK"
    }
    file_log = os.path.join('/data', 'sms.log')
    logging.basicConfig(level=logging.NOTSET,
                    format='%(asctime)s : %(levelname)s : %(message)s',
                    filename = file_log,
                    filemode = 'w',)
    logging.info(str(to+": "+body))


    return jsonify(ret), 200



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001)

