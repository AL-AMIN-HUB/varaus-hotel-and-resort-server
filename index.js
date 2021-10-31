const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
//
const app = express();
const port = process.env.PORT || 5000;

//middleware use
app.use(cors());
app.use(express.json());

// connect mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o4xkh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();

    const database = client.db("hotelResort");
    const servicesCollection = database.collection("services");
    const ordersCollection = database.collection("orders");

    // GET service from database
    app.get("/services", async (req, res) => {
      const result = await servicesCollection.find({}).toArray();
      res.send(result);
    });

    // GET order from database
    app.get("/reviewOrder", async (req, res) => {
      const result = await ordersCollection.find({}).toArray();
      res.send(result);
    });

    // Order Place
    app.get("/orderPlace/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      console.log("load user with id", id);
      res.send(service);
    });

    // order POST request
    app.post("/reviewOrder", async (req, res) => {
      const orders = req.body;
      console.log("hitting post api", orders);

      const result = await ordersCollection.insertOne(orders);
      console.log(result);
      res.json(result);
    });

    // POST new services
    app.post("/services", async (req, res) => {
      const newService = req.body;
      const result = await servicesCollection.insertOne(newService);
      res.json(result);
    });

    // DELETE order
    app.delete("/reviewOrder/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const deleteOrder = await ordersCollection.deleteOne(query);
      res.send(deleteOrder);
    });

    // my order GET api
    app.get("/myOrder/:email", async (req, res) => {
      const result = await ordersCollection.find({ email: req.params.email }).toArray();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
//
app.get("/", (req, res) => {
  res.send("Happy Assignment Hotel and Resort");
});
app.listen(port, () => {
  console.log("listening on port", port);
});
