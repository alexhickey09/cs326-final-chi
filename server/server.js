import {createServer} from 'http';
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
    else if (parsed.pathname === '/selectedfood') { //Views the current request being made
        res.end(JSON.stringify(database.selection));
        // res.end(JSON.stringify(database.requests));
    }
    else if (parsed.pathname === '/viewrequests') { //Views the current request being made
        // res.end(JSON.stringify(database.selection));
        res.end(JSON.stringify(database.requests));
    }
    else if (parsed.pathname === '/request') { //POST endpoint to add a new request
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            database.selection.push({
                name: data.name,
                category: data.category,
                amount: data.amount
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
    else if (parsed.pathname === '/select') { //POST endpoint to add a new request
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            const data = JSON.parse(body);
            database.requests.push(data);
            
            writeFile("database.json", JSON.stringify(database), err => {
                if (err) {
                    console.err(err);
                } else {
                    res.end();
                }
            });
        });
    }

    // else if (parsed.pathname === '/update') { //POST endpoint to add a new request
    //     let body = '';
    //     req.on('data', data => body += data);
    //     req.on('end', () => {
    //         const data = JSON.parse(body);
    //         const req = database.requests;
    //         for(let i = 0; i < database.selection.length; i++){
    //             const index = database.selection.indexOf(req[i][2][i]);
    //             if (index > -1) {
    //                 database.selection.splice(index);
    //               }
    //         }
    //         database.selection.push(data);
            
    //         writeFile("database.json", JSON.stringify(database), err => {
    //             if (err) {
    //                 console.err(err);
    //             } else {
    //                 res.end();
    //             }
    //         });
    //     });
    // }

    else if (parsed.pathname === '/fulfillrequest') {
        console.log("Fulfill Request");
    }

    else if (parsed.pathname === '/cancelrequest') {
        console.log("Cancel Request");
    
    }
    
    // Not really needed as of now 
    else if (parsed.pathname === '/removefood') {
        console.log("Remove Food");
        
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
        const filename = parsed.pathname === '/' ? "signin.html" : parsed.pathname.replace('/', '');
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