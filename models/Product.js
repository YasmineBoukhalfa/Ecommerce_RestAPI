const mongoose = require("mongoose");

ProductSchema = mongoose.Schema({

    title: { type: String, required: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    categorie: { type: Array, required: true },
    size: { type: String},
    color: { type: String },
    price: { type: Number, required: true },

}, { timestamps: true }
);


module.exports = mongoose.model("Product", ProductSchema);