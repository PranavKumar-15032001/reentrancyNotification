const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const simulatedTxSchema = mongoose.Schema(
  {
    transactionHash: {
      type: String,
      required: true,
      index: true,
    },
    simulated : {
      type : Boolean,
      required : true,
      default : false,
    },
    tx : {
      type : Object,
      required : false
    },
    flagged : {
      type : Boolean,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
simulatedTxSchema.plugin(toJSON);

/**
 * @typedef simulatedTx
 */
const SimulatedTx = mongoose.model('simulatedTx', simulatedTxSchema);

module.exports = SimulatedTx;
