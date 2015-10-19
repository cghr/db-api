let dao = require('./index')
let dbCache = require('./dbCache')

class Util {

	sqlByContext(sql, context) {
		return dbCache
			.tablesFor(context)
			.reduce(function(acc, table) {
				return acc.replace(` ${table} `, ` ${context}.${table} `)
			}, sql)
	}

	writeResponse(context, sql, params, response) {

		let contextSql = this.sqlByContext(sql, context)
		return dao.rows(contextSql, params)
			.then(data => response.send(data))

	}
}

module.exports = new Util()