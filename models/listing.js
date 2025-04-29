const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
        filename: {
            type: String,
          },
          url: {
            type: String,
            default : "Photo by Curtis Adams from Pexels: https://www.pexels.com/photo/white-and-brown-wooden-house-near-bare-trees-under-white-sky-3935333/",
            set : (v) => v==="" ? "Photo by Curtis Adams from Pexels: https://www.pexels.com/photo/white-and-brown-wooden-house-near-bare-trees-under-white-sky-3935333/" : v,
          },
    },
    price : Number,
    location : String,
    country : String,
    reviews : [{
      type : Schema.Types.ObjectId,
      ref : "Review"
    }]
});

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}})
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;