import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Hospital } from '@/models/Hospital';

const MONGODB_URI = process.env.MONGODB_URI || '';

async function seedHospital() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if hospital with this email already exists
        const existingHospital = await Hospital.findOne({ email: 'abcd@gmail.com' });

        if (existingHospital) {
            console.log('Hospital with email abcd@gmail.com already exists');
            await mongoose.disconnect();
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash('abcd', 10);

        // Create the sample hospital
        const sampleHospital = new Hospital({
            name: 'Sample Hospital',
            email: 'abcd@gmail.com',
            password: hashedPassword,
            phone: '1234567890',
            address: {
                street: '123 Healthcare Street',
                city: 'Medical City',
                state: 'Health State',
                pincode: '123456',
            },
            departments: ['General Medicine', 'Emergency'],
            description: 'A sample hospital for testing purposes',
            isVerified: true,
            isActive: true,
        });

        await sampleHospital.save();
        console.log('Sample hospital created successfully!');
        console.log('Email: abcd@gmail.com');
        console.log('Password: abcd');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding hospital:', error);
        process.exit(1);
    }
}

seedHospital();
