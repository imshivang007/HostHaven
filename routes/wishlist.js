const express = require("express");
const router = express.Router();
const wishlist = require("../controllers/wishlist");
const { isLoggedIn } = require("../middleware");

// Toggle wishlist - add/remove listing
router.post("/listings/:id/wishlist", isLoggedIn, wishlist.toggleWishlist);

// Get user's wishlist
router.get("/wishlist", isLoggedIn, wishlist.getWishlist);

module.exports = router;
