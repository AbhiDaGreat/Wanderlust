const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const reviews = require("../routes/review.js");


//Reviews
  //POST REVIEW ROUTE
  router.post("/", wrapAsync( async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.Review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
  }));

  //DELETE REVIEW ROUTE
  router.delete("/:reviewId", wrapAsync(
    async(req, res) => {
      let {id, reviewId} = req.params;
      await Listing.findByIdAndUpdate(id, {$pull: { reviews : reviewId } })
      await Review.findByIdAndDelete(reviewId);

      res.redirect(`/listings/${id}`);
    }
  ));

  module.exports = router;