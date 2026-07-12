import express from "express";
import { createServer } from "node:http";
import { connectToSocket } from "./controllers/socketmanager.js";

const app = express();
const server = createServer(app);

app.set("port", process.env.PORT || 8000);

connectToSocket(server);

// handle server errors (e.g. port already in use)
server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${app.get('port')} is already in use`);
        process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
});

server.listen(app.get("port"), () => {
    console.log(`Chat server listening on port ${app.get("port")}`);
});

// graceful shutdown to ensure port is freed on restarts
function gracefulShutdown(signal) {
    console.log(`Received ${signal}. Closing server...`);
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
    // force exit if close doesn't complete in time
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully exiting');
        process.exit(1);
    }, 5000);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));

