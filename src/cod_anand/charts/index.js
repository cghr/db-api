var express = require('express');
var sqlUtil = require('../../dao/util')
var router = express.Router();


let context = 'cod_anand'
let reports = {
	"0": "SELECT surveytype,COUNT(*) FROM death GROUP BY surveytype",
	"1": "SELECT DATE(timelog) `time`,COUNT(*) FROM death WHERE timelog NOT LIKE '%2013%' GROUP BY DATE(timelog) ",
	"2": "SELECT c.username,COUNT(*) completed_interviews FROM death a JOIN feedback b ON a.deathId=b.deathId  LEFT JOIN user c ON a.surveyor=c.id GROUP BY a.surveyor ORDER BY COUNT(*) ",
	"3": "SELECT c.username,COUNT(*) incomplete_interviews FROM death a LEFT JOIN feedback b ON a.deathId=b.deathId LEFT JOIN user c ON a.surveyor=c.id WHERE b.deathId IS NULL    GROUP BY a.surveyor ORDER BY COUNT(*)  DESC",
	"4": "SELECT * FROM (SELECT c.username,FLOOR(AVG(LENGTH(summary)))  avg_narrative_chars_length  FROM narrative a LEFT JOIN death b ON a.deathId=b.deathId  LEFT JOIN user c ON b.surveyor=c.id GROUP BY b.surveyor) tab1 ORDER BY avg_narrative_chars_length ",
	"5": "SELECT c.username,COUNT(*) zero_positive_symptoms FROM death a JOIN positiveSymptoms b ON a.deathId=b.deathid  LEFT JOIN user c ON a.surveyor=c.id WHERE surveytype='va'  AND summary='[]' GROUP BY surveyor ORDER BY COUNT(*) DESC",
	"6": "SELECT * FROM (SELECT c.username,FLOOR(AVG(TIMESTAMPDIFF(MINUTE,a.timelog,b.timelog))) avg_time_mins FROM  death a JOIN feedback b ON a.deathId=b.deathId LEFT JOIN user c ON a.surveyor=c.id WHERE a.surveytype='va' GROUP BY a.surveyor) tab1 ORDER BY avg_time_mins ",
	"7": "SELECT * FROM (SELECT c.username,FLOOR(AVG(TIMESTAMPDIFF(MINUTE,a.timelog,b.timelog))) avg_time_mins FROM  death a JOIN feedback b ON a.deathId=b.deathId LEFT JOIN user c ON a.surveyor=c.id WHERE a.surveytype='esl'    GROUP BY a.surveyor) tab1  WHERE avg_time_mins<100 ORDER BY avg_time_mins "
}


router.get('/:charId', (req, res) => {

	let params = req.params
	let sql = reports[params.charId]
	sqlUtil.writeResponse(context, sql, [], res)
})

module.exports = router;