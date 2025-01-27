const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.POST || 5000;

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion } = require("mongodb");
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

    app.post("/tails-products", async (req, res) => {
      const newProduct = req.body;

      if (newProduct.size === "8x12") {
        const quantity = newProduct.box * 18 + newProduct.pes;
        const result = await productsCollection.insertOne({
          ...newProduct,
          quantity,
        });
        return res.send(result);
      }
      if (newProduct?.size === "12x20") {
        const quantity = newProduct.box * 10 + newProduct.pes;
        const result = await productsCollection.insertOne({
          ...newProduct,
          quantity,
        });
        return res.send(result);
      }
      if (newProduct?.size === "16x16") {
        const quantity = newProduct.box * 10 + newProduct.pes;
        const result = await productsCollection.insertOne({
          ...newProduct,
          quantity,
        });
        return res.send(result);
      }
      if (newProduct?.size === "24x24") {
        const quantity = newProduct.box * 4 + newProduct.pes;
        const result = await productsCollection.insertOne({
          ...newProduct,
          quantity,
        });
        return res.send(result);
      }
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
