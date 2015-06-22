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
sequalize.sync().then(function() {
	// success(--) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if(count ===0) {  // la tabla se inicializa solo si esta vacia
			Quiz.create({ pregunta : 'Capital de Italia',
						  respuesta : 'Roma',
						  tema : 'Ocio'
						});
			Quiz.create({ pregunta : 'Capital de Francia',
						  respuesta : 'Paris',
						  tema : 'Ciencia'
						});
			Quiz.create({ pregunta : 'Presidente actual de Francia',
						  respuesta : 'Hollande',
						  tema : 'Ocio'
						});
			Quiz.create({ pregunta : 'Capital de Portugal',
						  respuesta : 'Lisboa',
						  tema : 'Tecnología'
						});
			Quiz.create({ pregunta : 'Presidente actual de Portugal',
						  respuesta : 'Cavaco',
						  tema : 'Ciencia'
						})
			.then(function(){console.log("Base de datos inicializada")});
        };
	});
});


// Importar la definición de la tabla Comment en comment.js
var Comment = sequalize.import(path.join(__dirname,'comment'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);
exports.Comment = Comment; // exportar definición de la tabla Comment





