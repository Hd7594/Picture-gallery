const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary").v2;

const fileUpload = require("express-fileupload");

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Gallery = require("../models/Gallery");

router.post("/gallery/add", fileUpload(), async (req, res) => {
  try {
    const { name, dimensions, color, author, links, numberDownloads, camera } =
      req.body;

    //console.log(req.files);
    const picture = req.files.picture;
    const realPicture = await cloudinary.uploader.upload(
      convertToBase64(picture)
    );

    const addPhoto = new Gallery({
      name: name,
      dimensions: dimensions,
      color: color,
      author: author,
      links: links,
      numberDownloads: numberDownloads,
      camera: camera,
      picture: realPicture,
    });
    console.log(addPhoto);
    await addPhoto.save();
    res.json(addPhoto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/gallery/list", async (req, res) => {
  try {
    const galleryList = await Gallery.find();
    res.json(galleryList);
    /*
    const onePicture = await Gallery.findOne(req.query.id);
    res.json(onePicture);
    */
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/gallery/delete", async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.body.id);
    if (!req.body.id) {
      res.json({ message: "missing id" });
    } else {
      res.json({ message: "picture deleted" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
