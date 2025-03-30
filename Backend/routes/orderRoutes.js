const express = require('express');
const router = express.Router();
const orderController = require('../controllers/Ordercontroller');
const protect = require('../Middleware/authMiddleware'); // Import middleware
// Create a new order
router.post('/create',protect, orderController.createOrder);
// Get all orders for a user
router.get('/user/orders', protect,orderController.getUserOrders);
router.put('/update/:id', protect, orderController.updateOrder);
router.delete('/:id', protect, orderController.deleteOrder);
router.put('/favorite/:id', protect, orderController.toggleFavorite);
router.put("/purchase/:id", protect, orderController.purchaseOrder);




module.exports = router;
