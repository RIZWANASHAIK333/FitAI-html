const express = require('express');
const app = express();
const port = 3000;
const request = require('request');
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./key.json");

initializeApp({
    credential: cert(serviceAccount),
}); 

const db = getFirestore();

app.use(express.static('public'));
app.use('/css',express.static(__dirname+'public/css'))
app.use('/img',express.static(__dirname+'public/img'))
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("login")
 });

app.get('/signup', (req, res) => {
    
    const full_name = req.query.name;
    const email = req.query.mail;
    const password = req.query.password;
    //Adding data to the collection
    // sample comment
    db.collection('users')
    .add({
        name: full_name,
        email: email,
        password: password,
    })
    .then(() => {
        res.render("index");
    });
});



 app.get('/sign-in', (req, res) => {
    const email = req.query.mail;
    const password = req.query.password;
    db.collection("users")
        .where("email", "==", email)
        .where("password", "==", password)
        .get()
        .then((docs) => {
            if(docs.size>0){
                res.render("index");
            }
        });
 });


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    
 });


 


