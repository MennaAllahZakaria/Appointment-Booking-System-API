const ApiError = require("../utils/apiError");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const multerOptions = () => {
  //diskStorage
  const upload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
      // check file type
      if (!file.mimetype.startsWith("image")) {
        return cb(new ApiError("Only Image allowed", 400), false);
      }
      cb(null, true);
    },
  });
  return upload;
};

//   // Memory Storage
//   const multerStorage = multer.memoryStorage();

//   const multerFilter = function (req, file, cb) {
//     if (file.mimetype.startsWith("image")) {
//       cb(null, true);
//     } else {
//       cb(new ApiError("Only Image allowed", 400), false);
//     }
//   };

//   const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
//   return upload;
// };

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (arryOfFields) =>
  multerOptions().fields(arryOfFields);
