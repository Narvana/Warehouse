const mongoose=require('mongoose');
const validator= require('validator');
const Warehouse=require('./warehouse.model');
const ThreePLColdstorage=require('./3PL.Coldstorage.model');
const ThreePLWarehouse=require('./3PL.Warehouse.model');
const LandModel=require('./Land.model')
const EnquirySchema = new mongoose.Schema(
    {
        UserID : {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'Register',
        },
        ListingID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'ListingModel',
            // validate: {
            //     validator: async function(value) {
            //         // Check if the corresponding model exists based on the listingModel
            //         const model = this.ListingModel;
            //         let modelExists = false;
                    
            //         switch (model) {
            //             case 'ThreePLWarehouse':
            //                 modelExists = await ThreePLWarehouse.exists({ _id: value });
            //                 break;
            //             case 'ThreePLColdstorage':
            //                 modelExists = await ThreePLColdstorage.exists({ _id: value });
            //                 break;
            //             case 'Warehouse':
            //                 modelExists = await Warehouse.exists({ _id: value });
            //                 break;
            //             case 'LandModel':
            //                 modelExists = await LandModel.exists({ _id: value });
            //                 break;
            //             default:
            //                 return false; // Invalid model
            //         }
                    
            //         return modelExists; // Return true if model exists, false otherwise
            //     },
            //     message: function(props) {
            //         const model = this.ListingModel;
            //         return `Invalid reference: No ListingID (${props.value}) found in the ${model} model.`;
            //     }
            // }
        },
        ListingModel: {
            type: String,
            required: true,
            enum: ['ThreePLWarehouse', 'ThreePLColdstorage', 'Warehouse', 'LandModel'],
            // select: false 
        }
    }
)  

EnquirySchema.pre('save', async function(next) {
    const enquiry = this;
    const { ListingID, ListingModel } = enquiry;

    let modelExists = false;

    try {
        switch (ListingModel) {
            case 'ThreePLWarehouse':
                modelExists = await ThreePLWarehouse.exists({ _id: ListingID });
                break;
            case 'ThreePLColdstorage':
                modelExists = await ThreePLColdstorage.exists({ _id: ListingID });
                break;
            case 'Warehouse':
                modelExists = await Warehouse.exists({ _id: ListingID });
                break;
            case 'LandModel':
                modelExists = await LandModel.exists({ _id: ListingID });
                break;
            default:
                return next(new Error(`Invalid model: ${ListingModel}`));
        }

        if (!modelExists) {
            return next(new Error(`Invalid reference: No ListingID (${ListingID}) found in the ${ListingModel} model.`));
        }

        next();
    } catch (error) {
        next(error);
    }
});

const Enquiry = mongoose.model('Enquiry',EnquirySchema);

module.exports= Enquiry;
