const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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

  app.use("/listings", listings);
  app.use("/listings/:id/reviews", reviews);
  
  
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