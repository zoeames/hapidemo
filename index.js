var port = process.env.PORT;
var Hapi = require('hapi');
var Joi = require('joi');
var server = new Hapi.Server(port);

server.route({
    config: {
        description: 'this is the home page route',
        notes: 'this is a note',
        tags: ['home', 'a', 'b', 'c']
    },
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + request.params.name + '!'+ request.query.limit);
    },
    config: {
        validate: {
            params: {
                name: Joi.string().min(3).max(10)
            },
            query: {
                limit: Joi.number().required().min(9)
            }
        }
    }
});

server.route({
    method: 'GET',
    path: '/static/{param*}',
    handler: {
        directory: {
            path: 'static'
        }
    }
});

server.pack.register(
   [
        {
        plugin: require('good'),
        options: {
            reporters: [{
                reporter: require('good-console'),
                args: [{log: '*', request: '*'}]
            }]
            }
        },
        {plugin: require('lout')}
   ], function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});

