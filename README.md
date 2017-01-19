#RESTful API using hapi.js and MongoDB

This is the code for this blog-post: [Build a RESTful API using hapi.js and MongoDB](http://mph-web.de/build-a-restful-api-using-hapi-js-and-mongodb/)

##How to setup?

You should have a current version of node installed and a local MongoDB server running. Now just clone the repository and execute these two commands:

```
npm install
node start
```

# RabbitMQ Commands(For Windows) -
    
	== >To stop/status rabbitmq server
        rabbitmqctl stop/ status
    == >To start rabbitmq server
        rabbitmq-server -detached
    == >To enable plugins in rabbitmq
        rabbitmq-plugins enable rabbitmq_management // for rabbitmq management console
        rabbitmq-plugins enable rabbitmq_mqtt // for mqtt
	rabbitmq-plugins enable rabbitmq_web_stomp // for web_stomp
	
Note - [https://github.com/beevelop/ng-stomp] , [https://github.com/JSteunou/webstomp-client] 	
		
# RabbitMQ Console -
      
    == >URL - http://localhost:15672/	  
       username- guest
	   password- guest 
	== > Url & Port -
       AMQP - amqp://localhost:5672
       MQTT - mqtt://localhost:1883
# Swagger API -

    == > URL - http://localhost:3000/documentation

# Test with mocha & chai

    run -
	```
	npm test
	```
