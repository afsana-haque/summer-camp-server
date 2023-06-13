const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//musicSchoolUser
//4XhqH6W8lrw6blCs



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zaizzat.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();

    const usersCollection = client.db("musicSchhol").collection("users");
    const classesCollection = client.db("musicSchhol").collection("classes");
    const instructorsCollection = client.db("musicSchhol").collection("instructors");
    const cartCollection = client.db("musicSchhol").collection("carts");
  
    //User apis
    app.post('/users', async(req, res) => {
      const user = req.body;
      const query = {email: user.email}
      const existingUser = await usersCollection.findOne(query);
      if(existingUser) {
        return res.send({message: 'User already exists'})
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })

    //Classes data
    app.get('/classes', async(req, res) => {
      const result = await classesCollection.find().sort({students: -1}).toArray();
      res.send(result);
    });

    app.post('/classes', async(req, res) => {
      const newItem = req.body;
      const result = await classesCollection.insertOne(newItem);
      res.send(result);
    })

    //Instructors data
    app.get('/instructors', async(req, res) => {
      const result = await instructorsCollection.find().sort({students: -1}).toArray();
      res.send(result);
    })

    //cart Collection 
    app.get('/carts', async(req, res) => {
      const email = req.query.email;
      if(!email){
        res.send([]);
      }
      const query = {email: email};
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/carts', async (req, res) => {
      const classes = req.body;
      console.log(classes);
      const result = await cartCollection.insertOne(classes);
      res.send(result);
    })

    app.delete('/carts/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Music school is running')
});

app.listen(port, () => {
    console.log(`Music school is running on port ${port}`)
})