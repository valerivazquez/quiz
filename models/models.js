var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequalize = new Sequelize(null, null, null,
						{dialect: "sqlite", storage: "quiz.sqlite"}
					);

// Importar la definición de la tabla quiz en quiz.js
var Quiz = sequalize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; // exportar definición de la tabla Quiz

// sequalize.sync() crea e inicializa tabla de preguntas en DB
sequalize.sync().success(function() {
	// success(--) ejecuta el manejador una vez creada la tabla
	Quiz.count().success(function(count){
		if(count ===0) {  // la tabla se inicializa solo si esta vacia
			Quiz.create({ pregunta : 'Capital de Italia',
						  respuesta : 'Roma'
						})
			.success(function(){console.log("Base de datos inicializada")});
        };
	});
});

