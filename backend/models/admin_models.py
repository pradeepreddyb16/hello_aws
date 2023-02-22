from extensions import mysql
from flask import request,jsonify
import json


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

        sql = "SELECT `store_id`,`store_no`,`store_code`,`user_ids`,`store_name`,`opening_date`,`store_city`,`store_state`,`store_region`,`store_type`,`store_status`,`store_foot_m2`,`store_foot_ft2`,`added_date`,`active_status`, `tracker1`, `tracker2`, `tracker3`, `tracker4`, `tracker5`, `tracker6`, `tracker7`, `tracker8`, `tracker9`, `tracker10` FROM `stores` where `user_ids` = %s order by id desc"

        cur.execute(sql,[uid])
        data = cur.fetchall()
        cur.close()
        return data


    ## CREATE STORE
    def addStore(store_no, code, uid, name, open_date,city,state, region, type, status,foot_m2, foot_ft2, added_date, active_status,tracker1,tracker2,tracker3,tracker4,tracker5,tracker6,tracker7,tracker8,tracker9,tracker10):
        cur = mysql.connection.cursor()
        
        sql="INSERT INTO `stores`( `store_no`, `store_code`, `user_ids`, `store_name`, `opening_date`, `store_city`, `store_state`, `store_region`, `store_type`, `store_status`, `store_foot_m2`, `store_foot_ft2`, `added_date`, `active_status`, `tracker1`, `tracker2`, `tracker3`, `tracker4`, `tracker5`, `tracker6`, `tracker7`, `tracker8`, `tracker9`, `tracker10`) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"


        cur.execute(sql,[store_no, code, uid, name, open_date,city,state, region, type, status,foot_m2, foot_ft2, added_date, active_status,tracker1,tracker2,tracker3,tracker4,tracker5,tracker6,tracker7,tracker8,tracker9,tracker10])
        mysql.connection.commit()
        cur.close()


    ## UPDATE STORE WITH STORE ID 
    def updateStore(store_no, code, name, open_date,city,state, region, typee, status,foot_m2, foot_ft2,  active_status,tracker1,tracker2,tracker3,tracker4,tracker5,tracker6,tracker7,tracker8,tracker9,tracker10, idd):
        cur = mysql.connection.cursor()

        sql = "UPDATE `stores` SET  `store_no`=%s,`store_code`=%s ,`store_name`=%s,`opening_date`=%s,`store_city`=%s,`store_state`=%s,`store_region`=%s,`store_type`=%s,`store_status`=%s,`store_foot_m2`=%s,`store_foot_ft2`=%s ,`active_status`=%s, `tracker1`=%s, `tracker2`=%s, `tracker3`=%s, `tracker4`=%s, `tracker5`=%s, `tracker6`=%s, `tracker7`=%s, `tracker8`=%s, `tracker9`=%s, `tracker10`=%s WHERE `store_id`=%s"

        cur.execute(sql,[store_no, code, name, open_date,city,state, region, typee, status,foot_m2, foot_ft2, active_status,tracker1,tracker2,tracker3,tracker4,tracker5,tracker6,tracker7,tracker8,tracker9,tracker10,idd])
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

        sql = "SELECT `store_no`,`month`, `store_code`, `store_name`, `city`, `state`, `region`,CAST(SUM(`footage_m2`) AS DECIMAL(10,2) ) as sum_footagem2,CAST(AVG(`footage_m2`) AS DECIMAL(10,2)) as avg_footagem2,CAST(SUM(`footage_ft2`) AS DECIMAL(10,2)) as sum_footageft2,CAST(AVG(`footage_ft2`) AS DECIMAL(10,2)) as avg_footageft2,CAST(SUM(`elec___kwh`) AS DECIMAL(10,2)) as sum_elec_kwh, CAST(AVG(`elec___kwh`) AS DECIMAL(10,2)) as avg_elec_kwh,CAST(SUM(`dg___kwh`) AS DECIMAL(10,2)) as sum_dg_kwh,CAST(AVG(`dg___kwh`) AS DECIMAL(10,2)) as avg_dg_kwh,CAST(SUM(`hvac___kwh`) AS DECIMAL(10,2)) as sum_hvac_kwh,CAST(AVG(`hvac___kwh`) AS DECIMAL(10,2)) as avg_hvac_kwh, CAST(SUM(`r22___kg`) AS DECIMAL(10,2)) as sum_r22_kg,CAST(AVG(`r22___kg`) AS DECIMAL(10,2)) as avg_r22_kg, CAST(SUM(`r404___kg`) AS DECIMAL(10,2)) as sum_r404_kg,CAST(AVG(`r404___kg`) AS DECIMAL(10,2)) as avg_r404_kg, CAST(SUM(`r407___kg`) AS DECIMAL(10,2)) as sum_r407_kg,CAST(AVG(`r407___kg`) AS DECIMAL(10,2))as avg_r407_kg, CAST(SUM(`other___kg`) AS DECIMAL(10,2)) as sum_other_kg,CAST(AVG(`other___kg`) AS DECIMAL(10,2)) as avg_other_kg FROM `approved_month` WHERE DATE(service_from) >= %s and DATE(service_to)<= %s GROUP BY store_code "
      
        cur.execute(sql,[serv_from,serv_to])
        data = cur.fetchall()
        cur.close()
        return data


