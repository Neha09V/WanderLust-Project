const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;
const Review = require("./review");

 const listingSchema = new mongoose.Schema ({
    title:  {
        type:String,
        required:true,
        validate: {
          validator: function (v) {
            return typeof v === 'string' && isNaN(Number(v));
          },
          message: "Title must be a non-numeric string."
        }
    },


    description: String,

  
  image: {
  //   url: {
  //     type: String,
  //     required: true,
  //     default: "https://unsplash.com/photos/a-mountain-range-covered-in-snow-and-clouds-O67hc8Ws_xo",
  //     set: (v) =>
  //       v === "" ? "https://unsplash.com/photos/a-mountain-range-covered-in-snow-and-clouds-O67hc8Ws_xo" : v
  //   }
  // },
        url:String,
        filename:String
        },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    location: String,
    country:String,
     category: {
    type: String,
    enum: [
      "Trending",
      "Rooms",
      "Mountains Retreats",
      "Farms",
      "Camping",
      "Amazing Pools",
      "Desert",
      "Lake",
      "Arctic",
      "Iconic cities",
      "boat",
      "Beach",
      "Castles",
      "Arctic",
      "Top of the world",
      "Countryside",

    ],

  },

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref:"Review",
      },
    ],
    owner : {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
 }) ;
  //  geometry : {
  //   type : {
  //     type : String , 
  //     enum : ["Point"],
  //     required : true
  //     },
  //     coordinates : {
  //       type : [Number],
  //       required : true
  //       },
  //       },

  // category : {
  //   type: String,
  //   enum:
    
  // }


   

 listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await Review.deleteMany({_id: {$in: listing.reviews}}) ;
  }
 });


 const Listing= mongoose.model("Listing",listingSchema) ;
 module.exports = Listing;
 

