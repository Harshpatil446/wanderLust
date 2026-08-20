const Listing = require("../models/listing");

const placeholderImage =
    "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23f2f2f2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='Arial, sans-serif' font-size='28'%3ENo Image Available%3C/text%3E%3C/svg%3E";

const getListingImageUrl = (listing) => {
    if (!listing || !listing.image) {
        return placeholderImage;
    }

    if (typeof listing.image === "string") {
        return listing.image;
    }

    if (typeof listing.image.url === "string" && listing.image.url.trim()) {
        return listing.image.url;
    }

    return placeholderImage;
};

const toPlainListing = (listing) => {
    const plainListing = listing.toObject ? listing.toObject() : listing;
    return {
        ...plainListing,
        imageUrl: getListingImageUrl(plainListing)
    };
};

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    console.log(allListings);
    res.render("listings/index.ejs", {
        allListings: allListings.map(toPlainListing)
    });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing: toPlainListing(listing) });
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditListingForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing your editing for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing: toPlainListing(listing) });
    console.log(listing);
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    Object.assign(listing, req.body.listing);

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();
    req.flash("success", "listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing Deleted!");
    res.redirect("/listings")
}
