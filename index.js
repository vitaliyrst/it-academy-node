const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const uuid = require('uuid');
const {WebSocketServer} = require('ws');

const FilesService = require('./files-service');
const SocketConnectionsService = require('./socket-connections-service');

const socketConnectionsService = new SocketConnectionsService();
const filesService = new FilesService();

const port = 5000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));

const socketServer = new WebSocketServer({port: 5001});
socketServer.on('connection', connection => {
    const id = uuid.v4();
    connection.send(JSON.stringify({type: 'connection', message: 'connection established', id}));
    socketConnectionsService.addConnection(id, connection);
    console.log('New connection with id: ', id);

    connection.onmessage = (message) => {

    }

    connection.onerror = (error) => {
        console.log('Websocket error: ', error);
    }
});
setInterval(() => {
    socketConnectionsService.checkAliveConnections(10000);
}, 1000);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/');
    },
    filename: (req, file, cb) => {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
        const originalName = file.originalname;
        const ext = path.extname(originalName);
        const filename = path.basename(originalName, ext);
        cb(null, filename + ext);
    },
});
const upload = multer({storage: storage});

const progress = (req, res, next) => {
    const clientId = req.headers['token'];
    const contentLength = req.headers['content-length'];
    let downloaded = 0;

    req.on('data', (chunk) => {
        downloaded += chunk.length;
        const progress = downloaded / contentLength * 100;
        socketConnectionsService.sendMessage(
            clientId,
            JSON.stringify({type: 'progress', progress: progress.toFixed(2) + ' %'})
        );
    });

    next();
}

app.post('/upload-file', progress, upload.single('file'), async (req, res) => {
    try {
        socketConnectionsService.sendMessage(req.headers['token'], JSON.stringify({
            type: 'progress',
            progress: 'Complete'
        }));
        await filesService.writeFileInfo({
            ...req.file,
            comment: req.body.comment
        })
        res.status(200).json({success: true, fileName: req.file.filename});
    } catch (error) {
        res.status(500);
    }
});

app.get('/download', async (req, res) => {
    try {
        const path = await filesService.getFilePath(req.query.name);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(req.query.name)}"`);
        res.status(200).sendFile(path);
    } catch (error) {
        res.status(404).json({message: 'File not found'});
    }
})

app.get('/get-files', async (req, res) => {
    try {
        const filesInfo = await filesService.getFilesInfo();
        res.status(200).json({success: true, filesInfo: filesInfo});
    } catch (e) {
        res.status(500);
    }
});

app.get('/', (req, res) => {
    try {
        res.sendFile('index.html');
    } catch (error) {
        res.status(500);
    }
})

app.listen(port, () => {
    console.log(`Server is running at port="${port}"`);
});
