const cloudinary = require('cloudinary');
const UserModel = require('../models/UserModel');
const dotenv = require('dotenv');

dotenv.config()

const saveAvatar = async (fields, files) => {
  console.log('fields in controller', fields);
  console.log('files in controller', files);
  // console.log('(avatarUploadController)user email', userEmail);
  // console.log('(avatarUploadController)avatar path', avatarPath);

  console.log('in avatar controller');

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  });

  if (files.avatar && files.avatar.length > 0) {
    try {

      const avatar = files.avatar[0]
      const avatarUrlUpload = avatar.filepath;
      const userEmail = fields.userEmail[0];
      console.log('avatar url upload', avatarUrlUpload);

      const cloudinaryResult = await cloudinary.v2.uploader.upload(avatarUrlUpload);
      var cloudinaryURL = cloudinaryResult.secure_url

      const avatarPath = cloudinaryURL
      console.log('avatar path for db', avatarPath);

      const userToEdit = await UserModel.findOne({ email: userEmail });

      if (!userToEdit) {
        console.log('User not found.(avatarUploadController)');
        // return (res.status(404).json({ error: 'User not found' }));

      } else {
        const userId = userToEdit._id;

        await UserModel.findByIdAndUpdate({ _id: userId }, { avatar: avatarPath });
        const userWithAvatar = await UserModel.findOne({ email: userEmail });

        console.log('user is:', userToEdit);
        console.log('User saved successfully.(avatarUploadController)', userWithAvatar);
        return (res.status(200).json({ user: userWithAvatar, message: 'User saved successfully.' }));
      };

    } catch (error) {
      console.log('Internal server error. (avatarUploadController)', error);
      // return res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    return console.log('no file to upload');
  };
};

module.exports = saveAvatar;