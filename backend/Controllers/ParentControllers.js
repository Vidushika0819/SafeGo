const Parent = require('../Models/ParentModel');

//get by email
const getByEmail = async (req, res, next) => {
    const email = req.params.email;

    try {
        const parent = await Parent.findOne({ email: email });
        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }
        res.status(200).json({ parent });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//data display
const getAllParents = async (req, res, next) => {


    try {
        const parents = await Parent.find();

    //not found
    if(!parents){
        return res.status(404).json({message:"No Parents found"});
    }

    //display all parents
    return res.status(200).json({parents});

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }} ;


//data insert
const addParents = async (req, res, next) => {
    const { parentId, fullName, phoneNumber, DOB, email, address, password } = req.body;


    try {
        const parent = new Parent({
            parentId,
            fullName,
            phoneNumber,
            DOB,
            email,
            address,
            password
        });

        await parent.save();
        return res.status(201).json( parent );
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Duplicate key error
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ message: `${field} already exists` });
        } else if (error.name === 'ValidationError') {
            // Validation error
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        } else {
            return res.status(500).json({ message: "Unable to add parent" });
        }
    }

} ;


//get parent by id

const getById = async (req, res, next) => {

    try {
        const parent = await Parent.findById(req.params.id);
        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }
        res.status(200).json({ parent });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }}  ;

//update parent details
const updateParent = async (req, res, next) => {
    const { parentId, fullName, phoneNumber, DOB, email, address, password } = req.body;
    const id =req.params.id;


    try {
          const parents= await Parent.findByIdAndUpdate(id,
           { parentId, fullName, phoneNumber, DOB, email, address, password },
            { new: true }
        );

         if(!parents){
        return res.status(404).json({message:"Unable to update by this user id"});
    }

    return res.status(200).json({parent:parents});

    }catch(error){
        console.log(error);
        if (error.code === 11000) {
            // Duplicate key error
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ message: `${field} already exists` });
        } else if (error.name === 'ValidationError') {
            // Validation error
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        } else {
            return res.status(500).json({ message: "Unable to update parent" });
        }
}
} ;


//Delete parent Details
const deleteParent = async (req, res, next) => {
    const id = req.params.id;

      try {
          const parents= await Parent.findByIdAndDelete(id);

         if(!parents){
        return res.status(404).json({message:"Unable to delete parent details"});
    }

    return res.status(200).json({parent:parents});

    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Unable to delete parent" });
}
} ;






module.exports = { getAllParents , addParents , getById , updateParent, deleteParent, getByEmail } ;
