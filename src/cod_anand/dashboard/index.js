var express = require('express');
var router = express.Router();
var sqlUtil = require('../../dao/util')
var dateUtil = require('../../dateUtil');



let context = 'cod_anand'
let reports = {
	downloads: "SELECT  username,COUNT(*)  downloads FROM user  a  JOIN   outbox b ON a.id=b.recipient  WHERE role!='user'  AND dwnStatus IS NULL GROUP BY  b.recipient",
	va: "select username name,count(*) surveys from user a join feedback b on a.id=b.surveyor where b.timelog like " + dateUtil.today() + "%" + " and surveytype='va' group by b.surveyor",
	esl: "select username name,count(*) surveys from user a join feedback b on a.id=b.surveyor where b.timelog like " + dateUtil.today() + "%" + " and surveytype is null group by b.surveyor"
}

router.get('/:type', (req, res) => {

	let params = req.params
	sqlUtil.writeResponse(context, reports[params.reportId], [params.areaId], res)
})

module.exports = router;