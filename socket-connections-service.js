module.exports = class SocketConnectionService {
    connections = {};

    addConnection(id, connection) {
        this.connections[id] = {
            lastActivity: Date.now(),
            connection
        };
    }

    sendMessage(id, message) {
        if (this.connections[id]) {
            this.connections[id].connection.send(message);
            this.changeConnectionTime(id);
        }
    }

    changeConnectionTime(id) {
        if (this.connections[id]) {
            this.connections[id].lastActivity = Date.now();
        }
    }

    checkAliveConnections(time) {
        Object.keys(this.connections).forEach(key => {
            const person = this.connections[key];
            const currentDate = Date.now();
            const lastActivity = person.lastActivity;

            if (currentDate - lastActivity > time) {
                person.connection.terminate();
                delete this.connections[key];
                console.log('Connection was closed, id: ', key)
            }
        });
    }
}
