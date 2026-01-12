import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'mediconnect-secret';

export async function GET(request: NextRequest) {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: 'No token provided' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        let decoded: { userId: string; email: string };
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
        } catch {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        await connectDB();

        // Get user profile
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        if (!user.isActive) {
            return NextResponse.json(
                { success: false, message: 'Account has been deactivated' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                address: user.address,
                emergencyContact: user.emergencyContact,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to get profile' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: 'No token provided' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        let decoded: { userId: string; email: string };
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
        } catch {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, phone, dateOfBirth, gender, address, emergencyContact } = body;

        await connectDB();

        // Update user profile
        const user = await User.findByIdAndUpdate(
            decoded.userId,
            {
                $set: {
                    ...(name && { name }),
                    ...(phone && { phone }),
                    ...(dateOfBirth && { dateOfBirth }),
                    ...(gender && { gender }),
                    ...(address && { address }),
                    ...(emergencyContact && { emergencyContact }),
                },
            },
            { new: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                address: user.address,
                emergencyContact: user.emergencyContact,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
