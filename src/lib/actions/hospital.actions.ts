'use server';

import { connectDB } from '@/lib/db';
import { Hospital } from '@/models';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export type RegisterHospitalInput = {
    name: string;
    email: string;
    password: string;
    phone: string;
    city: string;
    state: string;
};

export type ActionResult<T = null> = {
    success: boolean;
    message: string;
    data?: T;
};

export async function registerHospital(
    input: RegisterHospitalInput
): Promise<ActionResult<{ id: string }>> {
    try {
        await connectDB();

        // Check if email already exists
        const existing = await Hospital.findOne({ email: input.email });
        if (existing) {
            return { success: false, message: 'Email already registered' };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, 12);

        // Create hospital
        const hospital = await Hospital.create({
            name: input.name,
            email: input.email,
            password: hashedPassword,
            phone: input.phone,
            address: {
                city: input.city,
                state: input.state,
            },
            departments: [],
            images: [],
            isVerified: false,
            isActive: true,
        });

        return {
            success: true,
            message: 'Hospital registered successfully. Awaiting verification.',
            data: { id: hospital._id.toString() },
        };
    } catch (error) {
        console.error('Register hospital error:', error);
        return { success: false, message: 'Failed to register hospital' };
    }
}

export async function updateHospitalProfile(
    hospitalId: string,
    data: Partial<{
        name: string;
        phone: string;
        description: string;
        address: {
            street: string;
            city: string;
            state: string;
            pincode: string;
            lat: number;
            lng: number;
        };
        departments: string[];
        operatingHours: Record<string, { open: string; close: string; isClosed: boolean }>;
    }>
): Promise<ActionResult> {
    try {
        await connectDB();

        await Hospital.findByIdAndUpdate(hospitalId, { $set: data });
        revalidatePath('/dashboard');
        revalidatePath('/settings');

        return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
        console.error('Update hospital error:', error);
        return { success: false, message: 'Failed to update profile' };
    }
}

export async function getHospitalById(hospitalId: string) {
    try {
        await connectDB();
        const hospital = await Hospital.findById(hospitalId).lean();
        if (!hospital) return null;

        return {
            ...hospital,
            _id: hospital._id.toString(),
        };
    } catch (error) {
        console.error('Get hospital error:', error);
        return null;
    }
}

export async function getAllHospitals(filters?: {
    isVerified?: boolean;
    isActive?: boolean;
    city?: string;
}) {
    try {
        await connectDB();

        const query: Record<string, unknown> = {};
        if (filters?.isVerified !== undefined) query.isVerified = filters.isVerified;
        if (filters?.isActive !== undefined) query.isActive = filters.isActive;
        if (filters?.city) query['address.city'] = { $regex: filters.city, $options: 'i' };

        const hospitals = await Hospital.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();

        return hospitals.map((h) => ({
            ...h,
            _id: h._id.toString(),
        }));
    } catch (error) {
        console.error('Get hospitals error:', error);
        return [];
    }
}
