const express = require('express'),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    path = require('path'),
    app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.static("public"));
app.use(bodyParser.json());

app.use(function(request, response, next) {
    next();
});

app.get('/', (request, response) => {
    response.sendFile(__dirname + "/public/index.html");
});


app.listen(3000, () => {
    console.log("\nStarting development server at http://127.0.0.1:3000/");
    console.log("Quit the server with CONTROL-C.\n");
});