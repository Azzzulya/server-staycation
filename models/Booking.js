const mongoose  = require("mongoose");
const {ObjectId} = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
  bookingStartDate : {
    type: Date,
    required: true,
  },
  bookingEndDate : {
    type: Date,
    required: true,
  },
  itemId: [{
    _id: {
      type: ObjectId,
      required: true,
      ref : 'Item'
    },
    price : {
      type: ObjectId,
      required: true,
    },
    night : {
      type: ObjectId,
      required: true,
    }
  }],
  memberdId : [{
    type: ObjectId,
    ref: 'Member'
  }],
  bankId : [{
    type: ObjectId,
    ref: 'Bank'
  }],
  proofPayment : {
    type: String,
    required : true,
  },
  bankFrom : {
    type: String,
    required : true,
  },
  accountHolder : {
    type: String,
    required : true,
  },
  status : {
    type: String,
    required : true,
  },


  
});

module.exports = mongoose.model('Booking', bookingSchema)