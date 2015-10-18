var express = require('express');
var dao = require('../../dao')
var router = express.Router();
var _ = require('lodash')
var sqlUtil = require('../../dao/util')

let context = 'isha'
let reports = {
	11: "select * from area ",
	12: "select houseId,areaId,cast(timelog as char) timelog,surveyor,houseNs,gps_latitude,gps_longitude from house WHERE areaId=?",
	13: "SELECT a.householdId,a.houseId,a.areaId,b.houseNs,IF(c.name IS NULL,'',c.name) head,CAST(a.timelog AS CHAR) timelog,a.surveyor,religion,totalMembers FROM household a LEFT JOIN house b ON a.houseId=b.houseId LEFT JOIN (SELECT * from member WHERE head='Yes') c ON a.householdId=c.householdId WHERE a.areaId=? ",
	14: "SELECT householdId,a.houseId,a.areaId,b.houseNs,CAST(a.timelog AS CHAR) timelog,a.surveyor,NAME,age_value,age_unit,IF(gender='Male','M','F') gender,IF(head IS NULL,'',head) head FROM member a LEFT JOIN house b ON a.houseId=b.houseId WHERE a.areaId=?",
	15: "SELECT householdId,a.houseId,a.areaId,b.houseNs,CAST(a.timelog AS CHAR) timelog,a.surveyor,NAME,age_value,age_unit,IF(gender='Male','M','F') gender,IF(head IS NULL,'',head) head FROM member a LEFT JOIN house b ON a.houseId=b.houseId where age_value>29 and age_value<70 and age_unit='Years' AND  a.areaId=? ",
	16: "SELECT  b.username,COUNT(*) missingGps  FROM house a LEFT JOIN user b ON a.surveyor=b.id WHERE timelog LIKE '$today'  AND ( gps_latitude IS NULL OR gps_latitude=0) GROUP BY surveyor ORDER BY COUNT(*) DESC",
	17: "SELECT   a.areaId,a.houseId,houseNs,a.timelog,a.surveyor FROM house a JOIN  enumVisit  b ON a.houseId=b.houseId WHERE hhAvailability='Door temporarily locked'  AND   a.areaId=?",
	21: "SELECT * FROM (SELECT  a.memberId,NAME,gender,age_value,c.houseNs,IF(b.memberId IS NULL,'Pending','Completed') STATUS  FROM member a LEFT JOIN invitationCard b ON a.memberId=b.memberId LEFT JOIN house c ON a.houseId=c.houseId WHERE age_value>29 AND age_value<70 AND age_unit='Years' AND a.areaId=?) tab1 ORDER BY STATUS DESC",
	31: "SELECT a.id,username,role,CAST(IF(b.teamId IS NULL,'',b.teamId) as CHAR) teamId,IF(c.name IS NULL,'',c.name) NAME FROM user  a LEFT JOIN teamuser b ON a.id=b.userId LEFT JOIN team c ON b.teamId=c.id ",
	32: "SELECT  b.username,TIME(MIN(timelog)) first_house,TIME(MAX(timelog)) last_house FROM house  a LEFT JOIN  user b ON a.surveyor=b.id WHERE timelog LIKE '$today' GROUP BY surveyor",
	42: "SELECT  username,interviews,participants,(participants/interviews)*100 percentage  FROM (SELECT c.username,SUM(IF(a.memberId IS NOT NULL,1,0)) interviews,SUM(IF(b.memberId IS NOT NULL,1,0)) participants FROM hcMember a LEFT JOIN wrkstn1 b ON a.memberId=b.memberId  LEFT JOIN user  c ON a.surveyor=c.id  LEFT JOIN member d ON a.memberId=d.memberId WHERE d.areaId=? GROUP BY a.surveyor) tab1",
	43: "SELECT * FROM member a JOIN hcMember tab1 ON a.memberId=tab1.memberId  LEFT JOIN  ffqBeverages t1 ON a.memberId=t1.memberId LEFT JOIN ffqCereals t2 ON a.memberId=t2.memberId LEFT JOIN ffqFoodAdditives t3 ON a.memberId=t3.memberId LEFT JOIN ffqFruits t4 ON a.memberId=t4.memberId LEFT JOIN ffqGeneral t5 ON a.memberId=t5.memberId LEFT JOIN ffqJuice t6 ON a.memberId=t6.memberId LEFT JOIN ffqNonVeg t7 ON a.memberId=t7.memberId LEFT JOIN ffqOthers t8 ON a.memberId=t8.memberId LEFT JOIN ffqPulses t9 ON a.memberId=t9.memberId LEFT JOIN ffqRaw t10 ON a.memberId=t10.memberId LEFT JOIN ffqSalt t11 ON a.memberId=t11.memberId LEFT JOIN ffqSnacks t12 ON a.memberId=t12.memberId LEFT JOIN ffqSpiceMix t13 ON a.memberId=t13.memberId LEFT JOIN ffqSweets t14 ON a.memberId=t14.memberId LEFT JOIN ffqVeg t15 ON a.memberId=t15.memberId LEFT JOIN memberAlcohol2 t16 ON a.memberId=t16.memberId LEFT JOIN memberAlcoholFreq t17 ON a.memberId=t17.memberId LEFT JOIN memberBp1 t18 ON a.memberId=t18.memberId LEFT JOIN memberBp2 t19 ON a.memberId=t19.memberId LEFT JOIN memberFamilyMedicalHistory t20 ON a.memberId=t20.memberId LEFT JOIN memberFmhDisease t21 ON a.memberId=t21.memberId LEFT JOIN memberGeneralMood t22 ON a.memberId=t22.memberId LEFT JOIN memberPersonalMedicalHistory t23 ON a.memberId=t23.memberId LEFT JOIN memberReproductiveHistory t24 ON a.memberId=t24.memberId LEFT JOIN wrkstn1 t25 ON a.memberId=t25.memberId LEFT JOIN wrkstn2 t26 ON a.memberId=t26.memberId LEFT JOIN wrkstn3 t27 ON a.memberId=t27.memberId LEFT JOIN wrkstn4 t28 ON a.memberId=t28.memberId LEFT JOIN wrkstn5 t29 ON a.memberId=t29.memberId LEFT JOIN wrkstn6 t30 ON a.memberId=t30.memberId WHERE a.areaId=?  AND age_unit='Years' AND age_value>29 AND age_value<70 ",
	51: "SELECT a.memberId,a.name,gender,age_value,houseNs,mobile1,mobile2,e.username surveyor FROM member a   JOIN hcMember z ON a.memberId=z.memberId LEFT JOIN wrkstn1 b ON a.memberId=b.memberId LEFT JOIN house c ON a.houseId=c.houseId LEFT JOIN  hhContact d ON a.householdId=d.householdId LEFT JOIN user e ON z.surveyor=e.id WHERE a.age_value>29 AND a.age_value<71 AND  b.memberId IS NULL AND a.areaId=?"
}



router.get('/area/:areaId/:reportId', (req, res) => {

	let params = req.params
	sqlUtil.writeResponse(context, reports[params.reportId], [params.areaId], res)

})

module.exports = router;