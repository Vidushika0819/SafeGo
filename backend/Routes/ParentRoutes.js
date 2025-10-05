const express = require("express");
const router = express.Router();

// Import Parent Controller (only once)
const { getAllParents, addParents, getById, updateParent, deleteParent, getByEmail } = require("../Controllers/ParentControllers.js");

// GET all parents
router.get("/", getAllParents);

// POST add parent
router.post("/", addParents);

//get by ID
router.get("/:id", getById);

//get by email
router.get("/email/:email", getByEmail);

//update parent details
router.put( "/:id", updateParent);

//delete parent details
router.delete( "/:id", deleteParent);


//export
module.exports = router;
