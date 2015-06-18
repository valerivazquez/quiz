var models = require('../models/models.js');


// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
 	models.Quiz.find(quizId).then(function(quiz){
 		if (quiz){
 			req.quiz = quiz;
 			next();
 		} else { 
 			next (new Error('No existe quizId= ' + quizId));
 		}
 	}).catch(function(error) {next(error);});
	
};




// GET /quizzes/question
exports.index = function (req, res) {
	console.log("query:", req.query.search);
	if (req.query.search){
		req.query.search = req.query.search.replace(/ /g,"%");
		console.log("query2:", req.query.search);
		models.Quiz.findAll({where: ["pregunta like ?", "%"+req.query.search+"%"]}).then(function(quizes){
 			res.render('quizes/index', {quizes : quizes, errors : []});
 		})
	} else{
 		models.Quiz.findAll().then(function(quizes){
 			res.render('quizes/index', {quizes : quizes, errors : []});
 		})
 	}
	
};

// GET /quizzes/new
exports.new = function (req, res) {
 	var quiz = models.Quiz.build({pregunta: "Pregunta", respuesta: "Respuesta"});

 	res.render('quizes/new', {quiz : quiz, errors : []});
};

// GET /quizzes/create
exports.create = function (req, res) {
 	var quiz = models.Quiz.build(req.body.quiz);

 	quiz
 	.validate()
 	.then(
 		function(err){
 			if (err){
			 	res.render('quizes/new', {quiz : quiz, errors : err.errors});
 			} else {	// guarda en DB los campos pregunta y respuesta de quiz
 				quiz
 				.save({fields: ["pregunta", "respuesta"]})
 				.then(function(){res.redirect('/quizes')})
 			}
 		}
 	);
};

// GET /quizzes/:id/edit
exports.edit = function (req, res) {
 	var quiz = req.quiz; // autoload de instancia de quiz

 	res.render('quizes/edit', {quiz : quiz, errors : []});
};

// PUT /quizzes/:id
exports.update = function (req, res) {
 	req.quiz.pregunta = req.body.quiz.pregunta;
 	req.quiz.respuesta = req.body.quiz.respuesta;

 	req.quiz
 	.validate()
 	.then(
 		function(err){
 			if (err){
			 	res.render('quizes/edit', {quiz : req.quiz, errors : err.errors});
 			} else {	// guarda en DB los campos pregunta y respuesta de quiz
 				req.quiz
 				.save({fields: ["pregunta", "respuesta"]})
 				.then(function(){res.redirect('/quizes');});
 			}
 		}
 	);
};

// DELETE /quizzes/:id
exports.destroy = function (req, res) {
	console.log("id", req.quiz.pregunta, req.quiz.id);
 	req.quiz.destroy().then( function(){
 		res.redirect('/quizes');
 	}).catch(function(error){next(error)});
};





// GET /quizzes/question
exports.show = function (req, res) {
 	res.render('quizes/show', {quiz : req.quiz, errors : []});
};

// GET /quizzes/answer
exports.answer = function (req, res) {
	var resultado = 'Incorrecto';
 	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', { quiz : req.quiz ,respuesta: resultado, errors : []});
};