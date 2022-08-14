var template = require('./iwanna.marko');

var database = require('../../mongodb-database-v2.js');

var response = function(req, res, message, granted_role, revoked_role) {
	res.marko( template, {
		fingerprint: req.fingerprint,
		msg: message,
		granted_role: granted_role,
		revoked_role: revoked_role,
		is_admin: database.isAdmin(req.fingerprint),
		is_mod: database.isMod(req.fingerprint),
	});
}

module.exports = function(req, res) {
	let granted_role = null;
	let revoked_role = null;
	let message = null;

	if( req.query.action == 'grant' && req.query.role == 'mod' ) {
		granted_role = req.query.role;
		message = 'Поздравляем! Теперь вы модератор.';

        database.grantRights( req.fingerprint, req.query.role );

        response(req, res, message, granted_role);
	} else
	if( req.query.action == 'revoke' && req.query.role == 'mod' ) {
		revoked_role = req.query.role;
		message = 'Вы больше не модератор.';

		database.revokeRights( req.fingerprint, req.query.role );

        response(req, res, message, null, revoked_role);
	} else {
        response(req, res);
    }
};

