
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB without deprecated options
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/school-bus-health';
    await mongoose.connect(mongoUri);
    console.log('🗄️  MongoDB Connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    console.log('Make sure MongoDB is running or check your connection string');
    process.exit(1);
  }
};

module.exports = connectDB;


// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     //const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vehicle-health-check');
//     const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:5000/vehiclehealth');
//     console.log(`🗄️  MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error('❌ Database connection error:', error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;