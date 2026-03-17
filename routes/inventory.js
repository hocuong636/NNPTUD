var express = require('express');
var router = express.Router();
let inventoryController = require('../controllers/inventory');

// GET /inventory - Lấy tất cả inventory
router.get('/', async function (req, res, next) {
    try {
        let result = await inventoryController.GetAll();
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET /inventory/:id - Lấy inventory theo ID (populate product)
router.get('/:id', async function (req, res, next) {
    try {
        let result = await inventoryController.GetById(req.params.id);
        if (!result) {
            return res.status(404).send({ message: "Inventory not found" });
        }
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// POST /inventory/add-stock - Tăng stock
router.post('/add-stock', async function (req, res, next) {
    try {
        let { productId, quantity } = req.body;
        let result = await inventoryController.AddStock(productId, quantity);
        res.status(200).send(result);
    } catch (error) {
        let status = error.status || 500;
        res.status(status).send({ message: error.message });
    }
});

// POST /inventory/remove-stock - Giảm stock
router.post('/remove-stock', async function (req, res, next) {
    try {
        let { productId, quantity } = req.body;
        let result = await inventoryController.RemoveStock(productId, quantity);
        res.status(200).send(result);
    } catch (error) {
        let status = error.status || 500;
        res.status(status).send({ message: error.message });
    }
});

// POST /inventory/reservation - Đặt trước (giảm stock, tăng reserved)
router.post('/reservation', async function (req, res, next) {
    try {
        let { productId, quantity } = req.body;
        let result = await inventoryController.Reservation(productId, quantity);
        res.status(200).send(result);
    } catch (error) {
        let status = error.status || 500;
        res.status(status).send({ message: error.message });
    }
});

// POST /inventory/sold - Bán hàng (giảm reserved, tăng soldCount)
router.post('/sold', async function (req, res, next) {
    try {
        let { productId, quantity } = req.body;
        let result = await inventoryController.Sold(productId, quantity);
        res.status(200).send(result);
    } catch (error) {
        let status = error.status || 500;
        res.status(status).send({ message: error.message });
    }
});

module.exports = router;

