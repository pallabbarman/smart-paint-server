const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tp4g7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
    res.send('Hello, Smart Paint server side is working!');
});

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(() => {
    const serviceCollection = client.db('smart-paint').collection('services');
    const ordersCollection = client.db('smart-paint').collection('service-orders');
    const adminCollection = client.db('smart-paint').collection('admin');

    app.get('/services', (req, res) => {
        serviceCollection.find().toArray((err, items) => {
            res.send(items);
        });
    });

    app.post('/addService', (req, res) => {
        const newProduct = req.body;
        serviceCollection.insertOne(newProduct).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    app.get('/service/:_id', (req, res) => {
        serviceCollection.find({ _id: ObjectId(req.params._id) }).toArray((err, documents) => {
            res.send(documents);
        });
    });

    app.post('/addServicesOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    app.post('/addAAdmin', (req, res) => {
        const admin = req.body;
        adminCollection.insertOne(admin).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });
});

app.listen(process.env.PORT || port);
