const mongoose = require('mongoose');
const Parent = require('./Models/ParentModel');

async function checkParentProfile() {
  try {
    // Connect to database
    require('dotenv').config();
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/safego');

    // Check if parent profile exists
    const parent = await Parent.findOne({ email: 'Vidushika@safego.com' });

    if (parent) {
      console.log('✅ Parent profile found:');
      console.log('ID:', parent._id);
      console.log('Parent ID:', parent.parentId);
      console.log('Name:', parent.fullName);
      console.log('Email:', parent.email);
    } else {
      console.log('❌ Parent profile not found for Vidushika@safego.com');

      // Create the profile
      const newParent = new Parent({
        parentId: `P${Date.now()}`,
        fullName: 'Vidushika',
        phoneNumber: '0771234567',
        DOB: new Date('1995-01-01'),
        email: 'Vidushika@safego.com',
        address: 'Colombo, Sri Lanka',
        password: 'Password123'
      });

      await newParent.save();
      console.log('✅ Created new parent profile:');
      console.log('ID:', newParent._id);
      console.log('Parent ID:', newParent.parentId);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkParentProfile();
