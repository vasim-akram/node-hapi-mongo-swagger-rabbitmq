'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');
const Inert = require('inert');
const Vision = require('vision'); 
const hapiSwagger = require('hapi-swagger');
const Pack = require('./package');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    port: 3000
});
const io = require('socket.io')(server.listener);
const handler = function (request, reply) {

    reply.view('index', {
        title: 'Hapi ' + request.server.version,
        message: 'Welcome to hapi!'
    });
};

server.register(require('vision'), (err) => {

    if (err) {
        throw err;
    }

    server.views({
        engines: { html: require('handlebars') },
        path: __dirname + '/routes'
    });

    server.route({ method: 'GET', path: '/', handler: handler });
});
  
 io.on('connection', function(socket) {
                 console.log('new connection');

                socket.on('add-message', function(obj) {
                      console.log('client data ===>',obj);
                      io.emit('notification', {
                               title: obj.title
                      });
                 });
             });

//Connect to db
server.app.db = mongojs('127.0.0.1:27017/nodeapp', ['books','users']);

const options={
	//basePath: '/api',
	info:{
		'title':'API Documentation',
		'description': "This is test api documentation v0.0.1.You can find more about Swagger \n at <a href=\"http://www.swagger.io\"> #swagger",
		'version': Pack.version,
		'termsOfService': 'http://www.inventum.net',
		contact:{
			'name': 'Vasim Akram',
			'url': 'http://www.inventum.net',
			'email': 'vasim.akram@inventum.net'
		},
		license:{
			'name': 'Inventum Technologies',
			'url': 'http://www.inventum.net'
		}
	},
	host: 'localhost:3000',
	schemes:[
		'http'
	]
}

//Load plugins and start server
server.register([
{
   register: require('./routes/books')
},
{
   register: require('./routes/users')
},
Inert,
Vision,
{
	'register': hapiSwagger,
	'options':  options
}
], (err) => {
    server.start((err) =>{
		if(err){
			console.log(err);
		}else{
			console.log('Server runnig at : '+server.info.uri);
		}
	});

});

