var mysql = require('promise-mysql');
var _ = require('lodash')
var connection;
var dbConfig = require('./config')

mysql.createConnection(dbConfig)
	.then(function(conn) {
		connection = conn;
	});

class Dao {

	rows(sql, params) {
		return this.query(sql, params)
	}

	all(context, entity) {
		let sql = `select * from ${context}.${entity} limit 500`
		return this.query(sql, [])
	}

	findByCriteria(context, entity, queryParams) {
		let condition = _.keys(queryParams).map(param => `${param}=?`).join(' AND ')
		let sql = `select * from ${context}.${entity} where ${condition}`
		return this.query(sql, _.values(queryParams))
	}

	findById(context, entity, id) {
		return this.idFor(context, entity)
			.then(entityId => {
				let criteria = {}
				criteria[entityId] = id
				return this.findByCriteria(context, entity, criteria)

			})
	}

	idFor(context, entity) {
		return this.query(`desc ${context}.${entity}`)
			.then(rows => rows[0].Field)

	}
	query(sql, params) {
		return connection.query(sql, params)
	}
}

module.exports = new Dao()