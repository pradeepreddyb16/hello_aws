from extensions import mysql
from flask import request,jsonify



class Models:


    # GET ADMIN LOGIN DETAILS
    def checkAdminLogin(uname,passs):
        cur=mysql.connection.cursor()
        sql="SELECT `admin_id`,`admin_name`,`admin_pass`,`admin_email`,`admin_mobile`,`login_atempts`, date_format(`login_date`,'%%Y-%%m-%%d') as login_date,`otp_atempts`,date_format(`otp_date`,'%%Y-%%m-%%d') as`otp_date` , `admin_role`  FROM `admins`  WHERE ( `admin_email` = %s or `admin_mobile`=%s ) and admin_pass=%s and `admin_status`=1"
        cur.execute(sql,[uname,uname,passs])
        data=cur.fetchone()
        cur.close() 
        return data

    # LOGIN ATTEMPT WITH UNAME
    def getLoginAttemptsWithUname(uname):
        cur=mysql.connection.cursor()
        sql="SELECT `login_atempts`, date_format(`login_date`,'%%Y-%%m-%%d') as login_date,`otp_atempts`,date_format(`otp_date`,'%%Y-%%m-%%d') as`otp_date` FROM `admins` WHERE ( `admin_email` = %s or `admin_mobile`=%s )  and `admin_status`=1"
        cur.execute(sql,[uname,uname])
        data=cur.fetchone()
        cur.close() 
        return data


    # UPDATE LOGIN FAILED ATTEMPTS
    def failedLogin(datee,username):
        cur=mysql.connection.cursor()
        sql="UPDATE `admins` SET  `login_atempts`=`login_atempts`+1,`login_date`=%s WHERE `admin_email`=%s or `admin_mobile`=%s "
        cur.execute(sql,[datee,username,username])
        mysql.connection.commit()
        cur.close()


    # PASSWORD ATTEMPTS RESET
    def resetPasswordAttemptswithUname(uname):
        cur=mysql.connection.cursor()
        sql="UPDATE `admins` SET  `login_atempts`=0 WHERE  `admin_email`=%s or `admin_mobile`=%s  "
        cur.execute(sql,[uname,uname])
        mysql.connection.commit()
        cur.close() 
 
     
    def getotpAttemptsWithUname(uname):
        cur=mysql.connection.cursor()
        sql="SELECT `login_atempts`, date_format(`login_date`,'%%Y-%%m-%%d') as login_date,`otp_atempts`,date_format(`otp_date`,'%%Y-%%m-%%d') as`otp_date` FROM `admins` WHERE ( `admin_email` = %s or `admin_mobile`=%s )  and `admin_status`=1"
        cur.execute(sql,[uname,uname])
        data=cur.fetchone()
        cur.close() 
        return data


    # OTP ATTEMPTS RESET
    def resetOTPAttemptswithUname(uname):
        cur=mysql.connection.cursor()
        sql="UPDATE `admins` SET  `otp_atempts`=0 WHERE  `admin_email`=%s or `admin_mobile`=%s "
        cur.execute(sql,[uname,uname])
        mysql.connection.commit()
        cur.close() 


    # UPDATE FAILED OTP ATTEMPTS
    def failedOTP(datee,username):
        cur=mysql.connection.cursor()
        sql="UPDATE `admins` SET  `otp_atempts`=`otp_atempts`+1,`otp_date`=%s WHERE `admin_email`=%s or `admin_mobile`=%s "
        cur.execute(sql,[datee,username,username])
        mysql.connection.commit()
        cur.close()


   # CHECK MOBILE NUMBER,EMAIL
    def checkMobileandEmail(uemail,umobile):
        cur=mysql.connection.cursor()
        sql = "SELECT `admin_email`,`admin_mobile` FROM `admins` WHERE ( `admin_email` = %s or `admin_mobile`=%s )"
        cur.execute(sql,[uemail,umobile])
        data = cur.fetchone()
        cur.close()
        return data
    
    
    # CHECK EMAIL FOR EDIT
    def checkEmailforUpdate(uemail,uid):
        cur = mysql.connection.cursor()
        sql = "SELECT `admin_email` from admins where `admin_email` = %s and `admin_id` != %s"
        cur.execute(sql,[uemail,uid])
        data = cur.fetchone()
        cur.close()
        return data

    # CHECK MOBILE FOR EDIT
    def checkMobileforUpdate(umobile,uidd):
        cur = mysql.connection.cursor()
        sql = "SELECT `admin_mobile` from admins where `admin_mobile` = %s and `admin_id` != %s"
        cur.execute(sql,[umobile,uidd])
        data = cur.fetchone()
        cur.close()
        return data


