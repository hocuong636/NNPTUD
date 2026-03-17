let inventoryModel = require('../schemas/inventory');

module.exports = {
    GetAll: async function () {
        return await inventoryModel.find();
    },

    GetById: async function (id) {
        return await inventoryModel.findById(id).populate('product');
    },

    CreateInventory: async function (productId) {
        let newInventory = new inventoryModel({
            product: productId,
            stock: 0,
            reserved: 0,
            soldCount: 0
        });
        await newInventory.save();
        return newInventory;
    },

    AddStock: async function (productId, quantity) {
        if (!quantity || quantity <= 0) {
            throw { status: 400, message: "quantity phai lon hon 0" };
        }
        let inventory = await inventoryModel.findOneAndUpdate(
            { product: productId },
            { $inc: { stock: quantity } },
            { new: true }
        );
        if (!inventory) {
            throw { status: 404, message: "Inventory not found for this product" };
        }
        return inventory;
    },

    RemoveStock: async function (productId, quantity) {
        if (!quantity || quantity <= 0) {
            throw { status: 400, message: "quantity phai lon hon 0" };
        }
        // Atomic: chỉ update nếu stock >= quantity
        let inventory = await inventoryModel.findOneAndUpdate(
            { product: productId, stock: { $gte: quantity } },
            { $inc: { stock: -quantity } },
            { new: true }
        );
        if (!inventory) {
            // Phân biệt: không tìm thấy hay không đủ stock
            let existing = await inventoryModel.findOne({ product: productId });
            if (!existing) {
                throw { status: 404, message: "Inventory not found for this product" };
            }
            throw { status: 400, message: `Khong du stock. Hien tai: ${existing.stock}, yeu cau: ${quantity}` };
        }
        return inventory;
    },

    Reservation: async function (productId, quantity) {
        if (!quantity || quantity <= 0) {
            throw { status: 400, message: "quantity phai lon hon 0" };
        }
        // Atomic: chỉ update nếu stock >= quantity
        let inventory = await inventoryModel.findOneAndUpdate(
            { product: productId, stock: { $gte: quantity } },
            { $inc: { stock: -quantity, reserved: quantity } },
            { new: true }
        );
        if (!inventory) {
            let existing = await inventoryModel.findOne({ product: productId });
            if (!existing) {
                throw { status: 404, message: "Inventory not found for this product" };
            }
            throw { status: 400, message: `Khong du stock de reservation. Hien tai: ${existing.stock}, yeu cau: ${quantity}` };
        }
        return inventory;
    },

    Sold: async function (productId, quantity) {
        if (!quantity || quantity <= 0) {
            throw { status: 400, message: "quantity phai lon hon 0" };
        }
        // Atomic: chỉ update nếu reserved >= quantity
        let inventory = await inventoryModel.findOneAndUpdate(
            { product: productId, reserved: { $gte: quantity } },
            { $inc: { reserved: -quantity, soldCount: quantity } },
            { new: true }
        );
        if (!inventory) {
            let existing = await inventoryModel.findOne({ product: productId });
            if (!existing) {
                throw { status: 404, message: "Inventory not found for this product" };
            }
            throw { status: 400, message: `Khong du reserved de sold. Hien tai: ${existing.reserved}, yeu cau: ${quantity}` };
        }
        return inventory;
    }
};
