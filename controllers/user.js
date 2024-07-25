const { NotFound } = require("../error");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const multer = require("multer");
const fs = require("fs");

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: Storage,
}).array("profileImages", 10);

const createUser = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err.message });
    } else {
      try {
        const images = req.files.map((file) => {
          return {
            data: fs.readFileSync(file.path),
            contentType: file.mimetype,
            filename: file.originalname,
            size: file.size,
          };
        });

        const user = await User.create({
          name: req.body.name,
          email: req.body.email,
          role: req.body.role,
          company: req.body.company,
          images: images,
        });

        res.status(StatusCodes.CREATED).json({ status: "success", data: user });
      } catch (error) {
        console.log(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      }
    }
  });
};
const getUser = async (req, res, next) => {
  const { id: userID } = req.params;
  const user = await User.findOne({ _id: userID });
  if (!user) {
    throw new NotFound(`The product of id:${userID} is not found`);
  }
  res.status(StatusCodes.OK).json({ status: "success", data: user });
};

const updateUser = async (req, res, next) => {
  const { id: userID } = req.params;
  const user = await User.findOne({ _id: userID });
  if (!user) {
    throw new NotFound(`The product of id:${userID} is not found`);
  }

  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err.message });
    } else {
      try {
        // Process new images
        const newImages = req.files.map((file) => ({
          data: fs.readFileSync(file.path),
          contentType: file.mimetype,
          filename: file.originalname,
          size: file.size,
        }));

        // Add new images to existing images array
        const updatedUser = await User.findOneAndUpdate(
          { _id: userID },
          { $push: { images: { $each: newImages } } },
          { new: true, runValidators: true }
        );

        if (!updatedUser) {
          return next(customErrorMessage(`No user with id :${userID}`, 404));
        }

        res
          .status(StatusCodes.OK)
          .json({ status: "success", data: updatedUser });
      } catch (error) {
        console.log(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      }
    }
  });
};

const removeImages = async (req, res, next) => {
  const { id: userID } = req.params;
  const { imageID } = req.body;
  const user = await User.findOne({ _id: userID });
  if (!user) {
    throw new NotFound(`The product of id:${userID} is not found`);
  }

  const result = await User.updateOne(
    { _id: userID },
    { $pull: { images: { _id: imageID } } }
  );

  if (result.modifiedCount === 0) {
    return res
      .status(404)
      .json({ message: `No image with id: ${imageID} found to remove` });
  }

  res.status(200).json({ message: "Image removed successfully" });
};

const updateImages = async (req, res, next) => {
  const { id: userID } = req.params;
  const user = await User.findOne({ _id: userID });
  if (!user) {
    throw new NotFound(`The product of id:${userID} is not found`);
  }

  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err.message });
    } else {
      try {
        // Process new image
        const newImage = req.files.map((file) => ({
          data: fs.readFileSync(file.path),
          contentType: file.mimetype,
          filename: file.originalname,
          size: file.size,
        }))[0]; // Assuming single file upload

        // Find the image in the user's images array and update it
        const updatedImages = user.images.map((image) => {
          if (image._id.toString() === req.body.imageID) {
            return {
              ...image,
              data: newImage.data,
              contentType: newImage.contentType,
            };
          }
          return image;
        });

        user.images = updatedImages;
        await user.save();

        res.status(StatusCodes.OK).json({ status: "success", data: user });
      } catch (error) {
        console.log(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      }
    }
  });
};

const updateProfileImages = async (req, res, next) => {
  const { id: userID } = req.params;
  const user = await User.findOne({ _id: userID });
  if (!user) {
    throw new NotFound(`The product of id:${userID} is not found`);
  }

  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err.message });
    } else {
      try {
        const newImage = req.files.map((file) => ({
          data: fs.readFileSync(file.path),
          contentType: file.mimetype,
          filename: file.originalname,
          size: file.size,
        }))[0];

        const updatedImages = user.images.map((image) => {
          if (image._id.toString() === req.body.imageID) {
            return {
              ...image,
              data: newImage.data,
              contentType: newImage.contentType,
              profileImage: true,
            };
          }
          return {
            ...image,
            profileImage: image.profileImage ? false : image.profileImage,
          };
        });

        user.images = updatedImages;
        await user.save();

        res.status(StatusCodes.OK).json({ status: "success", data: user });
      } catch (error) {
        console.log(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      }
    }
  });
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  removeImages,
  updateImages,
  updateProfileImages,
};
