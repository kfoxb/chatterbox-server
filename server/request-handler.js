/*************************************************************


**************************************************************/
//var fs = require('fs');
var path = require('path');
var url = require('url');

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var results = [];
var counter = 0;

var sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

exports.requestHandler = function(request, response) {
  
  var parsedurl = url.parse(request.url).pathname;
  var method = request.method;

  if (parsedurl !== '/classes/messages') {
    sendResponse(response, ' ', 404);
  } else if (method === 'GET') {
    sendResponse(response, {results: results});  
  } else if (method === 'POST') {
    var body = '';
    request.on('data', function(chunk) {
      body += chunk;
    });


    request.on('end', function() {
      var message = JSON.parse(body);
      message.objectId = ++counter;
      results.push(message);
      if (message.message !== '') {
        sendResponse(response, {objectId: message.objectId}, 201);
      } else {
        sendResponse(response, {objectId: message.objectId}, 204);
      }
    });
  
     

  } else if (method === 'OPTIONS') {
    sendResponse(response, null);
  } 

};