############### ADMIN ###############


    # ADD ADMIN DETAILS
    def addadmin(uname,uemail,umobile,upass,uotp,uregdate,urole,ulogindate,uotpdate,status):
        cur = mysql.connection.cursor()
        sql = "INSERT INTO `admins`( `admin_name`, `admin_email`, `admin_mobile`, `admin_pass`, `admin_otp`, `admin_regdate`, `admin_role`, `login_date`, `otp_date`,`admin_status`) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        cur.execute(sql,[uname,uemail,umobile,upass,uotp,uregdate,urole,ulogindate,uotpdate,status])
        mysql.connection.commit()
        cur.close()

    #SELECT ADMIN 
    def selectadmin():
        cur = mysql.connection.cursor()
        sql = "SELECT `admin_id`, `admin_name`, `admin_email`, `admin_mobile`, date_format(`admin_regdate`,'%d-%m-%Y') as admin_regdate,`admin_role`, `admin_status`  FROM `admins` ORDER BY admin_id desc"
        cur.execute(sql)
        data = cur.fetchall()
        # print("admin_model",data)
        cur.close()
        return data


    # SELECT SINGLE ADMIN
    def singleadmin(uidd):
        cur = mysql.connection.cursor()
        sql = "SELECT  `admin_name`, `admin_email`, `admin_mobile`, `admin_role`, `admin_status` FROM `admins` WHERE `admin_id` = %s"
        cur.execute(sql,[uidd])
        data = cur.fetchone()
        cur.close()
        return data
    

    # EDIT ADMIN
    def editadmin(uname,uemail,umobile,urole,ustatus,uid):
        cur = mysql.connection.cursor()
        sql = "UPDATE `admins` SET `admin_name`= %s,`admin_email`= %s,`admin_mobile`= %s,`admin_role`= %s,`admin_status` = %s  WHERE `admin_id`= %s "
        cur.execute(sql,[uname,uemail,umobile,urole,ustatus,uid])
        mysql.connection.commit()
        cur.close()

    
