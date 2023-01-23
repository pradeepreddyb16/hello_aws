from flask import Flask, make_response, session,url_for,redirect,render_template,request,flash,Markup,jsonify,json, send_from_directory,Blueprint,current_app,send_file
import hashlib
from flask_mysqldb import MySQL
import pandas as pd
import numpy as np
import os
from extensions import mysql
import random
import datetime
from pytz import timezone
from models.admin_models import Models as db


#import requests

# ROLES PERMISSIONS SUPER-ADMIN AND ADMIN WILL HAVE ALL PERMISSIONS AND USER WILL HAVE RESTRICTED PERMISSIONS
# SUPER-ADMIN = 1
# ADMIN = 2
# USER = 3


from werkzeug.utils import secure_filename

api=Blueprint('api',__name__,url_prefix='/api')



# get Only Date Function
def getDateOnly():
    now = datetime.datetime.now(timezone('Asia/Kolkata'))
    datetimeee=datetime.datetime(
        now.year, now.month, now.day,now.hour,now.minute,now.second)
    datetimee=str(datetimeee)
    return datetimee


# FOR UPLOAD IMAGE

def uploadImage(pic, directory):
    now = datetime.datetime.now(timezone('Asia/Kolkata'))
    datetimeee = datetime.datetime(
        now.year, now.month, now.day, now.hour, now.minute, now.second)
    datetimee = str(datetimeee)
    ranNew = str(random.randint(00000, 99999))
    UPLOAD_FOLDER = "bills/"+directory+"/"
    ALLOWED_EXTENSIONS = set(
        ['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'xlsx', 'base64','csv','xlsx','xls'])
    if pic.filename == 'blob':
        picfilename = datetimee+ranNew+pic.filename+ALLOWED_EXTENSIONS
    else:
        picfilename = datetimee+ranNew+pic.filename
    picfilename = picfilename.replace(":", "")
    picfilename = picfilename.replace("-", "")
    picfilename = picfilename.replace(" ", "")

    picfilename = picfilename.replace(",", "")
    pic.save(os.path.join(UPLOAD_FOLDER, picfilename))
    return picfilename


# ROUTE FOR LOGIN
@api.route('/login',methods=['POST','GET'])
def login():
    if request.method=='POST':
        uname = request.form['uname']
        passs = str(hashlib.md5(request.form['pass'].encode('UTF-8')).hexdigest())
        current_date=getDateOnly()
        data=db.checkAdminLogin(uname,passs)
        ## Different date with Correct Password
        if data and data['login_atempts']>=5 and data['login_date']!=current_date:
            db.resetPasswordAttemptswithUname(uname)

        if data:
            print(data)
            if data['login_atempts']>=5 and data['login_date']==current_date:
                return jsonify({'status':False,'msg':'Too many Failed Login Attempts, Please retry after sometime...'})
            else:    
                db.resetPasswordAttemptswithUname(uname)
                # otp = str(random.randint(100000,999999))
                otp = str(123456)
                print(otp)
                session['login_otp'] = otp
                return jsonify({'status':True,'msg':'Please Enter The OTP'}) 
        else:
            data=db.getLoginAttemptsWithUname(uname)
            if data['login_atempts']>=5 and data['login_date']==current_date:
                    return jsonify({'status':False,'msg':'Too many Failed login Attempts, Please retry after sometime...'})
            db.failedLogin(current_date,uname)
            return jsonify({'status':False,'msg':'Incorrect Credentials...'})

    
# ROUTE FOR OTP VALIDATION
@api.route('/validate_otp',methods=['POST','GET'])
def validate_otp():
    if request.method=='POST':
        uname = request.form['uname']
        passs = str(hashlib.md5(request.form['pass'].encode('UTF-8')).hexdigest())
        otp = str(request.form['otp'])
        current_date=getDateOnly()
       
        if otp == session['login_otp']:
                data=db.checkAdminLogin(uname,passs)

                if data['otp_atempts']>=5 and data['otp_date']==current_date:
                    return jsonify({'status':False,'msg':'Too many Failed OTP Attempts, Please retry after sometime...'})
                    
                session.pop('login_otp', None)
                db.resetOTPAttemptswithUname(uname)
                session['admin_data']=data
                # print("chetan")
                # print(session['admin_data'])
                return jsonify({'status':True,'msg':'Login Successful','data':{ 'admin_id': session['admin_data']['admin_id'], 'admin_name': session['admin_data']['admin_name'], 'admin_mobile': session['admin_data']['admin_mobile'], 'admin_email': session['admin_data']['admin_email'],'admin_role': session['admin_data']['admin_role']}})
        else:
            data=db.getotpAttemptsWithUname(uname)
            if data and data['otp_atempts']>=5 and data['otp_date']!=current_date:
                db.resetOTPAttemptswithUname(uname)
            if data:
                if data['otp_atempts']>=5 and data['otp_date']==current_date:
                    return jsonify({'status':False,'msg':'Too many Failed OTP Attempts, Please retry after sometime...'})
            db.failedOTP(current_date,uname)
            return jsonify({'status':False,'msg':'Incorrect Credentials...'})


# LOGOUT ROUTE
@api.route('/logout',methods=['POST','GET'])
def logout():
    if  'admin_data' in session:
        session.pop('admin_data', None)
        return jsonify({'status':True,'msg':"Logged out Successfully...."}) 
    else:
        return jsonify({'status':False,'msg':"Already Logged out...."})


# CHECK SESSION ROUTE
@api.route('/getsession',methods=['POST','GET'])
def getsession():
    if 'admin_data' in session: 
        print(session['admin_data'])
        return jsonify({'status':True,'data':{ 'admin_id': session['admin_data']['admin_id'], 'admin_name': session['admin_data']['admin_name'], 'admin_mobile': session['admin_data']['admin_mobile'], 'admin_email': session['admin_data']['admin_email'],'admin_role': session['admin_data']['admin_role']}})

    else:
        return jsonify({'status':False})


#TEST
@api.route('/test_route',methods=['POST','GET'])
def test_route():
    uname = "9949226669"
    passs = str(hashlib.md5("varshi23".encode('UTF-8')).hexdigest())
    current_date=getDateOnly()
    data=db.checkAdminLogin(uname,passs)
    # print(current_date)
    # print(data)
    return data


############### ADMINS ###############


# ADD ADMIN
@api.route('/add',methods = ['GET','POST'])
def add():
     if request.method == 'POST'  and 'admin_data' in session and session['admin_data']['admin_role']==1:
        uname = request.form['admin_name']
        uemail = request.form['admin_email']
        umobile = request.form['admin_mobile']
        upass = str(hashlib.md5(request.form['admin_pass'].encode('UTF-8')).hexdigest())
        uotp = 0
        uregdate = getDateOnly()
        urole = 1
        ulogindate = getDateOnly()
        uotpdate = getDateOnly()
        data = db.checkMobileandEmail(uemail,umobile)
        #session['admin_data']=data
        #print(data)
        if data:
            if (data['admin_email'] ==uemail):
                return jsonify({"status":False,"msg":"email_id already exits"})
            elif (data['admin_mobile']==umobile):
                return jsonify({"status":False,"msg":"mobile number already exits"})
        else:
            db.addadmin(uname,uemail,umobile,upass,uotp,uregdate,urole,ulogindate,uotpdate, request.form['status'])
            return jsonify({'status':True,'msg':'successfully Added'})
        

# SELECT ALL ADMINS
@api.route('/select',methods = ['GET','POST'])
def select():
    if request.method == 'GET' and 'admin_data' in session and session['admin_data']['admin_role']==1:
        data = db.selectadmin()
        return jsonify ({'status':True,'data':data})


# SELECT SINGLE ADMIN
@api.route('/single',methods = ['GET','POST'])
def single():
    if request.method == 'POST' and 'admin_data' in session and session['admin_data']['admin_role']==1:
        uidd = request.form['admin_id']
        data = db.singleadmin(uidd)
        return jsonify ({'status':True,'data':data})

# EDIT ADMIN
@api.route('/edit', methods = ['GET','POST'])
def edit():
    if request.method == 'POST' and 'admin_data' in session and session['admin_data']['admin_role']==1 :
        uname = request.form['admin_name']
        uemail = request.form['admin_email']
        umobile = request.form['admin_mobile']
        ustatus = request.form['admin_status']
        urole = request.form['admin_role']
        uid = request.form['admin_id']
    
        data=db.checkEmailforUpdate(uemail,uid)
        data1=db.checkMobileforUpdate(umobile,uid)

        
        if data:           
            return jsonify({"status":False,"msg":"email_id already exits"})
        if data1:    
            return jsonify({"status":False,"msg":"mobile number already exits"})

        else:
        
            db.editadmin(uname,uemail,umobile,urole,ustatus,uid)
            return jsonify({'status':True,'msg':'successfully Updated'})


############### STORE ROUTES ###############


# ADD STORE
@api.route('/add_store',methods = ['GET','POST'])
def AddStore():
    if request.method == 'POST' and 'admin_data' in session and (session['admin_data']['admin_role']==3 or session['admin_data']['admin_role']==1):
        
        ## IF ADDING BY SUPER ADMIN
        if session['admin_data']['admin_role']==1:
            store_no = request.form['store_no'] 
            code = request.form['code']
            uid = request.form['uid'] 
            name = request.form['name'] 
            open_date = request.form['open_date']
            state = request.form['state']
            city = request.form['city'] 
            region = request.form['region'] 
            typee = request.form['type'] 
            status = request.form['status']
            foot_m2 = request.form['foot_m2'] 
            foot_ft2 = request.form['foot_ft2']
            added_date = getDateOnly()  # REPLACE IT WITH DATE AND TIME
            active_status = request.form['active_status']
            db.addStore(store_no, code, uid, name, open_date,city,state, region, typee, status,foot_m2, foot_ft2, added_date, active_status)        
            return jsonify({'status':True,'msg':"Store Created Successfully !!!"})

            ## IF ADDING BY STORE OWNER
        elif session['admin_data']['admin_role']==3:
            store_no = request.form['store_no'] 
            code = request.form['code']
            uid = session['admin_data']['admin_id'] 
            name = request.form['name'] 
            open_date = request.form['open_date']
            city = request.form['city'] 
            state = request.form['state'] 
            region = request.form['region'] 
            typee = request.form['type'] 
            status = request.form['status']
            foot_m2 = request.form['foot_m2'] 
            foot_ft2 = request.form['foot_ft2']
            added_date = getDateOnly()  
            active_status = request.form['active_status']
            db.addStore(store_no, code, uid, name, open_date,city,state, region, typee, status,foot_m2, foot_ft2, added_date, active_status)        
            return jsonify({'status':True,'msg':"Store Created Successfully !!!"})
    else:
        return jsonify({'status':False,'msg':"Invalid Route !!!"})


# GET ALL STORE DETAILS ROUTE
@api.route('/get_all_stores',methods = ['GET','POST'])
def GetStore():
    print(session['admin_data'])
    print("============================================")
    print('admin_data' in session)

    if request.method == 'POST' and 'admin_data' in session and (session['admin_data']['admin_role']==3 or session['admin_data']['admin_role']==1):

        # IF CALLING BY SUPER ADMIN
        if session['admin_data']['admin_role']==1:
            data = db.getAllStores()
            return jsonify({'status':True,'data':data})

        ## IF CALLING BY STORE OWNER
        elif session['admin_data']['admin_role']==3:
            data = db.getAllStoresByUID(session['admin_data']['admin_id'])
            return jsonify({'status':True,'data':data})
    else:
        return jsonify({'status':False,'msg':"Invalid Route !!!"})


# GET SINGLE STORE ROUTE
@api.route('/get_single_store',methods = ['GET','POST'])
def GetSingleStore():
     if request.method == 'POST' and 'admin_data' in session and (session['admin_data']['admin_role']==3 or session['admin_data']['admin_role']==1):
        
        # IF CALLING BY SUPER ADMIN
        if session['admin_data']['admin_role']==1:
            data = db.getSingleStore(request.form['id'])
            return jsonify({'status':True,'data':data})

        # IF CALLING BY STORE OWNER
        elif session['admin_data']['admin_role']==3:
            check = db.checkStore(request.form['id'],session['admin_data']['admin_id'])
            print(check)
            if check:
                data = db.getSingleStore(request.form['id'])
                print(data)
                return jsonify({'status':True,'data':data})
            else:
                return jsonify({'status':False,'msg':"Invalid Route !!!"})
     else:
        return jsonify({'status':False,'msg':"Invalid Route !!!"})


# UPDATE STORE
@api.route('/update_store',methods = ['GET','POST'])
def UpdateStore():
    if request.method == 'POST' and 'admin_data' in session and (session['admin_data']['admin_role']==3 or session['admin_data']['admin_role']==1) :
        
        # CHECK BEFORE UPDATE - CHECK IF SUPER ADMIN
        if session['admin_data']['admin_role']==1:
            store_no = request.form['store_no'] 
            print(request.form)
            code = request.form['code'] 
            name = request.form['name'] 
            open_date = request.form['open_date']
            city = request.form['city'] 
            state = request.form['state'] 
            region = request.form['region'] 
            typee = request.form['type'] 
            status = request.form['status']
            foot_m2 = request.form['foot_m2'] 
            foot_ft2 = request.form['foot_ft2']  
            active_status = request.form['active_status']
            idd = request.form['store_id']
            db.updateStore(store_no, code, name, open_date,city,state, region, typee, status,foot_m2, foot_ft2,  active_status, idd) 
            return jsonify({'status':True,'msg':"Updated Successfully!!!"})
        
        # CHECK BEFORE UPDATE - CHECK IF STORE BELONGS TO SAME STORE OWNER
        elif session['admin_data']['admin_role']==3:
            check = db.checkStore(request.form['store_id'],session['admin_data']['admin_id'])
            if check:
                store_no = request.form['store_no'] 
                code = request.form['code'] 
                name = request.form['name'] 
                open_date = request.form['open_date']
                city = request.form['city'] 
                state = request.form['state'] 
                region = request.form['region'] 
                typee = request.form['type'] 
                status = request.form['status']
                foot_m2 = request.form['foot_m2'] 
                foot_ft2 = request.form['foot_ft2']  
                active_status = request.form['active_status']
                idd = request.form['store_id']
                db.updateStore(store_no, code, name, open_date,city,state, region, typee, status,foot_m2, foot_ft2,  active_status, idd) 
                return jsonify({'status':True,'msg':"Updated Successfully !!!"})
            else:
                return jsonify({'status':False,'msg':"Invalid Route !!"})
    else:
        return jsonify({'status':False,'msg':"Invalid Route !!!"})    


############### MONTHLY ###############


months = ["January","February","March","April","May","June","July","August","September","October","November","December"]


# MONTHLY REPORTS
@api.route('/monthly_reports',methods = ['GET','POST'])
def monthly_reports():
    cur = mysql.connection.cursor()
    #year = request.form['year'] 
    year = '2022'

    monthly_report = []
    i=1
    while(i<=12):
        if i==2:
            sql = "SELECT "+str(i)+" as month,month as monthly,approve_status,approved_by,DATE_FORMAT(`service_from`,'%Y-%m-%d') as service_from,DATE_FORMAT(`service_to`,'%Y-%m-%d') as service_to FROM user_tables where DATE(service_from) >= '"+str(year)+"-"+str(i)+"-01' and DATE(service_to)<='"+str(year)+"-"+str(i)+"-28'"
        elif i==4 or i == 6 or i == 9 or i == 11 :
            sql = "SELECT "+str(i)+" as month,month as monthly,approve_status,approved_by,DATE_FORMAT(`service_from`,'%Y-%m-%d') as service_from,DATE_FORMAT(`service_to`,'%Y-%m-%d') as service_to FROM user_tables where DATE(service_from) >= '"+str(year)+"-"+str(i)+"-01' and DATE(service_to)<='"+str(year)+"-"+str(i)+"-30'"
        else:
            sql = "SELECT "+str(i)+" as month,month as monthly,approve_status,approved_by,DATE_FORMAT(`service_from`,'%Y-%m-%d') as service_from,DATE_FORMAT(`service_to`,'%Y-%m-%d') as service_to FROM user_tables where DATE(service_from) >= '"+str(year)+"-"+str(i)+"-01' and DATE(service_to)<='"+str(year)+"-"+str(i)+"-31'"


        #sql = "SELECT "+str(i)+" as month,month as monthly,approve_status,approved_by,DATE_FORMAT(`service_from`,'%Y-%m-%d') as service_from,DATE_FORMAT(`service_to`,'%Y-%m-%d') as service_to FROM user_tables where DATE(service_from) >= '"+str(year)+"-"+str(i)+"-01' and DATE(service_to)<='"+str(year)+"-"+str(i)+"-31'"

        # sql = "SELECT "+str(i)+" as month,`service_from`,`service_to` FROM user_tables where DATE(service_from) >= '2022-4-01' and DATE(service_to)<='2022-4-30'"

        cur.execute(sql)
        print(sql)
        data = cur.fetchone()
        if data:
            monthly_report.append(data)
            print(data)
        i+=1 
    for monthly in monthly_report:
        monthly['month_name'] = months[monthly['month']-1]
        print(monthly['month_name'])
    return jsonify ({'status':True,'data':monthly_report})

# MONTHLY VIEW
@api.route('/monthly_view',methods = ['POST','GET'])
def monthview():

    vmonthh = request.form['vmonth'] 
    
    data=db.monthview(vmonthh)
    return jsonify ({'status':True,'data':data})


# Delete_Month
@api.route('/delete_month', methods = ['GET', 'POST'])
def deletemonth():
    
    monthh = request.form['month'] 
    
    db.deletemonth(monthh)
    return jsonify({'status': True, 'msg' : 'Deleted Successfully'})


# APPROVE MONTH
@api.route('/approve_month',methods=['POST','GET'])
def trail():
    
    monthh=request.form['month']
    approvee = request.form['approve']
    approve_by = request.form['approved_by']
    monthhh = request.form['amonth']
    

    db.approve(monthh)
    db.updateapprove(approvee,approve_by,monthhh)

    return jsonify({'status':True,'msg': 'Approve Success'})


# REJECT APPROVE
@api.route('/reject',methods = ['POST','GET'])
def reject():

    monthh =  request.form['month']
    approvee = request.form['approve']
    approve_by = request.form['approved_by']
    monthhh = request.form['rmonth']

    db.reject(monthh)
    db.rejectapprove(approvee,approve_by,monthhh)
    return jsonify({'msg':'Month Rejected'})


# FOR UPLOAD FILES
def most_frequent(List):
    counter = 0
    num = List[0]
    for i in List:
        curr_frequency = List.count(i)
        if(curr_frequency> counter):
            counter = curr_frequency
            num = i
    return num


# # APPROVE MONTH   
# @api.route('/approve_month',methods = ['POST','GET'])
# def approvemonth():

#     # if request.method == 'POST' and 'admin_data' in session and (session['admin_data']['admin_role']==1):

#         #if request.method == 'POST':
#     # doc= request.files['file_upload']
#     doc = pd.read_csv (r'/home/arawinz03/Downloads/m&s june file.xlsx')   
#     # df = pd.DataFrame(file_upload)
#     # print(doc)
#     filedata =  pd.read_excel(doc)
#     print(filedata)
#     # for data in filedata:
#     #     print(data)
#     df = pd.DataFrame(filedata)
#     df = df.replace(np.nan,'-')
#     print(df.dtypes)
#     a=df['Service From'].replace(0,'0000-00-00')
#     print(a)
#     service_dates = list(df['Service From'])
#     print(service_dates)
    
#     months = []
#     years = []

#     for service_date in service_dates:
#         if str(service_date)!='nan':
#             #print(str(service_date))
#             datee=str(service_date).split()
#             dateee=datee[0].split("-")
#             months.append(dateee[1])
#             years.append(dateee[0])

#     mon = most_frequent(months)  
#     yer = most_frequent(years)
#     print(mon)
#     print(yer)
#     my = str(mon)+"-"+str(yer)
#     print(str(my))
#     doc = uploadImage(request.files['file_upload'], str(my))

#     df.columns = [x.lower().replace(" ","_").replace("?","")\
#                             .replace("-","_").replace(r"/","_").replace("\\","_").replace("%","").replace(".","")\
#                             .replace(")","").replace(r"(","").replace("$","").replace("&","") for x in df.columns]
#     print(df.columns)
#     replacements = {
#             'object': 'varchar(50)',
#             'float64': 'float(10)',
#             'int64': 'int(10)',
#             'datetime64': 'timestamp',
#             'timedelta64[ns]': 'varchar(50)',
#             'datetime64[ns]' : 'varchar(50)',
#         }
#     col_str = ", ".join("{} {}".format(n,d) for (n,d) in zip(df.columns,df.dtypes.replace(replacements)) )
#     print(str(col_str))
#     cur = mysql.connection.cursor()
#     sql="show tables in urjanet where Tables_in_urjanet = %s"
#     print(cur.execute(sql,[my]))
#     data = cur.fetchone()
#     if data == None:        
#         cur = mysql.connection.cursor()

#         sql1 = "CREATE TABLE `"+str(my)+"` (id integer auto_increment primary key,reg_date date,"+str(col_str)+",`poc_name` varchar(50) NOT NULL DEFAULT '0',`poc_no` int(20) NOT NULL DEFAULT '0',`poc_email` varchar(100) NOT NULL DEFAULT '0',`follow1` varchar(20) NOT NULL DEFAULT 'empty',`follow2` varchar(10) NOT NULL DEFAULT 'empty',`follow3` varchar(10) NOT NULL DEFAULT 'empty',`bill_paid` varchar(10) NOT NULL DEFAULT 'empty')" 

#         print("==============create===============")
#         print(sql1)
#         print("=============================")
#         cur.execute(sql1)
#         for i,row in df.iterrows():
#             cols = "`,`".join([str(i) for i in df.columns.tolist()])
#             sql = "INSERT INTO `"+str(my)+"` (`" +cols + "`) VALUES (" + "%s,"*(len(row)-1) + "%s)"
#             print("============insert=============")
#             print(sql)
#             cur.execute(sql, tuple(row))
#             mysql.connection.commit()
#     else:
#         cols = "`,`".join([str(i) for i in df.columns.tolist()])
#         for i,row in df.iterrows():
#             sql = "INSERT INTO `"+str(my)+"` (`" +cols + "`) VALUES (" + "%s,"*(len(row)-1) + "%s)"
#             cur.execute(sql, tuple(row))
#             mysql.connection.commit

           
#     return jsonify({'status': True, "msg": 'File uploaded sucessfully'})


# UPLOAD FILE TYPE2
@api.route('/upload_file',methods = ['POST','GET'])
def uploadfile():
    # if request.method == 'POST' and 'admin_data' in session and (session['admin_data']['admin_role']==1):

        #if request.method == 'POST':
    doc= request.files['file_upload']
    print(doc)
    filedata =  pd.read_excel(doc)
    print(filedata)
    df = pd.DataFrame(filedata)
    df = df.replace(np.nan,'-')
    print(df.dtypes)
    # a=df['Service From'].replace(0,'00-00-0000')
    # print(a)
    service_dates = list(df['Service From'])
    print(service_dates)
    months = []
    years = []

    for service_date in service_dates:
        if str(service_date)!='nan':
            #print(str(service_date))
            datee=str(service_date).split()
            dateee=datee[0].split("-")
            months.append(dateee[1])
            years.append(dateee[0])

    mon = most_frequent(months)  
    yer = most_frequent(years)
    print(mon)
    print(yer)
    my = str(mon)+"-"+str(yer)
    print(str(my))
    doc = uploadImage(request.files['file_upload'], str(my))

    df.columns = [x.lower().replace(" ","_").replace("?","")\
                            .replace("-","_").replace(r"/","_").replace("\\","_").replace("%","").replace(".","")\
                            .replace(")","").replace(r"(","").replace("$","") for x in df.columns]
    print(df.columns)
    replacements = { 
            'object': 'varchar(50)',
            'float64': 'float(10)',
            'int64': 'int(10)',
            'datetime64': 'timestamp',
            'timedelta64[ns]': 'varchar(50)',
            'datetime64[ns]' : 'varchar(50)',
        }
    col_str = ", ".join("{} {}".format(n,d) for (n,d) in zip(df.columns,df.dtypes.replace(replacements)) )
    print(str(col_str)) 
    # cur = mysql.connection.cursor()
    # sql="show tables in urja where Tables_in_urja = %s"
    # print(cur.execute(sql,[my]))
    # data = cur.fetchone() 
    # if data == None:        bill_paid_direct_or_landlord
    cur = mysql.connection.cursor()
    # sql1 = "CREATE TABLE `user_tables` (id integer auto_increment primary key,"+str(col_str)+")"

    # cur.execute(sql1)
    for i,row in df.iterrows():
        cols = "`,`".join([str(i) for i in df.columns.tolist()])
        sql = "INSERT INTO `user_tables` (`" +cols + "`) VALUES (" + "%s,"*(len(row)-1) + "%s)"
        cur.execute(sql, tuple(row))
        mysql.connection.commit()

    # else:
    #     cols = "`,`".join([str(i) for i in df.columns.tolist()])
    #     for i,row in df.iterrows():
    #         sql = "INSERT INTO `"+str(my)+"` (`" +cols + "`) VALUES (" + "%s,"*(len(row)-1) + "%s)"
    #         cur.execute(sql, tuple(row))
    #         mysql.connection.commit

           
    return jsonify({'status': True, "msg": 'File uploaded sucessfully'})


############### QUATERLY ###############


quarters = ["Q1","Q2","Q3","Q4"]


#QUATERLT REPORTS
@api.route('/quarterly_reports',methods = ['GET','POST'])
def quarterly_reports():
    cur = mysql.connection.cursor()
    #year = request.form['year'] 
    year = '2022'
    quarterly_report=[]
    

    q1="SELECT DATE_FORMAT(MIN(`service_from`),'%Y-%m-%d') as service_from,DATE_FORMAT(MAX(`service_to`),'%Y-%m-%d') as service_to,MIN(`service_from`) as service_fromm, MAX(`service_to`) as service_too FROM approved_month where DATE(service_from) >= '"+str(year)+"-04-01' and DATE(service_to) <= '"+str(year)+"-06-30'"
    cur.execute(q1)
    d1=cur.fetchone()
    if d1:
        d1["quarter"]="Q1"
        quarterly_report.append(d1)
        print(d1["service_from"])

    q2="SELECT DATE_FORMAT(MIN(`service_from`),'%Y-%m-%d') as service_from,DATE_FORMAT(MAX(`service_to`),'%Y-%m-%d') as service_to,MIN(`service_from`) as service_fromm, MAX(`service_to`) as service_too FROM approved_month where service_from >= '"+str(year)+"-07-01' and service_to<='"+str(year)+"-09-30'"
    cur.execute(q2)
    d2=cur.fetchone()
    if d2:
        d2["quarter"]="Q2"
        quarterly_report.append(d2)
        
    q3="SELECT DATE_FORMAT(MIN(`service_from`),'%Y-%m-%d') as service_from,DATE_FORMAT(MAX(`service_to`),'%Y-%m-%d') as service_to,MIN(`service_from`) as service_fromm, MAX(`service_to`) as service_too FROM approved_month where service_from >= '"+str(year)+"-10-01' and service_to<='"+str(year)+"-12-31'"
    cur.execute(q3)
    d3=cur.fetchone()
    if d3:
        d3["quarter"]="Q3"

        quarterly_report.append(d3)

    q4="SELECT DATE_FORMAT(MIN(`service_from`),'%Y-%m-%d') as service_from,DATE_FORMAT(MAX(`service_to`),'%Y-%m-%d') as service_to,MIN(`service_from`) as service_fromm, MAX(`service_to`) as service_too FROM approved_month where service_from >= '"+str(year)+"-01-01' and service_to<='"+str(year)+"-03-31'"
    cur.execute(q4)
    d4=cur.fetchone()
    if d4:
        d4["quarter"]="Q4"

        quarterly_report.append(d4)

    cur.close()
    # print(quarterly_report)

    return jsonify ({'status':True,'data':quarterly_report})

#QUARTERLY VIEW
@api.route('/quarterly_view',methods = ['POST','GET'])
def quarter():

    service_from = request.form['serv_from']
    service_to = request.form['serv_to']

    data = db.quaterlydata(service_from,service_to)
    
    return jsonify ({'status':True,'data':data})


############### YEARLY ###############


# YEARLY REPORTS
@api.route('/yearly_reports',methods = ['GET','POST'])
def yearly_reports():
    cur = mysql.connection.cursor()
    #year = request.form['year'] 
    year = '2022'
    yearly_report = []
    
    sql = "SELECT DATE_FORMAT(`service_from`,'%d-%m-%Y') as service_from, DATE_FORMAT(`service_to`,'%d-%m-%Y') as service_to FROM approved_month where DATE(service_from) >= '"+str(year)+"-01-01' and DATE(service_to)<='"+str(year)+"-12-31'"

    print(sql)
    cur.execute(sql)
    data = cur.fetchone()
    print(data)
    if data:
        data["year"] = '2022'
        yearly_report.append(data)
        print(yearly_report)
    return jsonify ({'status':True,'data':yearly_report})


# YEARLY VIEW
@api.route('/yearly_view',methods = ['GET','POST'])
def yearly_view():
    cur = mysql.connection.cursor()
    #year = request.form['year'] 
    year = '2022'
    
    sql = "SELECT `store_no`, `store_code`, `store_name`, `store_opening_date`, `city`, `state`, `region`, `type`, `status_of_store`, `footage_m2`, `footage_ft2`, `separate_elec_billing`, `separate_dg_billing`, `bill_received_by_store___sent_direct_to_ho`, `bill_paid_direct_or_landlord`, `service_from`, `service_to`, `elec___kwh`, `service_from1`, `service_to1`, `dg___kwh`, `service_from2`, `service_to2`, `hvac___kwh`, `r22___kg`, `r404___kg`, `r407___kg`, `other___kg`, `average_taken_as_no_update_from_store`, `change_in_sq_ft_in_the_store`, `store_closed`, `new_store`, `closed_store_due_to_lock_down`, `notes` FROM `approved_month`"

    cur.execute(sql)
    print(sql)
    data = cur.fetchall()
    # print(data)
    cur.close()
    return jsonify ({'status':True,'data':data})


############### FOLLOW UP ###############


# FETCH FOLLOW UP MONTHLY 
@api.route('/follow_monthly',methods = ['POST','GET'])
def followmointhly():

    month = request.form['month']
    print(month)
    data=db.follow(month)
    return jsonify({'status':True,'data':data})


# UPDATE FOLLOW UP
@api.route('/edit_follow',methods = ['GET','POST'])
def followsavee():
    if request.method == 'POST' and 'admin_data' in session and (session['admin_data']['admin_role']==3 or session['admin_data']['admin_role']==1) :
        
        # CHECK BEFORE UPDATE - CHECK IF SUPER ADMIN

        if session['admin_data']['admin_role']==1:
            
            # store_no = request.form['store_no']
            follow1 = request.form['follow1'] 
            follow2 = request.form['follow2'] 
            follow3 = request.form['follow3']
            bill_paid = request.form['bill_paid'] 
            mms = request.form['mms'] 
            sno = request.form['store_no']
            monthh = request.form['month']

            db.updateFollow(follow1, follow2, follow3, bill_paid, mms, sno, monthh) 
    return jsonify({'status':True,'msg':"Updated Successfully!!!"})


############### CONTACT ###############


#CONTACT US
@api.route('/contact_us',methods = ['POST','GET'])
def contactus():

    ticket1 = request.form['ticket1']
    mail1 = request.form['mail1']
    ticket2 = request.form['ticket2']
    mail2  = request.form['mail2']
    mail3 = request.form['mail3']

    db.contact(ticket1,mail1,ticket2,mail2,mail3)
    return jsonify({'msg':'changed successfully','status':True})


# SELECT CONTACT US
@api.route('/view_contact',methods = ['POST','GET'])
def viewcontact():

    data=db.scontact()
    return jsonify ({'data':data,'status':True})


############### FORGOT PASSWORD ###############


# ROUTE FOR FORGOT PASSWORD
@api.route('/forgot_password',methods=['POST','GET'])
def forgetpass():

    if request.method=='POST':
        # content = request.json
        uname = request.form['uname']
        print(uname)
        data=db.forgot(uname)
        if data:
            print(data)
            
            return jsonify({'status':True,'msg':'change password'}) 
        else:
           return jsonify({'status':False,'msg':'Incorrect Credentials...'})
    

# UPDATE PASSWORD
@api.route('/update_password',methods =['POST','GET'])
def forgetpassword():

    maill = request.form['mail']
    passs = str(hashlib.md5(request.form['pas'].encode('UTF-8')).hexdigest())
    # passs = request.form['pas']
    db.forgotpass(passs,maill)
    return jsonify({'status':True,'msg': 'password updated'})