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
    const carCollection = db.collection('cardata');
    const bookingCollection = db.collection("bookingData")

    // GET few cars
    app.get('/fewcars', async (req, res) => {
      const result = await carCollection.find().limit(6).toArray();
      res.send(result);
    });

    // GET all cars
    app.get('/allcars', async (req, res) => {
      const result = await carCollection.find().toArray();
      res.send(result);
    });

    // POST a new car
    app.post('/newcar', async (req, res) => {
      const newCar = req.body;
      const result = await carCollection.insertOne(newCar);
      res.send(result);
    });

    // GET my added cars
    app.get("/allcars/:email", async (req, res) => {
      const email = req.params.email;
       const query = {
         userEmail: email,
       };
      const result = await carCollection.find(query).toArray();
      res.send(result);
    })

    // Delete my added car
    app.delete("/allcars/:email/:id", async (req, res) => {
      const email = req.params.email;
      const id = req.params.id;

      const query = {
        userEmail: email,
        _id: new ObjectId(id),
      };

      const result = await carCollection.deleteOne(query);
      res.send(result);
    });

    // Update my added car
    app.patch("/allcars/:email/:id", async (req, res) => {
      const email = req.params.email;
      const id = req.params.id;
      const updatedCar = req.body;

      const query = {
        userEmail: email,
        _id: new ObjectId(id),
      };

      const result = await carCollection.updateOne(query, { $set: updatedCar });
      res.send(result);
    });

    // POST booking data
    app.post('/allbookings', async (req, res) => {
      try {
        const newBooking = req.body;
        // console.log(newBooking);
        const result = await bookingCollection.insertOne(newBooking);
        res.send(result);
      } catch (error) {
        console.log(error);

        res.status(500).send({
          error: error.message,
        });
      }
    });
  
  // GET my bookings
    app.get("/allbookings/:email", async (req, res) => {
      const email = req.params.email;
      const query = {
        userEmail: email,
      };
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });


    {" "}

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
