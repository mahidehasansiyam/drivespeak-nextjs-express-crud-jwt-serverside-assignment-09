const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

dotenv.config();

const uri = process.env.MONGODB_URI;
const app = express();
const port = process.env.PORT || 7000;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db('drivespeak');
    const dataCollection = db.collection('cardata');

    // GET few cardata
    app.get('/fewdata', async (req, res) => {
      const result = await dataCollection.find().limit(6).toArray();
      res.send(result);
    });

    // GET all cardata
    app.get('/alldata', async (req, res) => {
      const result = await dataCollection.find().toArray();
      res.send(result);
    });

    console.log('Successfully connected to MongoDB!');
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('This is home page of client server.');
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
