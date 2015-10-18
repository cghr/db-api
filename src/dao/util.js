let dao = require('./index')

class Util {

	tables(context) {

		return dao.rows('SELECT table_name FROM information_schema.tables WHERE table_schema=?', [context])
			.then(function(rows) {
				return rows.map(row => row.table_name)
			})

	}
	sqlByContext(sql, context) {
		return this.tables(context)
			.reduce(function(acc, table) {
				return acc.replace(` ${table} `, ' ' + context + '.' + table + ' ')
			}, sql)
	}

	writeResponse(context, sql, params, response) {

		this.sqlByContext(sql, context)
			.then(function(sql) {
				dao.rows(sql, params)
					.then(data => response.send(data))
			})

	}



}

module.exports = new Util()