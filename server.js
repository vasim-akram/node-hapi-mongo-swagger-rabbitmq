'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');
const Inert = require('inert');
const Vision = require('vision'); 
const hapiSwagger = require('hapi-swagger');
const Pack = require('./package');
var Good = require('good');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    port: 8080,
    routes: { cors: true } 
});
const io = require('socket.io')(server.listener);
const handler = function (request, reply) {

    reply.view('index', {
        title: 'Hapi ' + request.server.version,
        message: 'Welcome to hapi!'
    });
};/*
server.on('response', function (request) {
    console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.path + ' --> ' + request.response.statusCode);
});*/
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

const logoptions = {
    ops: {
        interval: 1000
    },
    reporters: {
        myConsoleReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*' }]
        }, {
            module: 'good-console'
        }, 'stdout'],
        myFileReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ ops: '*' }]
        }, {
            module: 'good-squeeze',
            name: 'SafeJson'
        }, {
            module: 'good-file',
            args: ['./test/fixtures/awesome_log']
        }],
        myHTTPReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ error: '*' }]
        }, {
            module: 'good-http',
            args: ['http://prod.logs:3000', {
                wreck: {
                    headers: { 'x-api-key': 12345 }
                }
            }]
        }]
    }
};

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
	host: 'localhost:8080',
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
{
    register: require('good'),
    logoptions    
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
module.exports = server
