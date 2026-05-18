const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();

const uri = process.env.MDB_URI;
const app = express();
const port = process.env.PORT || 7000;
app.use(cors());
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
    // it must be commented while deploy
    await client.connect();

    const db = client.db('drivespeak');
    const dataCollection = db.collection('data');
    

   

    // it must be commented while deploy
    await client.db('admin').command({ ping: 1 });

    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!',
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('This is home page of client server.');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