############### STORE ###############


    # GET SINGLE STORE DETAILS WITH STORE ID
    def getSingleStore(idd):
        cur = mysql.connection.cursor()
        
        sql = "SELECT `store_id`, `store_no`, `store_code`, `user_ids`, `store_name`, DATE_FORMAT(`opening_date`,'%%Y-%%m-%%d') as opening_date, `store_city`, `store_state`, `store_region`, `store_type`, `store_status`, `store_foot_m2`, `store_foot_ft2`, `added_date`, `active_status`, `tracker1`, `tracker2`, `tracker3`, `tracker4`, `tracker5`, `tracker6`, `tracker7`, `tracker8`, `tracker9`, `tracker10` FROM `stores` WHERE `store_id`= %s"

        cur.execute(sql,[idd])
        data = cur.fetchone()
        cur.close()
        return data

    ## GET ALL STORES
    def getAllStores():
        cur = mysql.connection.cursor()
        
        sql = "SELECT `store_id`, `store_no`, `store_code`, `user_ids`, `store_name`, DATE_FORMAT(`opening_date`,'%Y-%m-%d') as opening_date, `store_city`, `store_state`, `store_region`, `store_type`, `store_status`, `store_foot_m2`, `store_foot_ft2`, `added_date`, `active_status`, `tracker1`, `tracker2`, `tracker3`, `tracker4`, `tracker5`, `tracker6`, `tracker7`, `tracker8`, `tracker9`, `tracker10` FROM `stores` order by store_id desc"

        cur.execute(sql)
        data = cur.fetchall()
        cur.close()
        return data


    ## GET ALL STORES
    def getAllStoresByUID(uid):
        cur = mysql.connection.cursor()

        sql = "SELECT `store_id`,`store_no`,`store_code`,`user_ids`,`store_name`,`opening_date`,`store_city`,`store_state`,`store_region`,`store_type`,`store_status`,`store_foot_m2`,`store_foot_ft2`,`added_date`,`active_status` FROM `stores` where `user_ids` = %s order by id desc"

        cur.execute(sql,[uid])
        data = cur.fetchall()
        cur.close()
        return data


    ## CREATE STORE
    def addStore(store_no, code, uid, name, open_date,city,state, region, type, status,foot_m2, foot_ft2, added_date, active_status):
        cur = mysql.connection.cursor()
        
        sql="INSERT INTO `stores`( `store_no`, `store_code`, `user_ids`, `store_name`, `opening_date`, `store_city`, `store_state`, `store_region`, `store_type`, `store_status`, `store_foot_m2`, `store_foot_ft2`, `added_date`, `active_status`) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"


        cur.execute(sql,[store_no, code, uid, name, open_date,city,state, region, type, status,foot_m2, foot_ft2, added_date, active_status])
        mysql.connection.commit()
        cur.close()

    ## UPDATE STORE WITH STORE ID 
    def updateStore(store_no, code, name, open_date,city,state, region, typee, status,foot_m2, foot_ft2,  active_status, idd):
        cur = mysql.connection.cursor()

        sql = "UPDATE `stores` SET  `store_no`=%s,`store_code`=%s ,`store_name`=%s,`opening_date`=%s,`store_city`=%s,`store_state`=%s,`store_region`=%s,`store_type`=%s,`store_status`=%s,`store_foot_m2`=%s,`store_foot_ft2`=%s ,`active_status`=%s WHERE `store_id`=%s"

        cur.execute(sql,[store_no, code, name, open_date,city,state, region, typee, status,foot_m2, foot_ft2, active_status, idd])
        mysql.connection.commit()
        cur.close()
        
    ## CHECK STORE
    def checkStore(idd, uid):
        cur = mysql.connection.cursor()

        sql = "SELECT `store_id`,`store_no`,`store_code`,`user_ids`,`store_name`,`opening_date`,`store_city`,`store_state`,`store_region`,`store_type`,`store_status`,`store_foot_m2`,`store_foot_ft2`,`added_date`,`active_status` FROM `stores` WHERE `store_id`=%s and `user_ids`=%s "

        cur.execute(sql,[idd,uid])
        data = cur.fetchone()
        cur.close()
        if data:
            return True
        else:
            return False    


############### QUATERLY ###############
 

#QUARTERLY VIEW
    def quaterlydata(serv_from,serv_to):
        cur = mysql.connection.cursor()

        # sql = "SELECT april.`id`, april.`store_no`, april.`store_code`, april.`store_name`, april.`store_opening_date`, april.`city`, april.`state`, april.`region`, april.`type`, april.`status_of_store`,  april.`service_from`, june.`service_to`, (april.`elec___kwh`) as april_elec_kwh, (may.`elec___kwh`) as may_elec_kwh, (june.`elec___kwh`) as june_elec_kwh,(june.`elec___kwh`+may.`elec___kwh`+april.`elec___kwh`) as q2_elec_total, avg((june.`elec___kwh`+may.`elec___kwh`+april.`elec___kwh`)/3) as q2_average,(april.`dg___kwh`) as april_dg_kwh,(may.`dg___kwh`) as may_dg_kwh,(june.`dg___kwh`) as june_dg_kwh,(june.`dg___kwh`+may.`dg___kwh`+april.`dg___kwh`) as q2_dg_total, avg((june.`elec___kwh`+may.`elec___kwh`+april.`elec___kwh`)/3) as q2_dg_average FROM `06-2022` as june JOIN `05-2022` as may ON june.`store_no` = may.`store_no` JOIN `04-2022` as april ON may.`store_no`= april.`store_no` group by june.`store_no`,april.`store_no`,may.`store_no` order by april.id;"

        sql = "SELECT `store_no`, `store_code`, `store_name`, `city`, `state`, `region`,`footage_m2`, `footage_ft2`,`elec___kwh`,`dg___kwh`,`hvac___kwh`, `r22___kg`, `r404___kg`, `r407___kg`, `other___kg` FROM `approved_month` WHERE DATE(service_from) >= %s and DATE(service_to)<= %s "
      
        cur.execute(sql,[serv_from,serv_to])
        data = cur.fetchall()
        cur.close()
        return data


