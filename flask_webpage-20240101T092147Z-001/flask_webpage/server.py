from flask import Flask
from flask import url_for,redirect
from flask import render_template
from flask import request

import socket
import datetime
import pymongo
import json

host = socket.gethostbyname(socket.gethostname())
port = 3000

print("Host: " + str(host) + ' port: ' + str(port))

app = Flask(__name__)

pymongo_on = False
if pymongo_on:
    myclient = pymongo.MongoClient('mongodb://localhost:27017/')
    db = myclient["MIAT"]
    drink_records = db['drink_records']

@app.route('/')
def index():
    return drink_records

@app.route('/drink', methods = ['POST'])
def add_drink_amount():
    result = ''
    
    if request.is_json: # 判斷是不是 JSON
        data = request.get_json() # 從資料中獲取值
        print('Recv amount: ' +  str(data['amount']))
        new_amount = int(data['amount'])
        amount_today = drink_records.find_one({'date': str(datetime.date.today())})
        
        if amount_today != None:
            amount_today = new_amount + amount_today['amount']
            print(amount_today)
            
            drink_records.update_one({'date': str(datetime.date.today())}, 
                                     {'$set': {'amount': amount_today}})
        else: 
             drink_records.insert_one({'date': str(datetime.date.today()), 
                                       'amount': new_amount})
    else:
        result = 'Not JSON Data'
    return result

@app.route('/drinks', methods = ['GET'])
def get_all_drinks():
    if pymongo_on == False:
        drink_records_dict = [{'date': '2023-12-31', 'amount': 1000}, 
                              {'date': '2023-12-30', 'amount': 2000}, 
                              {'date': '2023-12-29', 'amount': 3000}, 
                              {'date': '2023-12-28', 'amount': 2437}, 
                              {'date': '2023-12-27', 'amount': 1243}, 
                              {'date': '2023-12-26', 'amount': 6000}, 
                              {'date': '2023-12-25', 'amount': 2410}, 
                              {'date': '2023-12-24', 'amount': 2140}, 
                              {'date': '2023-12-23', 'amount': 2010}, 
                              {'date': '2023-12-22', 'amount': 1890}]
        drink_records_dict.sort(key=lambda x: x['date'], reverse=False) # 依照日期從小到大排序
        print(json.dumps(drink_records_dict))
        return render_template('drinks.html', amt=2100, rec=json.dumps(drink_records_dict))
    
    amount_today = drink_records.find_one({'date': str(datetime.date.today())})
    drink_amount_today = 0 if amount_today == None else amount_today['amount']
    drink_records_dict = list(drink_records.find({}))
    return render_template('drinks.html', amt=drink_amount_today, rec=drink_records_dict)

if __name__ == '__main__':
    app.debug = True
    app.run(host, port)

