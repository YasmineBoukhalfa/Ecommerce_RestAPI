const { verifyToken, verifyTokenAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const express = require("express");
const User = require("../models/User");
const router = express.Router();

/* router.get("/usertest",(req,res)=>{
    res.send("user test successfull");
})

router.post("/userposttest", (req,res)=>{
const username = req.body.username;
//console.log(username);
res.send("votre nom est  " +username);
}) */

//UPDATE
router.put("/:id", verifyTokenAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = ryptoJs.AES.encrypt
            (req.body.password,
                process.env.PASSWORD_SEC
            ).toString()
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },
            { new: true });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
})

//DELETE
router.delete("/:id", verifyTokenAuthorization, async (req, res) => {
    try {
        deletedUser = await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Utilisateur supprimé");
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        const { password, ...others } = user._doc;

        //if everything is OK then return user
        return res.status(200).json(others);



    } catch (error) {
        res.status(500).json(error);
    }
});


//GET all users
router.get("/find", verifyTokenAndAdmin, async (req, res) => {

    const query = req.query.new;
    try {
        // if there is a query is gonna return 5 users else is gonna return all users
        const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();


        res.status(200).json(users);



    } catch (error) {
        res.status(500).json(error);
    }
});


//Get USER STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    //create new current date
    const date = new Date();

    const lastyear = new Date(date.setFullYear(date.getFullYear() - 1));
    //user statistics per month , so i should groupe my items ==> pour cela on utilise les agrégat 
    try {

        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastyear } } },
            {
                $project: {
                    //month variable = take the month number inside my createdAt date
                    month: { $month: "$createdAt" },
                },
            },
            {
                //group my items
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                }
            }
        ]);

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json(error);
    }




});




module.exports = router;