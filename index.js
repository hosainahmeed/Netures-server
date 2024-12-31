require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true
  })
)
app.use(express.json())
app.use(cookieParser())
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qcbcm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function run () {
  try {
    await client.connect()
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
    const blogsCollection = client.db('adventure').collection('blogs')
    const cartsCollection = client.db('adventure').collection('carts')
    const reviewsCollection = client.db('adventure').collection('reviews')
    const userCollection = client.db('adventure').collection('user')
    const bookingsCollection = client.db('adventure').collection('bookings')
    app.get('/', (req, res) => {
      res.send('home')
    })
    app.post('/user', async (req, res) => {
      try {
        const data = req.body
        const result = await userCollection.insertOne(data)
        res.send(result)
      } catch (error) {
        res.status(403).send({ message: error.message })
      }
    })

    app.get('/limit-blogs', async (req, res) => {
      try {
        const result = await blogsCollection.find().limit(2).toArray()
        res.send(result)
      } catch (error) {
        res.status(404).send({ message: error.message })
      }
    })
    app.get('/all-blogs', async (req, res) => {
      try {
        const result = await blogsCollection.find().toArray()
        res.send(result)
      } catch (error) {
        res.status(404).send({ message: error.message })
      }
    })
    app.get('/all-carts-limit', async (req, res) => {
      try {
        const result = await cartsCollection.find().limit(6).toArray()
        res.send(result)
      } catch (error) {
        res.status(404).send({ message: error.message })
      }
    })
    app.get('/all-carts', async (req, res) => {
      try {
        const result = await cartsCollection.find().toArray()
        res.send(result)
      } catch (error) {
        res.status(404).send({ message: error.message })
      }
    })
    app.get('/single-carts/:id', async (req, res) => {
      try {
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        const result = await cartsCollection.findOne(query)
        res.send(result)
      } catch (error) {
        res.status(404).send({ message: error.message })
      }
    })
    app.get('/update-carts/:id', async (req, res) => {
      try {
        const id = req.params.id
        const query = { bookItemId: id }
        const result = await cartsCollection.findOne(query)
        res.send(result)
      } catch (error) {
        res.status(404).send({ message: error.message })
      }
    })
    app.post('/add-carts', async (req, res) => {
      try {
        const data = req.body
        const result = await cartsCollection.insertOne(data)
        res.status(201).send({ success: true, data: result })
      } catch (error) {
        console.error('Error inserting cart:', error.message)
        res.status(500).send({
          success: false,
          message: 'Server Error',
          error: error.message
        })
      }
    })
    app.delete('/delete-carts/:id', async (req, res) => {
      try {
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        const result = await cartsCollection.deleteOne(query)
        res.status(201).send({ success: true, data: result })
      } catch (error) {
        console.error('Error inserting cart:', error.message)
        res.status(500).send({
          success: false,
          message: 'Server Error',
          error: error.message
        })
      }
    })
    app.get('/all-reviews', async (req, res) => {
      try {
        const result = await reviewsCollection.find().toArray()
        res.send(result)
      } catch (error) {
        res.status(404).send({ message: error.message })
      }
    })
    app.post('/booking', async (req, res) => {
      try {
        const data = req.body
        const result = await bookingsCollection.insertOne(data)
        res.send(result)
      } catch (error) {
        res.status(403).send({ message: error.message })
      }
    })
    app.get('/privet-booking/:email', async (req, res) => {
      try {
        const email = req.params.email
        const result = await bookingsCollection.find({ email: email }).toArray()
        res.send(result)
      } catch (error) {
        res.status(403).send({ message: error.message })
      }
    })
    app.delete('/delete-booking/:id', async (req, res) => {
      try {
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        const result = await bookingsCollection.deleteOne(query)
        res.send(result)
      } catch (error) {
        res.status(403).send({ message: error.message })
      }
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir)

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
