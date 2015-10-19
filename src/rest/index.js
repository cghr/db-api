var express = require('express');
var dao = require('../dao')
var router = express.Router();
var _ = require('lodash')

router
	.get('/:context/rest/:entity', (req, res) => {

		let [params, queryParams] = [req.params, req.query]
		let [context, entity] = [params.context, params.entity]

		let resolveResponse = function(queryParams) {
			if (_.isEmpty(queryParams))
				return dao.all(context, entity)
			else
				return dao.findByCriteria(context, entity, queryParams)
		}
		let sendReponse = (data) => res.send(data)

		resolveResponse(queryParams)
			.then(sendReponse)

	})
	.get('/:context/rest/:entity/:id', (req, res) => {

		let params = req.params
		dao.findById(params.context, params.entity, params.id)
			.then(user => res.send(user[0] || {}))
	})
	.post('/:context/rest/:entity', (req, res) => {
		let params = req.params
		let entityData = req.body
		dao.saveOrUpdate(params.context, params.entity, entityData)
			.then(() => res.send({
				status: 'success'
			}))

	})
	.post('/:context/rest', (req, res) => {
		let params = req.params
		let context = params.context
		let datalogs = req.body
		datalogs.forEach(log => {
			let entity = log.datastore
			let entityData = log.data
			dao.saveOrUpdate(context, entity, entityData)
		})
		res.send({
			status: 'success'
		})

	})

module.exports = router;