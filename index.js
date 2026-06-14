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
    const bookingCollection = db.collection('bookingData');

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
    app.get('/allcars/:email', async (req, res) => {
      const email = req.params.email;
      const query = {
        userEmail: email,
      };
      const result = await carCollection.find(query).toArray();
      res.send(result);
    });

    // Delete my added car
    app.delete('/allcars/:email/:id', async (req, res) => {
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
    app.patch('/allcars/:email/:id', async (req, res) => {
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
    app.get('/allbookings/:email', async (req, res) => {
      const email = req.params.email;
      const query = {
        userEmail: email,
      };
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    // Delete my booking car
    app.delete('/allbookings/:email/:id', async (req, res) => {
      const email = req.params.email;
      const id = req.params.id;

      const query = {
        userEmail: email,
        _id: new ObjectId(id),
      };

      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    // GET Search and filter cars
    app.get('/api/cars', async (req, res) => {
      try {
        // 1. Extract query params sent from the client-side
        const { search, type, seats } = req.query;

        // 2. Build a dynamic query object
        let query = {};

        // Case-insensitive regex search for the car name
        if (search && search.trim() !== '') {
          query.name = { $regex: search, $options: 'i' };
        }

        // Filter by car type (ignore if 'All')
        if (type && type !== 'All') {
          query.type = type;
        }

        // Filter by seat capacity (ignore if 'All'). Ensure it's parsed to a Number!
        if (seats && seats !== 'All') {
          query.seats = Number(seats);
        }

        // 3. Fetch filtered records from your MongoDB collection
        const result = await carCollection.find(query).toArray();

        // 4. Send response matching your frontend expectation (json.success & json.data)
        res.send({
          success: true,
          data: result,
        });
      } catch (error) {
        console.error('Filtering error:', error);
        res.status(500).send({
          success: false,
          error: 'Failed to retrieve filtered cars',
        });
      }
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
