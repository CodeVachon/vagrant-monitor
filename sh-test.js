var express = require('express'),
    app = express(),
    sh = require('exec-sh'),
    port = process.env.PORT || 3030
;


app.set('view engine', 'jade');

app.set("title", "Vagrant Explorer");
app.set("cssFiles", []);
app.set("jsFiles", []);
app.use(express.static(__dirname + '/public'));

/*
sh("vagrant global-status", function(error, content) {
    if (error) {
        console.error(error);
    }
    console.log(content);
});
*/

app.all('/', function(request, response, next) {
    response.render('index');
});


app.listen(port, function() {
    if (!process.env.PORT) {
        console.log("Server Running on Port: " + port);
    }
});
