const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Routes

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// Index Route (Show all listings)
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// New Route (Form)
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Create Route (Add listing to DB)
app.post("/listings", wrapAsync (async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// Show Route (Details page)
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// Edit Route (Form to edit)
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// Update Route (PUT)
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

// Delete Route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  });

  //Reviews
  //POST ROUTE
  app.post("/listings/:id/reviews", async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    console.log(newReview);
    // await newReview.save();
    // await listing.save();
    res.send("new review saved");
  })
  
  // Test Route (Optional)
  /*
  app.get("/testlisting", async (req, res) => {
    let sampleListing = new Listing({
      title: "My New Villa",
      description: "By the Beach",
      price: 1200,
      location: "Calangute, Goa",
      country: "India",
    });
  
    await sampleListing.save();
    console.log("Sample was saved");
    res.send("Successful Testing");
  });
  */

  app.all("*", (req, res, next) => {
    next(new ExpressError(404, 'Page not found!'));
  })

  //CUSTOM ERROR HANDLER MIDDLEWARE
  app.use((err,req,res,next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message})
  })
  
  app.listen(8080, () => {
    console.log("Server is listening on port 8080");
  });