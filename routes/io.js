var socketio = require('socket.io');

let people = [];

function io(server) {
    var io = socketio.listen(server);

    io.on('connection', socket => {
      socket.on('chat message', msg => {
        io.emit('chat message', msg);
      });
      socket.on('username', username => {
        people[socket.id] = username;
        let userlist = [];
        for(key in people){
          userlist.push(people[key]);
          console.log(userlist);
        }
        io.emit('username', username);
        io.emit('userlist', userlist);//empty考える
      });
      socket.on('disconnect', function(){
        console.log(people[socket.id] + 'さんが退出しました');
        delete people[socket.id];
      });
    });
}

module.exports = io;
