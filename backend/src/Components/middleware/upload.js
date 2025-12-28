const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "upload/images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = upload;
