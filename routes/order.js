const { verifyToken, verifyTokenAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const express = require("express");
const Order = require("../models/Order");

const router = express.Router();


//CREATE PRODUCT 

router.post("/", verifyToken, async (req, res) => {

    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});


//UPDATE order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {


    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});


//DELETE ORDER
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        deletedOrder = await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order supprimé");
    } catch (error) {
        res.status(500).json(error);
    }
});



//GET USER ORDERS
router.get("/find/:userId", verifyTokenAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        return res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});


//GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {

    try {
        const orders = await Order.find();
        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json(error);

    }
});


//GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    //septembre
    const date = new Date();
    //aout 
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    //juillet
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {

        const income = await Order.aggregate([
            //last 2 month ,, gte >
            { $match: { createdAt: { $gte: previousMonth } } },
            { $project: { month: { $month: "$createdAt" }, sales: "$amount", }, },
            
            { $group: { _id: "$month", total: { $sum: "$sales" }, }, }

        ]);

        res.status(200).json(income);
    } catch (error) {
        res.status(500).json(error);
    }
})



module.exports = router;