const express = require('express')
const router = express.Router()
const Transaction = require('../models/Transaction')

router.get('/', async (req, res) => {
    try{
        const transaction = await Transaction.find()
        res.json(transaction)
    } catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/', async (req, res) => {
    try{
        const newTranscation = new Transaction ({
            description: req.body.description,
            amount: req.body.amount,
            category: req.body.category,
            date: req.body.date
        })
        const savedTransaction = await newTranscation.save()
        res.status(201).json(savedTransaction)
    } catch(error){
        res.status(400).json({message: error.message})
    }
})

router.delete('/:id', async (req, res) => {
    try{
        const deletedTrasaction = await Transaction.findByIdAndDelete(req.params.id)
        if(!deletedTrasaction){
            return res.status(404).json({ message: 'Transaction not found.' })
        }
        res.json({ message: 'transaction deleted succesfully.' })
    } catch(error){
        res.status(500).json({ message: error.message })
    }
})

module.exports = router