#QUARTERLY VIEW1
    def quaterlydata1(month1):
        cur = mysql.connection.cursor()


        sql = "SELECT store_no, store_code, store_name, city, state, region,SUM(CASE WHEN month = '"+month1+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month1_elec_kwh,SUM(CASE WHEN month = '"+month1+"' THEN CAST((dg___kwh)AS DECIMAL(10,2)) END) AS month1_dg_kwh,SUM(CASE WHEN month = '"+month1+"' THEN CAST((hvac___kwh)AS DECIMAL(10,2)) END) AS month1_hvac_kwh,SUM(CASE WHEN month = '"+month1+"' THEN CAST((r22___kg)AS DECIMAL(10,2)) END) AS month1_r22_kg,SUM(CASE WHEN month = '"+month1+"' THEN CAST((r404___kg)AS DECIMAL(10,2)) END) AS month1_r404_kg,SUM(CASE WHEN month = '"+month1+"' THEN CAST((r407___kg)AS DECIMAL(10,2)) END) AS month1_r407_kg,SUM(CASE WHEN month = '"+month1+"' THEN CAST((other___kg)AS DECIMAL(10,2)) END) AS month1_other_kg FROM approved_month WHERE month IN (%s) GROUP BY store_code ORDER BY store_code; "
      
        cur.execute(sql,[month1])
        data = cur.fetchall()
        cur.close()
        return data


