var models = require('../models/models.js');


// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function (req, res, next){
	if (req.session.user){
		next();
	} else{
		res.redirect('/login');
	}
};


// GET /login -- formulario de login
exports.new = function (req, res) {
	console.log("/login")
	var errors = req.session.errors || {};
	req.session.errors = {}

 	res.render('sessions/new', {errors : errors});
};

// POST /login -- Crear la sesion
exports.create = function (req, res) {
	console.log("/create")

	var login = req.body.login;
	var password = req.body.password;


	var userController = require('./user_controller.js');

	console.log("login:", login, "Passw", password)

	userController.autentificar(login, password, function(error, user){

		if (error) {
			req.session.errors = [{"message": 'Se ha producido un error: ' + error}];
			res.redirect("/login");
			return;
		}

		// Crear req.session.user y guarda campos id y username
		//  La session se define por la existencia de: req.session.user
		req.session.user = { id:user.id, username: user.username};
		res.redirect(req.session.redir.toString()); // redirección a path anterior al login
	});
};

// GET /logout -- destruir sesion
exports.destroy = function (req, res) {
	delete req.session.user;
//	delete req.session.fecha;
	res.redirect(req.session.redir.toString()); // redirección a path anterior al login
};