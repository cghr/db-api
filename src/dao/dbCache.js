var mysql = require('promise-mysql');
var cache = require('memory-cache')
var dbConfig = require('./config')
var connection;

mysql.createConnection(dbConfig)
	.then(function(conn) {
		connection = conn;
		new DbCache().loadPrimaryKeys(['isha', 'cod_anand'])
	});

class DbCache {

	loadPrimaryKeys(contexts) {
		let self = this

		contexts.forEach(context => {
			self._tables(context)
				.then(tables => {
					tables.forEach(table => {

						self._loadIdFor(context, table)
							.then(id => cache.put('ids/' + context + '/' + table, id))

					})

				})

		})
	}

	idFor(context, table) {
		return cache.get('ids/' + context + '/' + table)
	}

	_tables(context) {

		return connection.query('SELECT table_name FROM information_schema.tables WHERE table_schema=?', [context])
			.then(function(rows) {
				return rows.map(row => row.table_name)
			})

	}

	_loadIdFor(context, table) {
		return connection.query(`desc ${context}.${table}`)
			.then(rows => {
				return rows[0].Field;
			})
			.catch(e => console.log(e))
	}
}

module.exports = new DbCache()