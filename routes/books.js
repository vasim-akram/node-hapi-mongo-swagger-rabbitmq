'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
// Create connection with AMQP & MQTT
var amqp = require('amqp');
var mqtt = require('mqtt');
var amqpurl  = 'amqp://localhost:5672';
var mqtturl  = 'mqtt://localhost:1883';

var payload = {
  deviceId : '8675309'
};
// Connection with AMQP
var connection = amqp.createConnection({url: amqpurl},  { defaultExchangeName: 'amq.topic' });
connection.on('ready', function () {
});
// Connection with MQTT
var client = mqtt.connect(mqtturl);
client.on('connect', function () {
});

exports.register = function (server, options, next) {

    const db = server.app.db;

    server.route({
        method: 'GET',
        path: '/books',
		config:{
			tags:['api'],
			description: 'Get all books',
			notes: 'Get all books data'
		},
        handler: function (request, reply) {

            db.books.find((err, docs) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }
                connection.publish('amqp', payload);
				client.publish('mqtt', JSON.stringify(payload), { qos: 0 });
                reply(docs);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/books/{id}',
		config:{
			tags:['api'],
			description: 'Get single book',
			notes: 'Get single book data'
		},
        handler: function (request, reply) {

            db.books.findOne({
                _id: request.params.id
            }, (err, doc) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (!doc) {
                    return reply(Boom.notFound());
                }

                reply(doc);
            });

        }
    });

    server.route({
        method: 'POST',
        path: '/books',
        handler: function (request, reply) {

            const book = request.payload;

            //Create an id
            book._id = uuid.v1();

            db.books.save(book, (err, result) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(book);
            });
        },
        config: {
			tags:['api'],
			description: 'Save book',
			notes: 'Save book data',
            validate: {
                payload: {
                    title: Joi.string().min(10).max(50).required(),
                    author: Joi.string().min(10).max(50).required(),
                    isbn: Joi.number()
                }
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/books/{id}',
        handler: function (request, reply) {

            db.books.update({
                _id: request.params.id
            }, {
                $set: request.payload
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        },
        config: {
			tags:['api'],
			description: 'Update book',
			notes: 'Update book data',
            validate: {
                payload: Joi.object({
                    title: Joi.string().min(10).max(50).optional(),
                    author: Joi.string().min(10).max(50).optional(),
                    isbn: Joi.number().optional()
                }).required().min(1)
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/books/{id}',
		config:{
			tags:['api'],
			description: 'Delete book',
			notes: 'Delete book data'
		},
        handler: function (request, reply) {

            db.books.remove({
                _id: request.params.id
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'routes-books'
};
