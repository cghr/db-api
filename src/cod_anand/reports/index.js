var express = require('express');
var dao = require('../../dao')
var router = express.Router();
var _ = require('lodash')
var sqlUtil = require('../../dao/util')

let context = 'cod_anand'
let reports = {
	"11": "SELECT a.areaId,a.name,IF(households IS NULL,0,households) households,IF(members IS NULL,0,members)members,deaths,below70,above70,va,esl FROM area a LEFT JOIN householdByArea b ON a.areaId=b.areaId LEFT JOIN memberByArea c ON a.areaId=c.areaId LEFT JOIN deathByArea d ON a.areaId=d.areaId",
	"12": "select * from house where areaId=?",
	"13": "select  * from household where areaId=?",
	"14": "SELECT deathId,a.name,age_value,age_unit,sex,surveytype,b.username FROM death a LEFT JOIN user b ON a.surveyor=b.id WHERE areaId=?",
	"15": "SELECT  a.deathId,c.username,summary FROM narrative a JOIN death b ON a.deathId=b.deathId  LEFT JOIN user c  ON b.surveyor=c.id  WHERE b.areaId=?",
	"16": "SELECT  surveytype,COUNT(*) deaths FROM death WHERE areaId=? GROUP BY surveytype",
	"31": "select id,username,role from user ",
	"32": "SELECT  surveyor,b.username,COUNT(*) deaths FROM death a LEFT JOIN user b ON a.surveyor=b.id  WHERE areaId=1 GROUP BY surveyor",
	"41": "SELECT  surveytype,COUNT(*) deaths FROM death  GROUP BY surveytype",
	"42": "SELECT  surveyor,b.username,COUNT(*) deaths FROM death a LEFT JOIN user b ON a.surveyor=b.id   GROUP BY surveyor",
	"43": "SELECT a.areaId,b.name,COUNT(*) total_deaths,SUM(IF(age_value<70,1,0)) below70,SUM(IF(age_value>=70,1,0)) equalAndAbove70 FROM death a LEFT JOIN area  b ON a.areaId=b.areaId WHERE surveytype='va' GROUP BY areaId",
	"51": "SELECT CAST(CONCAT(\"<a href='http://barshi.vm-host.net/esl/#/death/\",a.deathId,\"/deathInfo'  target='_new'>\",a.deathId,\"</a>\") AS CHAR)deathId,a.name,sex,CONCAT(age_value,' ',age_unit) age,a.surveytype,cooperation,date(a.timelog) `date`,TIMESTAMPDIFF(MINUTE,a.timelog,c.timelog) time_taken_mins,b.username surveyor FROM death a LEFT JOIN user b ON a.surveyor=b.id  LEFT JOIN feedback c ON a.deathId=c.deathId WHERE a.areaId!=999  AND a.surveytype='esl'",
	"52": "SELECT CAST(CONCAT(\"<a href='http://barshi.vm-host.net/esl/#/death/\",a.deathId,\"/va'  target='_new'>\",a.deathId,\"</a>\") AS CHAR)deathId,a.name,sex,CONCAT(age_value,' ',age_unit) age,a.surveytype,cooperation,date(a.timelog) `date`,TIMESTAMPDIFF(MINUTE,a.timelog,c.timelog) time_taken_mins,b.username surveyor FROM death a LEFT JOIN user b ON a.surveyor=b.id LEFT JOIN  feedback c ON a.deathId=c.deathId WHERE a.areaId!=999  AND a.surveytype='va'",
	"53": "SELECT c.username,FLOOR(AVG(LENGTH(summary)))  avg_narrative_chars_length  FROM narrative a LEFT JOIN death b ON a.deathId=b.deathId LEFT JOIN user c ON b.surveyor=c.id GROUP BY b.surveyor",
	"54": "SELECT username,COUNT(*) missing_gps FROM house a LEFT JOIN user b ON a.surveyor=b.id WHERE areaId!=999 AND (gps_latitude IS NULL OR gps_latitude=0)  GROUP BY surveyor ORDER BY COUNT(*) DESC",
	"61": "SELECT tab1.surveyor userid,c.username,tab1.total deaths,tab2.total households,tab1.total*50 `deaths_payment(50 per each)`,tab2.total*5 `households_payment(5 per each)`,(tab1.total*50+tab2.total*5) total FROM \n" +
		"\n" +
		"(SELECT  a.surveyor,COUNT(*)  total   FROM death a LEFT JOIN feedback b ON a.deathId=b.deathId  WHERE a.areaId!=999 GROUP BY a.surveyor) tab1\n" +
		"\n" +
		"LEFT JOIN (SELECT a.surveyor,COUNT(*)  total FROM household a  JOIN deathInf b ON a.householdId=b.householdId WHERE a.areaId!=999 GROUP BY a.surveyor) tab2\n" +
		"\n" +
		"ON tab1.surveyor=tab2.surveyor  LEFT JOIN user c ON tab1.surveyor=c.id "

}



router.get('/area/:areaId/:reportId', (req, res) => {

	let params = req.params
	sqlUtil.writeResponse(context, reports[params.reportId], [params.areaId], res)
})

module.exports = router;