const express = require("express");
const router = express.Router();
const { urlShortener, redirectUrl, updateUrl, deleteUrl } = require("../controllers/stateController");

// @route   POST /api/state/create
// @desc    Create a short URL
// @access  Public
router.post("/create", urlShortener);

// @route   GET /api/state/:uri
// @desc    Redirect to the original URL
// @access  Public
router.get("/:shortUrl", redirectUrl);

// @route   UPDATE /api/state/update/:uri
// @desc    Update the original URL
// @access  Public
router.put("/update/:shortUrl", updateUrl);

// @route   DELETE /api/state/delete/:uri
// @desc    Delete the short URL
// @access  Public
router.delete("/delete/:shortUrl", deleteUrl);

module.exports = router;