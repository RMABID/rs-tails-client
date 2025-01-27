const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.POST || 5000;

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASS}@cluster0.ygtr7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const productsCollection = client.db("RS-Tails").collection("product");

    app.get("/all-products", async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    app.post("/tails-products", async (req, res) => {
      const newProduct = req.body;

      if (newProduct.size === "8x12") {
        const totalPes = newProduct.box * 18 + newProduct.pes;
        const total_box = totalPes / 18;
        const quantity = total_box * 12;
        const result = await productsCollection.insertOne({
          ...newProduct,
          total_box,
          quantity,
        });
        return res.send(result);
      }
      if (newProduct?.size === "12x20") {
        const totalPes = newProduct.box * 10 + newProduct.pes;
        const total_box = totalPes / 10;
        const quantity = total_box * 16.6666;

        const result = await productsCollection.insertOne({
          ...newProduct,
          quantity,
          total_box,
        });
        return res.send(result);
      }
      if (newProduct?.size === "16x16") {
        const totalPes = newProduct.box * 10 + newProduct.pes;
        const total_box = totalPes / 10;
        const quantity = total_box * 17.7777;
        const result = await productsCollection.insertOne({
          ...newProduct,
          quantity,
          total_box,
        });
        return res.send(result);
      }
      if (newProduct?.size === "24x24") {
        const totalPes = newProduct.box * 4 + newProduct.pes;
        const total_box = totalPes / 4;
        const quantity = total_box * 16;
        const result = await productsCollection.insertOne({
          ...newProduct,
          quantity,
          total_box,
        });
        return res.send(result);
      }
      if (newProduct?.size === "12x24") {
        const totalPes = newProduct.box * 8 + newProduct.pes;
        const total_box = totalPes / 8;
        const quantity = total_box * 16;

        const result = await productsCollection.insertOne({
          ...newProduct,
          quantity,
          total_box,
        });
        return res.send(result);
      }
    });

    // quantity updated only
    app.patch("/product/:id", async (req, res) => {
      const id = req.params.id;
      const newQuantity = req.body;
      const filter = { _id: new ObjectId(id) };
      const query = await productsCollection.findOne(filter);

      // return console.log(query?.box + newQuantity?.box);

      if (query?.size === "24x24") {
        const totalPes =
          query?.box * 4 + newQuantity?.box * 4 + query?.pes + newQuantity?.pes;
        const total_box = totalPes / 4;
        const quantity = totalPes * 4;

        let updatedQuantity = {
          $set: {
            box: query?.box + newQuantity?.box,
            pes: query?.pes + newQuantity?.pes,
            total_box: total_box,
            quantity: quantity,
          },
        };
        // return console.log(updatedQuantity);
        const result = await productsCollection.updateOne(
          filter,
          updatedQuantity
        );
        res.send(result);
      }
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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
