var mysql = require('promise-mysql');
var cache = require('memory-cache')
var dbConfig = require('./config')
var connection;

mysql.createConnection(dbConfig)
	.then(function(conn) {
		connection = conn;
		new DbCache().cacheMetadata(['isha', 'cod_anand'])
	});

class DbCache {

	cacheMetadata(contexts) {

		let cachePrimaryKey = function(context, table) {
			_loadIdFor(context, table)
				.then(id => cache.put(`ids/${context}/${table}`, id))

		};
		let cacheTables = function(context) {
			_tables(context)
				.then(tables => {
					cache.put('tables/' + context, tables)
					tables.forEach((table) => cachePrimaryKey(context, table))

				})

		};
		let _tables = function(context) {

			return connection.query('SELECT table_name FROM information_schema.tables WHERE table_schema=?', [context])
				.then(function(rows) {
					return rows.map(row => row.table_name)
				})

		};

		let _loadIdFor = function(context, table) {
			return connection.query(`desc ${context}.${table}`)
				.then(rows => {
					return rows[0].Field;
				})
				.catch(e => console.log(e))
		};

		contexts.forEach(cacheTables)
	}

	idFor(context, table) {
		return cache.get('ids/' + context + '/' + table)
	}
	tablesFor(context) {
		return cache.get('tables/' + context)
	}


}

module.exports = new DbCache()