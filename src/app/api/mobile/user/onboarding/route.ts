import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'mediconnect-secret';

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
        const {
            dateOfBirth,
            gender,
            bloodGroup,
            height,
            weight,
            address,
            emergencyContact,
            medicalHistory,
        } = body;

        await connectDB();

        // Update user with onboarding data
        const user = await User.findByIdAndUpdate(
            decoded.userId,
            {
                $set: {
                    ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
                    ...(gender && { gender }),
                    ...(bloodGroup && { bloodGroup }),
                    ...(height && { height }),
                    ...(weight && { weight }),
                    ...(address && { address }),
                    ...(emergencyContact && { emergencyContact }),
                    ...(medicalHistory && { medicalHistory }),
                    isOnboardingComplete: true,
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
            message: 'Onboarding completed successfully',
            data: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                bloodGroup: user.bloodGroup,
                height: user.height,
                weight: user.weight,
                address: user.address,
                emergencyContact: user.emergencyContact,
                medicalHistory: user.medicalHistory,
                isOnboardingComplete: user.isOnboardingComplete,
            },
        });
    } catch (error) {
        console.error('Onboarding error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to complete onboarding' },
            { status: 500 }
        );
    }
}
