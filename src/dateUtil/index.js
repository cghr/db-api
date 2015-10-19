var dateFormat = require('dateformat');

module.exports = {
	today: function() {
		return dateFormat(new Date(), "yyyy-MM-dd");
	}
}