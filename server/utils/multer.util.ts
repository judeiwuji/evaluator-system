import * as multer from 'multer';
import * as path from 'path';
import { v2 } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as dotEnv from 'dotenv';
dotEnv.config();
v2.config({
  api_key: process.env['CLOUD_API_KEY'],
  cloud_name: process.env['CLOUD_NAME'],
  api_secret: process.env['CLOUD_API_SECRET'],
});

export const getMulterStorage = () => {
  let storage: any;
  if (process.env['NODE_ENV'] === 'production') {
    storage = new CloudinaryStorage({
      cloudinary: v2,
      params: async (req, file) => {
        return {
          format: file.mimetype.split('/')[1],
          public_id: `${Date.now()}${path.extname(file.originalname)}`,
        };
      },
    });
  } else {
    storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../public/images/'));
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    });
  }

  return storage;
};
