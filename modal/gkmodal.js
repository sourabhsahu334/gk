const mongoose = require('mongoose');

// Define the schema
const loadSchema = new mongoose.Schema({

    data: {
        type: Object, // Data will be stored as an object
        required: true, // Data is required
      },

      type:{
        type:String,
        required:true
      }
});

const GKmodal = mongoose.model('GKmodal', loadSchema);


module.exports = GKmodal;
