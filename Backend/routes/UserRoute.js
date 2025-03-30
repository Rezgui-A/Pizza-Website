const express = require('express');
const { registerUser, loginUser, getAllUsers, getUserById, getLoggedInUser, updateUser } = require('../controllers/Usercontroller');
const protect = require('../Middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getAllUsers); // Route pour récupérer tous les utilisateurs
router.get('/user/:id',getUserById); // Route pour récupérer un utilisateur par ID
router.get('/me', protect, getLoggedInUser); // Get logged-in user's details
router.put('/me', protect, updateUser); // Update logged-in user's info

module.exports = router;