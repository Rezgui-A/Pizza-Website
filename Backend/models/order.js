const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  method: { type: String, enum: ['CarryOut', 'Delivery'], required: true },
  size: { type: String, enum: ['Small', 'Medium', 'Large'], required: true },
  crust: { type: String, enum: ['Thin Crust', 'Regular Crust', 'Stuffed Crust'], required: true },
  toppings: [{ type: String }],
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  favorite: { type: Boolean, default: false }, // Added favorite field
  purchased: { type: Boolean, default: false }, // New field for purchase status
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
