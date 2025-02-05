import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" ) {
      cb(null, "./public/tmp/images");
    }
  },
  filename: function (req, file, cb) {
    // const filename = Date.now() + "-" + file.originalname
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({ storage, fileFilter: fileFilter });
