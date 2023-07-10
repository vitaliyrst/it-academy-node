const express = require('express');
const cors = require('cors');
const PostmanController = require('./controllers/postman-controller');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get('/rest/requests', PostmanController.requests);
app.post('/rest/addRequest');
app.post('/rest/makeRequest');

app.listen(port, () => {
    console.log(`Server is running at port="${port}"`);
});
