var mysql = require('promise-mysql');
var _ = require('lodash')
var connection;
var dbConfig = require('./config')
var dbCache = require('./dbCache')

mysql.createConnection(dbConfig)
	.then(function(conn) {
		connection = conn;
	});

class Dao {

	rows(sql, params) {
		return connection.query(sql, params)
	}

	all(context, entity) {
		let sql = `select * from ${context}.${entity} limit 500`
		return this.rows(sql, [])
	}

	findByCriteria(context, entity, queryParams) {
		let condition = _.keys(queryParams).map(param => `${param}=?`).join(' AND ')
		let sql = `select * from ${context}.${entity} where ${condition}`
		return this.rows(sql, _.values(queryParams))
	}

	findById(context, entity, id) {
		let entityId = this.idFor(context, entity)
		let criteria = {}
		criteria[entityId] = id
		return this.findByCriteria(context, entity, criteria)

	}

	idFor(context, entity) {
		return dbCache.idFor(context, entity)

	}
	saveOrUpdate(context, entity, entityData) {
		return this.isNewData(context, entity, entityData)
			.then(isNew => {
				if (isNew)
					return this.saveNew(context, entity, entityData)
				else
					return this.update(context, entity, entityData)
			})

	}
	saveNew(context, entity, entityData) {
		let columns = _.keys(entityData)
		let placeHolders = columns.map(col => '?').join(',')
		let params = _.values(entityData)
		let sql = `insert into ${context}.${entity}(${columns}) values(${placeHolders})`
		return connection.query(sql, params)

	}
	update(context, entity, entityData) {
		let columns = _.keys(entityData)
		let placeHolders = columns.map(col => '?').join(',')
		let params = _.values(entityData)
		let id = this.idFor(context, entity)
		let idValue = entityData[id]
		let sql = `update ${context}.${entity} set ${this.keysWithPlaceHolders(entityData)}  where ${id}=${idValue}`
		return connection.query(sql, params)
	}

	keysWithPlaceHolders(entityData) {
		return _.keys(entityData).map(key => `${key}=?`)
	}
	isNewData(context, entity, entityData) {
		let id = this.idFor(context, entity)
		let idValue = entityData[id]
		let criteria = {}
		criteria[id] = idValue
		return this.findByCriteria(context, entity, criteria)
			.then(rows => rows.length == 0)

	}

}

module.exports = new Dao()