const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const path = require("path");
const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/\s+/g, '-')             
    .replace(/[^\w\-]+/g, '')         
    .replace(/\-\-+/g, '-')           
    .substring(0, 50);              

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const nameWithoutExt = path.parse(file.originalname).name;
    const safeName = slugify(nameWithoutExt);

    return {
      folder: process.env.CLOUDINARY_UPLOAD_FOLDER || "notesSharingFiles",
      resource_type: "auto", 
      public_id: `${Date.now()}-${safeName}`,
    };
  },
});

const upload = multer({ storage });
module.exports = upload;
