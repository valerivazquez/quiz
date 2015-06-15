var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*):\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user	 = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port	 = (url[5]||null);
var host	 = (url[4]||null);
var storage	 = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequalize = new Sequelize(DB_name, user, pwd,
	{dialect: protocol,
	 protocol: protocol,
	 port:     port,
	 host:     host, 
	 storage:  storage, // solo SQLite (.env)
	 omitNull: null     // solo Postgres
	}
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
						});
			Quiz.create({ pregunta : 'Capital de Portugal',
						  respuesta : 'Lisboa'
						})
			.success(function(){console.log("Base de datos inicializada")});
        };
	});
});

