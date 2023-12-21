const { log } = require('console');
const express = require('express');
const http = require('http');
const fs = require('fs')
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const webpush = require('web-push');
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));


const vapidKeys = {
    "subject": "mailto:uriel@bhbsdventures.com",
    "publicKey": "BI8ijHXa_hTVo2q8fT3S05Y2DWfTT-qUQcdEYf2KNvf_Ti_ZzSXo24yYnEwcXl-TVNVkJtWI6XJZXu0Ca1mh7kE",
    "privateKey": "ITtU8u0e5PYjVNuzEwDotxCgyfKo5NHVYn3O6UNriok"
};

webpush.setVapidDetails(
    vapidKeys.subject,
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html'); // Replace with the path to your HTML file
// });

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.post('/send', (req, res) => {
 
    res.status(200).json({});
    let subscription = ''
    const payload = JSON.stringify(req.body)
    fs.readFile('tp.txt', (err, inputD) => {
        if (err) throw err
        console.log(JSON.parse(inputD.toString()))
        subscription = JSON.parse(inputD.toString())
        webpush.sendNotification(subscription, payload)
            .catch(err => console.log('Push Notification Error' + err))
    })
});

app.post('/send-user-info', (req, res) => {
    let fInput = JSON.stringify(req.body)
    fs.writeFile('tp.txt', fInput, (err) => {
        if (err) throw err
        else {
            console.log("The file is updated with the given data")
        }
    })
    const subscription = req.body;
    console.log(subscription)
    res.status(200).json({});

    const payload = JSON.stringify({
        title: 'Push Notification',
        body: 'Initial Push Notification',
    })

    webpush.sendNotification(subscription, payload)
        .catch(err => console.log('Push Notification Error' + err));
});
