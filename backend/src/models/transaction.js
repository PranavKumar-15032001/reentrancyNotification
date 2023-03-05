const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { tokenTypes } = require('../config/tokens');

const tokenSchema = mongoose.Schema(
  {
    transactionHash: {
      type: String,
      required: true,
      index: true,
    },
    notified : {
      type : Boolean,
      required : true,
      default : false,
    },
    tx : {
      type : Object,
      required : false
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
