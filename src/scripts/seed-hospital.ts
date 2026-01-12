import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Hospital } from '../models/Hospital';
import { Department } from '../models/Department';
import { Doctor } from '../models/Doctor';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found in .env.local');
    process.exit(1);
}

async function seedHospitalWithDoctors() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if hospital with this email already exists
        let hospital = await Hospital.findOne({ email: 'cityhospital@demo.com' });

        if (!hospital) {
            // Hash the password
            const hashedPassword = await bcrypt.hash('hospital123', 10);

            // Create the hospital
            hospital = new Hospital({
                name: 'City General Hospital',
                email: 'cityhospital@demo.com',
                password: hashedPassword,
                phone: '9876543210',
                address: {
                    street: '456 Healthcare Boulevard',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001',
                    lat: 19.0760,
                    lng: 72.8777,
                },
                departments: ['Cardiology', 'Orthopedics', 'Neurology', 'Pediatrics', 'General Medicine'],
                description: 'A multi-specialty hospital providing comprehensive healthcare services',
                isVerified: true,
                isActive: true,
            });
            await hospital.save();
            console.log('Hospital created:', hospital.name);
        } else {
            console.log('Hospital already exists:', hospital.name);
        }

        const hospitalId = hospital._id;

        // Create Departments
        const departmentNames = ['Cardiology', 'Orthopedics', 'Neurology', 'Pediatrics', 'General Medicine'];
        const departmentIds: Record<string, mongoose.Types.ObjectId> = {};

        for (const name of departmentNames) {
            let dept = await Department.findOne({ hospitalId, name });
            if (!dept) {
                dept = await Department.create({
                    hospitalId,
                    name,
                    description: `${name} department`,
                    isActive: true,
                });
                console.log('Created department:', name);
            }
            departmentIds[name] = dept._id as mongoose.Types.ObjectId;
        }

        // Create Doctors
        const doctors = [
            {
                name: 'Rajesh Kumar',
                email: 'rajesh.kumar@cityhospital.com',
                phone: '9876543001',
                specialization: 'Cardiologist',
                department: 'Cardiology',
                qualifications: ['MBBS', 'MD Cardiology', 'DM'],
                experience: 15,
                consultationFee: 800,
            },
            {
                name: 'Priya Sharma',
                email: 'priya.sharma@cityhospital.com',
                phone: '9876543002',
                specialization: 'Orthopedic Surgeon',
                department: 'Orthopedics',
                qualifications: ['MBBS', 'MS Orthopedics'],
                experience: 12,
                consultationFee: 700,
            },
            {
                name: 'Amit Patel',
                email: 'amit.patel@cityhospital.com',
                phone: '9876543003',
                specialization: 'Neurologist',
                department: 'Neurology',
                qualifications: ['MBBS', 'MD Neurology', 'DM'],
                experience: 10,
                consultationFee: 900,
            },
            {
                name: 'Sneha Gupta',
                email: 'sneha.gupta@cityhospital.com',
                phone: '9876543004',
                specialization: 'Pediatrician',
                department: 'Pediatrics',
                qualifications: ['MBBS', 'MD Pediatrics'],
                experience: 8,
                consultationFee: 500,
            },
            {
                name: 'Vikram Singh',
                email: 'vikram.singh@cityhospital.com',
                phone: '9876543005',
                specialization: 'General Physician',
                department: 'General Medicine',
                qualifications: ['MBBS', 'MD'],
                experience: 20,
                consultationFee: 400,
            },
        ];

        for (const doc of doctors) {
            const existing = await Doctor.findOne({ email: doc.email });
            if (existing) {
                console.log('Doctor already exists:', doc.name);
                continue;
            }

            const hashedPassword = await bcrypt.hash('doctor123', 10);
            await Doctor.create({
                hospitalId,
                departmentId: departmentIds[doc.department],
                name: doc.name,
                email: doc.email,
                password: hashedPassword,
                phone: doc.phone,
                specialization: doc.specialization,
                qualifications: doc.qualifications,
                experience: doc.experience,
                consultationFee: doc.consultationFee,
                schedule: {
                    monday: { slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'], isAvailable: true },
                    tuesday: { slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'], isAvailable: true },
                    wednesday: { slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'], isAvailable: true },
                    thursday: { slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'], isAvailable: true },
                    friday: { slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'], isAvailable: true },
                    saturday: { slots: ['10:00', '10:30', '11:00', '11:30'], isAvailable: true },
                    sunday: { slots: [], isAvailable: false },
                },
                isActive: true,
            });
            console.log('Created doctor:', doc.name, '| Password: doctor123');
        }

        console.log('\n=== Seed Complete ===');
        console.log('Hospital: cityhospital@demo.com / hospital123');
        console.log('Doctors use email / doctor123');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding:', error);
        process.exit(1);
    }
}

seedHospitalWithDoctors();
