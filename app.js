const express = require("express");
const https = require("https"); // Already installed with nodeJS
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public")); // allows you to link css, js and any other files inside the folder enclosed by the quotes

app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res) {
	res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req, res) {
	const firstName = req.body.first_name;
	const lastName = req.body.last_name;
	const email = req.body.email;

	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName
				}
			}
		]
	};

	const jsonData = JSON.stringify(data);

	const url = "https://server.api.mailchimp.com/3.0/lists/{list-id}";

	const options = {
		method:"POST",
		auth: "anystring:your-api-key"
	};

	const request = https.request(url, options, function(response) {
		const statusCode = response.statusCode;

		if (statusCode === 200) { // status code 200 means everything went fine
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}

		response.on("data", function(data) {
			console.log(JSON.parse(data));
		});
	});

	request.write(jsonData);
	request.end();
});


app.post("/failure", function(req, res) {
	res.redirect("/");
});


app.listen(3000);