############### MONTHLY ###############


# #TOTAL MONTHS VIEW
#     def monthdata():
#         cur=mysql.connection.cursor()
#         cur.execute("show tables in urjanet where Tables_in_urjanet like '%-2022'")
#         data=cur.fetchall()
#         cur.close()
#         print(data)
#         tables=[]
#         for da in data:
#             #print(da['Tables_in_urjanet'])
#             my = str(da['Tables_in_urjanet'])
#             print(my)
#             sql="select DATE_FORMAT(`service_from`,'%m-%Y') as month_and_year , min(`service_from`) as service_from ,max(`service_to`) as service_to from `"+str(da['Tables_in_urjanet'])+"`"
            
#             print(sql)
#             cur=mysql.connection.cursor()
#             cur.execute(sql)
#             data1=cur.fetchall()
#             print("------------TABLE START--------------")
#             print(data1)
#             print("------------TABLE END--------------")
#             cur.close()
#             tables.append(data1)
            
#         return tables


#INDIVIDUAL MONTH VIEW
    def monthview(vmonth):
        cur = mysql.connection.cursor()

        sql = "SELECT `store_no`, `store_code`, `store_name`, `store_opening_date`, `city`, `state`, `region`, `type`, `status_of_store`, `footage_m2`, `footage_ft2`, `separate_elec_billing`, `separate_dg_billing`, `bill_received_by_store___sent_direct_to_ho`, `bill_paid_direct_or_landlord`, `service_from`, `service_to`, `elec___kwh`, `dg___kwh`,`hvac___kwh`, `r22___kg`, `r404___kg`, `r407___kg`, `other___kg`, `month` FROM `user_tables` WHERE `month` = %s "

        cur.execute(sql,[vmonth])
        data = cur.fetchall()
        cur.close()
        return data
        

    # APPROVE MONTH
    def approve(month):
        cur = mysql.connection.cursor()

        sql = "INSERT INTO `approved_month` ( `store_no`, `store_code`, `store_name`, `store_opening_date`, `city`, `state`, `region`, `type`, `status_of_store`, `footage_m2`, `footage_ft2`, `separate_elec_billing`, `separate_dg_billing`, `bill_received_by_store___sent_direct_to_ho`, `bill_paid_direct_or_landlord`, `service_from`, `service_to`, `elec___kwh`, `service_from1`, `service_to1`, `dg___kwh`, `service_from2`, `service_to2`, `hvac___kwh`, `r22___kg`, `r404___kg`, `r407___kg`, `other___kg`, `average_taken_as_no_update_from_store`, `change_in_sq_ft_in_the_store`, `store_closed`, `new_store`, `closed_store_due_to_lock_down`, `notes`, `month`)SELECT  `store_no`, `store_code`, `store_name`, `store_opening_date`, `city`, `state`, `region`, `type`, `status_of_store`, `footage_m2`, `footage_ft2`, `separate_elec_billing`, `separate_dg_billing`, `bill_received_by_store___sent_direct_to_ho`, `bill_paid_direct_or_landlord`, `service_from`, `service_to`, `elec___kwh`, `service_from1`, `service_to1`, `dg___kwh`, `service_from2`, `service_to2`, `hvac___kwh`, `r22___kg`, `r404___kg`, `r407___kg`, `other___kg`, `average_taken_as_no_update_from_store`, `change_in_sq_ft_in_the_store`, `store_closed`, `new_store`, `closed_store_due_to_lock_down`, `notes`, `month` FROM `user_tables` WHERE `month`= %s"

    
        data=cur.execute(sql,[month])
        mysql.connection.commit()
        cur.close()
        return data


    #UPDATE APPROVE STATUS
    def updateapprove(approve,approved_by,amonth):
        cur = mysql.connection.cursor()

        sql = "UPDATE `user_tables` SET `approve_status`= %s, `approved_by`=%s WHERE `month`= %s"
    
        data=cur.execute(sql,[approve,approved_by,amonth])
        mysql.connection.commit()
        cur.close()
        return data


    # REJECT APPROVE
    def reject(month):
        cur = mysql.connection.cursor()
        sql = "DELETE FROM `approved_month` WHERE `month`= %s"
        cur.execute(sql,[month])
        mysql.connection.commit()
        cur.close()


    #UPDATE APPROVE STATUS
    def rejectapprove(approve,updated_by,rmonth):
        cur = mysql.connection.cursor()

        sql = "UPDATE `user_tables` SET `approve_status`= %s,`updated_by`=%s WHERE `month`= %s"
    
        data=cur.execute(sql,[approve,updated_by,rmonth])
        mysql.connection.commit()
        cur.close()
        return data


    # DELETE MONTH
    def deletemonth(service_from):
        cur=mysql.connection.cursor()
        sql ="DELETE FROM `user_tables` WHERE `month`= %s "
        print(sql)
        cur.execute(sql,[service_from])
        mysql.connection.commit()
        cur.close()
            

