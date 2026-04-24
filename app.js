const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))


const mongooseUrl = "mongodb://127.0.0.1:27017/wanderlust";
const port = 8080;

async function main() {
    await mongoose.connect(mongooseUrl);
    console.log("connection successful");

    app.listen(port, () => {
        console.log(`Listening on http://localhost:${port}`);
    });
}

app.get("/", (req, res) => {
    res.send("on the root path");
});

// new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

//index route
app.get("/listings", async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});


//show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//create route
app.post("/listings", async (req, res) => {
    let listing = req.body.listing;
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
    console.log(listing);
});

//edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
    console.log(listing);
});

//update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listing/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
})



main().catch((err) => {
    console.error("MongoDB connection failed:", err.message);
});


