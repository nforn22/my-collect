const express = require('express');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

const router = express.Router();

// retrieve all items of the logged-in user
router.get("/", auth, async (req, res) => {
    try {
        const items = await Item.find({ owner: req.userId}).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// create item 
router.post("/", auth, async (req, res) => {
    try {
        const { title, description, category, imageUrl, purchaseDate, value, tags } = req.body;

        const item = new Item ({
            title,
            description,
            category,
            imageUrl,
            purchaseDate,
            value,
            tags,
            owner: req.userId
        });

        await item.save();
        res.status(201).json(item)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// retrieve specific item
router.get("/:id", auth, async (req, res) => {
    try {
        const item = await Item.findOne({ _id: req.params.id, owner: req.userId });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        };
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// update item
router.put("/:id", auth, async (req, res) => {
    try {
        const item = await Item.findOneAndUpdate(
            { _id: req.params.id, owner: req.userId },
            req.body,
            { new: true }
        );

        if (!item) {
            return res.status(404).json({ message: 'Item not found'})
        }
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// delete item
router.delete("/:id", auth, async (req,res) => {
    try {
        const item = await Item.findOneAndDelete({ _id: req.params.id, owner: req.userId });

        if (!item) {
            return res.status(404).json({ message: 'Item not found'})
        }
        res.json({ message: 'Item successfully deleted'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;