############### FOLLOW UP ############### 
 

# UPDATE STORE WITH STORE ID
    def updateFollow(follow1,follow2,follow3,bill_paid,mms,sno, month):
        cur = mysql.connection.cursor()

        # sql = "UPDATE `follow` SET `follow1`=%s,`follow2`=%s,`follow3`=%s,`bill_paid`=%s,`notes`=%s WHERE `store_no`=%s "

        sql = "UPDATE `user_tables` SET `follow1`=%s,`follow2`=%s,`follow3`=%s,`bill_paid`=%s,`mms`=%s WHERE `store_no`=%s AND `month`=%s"
        
        cur.execute(sql,[follow1,follow2,follow3,bill_paid,mms,sno, month])
        mysql.connection.commit()
        cur.close()          


# SELECT FOLLOW
    def follow(month):
        cur=mysql.connection.cursor()

        # sql = "SELECT `id`, `store_no`, `store_code`, `store_name`, `poc_name`, `poc_no`, `poc_email`, `follow1`, `follow2`, `follow3`, `bill_paid`, `notes` FROM `follow`"

        sql = "SELECT `id`, `store_no`, `store_code`, `store_name`, `follow1`, `follow2`, `follow3`, `bill_paid`, `mms` FROM `user_tables` WHERE `month` = %s "
        
        cur.execute(sql,[month])
        data = cur.fetchall()
        cur.close()
        return data


############### CONTACT ###############


# SELECT CONTACT US
    def scontact():
        cur = mysql.connection.cursor()

        sql = "SELECT `zendesk_support`, `arcadia_poc`, `standard_support`, `mail2`, `mail3` FROM `contact` WHERE `id`='1'"
        
        cur.execute(sql)
        data = cur.fetchall()
        cur.close()
        return data


#EDIT CONTACT US
    def contact(ticket1,mail1,ticket2,mail2,mail3):
        cur = mysql.connection.cursor()
        
        sql="UPDATE `contact` SET `zendesk_support`=%s,`arcadia_poc`=%s,`standard_support`=%s,`mail2`=%s,`mail3`=%s WHERE `id`= '1'"

        cur.execute(sql,[ticket1,mail1,ticket2,mail2,mail3])
        mysql.connection.commit()

        cur.close()


############### FORGOT PASSWORD ###############


    # CHECK EMAIL FOR FORGOT PASSWORD
    def forgot(uname):
        cur=mysql.connection.cursor()
        
        sql= "SELECT `admin_id`,`admin_name`,`admin_pass`,`admin_email`,`admin_mobile`,`login_atempts`, date_format(`login_date`,'%%Y-%%m-%%d') as login_date,`otp_atempts`,date_format(`otp_date`,'%%Y-%%m-%%d') as`otp_date` , `admin_role`  FROM `admins`  WHERE ( `admin_email` = %s ) and `admin_status`=1"

        cur.execute(sql,[uname])
        data = cur.fetchone()
        return data


    # FORGOT PASSWORD
    def forgotpass(pas,mail):
        cur = mysql.connection.cursor()
        sql = "UPDATE `admins` SET `admin_pass`= %s WHERE `admin_email`=%s"
        cur.execute(sql,[pas,mail])
        mysql.connection.commit()
        cur.close()

