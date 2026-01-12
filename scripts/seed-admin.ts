/**
 * Admin Seed Script
 * 
 * Run this script to create the initial admin user in the database.
 * 
 * Usage: npx tsx scripts/seed-admin.ts
 * 
 * You can modify the credentials below before running.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Admin model schema (inline to avoid import issues)
const AdminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

// ========================================
// CONFIGURE YOUR ADMIN CREDENTIALS HERE
// ========================================
const ADMIN_NAME = 'Super Admin';
const ADMIN_EMAIL = 'admin@mediconnect.com';
const ADMIN_PASSWORD = 'Admin@123';
// ========================================

async function seedAdmin() {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        console.error('❌ MONGODB_URI not found in .env.local');
        process.exit(1);
    }

    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            console.log(`⚠️  Admin with email "${ADMIN_EMAIL}" already exists.`);
            console.log('   If you want to reset the password, delete the admin first or use a different email.');
        } else {
            // Hash password and create admin
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

            await Admin.create({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: hashedPassword,
                role: 'superadmin',
                isActive: true,
            });

            console.log('✅ Admin user created successfully!');
            console.log('');
            console.log('   📧 Email:', ADMIN_EMAIL);
            console.log('   🔑 Password:', ADMIN_PASSWORD);
            console.log('');
            console.log('   Use these credentials to login at /login');
        }

    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seedAdmin();
