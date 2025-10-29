const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

// Index Route (Show all listings)
router.get("/", async (req, res) => {
  try {
    const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
  } catch (error) {
    const allListings = await Listing.find({});
    console.error("Error fetching listings:", error);
    console.log({ allListings});
  }
  
});

// New Route (Form)
router.get("/new", isLoggedIn , (req, res) => {
  res.render("listings/new.ejs");
});


// Create Route (Add listing to DB)
router.post("/", isLoggedIn, wrapAsync(async (req, res, next) => {
  const listingData = await req.body.listing;
  console.log(listingData);

  // Set default image if none provided
  // if (!listingData.image || !listingData.image.url) {
  //     listingData.image = {
  //         filename: "default",
  //         url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
  //     };
  // }

  const newListing = new Listing(listingData);
  
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
}));

// Show Route (Details page)
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
  if(!listing){
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
});

// Edit Route (Form to edit)
router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
});

// Update Route (PUT)
router.put("/:id", isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
});

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  });

  module.exports = router;