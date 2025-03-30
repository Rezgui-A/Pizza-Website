const Order = require('../models/order');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User is not authenticated' });
    }

    const { method, size, crust, toppings, quantity, totalPrice } = req.body;
    const order = new Order({
      userId: req.user.id, // Attach authenticated user ID
      method,
      size,
      crust,
      toppings,
      quantity,
      totalPrice,
    });

    await order.save();
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all orders for the authenticated user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }); // Use authenticated user ID
    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params; // Get the order ID from params
    const { method, size, crust, toppings, quantity, totalPrice } = req.body;

    // Find the order by ID and update it
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { method, size, crust, toppings, quantity, totalPrice },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Error in updateOrder:", error);
    res.status(500).json({ message: error.message });
  }
};



// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the order by its ID
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Delete the order
    await Order.deleteOne({ _id: id });

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error("Error in deleteOrder:", error);
    res.status(500).json({ message: error.message });
  }
};

// Toggle favorite status for an order
exports.toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.favorite = !order.favorite; // Toggle the favorite status
    await order.save();
    res.status(200).json({ message: 'Favorite status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark an order as purchased
exports.purchaseOrder = async (req, res) => {
  try {
    const { id } = req.params; // Get the order ID from params

    // Find the order by ID
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Mark the order as purchased
    order.purchased = true; // Add this new field to your schema if not already
    await order.save();

    res.status(200).json({ message: "Order purchased successfully", order });
  } catch (error) {
    console.error("Error in purchaseOrder:", error);
    res.status(500).json({ message: error.message });
  }
};






