const express = require('express');
const bodyParser = require('body-parser');
const DomParser = require('dom-parser');
const cheerio = require('cheerio');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const app = express();
const PORT = (process.env.PORT || 3000);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Content-Length, X-Requested-With");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');

    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

app.use(bodyParser.urlencoded({
    extended: true
}));

const otoslottoszamokUrl = 'https://www.lottoszamok.net/otoslotto/';
const hatoslottoszamokUrl = 'https://www.lottoszamok.net/hatoslotto/';
const skandiUrl = 'https://www.lottoszamok.net/skandinav-lotto/';

app.get('/otoslotto', (req, res) => {
    let lottoNumbersFromPage = [];
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", otoslottoszamokUrl, false);
    xmlhttp.send();
    parser = new DomParser();
    const dom = parser.parseFromString(xmlhttp.responseText, "text/html");
    const $ = cheerio.load(dom.rawHTML);
    const listElements = $('.szamok_nagy ul li span').toArray().map(element => {
        return $(element).text();
    });

    for (value of listElements) {
        lottoNumbersFromPage.push(value);
    }

    if (lottoNumbersFromPage.length == 0) {
        res.status(400);
        res.send('Nem sikerült lekérni az ötöslottószámokat!');
    } else {
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.json({
            'lottoszamok': lottoNumbersFromPage
        });
    }
});

app.get('/hatoslotto', (req, res) => {
    let lottoNumbersFromPage = [];
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", hatoslottoszamokUrl, false);
    xmlhttp.send();
    parser = new DomParser();
    const dom = parser.parseFromString(xmlhttp.responseText, "text/html");
    const $ = cheerio.load(dom.rawHTML);
    const listElements = $('.szamok_nagy ul li span').toArray().map(element => {
        return $(element).text();
    });

    for (value of listElements) {
        lottoNumbersFromPage.push(value);
    }

    if (lottoNumbersFromPage.length == 0) {
        res.status(400);
        res.send('Nem sikerült lekérni a hatoslottószámokat!');
    } else {
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.json({
            'lottoszamok': lottoNumbersFromPage
        });
    }
});

app.get('/skandinavlotto', (req, res) => {
    let machineArray = [];
    let handArray = [];
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", skandiUrl, false);
    xmlhttp.send();
    parser = new DomParser();
    const dom = parser.parseFromString(xmlhttp.responseText, "text/html");
    const $ = cheerio.load(dom.rawHTML);
    const listElements = $('.szamok_nagy ul li span').toArray().map(element => {
        return $(element).text();
    });

    machineArray = listElements.slice(0, 7);
    handArray = listElements.slice(7, listElements[listElements.length - 1]);

    if (machineArray.length == 0) {
        res.status(400);
        res.send('Nem sikerült lekérni a hatoslottószámokat!');
    } else {
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.json({
            'gepi sorsolas': machineArray,
            'kezi sorsolas': handArray
        });
    }
});

app.listen(PORT, () => {
    console.log(`App is listening on PORT ${PORT}`);
});