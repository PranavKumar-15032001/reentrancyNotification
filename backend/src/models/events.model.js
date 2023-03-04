const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { tokenTypes } = require('../config/tokens');

const eventSchema = mongoose.Schema(
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
    eventData : []
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
eventSchema.plugin(toJSON);

/**
 * @typedef Event
 */
const Event = mongoose.model('event', eventSchema);

module.exports = Event;
