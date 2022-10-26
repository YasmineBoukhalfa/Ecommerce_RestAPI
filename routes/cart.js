const { verifyToken, verifyTokenAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const express = require("express");
const Cart = require("../models/Cart");
const router = express.Router();


//CREATE PRODUCT 

router.post("/", verifyToken, async (req, res) => {

    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
    }

})




 //UPDATE
router.put("/:id", verifyTokenAuthorization, async (req, res) => {


    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id,{$set: req.body},{ new: true });
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
})

//DELETE
router.delete("/:id", verifyTokenAuthorization, async (req, res) => {
    try {
        deletedCart = await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart supprimé");
    } catch (error) {
        res.status(500).json(error);
    }
});



//GET USER CART
router.get("/find/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({userId : req.params.userId});
        return res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(error);
    }
});

//get all carts
router.get("/", verifyTokenAndAdmin, async(req,res)=>{

try {
const cart = await Cart.find();
res.status(200).json(cart);
    
} catch (error) {
    res.status(500).json(error);
    
}


});


module.exports = router;