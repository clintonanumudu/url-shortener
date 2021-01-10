const express = require("express");

const app = express();

const port = process.env.PORT || 3000;

var fs = require("fs");

var bodyParser = require("body-parser");

var validUrl = require("valid-url");

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));

app.use(function (req, res) {
	
	if (req.body.url) {
		
		var urlinput = req.body.url;
		
		var urlid = "";
		
		function generateId() {
			
			for (i = 0; i < 6; i++) {
				
				var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
				
				var random = Math.floor(Math.random() * characters.length);
				
				urlid = urlid + characters.charAt(random);
				
			}
			
			fs.readFile("links.txt", "utf8", (err, links) => {
				
				if (links.indexOf(urlid) == -1) {
					
					fs.appendFile("links.txt", urlid + " | " + urlinput + "\n", function(){});
					
					res.send(req.headers.host + "/" + urlid);
					
				}
				
				else {
					
					generateId();
					
				}
				
			});
			
		}
		
		if (urlinput.indexOf("http://") == -1 && urlinput.indexOf("https://") == -1) {
			
			urlinput = "https://" + urlinput;
			
		}
		
		if (validUrl.isUri(urlinput) && urlinput.indexOf("http://" + req.headers.host) !== 0 && urlinput.indexOf("https://" + req.headers.host) !== 0) {
			
			generateId();
			
		}
		
		else {
			
			res.send("Invalid URL");
			
		}
		
	}
	
	else {
		
		if (req.url !== "/") {
			
			var urlid = req.url.substring(1);
			
			fs.readFile("links.txt", "utf8", (err, links) => {
				
				if (links.indexOf(urlid) !== -1) {
					
					var redirect = links.substring(links.indexOf(urlid) + urlid.length + " | ".length, links.indexOf("\n", links.indexOf(urlid) + urlid.length + " | ".length));
					
					res.send("<script type='text/javascript'> location.href = '" + redirect + "' </script>");
					
				}
				
				else {
					
					res.send("Not Found");
					
				}
				
			});
			
		}
		
		else {
			
			res.sendFile("index.html", {root: __dirname});
			
		}
	
	}
	
});

app.listen(port, () => {
	
	console.log("Server listening on port: " + port);
	
});
