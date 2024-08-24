const mongoose = require('mongoose');
const validator = require('validator');

const floorSchema = new mongoose.Schema({
    floor: {
        type: String,
        required: true,
        enum: ['Basement', 'Ground', 'First', 'Second']
    },
    area: {
        type: Number, // Correct type for numeric values
        required: true
    },
    height: {
        type: Number,   
        required: true
    },
    length: {
        type: Number,   
        required: true
    },
    breadth: {
        type: Number,   
        required: true
    }
});

const warehouseSchema = new mongoose.Schema({
    wareHouseLister:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Register'
    },
    basicInfo: {
        name: {
            type: String,
            required: [true, 'Your good name is required']
        },
        contactNo: {
            type: String,
            required: [true,'Mobile Number is required'],
            unique: true,
            validate: {
                validator: function(value) {
                    // Ensure the phone number is 10 digits long
                    return /^[0-9]{10}$/.test(value);
                },
                message: 'Mobile number must be a 10-digit number'
            }
        },
        email: {
            type: String,
            required: [true,'Email is required'],
            unique: true,            
            trim: true,
            validate: {
                validator(value) {
                    return validator.isEmail(value);
                },
                message: 'Write a Valid Email'
            }
        },
        ownerShipType: {
            type: String,
            enum: ['Broker', 'Owner'],
            required: [true,'Your Owner Ship Type is required'],
        },
        locality: {
            type: String,
            required: [true,'Locality is required'],
        },
        city: {
            type: String,
            required: [true,'City is required'],
        },
        state: {
            type: String,
            required: [true,'State is required'],
        },
        address: {
            type: String,
            required: [true,'Address is required'],
        },
        pincode: 
        {
            type: Number,
            required: [true, 'Pincode is required'],
            validate: 
            {
                validator: function(v) {
                    return /^[0-9]{6}$/.test(v);
                },
                message: `Pincode must be a 6-digit pincode!`
            }
        }
    },
    layout: {
        warehouseType: {
            type: String,
            enum: ['RCC', 'Industrial Shed'],
            required: [true,'Warehouse Type is required'],
        },
        buildUpArea: {
            type: Number,
            required: [true,'Build Up Area is required'],
        },
        totalPlotArea: {
            type: Number,
            required: [true,'Total Plot Area is required'],
        },
        totalParkingArea: {
            type: Number,
            required: [true,'Total Parking Area is required'],
        },
        plotStatus: {
            type: String,
            enum: ['Agriculture', 'Commercial', 'Industrial', 'Residential'],
            required: [true,'Plot Status is required'],
        },
        listingFor: {
            type: String,
            enum: ['Rent', 'Selling'],
            required: [true,'Listing for is required'],
        },
        plinthHeight: {
            type: Number,   
            required: [true,'Plinth Height is required'],
        },
        door: {
            type: Number,
            required: [true,'Doors is required'],
        },
        electricity: {
            type: Number,
            required: [true,'Electricity is required'],
        },
        additionalDetails: [String] // Array of strings for additional details
    },
    floorRent: {
        floors: [floorSchema], // Use correct array notation
        warehouseDirection: {
            type: String,
            required: [true,'WareHouse Direction is required'],
            enum: ['North', 'South', 'East', 'West', 'NorthEast', 'NorthWest', 'SouthEast', 'SouthWest']
        },
        roadAccess: {
            type: String,
            required: [true,'Road Access is required'],
        }, 
        expectedRent: {
            type: Number,
            required: [true,'Expected Rent is required'],
        },
        expectedDeposit: {
            type: Number,   
            required: [true,'Expexted Deposit is required'],
        },
        warehouseDescription: {
            type: String,
            required: [true,'Ware House Description is required'],
        }
    }, 
    wareHouseImage: [String] // Array of strings, likely URLs or paths
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;
