var express = require('express');
var dao = require('../../dao')
var router = express.Router();
var _ = require('lodash')
var sqlUtil = require('../../dao/util')
var dateUtil = require('../../dateUtil');


let context = 'isha'
let reports = {
	downloads: 'SELECT  username,COUNT(*)  downloads FROM user  a  JOIN   outbox b ON a.id=b.recipient  WHERE  dwnStatus IS NULL GROUP BY  b.recipient',
	hhq: 'select username name,count(*) households from user a join invitationCard b on a.id=b.surveyor where b.timelog like ' + dateUtil.today() + '%' + ' group by b.surveyor',
	enum: 'select username name,count(*) households from user a join hhContact b on a.id=b.surveyor where b.timelog like ' + dateUtil.today() + '%' + ' group by b.surveyor'
}



router
	.get('/:type', (req, res) => {

		let params = req.params
		sqlUtil.writeResponse(context, reports[params.reportId], [params.areaId], res)
	})

module.exports = router;