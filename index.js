const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "db-mysql-ams3-61819-do-user-10314580-0.b.db.ondigitalocean.com",
    port: 25060,
    user: "marco",
    password: "PqcqAsppiApoK0xB",
    database: "air_quality",
    ssl: true,
});

connection.connect();

const insert = (data) => {
    return new Promise((resolve) => {
        connection.query("INSERT INTO air_quality (type, value, source) VALUES ('temperature', " + data.value + ", '" + data.source + "')", function (error, results, fields) {
            if (error) console.log(error);
            resolve();
        });
    })
}

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('COM3', {baudRate: 9600});
const parser = port.pipe(new Readline({delimiter: '\n'}));
// Read the port data
port.on("open", () => {
    console.log('connected to arduino');
});
parser.on('data', data => {
    if (data && typeof data === 'string') {
        const temperature = data.split(' : ')[1];
        console.log('temperature: ' + temperature);
        if (temperature) {
            insert({value: temperature, source: 'arduino_com3'});
        }
    }
});

const express = require('express');
const moment = require('moment');

const app = new express();

app.get('/api/data', (req, res) => {
    connection.query("SELECT * FROM air_quality LIMIT 100", function (error, results, fields) {
        if (error) console.log(error);
        res.status(200).json(results);
    });
});

app.get('/api/hourly', (req, res) => {

    const start = req.query.start;
    const end = req.query.end;
    connection.query("SELECT AVG( value ) as average, type, DATE(timestamp) as order_date, HOUR(timestamp) as order_hour\n" +
        "FROM air_quality.air_quality\n" +
        "WHERE timestamp BETWEEN '"+start+"' AND '"+end+"'\n" +
        "GROUP BY order_date, order_hour, type", function (error, results, fields) {
        if (error) {
            console.log(error);
            return res.status(500).json({
                message: "invalid dates"
            })
        }
        res.status(200).json({
            start,end,data: results.map(e => ({[e.type]: e.average, date: moment(e.order_date).hour(e.order_hour).toISOString()}))
        });
    });
});

app.listen(80, () => {
    console.log('listening on port 80');
});