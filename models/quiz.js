// Definición del modelo Quiz
module.exports = function (sequelize, dataTypes){

 	return sequelize.define('Quiz',
 		{ pregunta : dataTypes.STRING,
 		  respuesta: dataTypes.STRING,
 		});

}