const mongoose = require('mongoose');
const User = require('./Models/User');
const Driver = require('./Models/DriverModel');
const Coordinator = require('./Models/CoordinatorModel');
const Parent = require('./Models/ParentModel');
const Child = require('./Models/Child');

const seedUsers = async () => {
  try {
    // Always recreate sample users and profiles for testing
    await User.deleteMany({});
    await Driver.deleteMany({});
    await Coordinator.deleteMany({});
    await Parent.deleteMany({});
    console.log('Removed all existing users and profiles.');

    // Sample user data
    const sampleUsers = [
      {
        email: 'admin@safego.com',
        password: 'Password123', // Meets complexity requirements
        role: 'admin'
      },
      {
        email: 'coordinator@safego.com',
        password: 'Password123',
        role: 'coordinator'
      },
      {
        email: 'driver@safego.com',
        password: 'Password123',
        role: 'driver'
      },
      {
        email: 'parent@safego.com',
        password: 'Password123',
        role: 'parent'
      }
    ];

    // Create users and their profiles
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();

      // Create profile based on role
      if (userData.role === 'driver') {
        const driverProfile = new Driver({
          name: 'Sample Driver',
          licenseNumber: 'DL123456789',
          phoneNumber: '0771234567',
          vehicleType: 'Bus',
          vehicleNumber: 'WP-CA-1234',
          age: 35,
          experienceYears: 10,
          email: userData.email,
          address: 'Colombo, Sri Lanka',
          password: userData.password
        });
        await driverProfile.save();
        user.profile = driverProfile._id;
        await user.save();
      } else if (userData.role === 'coordinator') {
        const coordinatorProfile = new Coordinator({
          coordinatorId: `C${Date.now()}`,
          fullName: 'Sample Coordinator',
          phoneNumber: '0771234567',
          department: 'Operations',
          DOB: new Date('1980-01-01'),
          email: userData.email,
          address: 'Colombo, Sri Lanka',
          password: userData.password
        });
        await coordinatorProfile.save();
        user.profile = coordinatorProfile._id;
        await user.save();
      } else if (userData.role === 'parent') {
        const parentProfile = new Parent({
          parentId: `P${Date.now()}`,
          fullName: 'Sample Parent',
          phoneNumber: '0771234567',
          DOB: new Date('1990-01-01'),
          email: userData.email,
          address: 'Colombo, Sri Lanka',
          password: userData.password
        });
        await parentProfile.save();
        user.profile = parentProfile._id;
        await user.save();

        // Removed sample children creation
      }

      console.log(`Created sample user: ${userData.email} (${userData.role})`);
    }

    console.log('Sample users seeded successfully!');
    console.log('\nSample Login Credentials:');
    console.log('Admin: admin@safego.com / Password123');
    console.log('Coordinator: coordinator@safego.com / Password123');
    console.log('Driver: driver@safego.com / Password123');
    console.log('Parent: parent@safego.com / Password123');

  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Run seeding if this script is executed directly
if (require.main === module) {
  // Connect to database
  require('dotenv').config();

  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/safego')
    .then(async () => {
      console.log('Connected to MongoDB for seeding...');
      await seedUsers();
      await mongoose.connection.close();
      console.log('Seeding complete. Database connection closed.');
    })
    .catch((error) => {
      console.error('Database connection error:', error);
      process.exit(1);
    });
}

module.exports = seedUsers;
