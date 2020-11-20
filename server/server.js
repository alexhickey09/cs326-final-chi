const express = require("express");
const { MongoClient } = require("mongodb");
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
    url = process.env.DATABASE_URL;
}

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = "DishSaver";

let db, collection;

const app = express();
app.use(express.json());

app.use(express.static("client"));

app.post("/addfood", async (req, res) => {
    collection = db.collection("food");
    const foodItem = {
        name: req.body.name,
        category: req.body.category,
        amount: req.body.amount,
        nutrition: req.body.nutrition,
        dc: req.query.dc
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
    console.log(req.query.dc)
    collection.find({}).toArray((err, docs) => {
        if(err) {
            res.send("Error with viewfood GET request");
        }
        else {
            docs = docs.filter((doc) => {
                return doc.dc === window.localStorage.getItem("dc");
            });
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

app.post("/addToSelection", (req, res) => {
    collection = db.collection("selection");
    const selectedFood = {
        name: req.body.name,
        category: req.body.category,
        amount: req.body.amount
    };

    collection.insertOne(selectedFood, (err) => {
        if(err) {
            res.send("Error with addToSelection POST request");
        }
        else {
            res.send("Information has been passed successfully");
        }
    });
});

app.get("/selectedFood", (req, res) => {
    collection = db.collection("selection");
    collection.find({}).toArray((err, docs) => {
        if(err) {
            res.send("Error with viewfood GET request");
        }
        else {
            res.send(docs);
        }
    });
});

app.post("/makeRequest", (req, res) => {
    collection = db.collection("requests");
    const requestedFood = {
        name: req.body[0],
        time: req.body[1],
        foods: req.body[2]
    };
    collection.insertOne(requestedFood, (err) => { //Adding the current request
        if(err) {
            res.send("Error with makeRequest POST request");
        }
        else {
            res.send("Information has been passed successfully");
        }
    });
    //Now, to remove all the food from the list of available food
    const foods = requestedFood.foods;
    for(let selectedFoods = 0; selectedFoods < foods.length; selectedFoods++) {
        const currFood = foods[selectedFoods];
        db.collection("food").deleteOne({name: currFood});
    }

    //Finally, to clear the selection so another selection may be made
    db.collection("selection").drop();
});

app.get("/viewrequests", (req, res) => {
    collection = db.collection("requests");
    collection.find({}).toArray((err, docs) => {
        if(err) {
            res.send("Error with viewrequests GET request");
        }
        else {
            res.send(docs);
        }
    });
});

app.post("/fulfillRequest", (req) => {
    collection = db.collection("requests");
    collection.deleteOne({name: req.body.name});
});


client.connect(err => {
    if (err) {
        console.error(err);
    } else {
        const port = process.env.PORT || 8080;
        app.listen(port);
        db = client.db(dbName);
    }
});

//Login/signup stuff
const mc = new minicrypt();

const session = {
    secret : process.env.SECRET || 'SECRET',
    resave : false,
    saveUninitialized: false
};

const strategy = new LocalStrategy(
    async (username, password, done) => {
        if (!findUser(username)) {
            return done(null, false, {'message':'Wrong email'});
        }
        if (!validatePassword(username, password)) {
            await new Promise((r) => setTimeout(r, 2000));
            return done(null, false, { 'message' : 'Wrong password' });
        }
        return done(null, username);
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

app.use(express.urlencoded({'extended' : true}));

async function findUser(username) {
    const currUsers = await db.collection('users').find({}).toArray();
    for(let i = 0; i < currUsers.length; i++) {
        if(currUsers[i].username === username) {
            return true;
        }
    }
    return false;
}

async function validatePassword(username, pwd) {
    if (!findUser(username)) {
        return false;
    }

    const currUsers = await db.collection('users').find({}).toArray();
    let users = {};
    for(let i = 0; i < currUsers.length; i++) {
        console.log(currUsers[i]);
        users[currUsers[i].username] = currUsers[i].password;
    }
    console.log(users);
    if (!mc.check(pwd, users[username][0], users[username][1])) {
        return false;
    }
    return true;
}

async function addUser(username, pwd) {
    if (findUser(username)) {
        return false;
    }
    const [salt, hash] = mc.hash(pwd);
    const newuser = {
        username: username,
        password: [salt, hash]
    };
    await db.collection('users').insertOne(newuser);
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
        //'failureRedirect' : '/dc' 
    })
);

app.post('/loginngo',
    passport.authenticate('local' , {   
        'successRedirect' : '/ngo',   
        'failureRedirect' : '/login'      
        //'failureRedirect' : '/ngo' 
    })
);

app.get('/dc',
    checkLoggedIn,
    (req, res) => res.sendFile('/client/dc-home.html',
                { 'root' : process.cwd() }
    )
);

app.get('/ngo',
    checkLoggedIn,
    (req, res) => res.sendFile('client/ngo-choose-dc.html',
            { 'root' : process.cwd() }
    )
);

app.get('/login',
    (req, res) => res.sendFile('client/index.html',
                { 'root' : process.cwd() }
    )
);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

app.post('/register',
    (req, res) => {
        const username = req.body['username'];
        const password = req.body['password'];
        if (addUser(username, password)) {
            res.redirect('/login');
        } else {
            res.redirect('/register');
        }
    });

app.get('/register',
    (req, res) => res.sendFile('client/signup.html',
                { 'root' : process.cwd() }
    )
);


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