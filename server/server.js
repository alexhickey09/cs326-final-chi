const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const minicrypt = require('./miniCrypt');

let secrets, username, password, url;
if (!process.env.PASSWORD) {
    secrets = require('../secrets.json');
    username = secrets.username;
    password = secrets.password;
    url = `mongodb+srv://${username}:${password}@dishsaver.knahq.mongodb.net/DishSaver?retryWrites=true&w=majority`;
} else {
    username = process.env.USERNAME;
    password = process.env.PASSWORD;
    url = process.env.DATABASE_URL
}

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = "DishSaver";

let db, collection;

const app = express();

app.use(express.static("client"));

app.post("/addfood", (req, res) => {
    collection = db.collection("food");
    const foodItem = {
        name: req.body.name,
        category: req.body.category,
        amount: req.body.amount,
        nutrition: req.body.nutrition
    };
    collection.insertOne(foodItem, (err) => {
        if(err) {
            res.send("Error with addfood POST request");
        }
        else {
            res.send("Information has been passed successfully");
        }
    });
});

app.get("/viewfood", (req, res) => { //Note: first parameter has to be req even though it isn't used
    collection = db.collection("food");
    collection.find({}).toArray((err, docs) => {
        if(err) {
            res.send("Error with viewfood GET request");
        }
        else {
            res.send(docs);
        }
    });
});

app.put("/updatecontact", (req, res) => { //May need to be app.put
    collection = db.collection("contact");
    collection.findOneAndUpdate(
        {}, //Query field. Should eventually be the name of the DC we want to update
        {
            $set: {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone
            }
        },
        {
            upsert: true //This means insert a document if none fitting the query exist
        }
    );
    res.send("Contact successfully updated"); //Not sure if this is necessary or is sending the right info
});

app.get("/viewcontact", async (req, res) => {
    collection = db.collection("contact");
    const contact = await collection.findOne();
    res.send(contact);
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

/*app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "/../client/index.html"));
});

app.use('/', express.static(__dirname + '/../client'));*/

client.connect(err => {
    if (err) {
        console.error(err);
    } else {
        const port = process.env.PORT || 8080;
        app.listen(port);
        db = client.db(dbName);
    }
})

//Login/signup stuff
const users = {};
const mc = new minicrypt();

const session = {
    secret : process.env.SECRET || 'SECRET',
    resave : false,
    saveUninitialized: false
};

const strategy = new LocalStrategy(
    async (email, password, done) => {
	if (!findUser(email)) {
	    return done(null, false, { 'message' : 'Wrong email' });
	}
	if (!validatePassword(email, password)) {
	    await new Promise((r) => setTimeout(r, 2000));
	    return done(null, false, { 'message' : 'Wrong password' });
	}
	return done(null, email);
    });

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((uid, done) => {
    done(null, uid);
});

app.use(express.json());
app.use(express.urlencoded({'extended' : true}));

function findUser(email) {
    if (!users[email]) {
	return false;
    } else {
	return true;
    }
}

function validatePassword(email, pwd) {
    if (!findUser(email)) {
	return false;
    }
    if (!mc.check(pwd, users[email][0], users[email][1])) {
	return false;
    }
    return true;
}

function addUser(email, pwd) {
    if (findUser(email)) {
	return false;
    }
    const [salt, hash] = mc.hash(pwd);
    users[email] = [salt, hash];
    return true;
}

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
	next();
    } else {
	res.redirect('/login');
    }
}

app.post('/logindc',
    passport.authenticate('local' , {   
        'successRedirect' : '/dc',   
        'failureRedirect' : '/login'      
    }));

app.post('/loginngo',
    passport.authenticate('local' , {   
        'successRedirect' : '/ngo',   
        'failureRedirect' : '/login'      
    }));

app.get('/dc',
    (req, res) => res.sendFile('client/dc-home.html',
                { 'root' : process.cwd() }));

app.get('/ngo',
    (req, res) => res.sendFile('client/ngo-choosedc.js',
            { 'root' : process.cwd() }));

app.get('/login',
    (req, res) => res.sendFile('client/index.html',
                { 'root' : process.cwd() }));

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

app.post('/register',
    (req, res) => {
        const email = req.body['email'];
        const password = req.body['password'];
        if (addUser(email, password)) {
        res.redirect('/login');
        } else {
        res.redirect('/register');
        }
    });

app.get('/register',
    (req, res) => res.sendFile('client/signup.html',
                { 'root' : process.cwd() }));


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