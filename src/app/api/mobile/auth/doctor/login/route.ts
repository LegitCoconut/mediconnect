import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Doctor } from '@/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'mediconnect-secret';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            );
        }

        await connectDB();

        const doctor = await Doctor.findOne({ email })
            .populate('hospitalId', 'name')
            .populate('departmentId', 'name');

        if (!doctor) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        if (!doctor.isActive) {
            return NextResponse.json(
                { success: false, message: 'Account has been deactivated' },
                { status: 401 }
            );
        }

        const isValidPassword = await bcrypt.compare(password, doctor.password);
        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            {
                doctorId: doctor._id.toString(),
                email: doctor.email,
                role: 'doctor',
            },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                doctor: {
                    id: doctor._id.toString(),
                    name: doctor.name,
                    email: doctor.email,
                    phone: doctor.phone,
                    specialization: doctor.specialization,
                    avatar: doctor.avatar,
                    hospital: doctor.hospitalId
                        ? {
                            id: (doctor.hospitalId as { _id: { toString: () => string } })._id.toString(),
                            name: (doctor.hospitalId as { name: string }).name,
                        }
                        : null,
                    department: doctor.departmentId
                        ? {
                            id: (doctor.departmentId as { _id: { toString: () => string } })._id.toString(),
                            name: (doctor.departmentId as { name: string }).name,
                        }
                        : null,
                },
            },
        });
    } catch (error) {
        console.error('Doctor login error:', error);
        return NextResponse.json(
            { success: false, message: 'Login failed' },
            { status: 500 }
        );
    }
}
