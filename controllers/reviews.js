const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).send("Listing not found");
  }
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  let listing = await Listing.findById(id);
  let review = await Review.findById(reviewId);

  // Handle case where listing or review is not found
  if (!listing || !review) {
    return res.status(404).send("Listing or Review not found");
  }
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", " Review Deleted!");
  res.redirect(`/listings/${id}`);
};
