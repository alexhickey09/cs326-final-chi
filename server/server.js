const join = require("path").join;
const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require('body-parser');

let secrets, username, password;
if (!process.env.PASSWORD) {
    secrets = require('../secrets.json');
    username = secrets.username;
    password = secrets.password;
} else {
	password = process.env.PASSWORD;
}

const url = `mongodb+srv://${username}:${password}@dishsaver.knahq.mongodb.net/DishSaver?retryWrites=true&w=majority`;
const client = new MongoClient(url, { useUnifiedTopology: true });

const dbName = "DishSaver";

const app = express();
app.use(require("cors")());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());


client.connect((err) => {
    if (err) { 
        throw err;
    }
    const db = client.db(dbName);
    let collection;


    app.post("/addfood", (req, res) => {
        console.log("addfood");
    });

    app.get("/viewfood", (req, res) => {
        console.log("viewfood");
    });

    app.put("/updatecontact", (req, res) => {
        console.log("updatecontact");
    });

    app.get("/viewcontact", (req, res) => {
        console.log("viewcontact");
    });

    app.get("/selectedFood", (req, res) => {
        console.log("selectedFood");
    });

    app.get("/viewrequests", (req, res) => {
        console.log("viewrequests");
    });

    app.post("/makeRequest", (req, res) => {
        console.log("makeRequest");
    });

    app.post("/addToSelection", (req, res) => {
        console.log("addToSelection");
    });

    app.post("/fulfillRequest", (req, res) => {
        console.log("addfood");
    });

    app.post("/register", (req, res) => { //POST endpoint may not be correct
        console.log("register");
    });

    app.post("/login", (req, res) => { //POST endpoint may not be correct
        console.log("login");
    });

    app.get("/", (req, res) => {
        res.sendFile(join(__dirname, "/../client/index.html"));
    });

    app.use('/', express.static(__dirname + '/../client'));
});

app.listen(process.env.PORT || 8080);


//Below is all of our original server code, pre-MongoDB

/*import {createServer} from 'http';
import {parse} from 'url';
import {join} from 'path';
import {writeFile, readFileSync, existsSync} from 'fs';

let database;
if (existsSync("database.json")) {
    database = JSON.parse(readFileSync("database.json"));
}
else {
    database = {
        foodlist: [],
        contact: {},
        requests: [],
        selection: []
    };
}

createServer(async (req, res) => {
    const parsed = parse(req.url, true);

    if (parsed.pathname === '/addfood') { //POST endpoint
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            database.foodlist.push({
                name: data.name,
                category: data.category,
                amount: data.amount,
                nutrition: data.nutrition
            });
            
            writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);
                } else {
                    res.end();
                }
            });
        });
    }
    else if (parsed.pathname === '/viewfood') { //GET endpoint
        res.end(JSON.stringify(database.foodlist));
    }
    else if (parsed.pathname === '/updatecontact') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            database.contact = JSON.parse(body);
            
            writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);
                } else {
                    res.end();
                }
            });
        });
    }
    else if (parsed.pathname === '/viewcontact') {
        res.end(JSON.stringify(database.contact));
    }
    else if (parsed.pathname === '/selectedFood') { //Views the current request being made
        res.end(JSON.stringify(database.selection));
    }
    else if (parsed.pathname === '/viewrequests') { //Views the current requests being made
        res.end(JSON.stringify(database.requests));
    }
    else if (parsed.pathname === '/makeRequest') { //POST endpoint to add a new request
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            database.requests.push(data); //Adding the request to the DB

            //Now, need to delete all the selected food items from the list.
            const foods = data[2];
            for(let selectedFoods = 0; selectedFoods < foods.length; selectedFoods++) {
                for(let allFoods = 0; allFoods < database.foodlist.length; allFoods++) {
                    if(foods[selectedFoods] === database.foodlist[allFoods].name) {
                        //Remove the food of index allFoods from foodlist
                        database.foodlist.splice(allFoods, 1);
                    }
                }
            }

            //Finally, we must clear selection so another person may make a request
            database.selection = [];
            
            writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);
                } else {
                    res.end();
                }
            });
        });
    }
    else if (parsed.pathname === '/addToSelection') { //POST endpoint to add food to current request
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            database.selection.push(data);
            
            writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);
                } else {
                    res.end();
                }
            });
        });
    }
    else if (parsed.pathname === '/fulfillRequest') {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const name = JSON.parse(body);
            for(let i = 0; i < database.requests.length; i++){
                if(database.requests[i][0] === name) {
                    database.requests.splice(i, 1);
                }
            }
            
            writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);
                } else {
                    res.end();
                }
            });
        });
    }
    else if (parsed.pathname === '/register') {
        console.log("Register");

    }
    else if (parsed.pathname === '/login') {
        console.log("Login");

    }
    else {
        // If the client did not request an API endpoint, we assume we need to fetch a file.
        // This is terrible security-wise, since we don't check the file requested is in the same directory.
        // This will do for our purposes.
        const filename = parsed.pathname === '/' ? "index.html" : parsed.pathname.replace('/', '');
        const path = join("client/", filename);
        console.log("trying to serve " + path + "...");
        if (existsSync(path)) {
            if (filename.endsWith("html")) {
                res.writeHead(200, {"Content-Type" : "text/html"});
            } else if (filename.endsWith("css")) {
                res.writeHead(200, {"Content-Type" : "text/css"});
            } else if (filename.endsWith("js")) {
                res.writeHead(200, {"Content-Type" : "text/javascript"});
            } else {
                res.writeHead(200);
            }

            res.write(readFileSync(path));
            res.end();
        } else {
            res.writeHead(404);
            res.end();
        }
    }
}).listen(process.env.PORT || 8080);
*/