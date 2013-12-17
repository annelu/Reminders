var url = require('url');
var fs = require('fs');
var Sequelize = require('sequelize')
var sequelize = new Sequelize('reminders', 'root', 'd07T6j9D');
var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10
};
var path = require('path');
var mime = {
  ".js" : 'application/javascript',
  ".css" : 'text/css',
  ".html": 'text/html'
};
headers['Content-Type'] = "text/plain";

var Reminder = sequelize.define('Reminder', {
  task: Sequelize.STRING,
  interval: Sequelize.INTEGER,
  duedate: Sequelize.STRING
})

Reminder.sync();

var sendResponse = function(sendMe, request,response,status, contentType) {
  status = status || 200;
  response.writeHeader(status, headers);
  response.write(sendMe);
  response.end();
};

var sendData = function(request, response, statuscode){
  var reminderData = [];
  Reminder.findAll().success(function(results){
    for (var i = 0; i < results.length; i++) {
      reminderData.push(results[i].dataValues);
    }
    reminderData = JSON.stringify(reminderData);
    sendResponse(reminderData, request, response, statuscode);
  });
}

exports.handleRequest = function(request, response){
  var urlParse = url.parse(request.url);
  if (request.method === 'GET'){
    //Handles GETs
    if (urlParse.pathname === '/') {
      headers['Content-Type'] = mime['.html'];
      fs.readFile('../Client/index.html', function(err, html) {
        if (err) {throw err;}
        sendResponse(html, request,response);
      });
    } else if (urlParse.pathname === '/reminders') {
      // var reminderData = [];
      // Reminder.findAll().success(function(results){
      //   for (var i = 0; i < results.length; i++) {
      //     reminderData.push(results[i].dataValues);
      //   }
      //   reminderData = JSON.stringify(reminderData);
      //   sendResponse(reminderData, request, response);
      // });
      sendData(request, response);
    } else {
      fs.readFile('../Client' + urlParse.pathname, function(err, data) {
        if (err) {throw err;}
        var contentType = mime[path.extname(urlParse.pathname)];
        headers['Content-Type'] = contentType;
        sendResponse(data, request,response);
      });
    }
  } else {
    //Handles POSTs for /reminders
    if (urlParse.pathname === '/reminders'){  
      var body = '';
      //create and save new reminder
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var reminderData = JSON.parse(body);
        var newReminder = Reminder.build(reminderData);
        newReminder.save();
      });
      //send back data to update
      sendData(request, response, 201);
    } 
    else if (urlParse.pathname === '/done') {
      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        body = JSON.parse(body);
        Reminder.find({where: {id: body.id}}).on('success', function(reminder){
          if (reminder) {
            reminder.updateAttributes({duedate: body.duedate});
          }
        })
      sendData(request, response, 201);
      });
    } else if (urlParse.pathname === '/cancel') {
      var body = '';
      request.on('data', function(data){
        body += data;
      });

      request.on('end', function(){
        body = JSON.parse(body);
        Reminder.find({where: {id: body}}).on('success', function(reminder){
          if (reminder) {
            reminder.destroy();
          }
        })
        sendData(request, response, 201);
      });

    }
  }
};