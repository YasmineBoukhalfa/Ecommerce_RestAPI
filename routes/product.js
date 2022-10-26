const { verifyToken, verifyTokenAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const express = require("express");
const Product = require("../models/Product");
const router = express.Router();


//CREATE PRODUCT 

router.post("/", verifyTokenAndAdmin, async (req, res) => {

    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error);
    }

})




//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {


    try {
        const updatedProduct = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },
            { new: true });
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
})

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        deletedProduct = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Produit supprimé");
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        return res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
});


//GET all users
router.get("/", async (req, res) => {

    const qnew = req.query.new;
    const qcategory = req.query.category;

    try {
        let products;
        if (qnew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (qcategory) {
            products = await Product.find({
                categorie: {
                    $in: [qcategory],
                }
            });
        } else {
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error);
    }

});

module.exports = router;