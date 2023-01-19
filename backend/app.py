from flask import Flask,send_from_directory,session,render_template,request
from flask_mysqldb import MySQL
from pytz import timezone
from extensions import mysql 

#from models.webmodels import Models as db

#import jwt

_secret_key="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZCJ9.Joh1R2dYzkRvDkqv3sygm5YyK8Gi4ShZqbhK2gxcs2U"

# app=Flask(__name__)
app = Flask(__name__)
app.secret_key='sdjasdnjasdnasjdnasdjiqwjeuqwehjasndasd'


app.config['MYSQL_HOST'] = 'urjanet.c7rufc6xdprd.us-east-1.rds.amazonaws.com'
app.config['MYSQL_USER'] = 'admin'
app.config['MYSQL_PASSWORD'] = 'arcadia_db123'
app.config['MYSQL_DB'] = 'urjanet'
app.config['MYSQL_CURSORCLASS'] = "DictCursor"
     
mysql=MySQL(app)


@app.after_request
def after_request(response):
   response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
   response.headers["Expires"] = 0
   response.headers["Pragma"] = "no-cache"
   return response

@app.route('/', methods=['POST','GET'])
def home():
    # cur=mysql.connection.cursor()
    # sql="SELECT * FROM `admins`"
    # cur.execute(sql)1

    # data=cur.fetchall()
    # cur.close() 
    # print(data)
    # return "Hello World !"
    return render_template("index.html")

@app.errorhandler(404)
def notfounf():
    return render_template("index.html")


from routes.admin_routes import api

app.register_blueprint(api)


if __name__ == '__main__':
    app.run(debug = True,host = '0.0.0.0', port = '5001')
    # app.run(debug = True)
    