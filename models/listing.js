const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    review : [{
      type : Schema.Types.ObjectId,
      ref : "Review"
    }]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;