import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/tmp/images");
  },
  filename: function (req, file, cb) {
  // const filename = Date.now() + "-" + file.originalname
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
