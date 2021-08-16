const express = require("express");
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); 

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
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
    
    const url = "https://us5.api.mailchimp.com/3.0/lists/3dffd5aff4";

    const options = {
      method: "POST",                                                         
      auth: "arpit1:YOUR_API_KEY"
    };

    const request = https.request(url, options, function (response) {
       
        if (response.statusCode === 200)
        {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server has been set to port 3000");
});

