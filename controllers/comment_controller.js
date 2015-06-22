var models = require('../models/models.js');


// GET /quizzes/:quizId/comments/new
exports.new = function (req, res) {
	console.log("new", req.params.quizId )
 	res.render('comments/new', {quizid : req.params.quizId, errors : []});
};

// GET /quizzes/create
exports.create = function (req, res) {
	console.log("crete", req.params.quizId )

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

