const express = require('express');
const app = express();
const port = 3000;


const TranslateEngToFrench = require("./Controllers/TranslateEngToFrench")

app.get('/', function (req,res) {
    res.send({"Info": "This is Home Page"})
})

app.post('/translate', function (req, res) {
    return TranslateEngToFrench.getTranslation(req,res)
})

app.listen(port)

