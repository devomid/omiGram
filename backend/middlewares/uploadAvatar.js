const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const saveAvatar = require('../controllers/avatarUploadController');
const UserModel = require('../models/UserModel');

// const uploadsFolder = path.join(__dirname, '../uploads/avatars');

// const checkCreateUploadFolder = (uploadsFolder) => {
//   try {
//     if (!fs.existsSync(uploadsFolder)) {
//       fs.mkdirSync(uploadsFolder)
//     }
//   } catch (error) {
//     console.log(error);
//   };
// };

const checkFileType = (file) => {
  const type = file[0].mimetype.split('/').pop();
  const validTypes = ['png', 'jpeg', 'jpg'];
  if (validTypes.indexOf(type) == -1) {
    console.log('The file type is invalid');
    return false;
  }
  return true;
}

const uploadAvatar = async (req, res) => {
  
  const form = new formidable.IncomingForm();
  const uploadsFolder = path.join(__dirname, '../public/uploads/avatars');
  form.multiples = true;
  form.maxFileSize = 50 * 1024 * 1024; //50 MB
  form.uploadDir = uploadsFolder;
  form.parse(req, async (error, fields, files) => {

    const userEmail = fields.userEmail
    console.log('fields is: ', fields);
    console.log('files is: ', files);
    await saveAvatar(fields, files);

    if (error) {
      // console.log(error, 'Error parsing files');
      return res.json({ ok: false, msg: 'Error parsing files' })
    };

    if (files.avatar) {
      const file = files.avatar
      const isValid = checkFileType(file);
      const fileName = encodeURIComponent(file[0].originalFilename.replace(/&. *;+/g, '-'))
      console.log('file name is: ', fileName);
      if (!isValid) {
        return res.json({ ok: false, msg: 'File type is invalid' })
      }
      // try {
      //   // console.log('file path is: ', file[0].filepath );
      //   fs.rename(file[0].filepath, path.join(uploadsFolder, fileName), (error) => {
      //     if (error) {
      //       console.log('file upload failed:', error);
      //       // Handle the error and return an appropriate response
      //       return res.json({ ok: false, msg: 'Upload failed' });
      //     }
      //     // File renamed successfully, continue with the rest of the code
      //   });

      // } catch (error) {
      //   console.log(error, 'file upload failed, trying to remove the temp file...');
      //   try { fs.unlink(file[0].path) } catch (error) { };
      //   return res.json({ ok: false, msg: 'Upload failed' });
      // }
    } else if (files.files instanceof Array && files.files.length > 0) {
      return
    } else {
      return res.json({ ok: false, msg: 'No files uploaded' });
    }
    const userWithAvatar = await UserModel.findOne({ email: userEmail });
    return res.status(200).json({ ok: true, msg: 'File uploaded successfuly', user: userWithAvatar })
  });
};

module.exports = uploadAvatar;