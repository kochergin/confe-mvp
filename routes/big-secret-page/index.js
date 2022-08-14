var template = require('./big-secret-page.marko');

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
	let hrr = '';
	if( req.query.role == 'admin' ) hrr = 'администратор';
	if( req.query.role == 'mod' ) hrr = 'модератор';

	if( req.query.action == 'grant' ) {
		granted_role = req.query.role;
		message = 'Поздравляем! Теперь вы '+hrr+'.';

        database.grantRights( req.fingerprint, req.query.role );

        response(req, res, message, granted_role);
	} else
	if( req.query.action == 'revoke' ) {
		revoked_role = req.query.role;
		message = 'Вы больше не '+hrr+'.';

		database.revokeRights( req.fingerprint, req.query.role );

        response(req, res, message, null, revoked_role);
	} else
	if( req.query.action == 'reinstall' && database.isAdmin(req.fingerprint) ) {
		message = 'Все пользовательские данные удалены.';
        database.reinstall().then(function() {
            response(req, res, message);
        });
	} else
	if( req.query.action == 'reinstate_feedback' && database.isAdmin(req.fingerprint) ) {
		message = 'Вопросы для обратной базы обновлены.';
        database.reinstateFeedback(function() {
            response(req, res, message);
        });
	} else
	if( req.query.action == 'drop_questions' && database.isAdmin(req.fingerprint) ) {
		message = 'Все вопросы были удалены.';
        database.dropCollection('questions').then(function() {
            response(req, res, message);
        });
	} else
	if( req.query.action == 'drop_ratings' && database.isAdmin(req.fingerprint) ) {
		message = 'Все оценки были удалены.';
        database.dropCollection('ratings').then(function() {
            response(req, res, message);
        });
	} else
	if( req.query.action == 'drop_feedback_answers' && database.isAdmin(req.fingerprint) ) {
		message = 'Все отзывы по конференции были удалены.';
        database.dropFeedbackAnswers().then(function() {
            response(req, res, message);
        });
	} else {
        response(req, res);
    }
};

