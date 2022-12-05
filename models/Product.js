const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide product name'],
      maxlength: [100, 'Name can not be more than 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [1000, 'Description can not be more than 1000 characters'],
    },

    image: {
      type: String,
      default: '/uploads/example.png',
    },

    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: ['office', 'kitchen', 'bedroom'],
    },

    company: {
      type: String,
      required: [true, 'Please provide company'],
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported',
      },
    },
    
    colors: {
      type: [String],
      default: ['#222'],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true,  toJSON : {  virtuals : true  },   toObject : {  virtuals : true }   }
);

//getting all the reviews related to this product
//using "reviews" because thats' what will use o fetch while using populate
//ref: "Review" means refer to Review Model
//localField : "_id" refer with help of _id
//foreignField : "product" refer localField with product filed 
ProductSchema.virtual("reviews", {
  ref: "Review",
  localField : "_id",
  foreignField : "product",
  justOne : false
} )

//when product will be removed - delete all the related reviews
ProductSchema.pre("remove",   async function(next) {
//from the model review delete "product"
  await this.model('Review').deleteMany({ product : this._id  });

  })





module.exports = mongoose.model('Product', ProductSchema);