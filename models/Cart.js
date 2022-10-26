const mongoose = require("mongoose");

CartSchema = mongoose.Schema({

    userId: { type: String, required: true },
    products: [
        { 
            productId: { type: String } 
        },

        {
            quantity: {
                Type: Number,
                default: 1
            }
        }
     ]


}, { timestamps: true }
);


module.exports = mongoose.model("Cart", CartSchema);