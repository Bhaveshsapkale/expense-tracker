const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const transactionRoutes = require('./routes/transaction')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/transaction', transactionRoutes)

app.get('/', (req, res) => {
    res.send('Expense tracker API is running')
})

mongoose.connect(process.env.MONGODB_URI).then(() => console.log('mongoDB connected successfully.')).catch((err) => console.log('mongoDB connection error', err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {        
    console.log(`server is running on port ${PORT}`)
})