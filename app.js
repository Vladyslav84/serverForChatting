const app =  require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

app.use('*', (req, res) => {
    res.send('WS server')
});

let users = {};

io.on('connection', (client) => {
    users[client.id] = 'Anonymous'
    broadcast('users', users);

    client.on('change:name', (name) => {
        users[client.id] = name;
        broadcast('users', users);
    });

    client.on('message', (message) => {
        broadcast('message', message);
    });

    client.on('disconnect', (message) => {
        delete users[client.id];
        broadcast('users', users);
    });

    function broadcast(event, data) {
        client.emit(event, data);
        client.broadcast.emit(event, data);
    };
    
});

http.listen(5000, () => {
    console.log('port 5000 started');
});


