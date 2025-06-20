const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

// For GET/listings/new
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show", { listing });
};

//   module.exports.createListing= async (req, res,next) => {
//       let url=req.file.path;
//       let filename =req.file.filename;
//     //   console.log(url,"..", filename) ;
//     //   const newListing =  new Listing(req.body.listing );
//     //          newListing.owner =req.user._id;
//     //         await newListing.save() ;
//             req.flash("success", "New Listing Created!") ;
//             res.redirect("/listings") ;
//            };

module.exports.createListing = async (req, res) => {
  if (!req.file) {
    req.flash("error", "Image is required");
    return res.redirect("/listings/new");
  }

  const { path: url, filename } = req.file;

  const newListing = new Listing(req.body.listing);
  newListing.image = { url, filename };
  newListing.owner = req.user._id;

  await newListing.save();

  req.flash("success", "New Listing Created!");
  res.redirect(`/listings/${newListing._id}`);
};

//For GET/listings/:id/edit
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_240");
  res.render("listings/edit", { listing, originalImageUrl });
};

//   module.exports.updateListing  = async(req, res) => {
//         let {id} = req.params ;
//      let listing=   await Listing.findByIdAndUpdate(id, {...req.body.listing });

//         if(typeof req.file!="undefined") {
//           let url=req.file.path;
//       let filename =req.file.filename;
//       listing.image = {url,filename };
//       await listing.save() ;
//         }

//         req.flash("success", "Listing Updated!") ;
//         res.redirect(`/listings/${id}`) ;

//       };
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  // If new image uploaded, replace it
  if (req.file) {
    const { path: url, filename } = req.file;
    listing.image = { url, filename };

    // ✅ Optional: delete old image from Cloudinary here
    // await cloudinary.uploader.destroy(listing.image.filename);
  }

  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${listing._id}`);
};



module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