#QUARTERLY VIEW2
    def quaterlydata2(month1,month2):
        cur = mysql.connection.cursor()


        sql = "SELECT store_no, store_code, store_name, city, state, region,SUM(CASE WHEN month = '"+month1+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month1_elec_kwh,SUM(CASE WHEN month = '"+month2+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month2_elec_kwh,SUM(CASE WHEN month = '"+month1+"' THEN CAST((dg___kwh)AS DECIMAL(10,2)) END) AS month1_dg_kwh,SUM(CASE WHEN month = '"+month2+"' THEN CAST((dg___kwh)AS DECIMAL(10,2)) END) AS month2_dg_kwh,SUM(CASE WHEN month = '"+month1+"' THEN CAST((hvac___kwh)AS DECIMAL(10,2)) END) AS month1_hvac_kwh,SUM(CASE WHEN month = '"+month2+"' THEN CAST((hvac___kwh)AS DECIMAL(10,2)) END) AS month2_hvac_kwh,SUM(CASE WHEN month = '"+month1+"' THEN CAST((r22___kg)AS DECIMAL(10,2)) END) AS month1_r22_kg,SUM(CASE WHEN month = '"+month2+"' THEN CAST((r22___kg)AS DECIMAL(10,2)) END) AS month2_r22_kg,SUM(CASE WHEN month = '"+month1+"' THEN CAST((r404___kg)AS DECIMAL(10,2)) END) AS month1_r404_kg,SUM(CASE WHEN month = '"+month2+"' THEN CAST((r404___kg)AS DECIMAL(10,2)) END) AS month2_r404_kg,SUM(CASE WHEN month = '"+month1+"' THEN CAST((r407___kg)AS DECIMAL(10,2)) END) AS month1_r407_kg,SUM(CASE WHEN month = '"+month2+"' THEN CAST((r407___kg)AS DECIMAL(10,2)) END) AS month2_r407_kg,SUM(CASE WHEN month = '"+month1+"' THEN CAST((other___kg)AS DECIMAL(10,2)) END) AS month1_other_kg,SUM(CASE WHEN month = '"+month2+"' THEN CAST((other___kg)AS DECIMAL(10,2)) END) AS month2_other_kg FROM approved_month WHERE month IN (%s, %s) GROUP BY store_code ORDER BY store_code; "
      
        cur.execute(sql,[month1,month2])
        data = cur.fetchall()
        cur.close()
        return data


    #QUARTERLY VIEW3
    def quaterlydata3(month1,month2,month3):
        cur = mysql.connection.cursor()


       

        sql = "SELECT store_no, store_code, store_name, city, state, region,SUM(CASE WHEN month = '"+month1+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month1_elec_kwh,SUM(CASE WHEN month = '"+month2+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month2_elec_kwh,SUM(CASE WHEN month = '"+month3+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month3_elec_kwh,SUM(CASE WHEN month = '"+month1+"' THEN CAST((dg___kwh)AS DECIMAL(10,2)) END) AS month1_dg_kwh,SUM(CASE WHEN month = '"+month2+"' THEN CAST((dg___kwh)AS DECIMAL(10,2)) END) AS month2_dg_kwh,SUM(CASE WHEN month = '"+month3+"' THEN CAST((dg___kwh)AS DECIMAL(10,2)) END) AS month3_dg_kwh,SUM(CASE WHEN month = '"+month1+"' THEN CAST((hvac___kwh)AS DECIMAL(10,2)) END) AS month1_hvac_kwh,SUM(CASE WHEN month = '"+month2+"' THEN CAST((hvac___kwh)AS DECIMAL(10,2)) END) AS month2_hvac_kwh,SUM(CASE WHEN month = '"+month3+"' THEN CAST((hvac___kwh)AS DECIMAL(10,2)) END) AS month3_hvac_kwh,SUM(CASE WHEN month = '"+month1+"' THEN CAST((r22___kg)AS DECIMAL(10,2)) END) AS month1_r22_kg,SUM(CASE WHEN month = '"+month2+"' THEN CAST((r22___kg)AS DECIMAL(10,2)) END) AS month2_r22_kg,SUM(CASE WHEN month = '"+month3+"' THEN CAST((r22___kg)AS DECIMAL(10,2)) END) AS month3_r22_kg,SUM(CASE WHEN month = '"+month1+"' THEN CAST((r404___kg)AS DECIMAL(10,2)) END) AS month1_r404_kg,SUM(CASE WHEN month = '"+month2+"' THEN CAST((r404___kg)AS DECIMAL(10,2)) END) AS month2_r404_kg,SUM(CASE WHEN month = '"+month3+"' THEN CAST((r404___kg)AS DECIMAL(10,2)) END) AS month3_r404_kg,SUM(CASE WHEN month = '"+month1+"' THEN CAST((r407___kg)AS DECIMAL(10,2)) END) AS month1_r407_kg,SUM(CASE WHEN month = '"+month2+"' THEN CAST((r407___kg)AS DECIMAL(10,2)) END) AS month2_r407_kg,SUM(CASE WHEN month = '"+month3+"' THEN CAST((r407___kg)AS DECIMAL(10,2)) END) AS month3_r407_kg,SUM(CASE WHEN month = '"+month1+"' THEN CAST((other___kg)AS DECIMAL(10,2)) END) AS month1_other_kg,SUM(CASE WHEN month = '"+month2+"' THEN CAST((other___kg)AS DECIMAL(10,2)) END) AS month2_other_kg,SUM(CASE WHEN month = '"+month3+"' THEN CAST((other___kg)AS DECIMAL(10,2)) END) AS month3_other_kg FROM approved_month WHERE month IN (%s, %s, %s) GROUP BY store_code ORDER BY store_code; "
      

        # num_months = 3  # set the number of months to include
        # months = [month1, month2, month3][:num_months]  # generate a list of month strings
        # sql_months = ",".join(["SUM(CASE WHEN month = '{0}' THEN CAST((elec___kwh) AS DECIMAL(10,2)) END) AS month{1}_elec_kwh,SUM(CASE WHEN month = '{0}' THEN CAST((dg___kwh) AS DECIMAL(10,2)) END) AS month{1}_dg_kwh,SUM(CASE WHEN month = '{0}' THEN CAST((hvac___kwh) AS DECIMAL(10,2)) END) AS month{1}_hvac_kwh,SUM(CASE WHEN month = '{0}' THEN CAST((r22___kg) AS DECIMAL(10,2)) END) AS month{1}_r22_kg,SUM(CASE WHEN month = '{0}' THEN CAST((r404___kg) AS DECIMAL(10,2)) END) AS month{1}_r404_kg,SUM(CASE WHEN month = '{0}' THEN CAST((r407___kg) AS DECIMAL(10,2)) END) AS month{1}_r407_kg,SUM(CASE WHEN month = '{0}' THEN CAST((other___kg) AS DECIMAL(10,2)) END) AS month{1}_other_kg".format(month, i+1) for i, month in enumerate(months)])
        # sql_in = ",".join(["%s" for _ in range(num_months)])  # generate placeholders for the IN clause

        # sql = f"SELECT store_no, store_code, store_name, city, state, region,{sql_months} FROM approved_month WHERE month IN ({sql_in}) GROUP BY store_code ORDER BY store_code;"

        # print(sql)


        cur.execute(sql,[month1,month2,month3])
        data = cur.fetchall()
        cur.close()
        return data

#QUARTERLY MONTH DATA VIEW
    def quaterlymonthlydata(serv_from,serv_to):
        cur = mysql.connection.cursor()

        sql = "SELECT `store_no`,`month`, `store_code`, `store_name`, `city`, `state`, `region`,CAST(SUM(`footage_m2`) AS DECIMAL(10,2) ) as sum_footagem2,CAST(AVG(`footage_m2`) AS DECIMAL(10,2)) as avg_footagem2,CAST(SUM(`footage_ft2`) AS DECIMAL(10,2)) as sum_footageft2,CAST(AVG(`footage_ft2`) AS DECIMAL(10,2)) as avg_footageft2,CAST(SUM(`elec___kwh`) AS DECIMAL(10,2)) as sum_elec_kwh, CAST(AVG(`elec___kwh`) AS DECIMAL(10,2)) as avg_elec_kwh,CAST(SUM(`dg___kwh`) AS DECIMAL(10,2)) as sum_dg_kwh,CAST(AVG(`dg___kwh`) AS DECIMAL(10,2)) as avg_dg_kwh,CAST(SUM(`hvac___kwh`) AS DECIMAL(10,2)) as sum_hvac_kwh,CAST(AVG(`hvac___kwh`) AS DECIMAL(10,2)) as avg_hvac_kwh, CAST(SUM(`r22___kg`) AS DECIMAL(10,2)) as sum_r22_kg,CAST(AVG(`r22___kg`) AS DECIMAL(10,2)) as avg_r22_kg, CAST(SUM(`r404___kg`) AS DECIMAL(10,2)) as sum_r404_kg,CAST(AVG(`r404___kg`) AS DECIMAL(10,2)) as avg_r404_kg, CAST(SUM(`r407___kg`) AS DECIMAL(10,2)) as sum_r407_kg,CAST(AVG(`r407___kg`) AS DECIMAL(10,2))as avg_r407_kg, CAST(SUM(`other___kg`) AS DECIMAL(10,2)) as sum_other_kg,CAST(AVG(`other___kg`) AS DECIMAL(10,2)) as avg_other_kg FROM `approved_month` WHERE DATE(service_from) >= %s and DATE(service_to)<= %s GROUP BY store_code "
      
        cur.execute(sql,[serv_from,serv_to])
        data = cur.fetchall()
        cur.close()
        return data

    #YEARLY VIEW
    def yearview(serv_from,serv_to):
        cur = mysql.connection.cursor()

        sql = "SELECT `store_no`,`month`, `store_code`, `store_name`, `city`, `state`, `region`,CAST(SUM(`footage_m2`) AS DECIMAL(10,2) ) as sum_footagem2,CAST(AVG(`footage_m2`) AS DECIMAL(10,2)) as avg_footagem2,CAST(SUM(`footage_ft2`) AS DECIMAL(10,2)) as sum_footageft2,CAST(AVG(`footage_ft2`) AS DECIMAL(10,2)) as avg_footageft2,CAST(SUM(`elec___kwh`) AS DECIMAL(10,2)) as sum_elec_kwh, CAST(AVG(`elec___kwh`) AS DECIMAL(10,2)) as avg_elec_kwh,CAST(SUM(`dg___kwh`) AS DECIMAL(10,2)) as sum_dg_kwh,CAST(AVG(`dg___kwh`) AS DECIMAL(10,2)) as avg_dg_kwh,CAST(SUM(`hvac___kwh`) AS DECIMAL(10,2)) as sum_hvac_kwh,CAST(AVG(`hvac___kwh`) AS DECIMAL(10,2)) as avg_hvac_kwh, CAST(SUM(`r22___kg`) AS DECIMAL(10,2)) as sum_r22_kg,CAST(AVG(`r22___kg`) AS DECIMAL(10,2)) as avg_r22_kg, CAST(SUM(`r404___kg`) AS DECIMAL(10,2)) as sum_r404_kg,CAST(AVG(`r404___kg`) AS DECIMAL(10,2)) as avg_r404_kg, CAST(SUM(`r407___kg`) AS DECIMAL(10,2)) as sum_r407_kg,CAST(AVG(`r407___kg`) AS DECIMAL(10,2))as avg_r407_kg, CAST(SUM(`other___kg`) AS DECIMAL(10,2)) as sum_other_kg,CAST(AVG(`other___kg`) AS DECIMAL(10,2)) as avg_other_kg FROM `approved_month` WHERE DATE(service_from) >= %s and DATE(service_to)<= %s GROUP BY store_code"
      
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

        # sql = "SELECT `store_no`, `store_code`, `store_name`,date_format(`store_opening_date`,'%%Y-%%m-%%d') as store_opening_date, `city`, `state`, `region`, `type`, `status_of_store`, `footage_m2`, `footage_ft2`, `separate_elec_billing`, `separate_dg_billing`, `bill_received_by_store___sent_direct_to_ho`, `bill_paid_direct_or_landlord`, `service_from`, `service_to`, `elec___kwh`, `dg___kwh`,`hvac___kwh`, `r22___kg`, `r404___kg`, `r407___kg`, `other___kg`, `month` FROM `user_tables` WHERE `month` = %s "
        
        sql = "SELECT `store_no`, `store_code`, `store_name`, date_format(`store_opening_date`,'%%Y-%%m-%%d') as store_opening_date, `city`, `state`, `region`, `type`, `status_of_store`, `footage_m2`, `footage_ft2`, `separate_elec_billing`, `separate_dg_billing`, `bill_received_by_store___sent_direct_to_ho`, `bill_paid_direct_or_landlord`, date_format(`service_from`,'%%Y-%%m-%%d') as service_from, date_format(`service_to`,'%%Y-%%m-%%d') as service_to, `elec___kwh`, `dg___kwh`,`hvac___kwh`, `r22___kg`, `r404___kg`, `r407___kg`, `other___kg`, `month` FROM `user_tables` WHERE `month` = %s "


        cur.execute(sql,[vmonth])
        data = cur.fetchall()
        cur.close()
        return data


        
        

    # APPROVE MONTH
    def approve(month):
        cur = mysql.connection.cursor()

        sql = "INSERT INTO `approved_month` ( `store_no`, `store_code`, `store_name`, `store_opening_date`, `city`, `state`, `region`, `type`, `status_of_store`, `footage_m2`, `footage_ft2`, `separate_elec_billing`, `separate_dg_billing`, `bill_received_by_store___sent_direct_to_ho`, `bill_paid_direct_or_landlord`, `service_from`, `service_to`, `elec___kwh`, `dg___kwh`, `hvac___kwh`, `r22___kg`, `r404___kg`, `r407___kg`, `other___kg`, `average_taken_as_no_update_from_store`, `change_in_sq_ft_in_the_store`, `store_closed`, `new_store`, `closed_store_due_to_lock_down`, `notes`, `month`)SELECT  `store_no`, `store_code`, `store_name`, `store_opening_date`, `city`, `state`, `region`, `type`, `status_of_store`, `footage_m2`, `footage_ft2`, `separate_elec_billing`, `separate_dg_billing`, `bill_received_by_store___sent_direct_to_ho`, `bill_paid_direct_or_landlord`, `service_from`, `service_to`, `elec___kwh`, `dg___kwh`, `hvac___kwh`, `r22___kg`, `r404___kg`, `r407___kg`, `other___kg`, `average_taken_as_no_update_from_store`, `change_in_sq_ft_in_the_store`, `store_closed`, `new_store`, `closed_store_due_to_lock_down`, `notes`, `month` FROM `user_tables` WHERE `month`= %s"

    
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
    def updateFollow(pocname,pocmobile,pocemail,follow1,follow2,follow3,bill_paid,mms,sno, month):
        cur = mysql.connection.cursor()

        # sql = "UPDATE `follow` SET `follow1`=%s,`follow2`=%s,`follow3`=%s,`bill_paid`=%s,`notes`=%s WHERE `store_no`=%s "

        sql = "UPDATE `user_tables` SET `poc_name` = %s,`poc_mobile` = %s,`poc_email` = %s,`follow1`=%s,`follow2`=%s,`follow3`=%s,`bill_paid`=%s,`mms`=%s WHERE `store_no`=%s AND `month`=%s"
        
        cur.execute(sql,[pocname,pocmobile,pocemail,follow1,follow2,follow3,bill_paid,mms,sno, month])
        mysql.connection.commit()
        cur.close()          


# SELECT FOLLOW
    def follow(month):
        cur=mysql.connection.cursor()

        # sql = "SELECT `id`, `store_no`, `store_code`, `store_name`, `poc_name`, `poc_no`, `poc_email`, `follow1`, `follow2`, `follow3`, `bill_paid`, `notes` FROM `follow`"

        sql = "SELECT `id`, `store_no`, `store_code`, `store_name`,`poc_name`,`poc_mobile`,`poc_email`, `follow1`, `follow2`, `follow3`, `bill_paid`, `mms` FROM `user_tables` WHERE `month` = %s "
        
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


############### bills upload ###############


 # UPLOAD BILLS
    def billupload(billmonth,billname,uploaddate):
        cur = mysql.connection.cursor()

        sql = "INSERT INTO `bills`(`bill_month`, `bill_name`,`upload_date`) VALUES (%s,%s,%s)"

        data=cur.execute(sql,[billmonth,billname,uploaddate])
        mysql.connection.commit()
        cur.close()
        return data
    

#QUARTERLY TEST
    def quarterlycheck(year,year1):
        cur = mysql.connection.cursor()
        # year = request.form['year'] 
        # year1 = request.form['year1']
        # year = '2022'
        quarterly_report=[]
        

        # q1="SELECT DATE_FORMAT(MIN(`service_from`),'%Y-%m-%d') as service_from,DATE_FORMAT(MAX(`service_to`),'%Y-%m-%d') as service_to,MIN(`service_from`) as service_fromm, MAX(`service_to`) as service_too FROM approved_month where DATE(service_from) >= '"+str(year)+"-04-01' and DATE(service_to) <= '"+str(year)+"-06-30'"

    # QUARTER 1
        q1 = "SELECT DATE_FORMAT(MIN(`service_from`),'%Y-%m-%d') as service_from, DATE_FORMAT(MAX(`service_to`),'%Y-%m-%d') as service_to, MIN(`service_from`) as service_fromm, MAX(`service_to`) as service_too FROM approved_month WHERE DATE(service_from) >= '"+str(year)+"-04-01' AND DATE(service_to) <= '"+str(year)+"-06-30';"

        q11 = "SELECT `month` FROM approved_month WHERE DATE(service_from) >= '"+str(year)+"-04-01' AND DATE(service_to) <= '"+str(year)+"-06-30' GROUP BY `month`;"

        a1 = cur.execute(q1)
        d1=cur.fetchone()
        a2 = cur.execute(q11)
        d2=cur.fetchall()
        
        if d1 and d2:
            # d1["month1"] = ""
            # d1["month1"] = d2[0]["month"]
            # d1["month2"] = d2[1]["month"]
            # d1["month3"] = d2[2]["month"]
            s1 = len(d2)
            if s1:
                s1 -= 1
                d1["month1"] = d2[0]["month"]
            if s1:
                s1 -= 1
                d1["month2"] = d2[1]["month"]
            if s1:
                s1 -= 1
                d1["month3"] = d2[2]["month"]
            

            # for d in d2:
            #     if d1["month1"] == "":
            #         d1["month1"] = d["month"]
            #     elif d1["month2"] == "":
            #         d1["month2"] = d["month"]
            #     elif d1["month3"] == "":
            #         d1["month3"] = d["month"]
            d1["quarter"]="Q1"
            quarterly_report.append(d1)
            print(d1["service_from"])

    
    # QUARTER 2
        q2 = "SELECT DATE_FORMAT(MIN(`service_from`),'%Y-%m-%d') as service_from,DATE_FORMAT(MAX(`service_to`),'%Y-%m-%d') as service_to,MIN(`service_from`) as service_fromm, MAX(`service_to`) as service_too FROM approved_month where service_from >= '"+str(year)+"-07-01' and service_to<='"+str(year)+"-09-30'"

        q22 = "SELECT `month` FROM approved_month WHERE DATE(service_from) >= '"+str(year)+"-07-01' AND DATE(service_to) <= '"+str(year)+"-09-30' GROUP BY `month`;"
        
        a1 = cur.execute(q2)
        d1=cur.fetchone()
        a2 = cur.execute(q22)
        d2=cur.fetchall()
        
        if d1 and d2:
            s1 = len(d2)
            if s1:
                s1 -= 1
                d1["month1"] = d2[0]["month"]
            if s1:
                s1 -= 1
                d1["month2"] = d2[1]["month"]
            if s1:
                s1 -= 1
                d1["month3"] = d2[2]["month"]

            d1["quarter"]="Q2"
            quarterly_report.append(d1)
            print(d1["service_from"])
            


    # QUARTER 3
        q3="SELECT DATE_FORMAT(MIN(`service_from`),'%Y-%m-%d') as service_from,DATE_FORMAT(MAX(`service_to`),'%Y-%m-%d') as service_to,MIN(`service_from`) as service_fromm, MAX(`service_to`) as service_too FROM approved_month where service_from >= '"+str(year)+"-10-01' and service_to<='"+str(year)+"-12-31'"

        q33 = "SELECT `month` FROM approved_month WHERE DATE(service_from) >= '"+str(year)+"-10-01' AND DATE(service_to) <= '"+str(year)+"-12-31' GROUP BY `month`;"

        a1 = cur.execute(q3)
        d1=cur.fetchone()
        a2 = cur.execute(q33)
        d2=cur.fetchall()
        
        if d1 and d2:
            s1 = len(d2)
            if s1:
                s1 -= 1
                d1["month1"] = d2[0]["month"]
            if s1:
                s1 -= 1
                d1["month2"] = d2[1]["month"]
            if s1:
                s1 -= 1
                d1["month3"] = d2[2]["month"]
                
            d1["quarter"]="Q3"
            quarterly_report.append(d1)
            print(d1["service_from"])


    # QUARTER 4
        q4="SELECT DATE_FORMAT(MIN(`service_from`),'%Y-%m-%d') as service_from,DATE_FORMAT(MAX(`service_to`),'%Y-%m-%d') as service_to,MIN(`service_from`) as service_fromm, MAX(`service_to`) as service_too FROM approved_month where service_from >= '"+str(year1)+"-01-01' and service_to<='"+str(year1)+"-03-31'"

        q44 = "SELECT `month` FROM approved_month WHERE DATE(service_from) >= '"+str(year1)+"-01-01' AND DATE(service_to) <= '"+str(year1)+"-03-31' GROUP BY `month`;"

        a1 = cur.execute(q4)
        d1=cur.fetchone()
        a2 = cur.execute(q44)
        d2=cur.fetchall()
        
        if d1 and d2:
            s1 = len(d2)
            if s1:
                s1 -= 1
                d1["month1"] = d2[0]["month"]
            if s1:
                s1 -= 1
                d1["month2"] = d2[1]["month"]
            if s1:
                s1 -= 1
                d1["month3"] = d2[2]["month"]
                
            d1["quarter"]="Q4"
            quarterly_report.append(d1)
            print(d1["service_from"])

        cur.close()
        return quarterly_report


# ELEC YEAR VIEW 
 #YEAR ELEC VIEW
    def yearlyelec(months):
        cur = mysql.connection.cursor()


        # sql = "SELECT store_no, store_code, store_name, city, state, region,SUM(CASE WHEN month = '"+month1+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month1_elec_kwh,SUM(CASE WHEN month = '"+month2+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month2_elec_kwh,SUM(CASE WHEN month = '"+month3+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month3_elec_kwh,SUM(CASE WHEN month = '"+month4+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month4_elec_kwh,SUM(CASE WHEN month = '"+month5+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month5_elec_kwh,SUM(CASE WHEN month = '"+month6+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month6_elec_kwh,SUM(CASE WHEN month = '"+month7+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month7_elec_kwh,SUM(CASE WHEN month = '"+month8+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month8_elec_kwh,SUM(CASE WHEN month = '"+month9+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month9_elec_kwh,SUM(CASE WHEN month = '"+month10+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month10_elec_kwh,SUM(CASE WHEN month = '"+month11+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month11_elec_kwh,SUM(CASE WHEN month = '"+month12+"' THEN CAST((elec___kwh)AS DECIMAL(10,2)) END) AS month12_elec_kwh FROM approved_month WHERE month IN (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) GROUP BY store_code ORDER BY store_code; "
        print(months)
        print(type(months))
        months = json.loads(months)

        print(type(months))
        placeholders = ','.join(['%s']*len(months))

        sql = f"""
        SELECT store_no, store_code, store_name, city, state, region,
        {','.join([f"SUM(CASE WHEN month='{month}' THEN CAST(elec___kwh AS DECIMAL(10,2)) END) AS {month}_elec_kwh" for month in months])}
        FROM approved_month
        WHERE month IN ({placeholders})
        GROUP BY store_code
        ORDER BY store_code;    
        """
        print(sql)


        # Execute the query with the parameters
        cur.execute(sql,months)


      
        # cur.execute(sql,[month1,month2,month3,month4,month5,month6,month7,month8,month9,month10,month11,month12])
        data = cur.fetchall()
        cur.close()
        return data


    #YEAR DG VIEW
    def yearlydg(months):
        cur = mysql.connection.cursor()
        months = json.loads(months)
        placeholders = ','.join(['%s']*len(months))

        sql = f"""
        SELECT store_no, store_code, store_name, city, state, region,
        {','.join([f"SUM(CASE WHEN month='{month}' THEN CAST(dg___kwh AS DECIMAL(10,2)) END) AS {month}_dg_kwh" for month in months])}
        FROM approved_month
        WHERE month IN ({placeholders})
        GROUP BY store_code
        ORDER BY store_code;    
        """
        print(sql)
        # Execute the query with the parameters
        cur.execute(sql,months)
        data = cur.fetchall()
        cur.close()
        return data


#YEAR HVAC VIEW
    def yearlyhvac(months):
        cur = mysql.connection.cursor()
        print(type(months))
        months = json.loads(months)
        print(type(months))
        placeholders = ','.join(['%s']*len(months))

        sql = f"""
        SELECT store_no, store_code, store_name, city, state, region,
        {','.join([f"SUM(CASE WHEN month='{month}' THEN CAST(hvac___kwh AS DECIMAL(10,2)) END) AS {month}_hvac_kwh" for month in months])}
        FROM approved_month
        WHERE month IN ({placeholders})
        GROUP BY store_code
        ORDER BY store_code;    
        """
        
        print(sql)
        # Execute the query with the parameters
        cur.execute(sql,months)
        data = cur.fetchall()
        cur.close()
        return data
    

#YEAR HVAC VIEW
    def yearlyr22(months):
        cur = mysql.connection.cursor()
        print(type(months))
        months = json.loads(months)
        print(type(months))
        placeholders = ','.join(['%s']*len(months))

        sql = f"""
        SELECT store_no, store_code, store_name, city, state, region,
        {','.join([f"SUM(CASE WHEN month='{month}' THEN CAST(r22___kwh AS DECIMAL(10,2)) END) AS {month}_r22_kwh" for month in months])}
        FROM approved_month
        WHERE month IN ({placeholders})
        GROUP BY store_code
        ORDER BY store_code;    
        """
        print(sql)
        # Execute the query with the parameters
        cur.execute(sql,months)
        data = cur.fetchall()
        cur.close()
        return data
    

#YEAR HVAC VIEW
    def yearlyr404(months):
        cur = mysql.connection.cursor()
        print(type(months))
        months = json.loads(months)
        print(type(months))
        placeholders = ','.join(['%s']*len(months))

        sql = f"""
        SELECT store_no, store_code, store_name, city, state, region,
        {','.join([f"SUM(CASE WHEN month='{month}' THEN CAST(r404___kwh AS DECIMAL(10,2)) END) AS {month}_r404_kwh" for month in months])}
        FROM approved_month
        WHERE month IN ({placeholders})
        GROUP BY store_code
        ORDER BY store_code;    
        """
        print(sql)
        # Execute the query with the parameters
        cur.execute(sql,months)
        data = cur.fetchall()
        cur.close()
        return data
    

#YEAR HVAC VIEW
    def yearlyr407(months):
        cur = mysql.connection.cursor()
        print(type(months))
        months = json.loads(months)
        print(type(months))
        placeholders = ','.join(['%s']*len(months))

        sql = f"""
        SELECT store_no, store_code, store_name, city, state, region,
        {','.join([f"SUM(CASE WHEN month='{month}' THEN CAST(r407___kwh AS DECIMAL(10,2)) END) AS {month}_r407_kwh" for month in months])}
        FROM approved_month
        WHERE month IN ({placeholders})
        GROUP BY store_code
        ORDER BY store_code;    
        """
        print(sql)
        # Execute the query with the parameters
        cur.execute(sql,months)
        data = cur.fetchall()
        cur.close()
        return data
    

#YEAR HVAC VIEW
    def yearlyother(months):
        cur = mysql.connection.cursor()
        print(type(months))
        months = json.loads(months)
        print(type(months))
        placeholders = ','.join(['%s']*len(months))

        sql = f"""
        SELECT store_no, store_code, store_name, city, state, region,
        {','.join([f"SUM(CASE WHEN month='{month}' THEN CAST(other___kwh AS DECIMAL(10,2)) END) AS {month}_other_kwh" for month in months])}
        FROM approved_month
        WHERE month IN ({placeholders})
        GROUP BY store_code
        ORDER BY store_code;    
        """
        print(sql)
        # Execute the query with the parameters
        cur.execute(sql,months)
        data = cur.fetchall()
        cur.close()
        return data