const express = require('express');
const cors = require('cors');
const votesController = require('./votes-controller');
const VotesController = new votesController();

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/variants', VotesController.variants);
app.post('/stats', VotesController.stats);
app.post('/vote', VotesController.vote);
app.get('/reports', VotesController.reports);

app.listen(port, () => {
    console.log(`Server is running at port="${port}"`);
});
