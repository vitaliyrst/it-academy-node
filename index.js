const express = require('express');
const cors = require('cors');
const {engine} = require('express-handlebars');
const path = require('path');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', engine({defaultLayout: ''}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './views'));

app.get('/', (req, res) => {
    const formData = {
        name: req.query.name || '',
        email: req.query.email || '',
        errorName: req.query.errorName || '',
        errorEmail: req.query.errorEmail || ''
    }

    res.render('form', formData);
});

app.get('/success', (req, res) => {
    const data = {
        name: req.query.name,
        email: req.query.email
    }

    res.render('success', data);
});

app.post('/submit', (req, res) => {
    const formData = {
        name: req.body.name,
        email: req.body.email,
        errorName: '',
        errorEmail: ''
    }

    if (!formData.name) {
        formData.errorName = 'Name cannot be empty';
    }

    if (!formData.email) {
        formData.errorEmail = 'Email cannot be empty';
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
        formData.errorEmail = 'Wrong email';
    }

    if (formData.errorName || formData.errorEmail) {
        res.render('form', formData);
    } else {
        res.status(301).redirect(`/success?name=${formData.name}&email=${formData.email}`);
    }
});

app.listen(port, () => {
    console.log(`Server is running at port="${port}"`);
});
