const express = require("express");
const cors = require("cors");

const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Art & craft running!");
 
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gze7wpc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    const artsCraftsCollection = client.db("craftsDB").collection("crafts");

    app.get("/crafts", async (req, res) => {
      const cursor = artsCraftsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/crafts", async (req, res) => {
      const newItem = req.body;
    // console.log(newItem);
      const result = await artsCraftsCollection.insertOne(newItem);
       res.send(result)
      // console.log(result);
    });
    app.get("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const quarry = { _id: new ObjectId(id) };
      const result = await artsCraftsCollection.findOne(quarry);
      res.send(result);
    })
    //  get all data
    app.get("/allItem", async (req, res) => {
      const cursor = artsCraftsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
   

    //  get user email
    app.get("/myList-from-email/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const quarry = { email: email };
      const result = await artsCraftsCollection.find(quarry).toArray();
      // console.log(result);
      res.send(result);
    });
   
    //   get update Data
    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const quarry = { _id: new ObjectId(id) };
      const result = await artsCraftsCollection.findOne(quarry);
      res.send(result);
    });
    // update data
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateItem = req.body;
      // console.log(updateItem);
      const item = {
        $set: {
          img: updateItem.img,
          ratting: updateItem.ratting,
          custom: updateItem.custom,
          status: updateItem.status,
          time: updateItem.time,
          price: updateItem.price,
          desc: updateItem.desc,
          item_name: updateItem.item_name,
          sub_name: updateItem.sub_name,
        },
      };
      // console.log(item);
      const result = await artsCraftsCollection.updateOne(
        filter,
        item,
        options
      );
      // console.log(result);
      res.send(result);
    });
    //  get myList id
    app.get("/myList/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const quarry = { _id: new ObjectId(id) };
      const result = await artsCraftsCollection.find(quarry).toArray();
      // console.log(result);
      res.send(result);
    });
    //  delete data
    app.delete("/myList/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const quarry = { _id: new ObjectId(id) };
      const result = await artsCraftsCollection.deleteOne(quarry);
      res.send(result);
      // console.log(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
