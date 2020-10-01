const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const port = 5000;
const MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.json());
app.use(cors());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.fwfle.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productCollection = client.db('emaJohnStore').collection('products');
  const orderCollection = client.db('emaJohnStore').collection('orders');

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productCollection.insertMany(product).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get('/products', (req, res) => {
    productCollection.find({}).toArray((err, docs) => {
      res.send(docs);
    });
  });

  app.get('/product/:key', (req, res) => {
    productCollection.find({
      key: req.params.key
    }).toArray((err, docs) => {
      res.send(docs[0]);
    });
  });

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productCollection
      .find({
        key: {
          $in: productKeys
        }
      })
      .toArray((err, docs) => {
        res.send(docs);
      });
  });

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT || port);