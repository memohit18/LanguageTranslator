const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware to parse JSON bodies
app.use(bodyParser.json());

const port = 3000;


const TranslateEngToFrench = require("./Controllers/TranslateEngToFrench")
const MinimumCostController = require("./Controllers/MinimumCostController")

app.get('/', function (req,res) {
    res.send({"Info": "This is Home Page"})
})

//Post API for translation 
app.post('/translate', function (req, res) {
    return TranslateEngToFrench.getTranslation(req,res)
})

//Post API to get the minimum Cost to deliver 
app.post('/getcost',function (req,res) {
    return MinimumCostController.getMinimumCost(req,res)
})

app.listen(port)

