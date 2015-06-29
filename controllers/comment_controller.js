var models = require('../models/models.js');

// Autoload :id de comentarios
exports.load = function (req, res, next, commentId) {
 	models.Comment.find({
 		where: { id: Number(commentId) }
 		}).then(function(comment){
	 		if (comment){
	 			req.comment = comment;
	 			next();
	 		} else { 
	 			next (new Error('No existe commentId= ' + commentId));
	 		}
	 	}
	).catch(function(error) {next(error);});
	
};


// GET /quizzes/:quizId/comments/new
exports.new = function (req, res) {
 	res.render('comments/new', {quizid : req.params.quizId, errors : []});
};

// GET /quizzes/create
exports.create = function (req, res) {
 	var comment = models.Comment.build(
 		{ texto: req.body.comment.texto,
 		  QuizId : req.params.quizId
 		});

 	comment
 	.validate()
 	.then(
 		function(err){
 			if (err){
			 	res.render('comments/new',
			 	 {comment : comment, quizId : req.params.quizId, errors : err.errors});
 			} else {	// guarda en DB los campos pregunta y respuesta de quiz
 				comment
 				.save()
 				.then(function(){res.redirect('/quizes/'+req.params.quizId)})
 			}
 		}
 	);
};

// GET /quizes/:quizID/comments/:commentId/publish
exports.publish = function(req, res){
	req.comment.publicado = true;

	req.comment.save( {fields: ["publicado"]})
	.then( function(){ res.redirect('/quizes/'+req.params.quizId);} )
	.catch(function(error){next(error)});
};


