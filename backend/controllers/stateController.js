const stateModal = require("../model/stateSchema");
const shortid = require("shortid");

// @route   POST /api/state/create
// @desc    Create a short URL
// @access  Public
const urlShortener = async (req, res) => {
  const { originalUrl, userId } = req.body;
  const shortUrl = shortid.generate();
  try {
    const url = new stateModal({
      uri: shortUrl,
      originalUrl,
      shortUrl,
      userId,
    });
    await url.save();
    res
      .status(201)
      .json({ url: `http://localhost:3000/api/state/${shortUrl}` });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ error: error.message });
  }
};

// @route   GET /api/state/:uri
// @desc    Redirect to the original URL
// @access  Public
const redirectUrl = async (req, res) => {
  const { shortUrl } = req.params;
  try {
    const url = await stateModal.findOne({ shortUrl });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    url.clickCount++;
    await url.save();
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Error redirecting to original URL:", error);
    res.status(500).json({ error: error.message });
  }
};

// @route   UPDATE /api/state/update/:uri
// @desc    Update the original URL
// @access  Public
const updateUrl = async (req, res) => {
  const { shortUrl } = req.params;
  const { originalUrl } = req.body;
  try {
    const url = await stateModal.findOne({
      shortUrl,
    });
    if (!url) {
      return res.status(404).json({
        error: "URL not found",
      });
    }
    url.originalUrl = originalUrl;
    await url.save();
    res.status(200).json({
      message: "URL updated successfully",
    });
  } catch (error) {
    console.error("Error updating URL:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

// @route   DELETE /api/state/delete/:uri
// @desc    Delete the short URL
// @access  Public
const deleteUrl = async (req, res) => {
  const { shortUrl } = req.params;
  try {
    const url = await stateModal.findOneAndDelete({ shortUrl });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { urlShortener, redirectUrl, updateUrl, deleteUrl };
