const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1505691938895-1758d7feb511" : v
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"

        }
    ]


});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
