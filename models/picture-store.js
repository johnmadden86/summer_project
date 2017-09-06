'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const cloudinary = require('cloudinary');
const path = require('path');
const logger = require('../utils/logger');

const pictureStore = {

  store: new JsonStore('./models/picture-store.json', { pictures: [] }),
  collection: 'pictures',

  getPicture(userId) {
    return this.store.findOneBy(this.collection, { userId: userId });
  },

  addPicture(userId, imageFile, response) {
    let picture = this.getPicture(userId);
    if (!picture) {
      picture = {
        userId: userId,
      };
      this.store.add(this.collection, picture);
      this.store.save();
    }

    imageFile.mv('tempimage', err => {
      if (!err) {
        cloudinary.uploader.upload('tempimage', result => {
          logger.debug(result);
          picture.img = result.url;
          this.store.save();
          response();
        });
      }
    });
  },

  deletePicture(userId) {
    const picture = this.getPicture(userId);
    const id = path.parse(picture.img);
    cloudinary.api.delete_resources([id.name], function (result) {
      console.log(result);
    });

    this.store.remove(this.collection, picture);
    this.store.save();
  },

};

module.exports = pictureStore;
