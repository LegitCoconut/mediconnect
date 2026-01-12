import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Appointment } from '@/models';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'mediconnect-secret';

function getUserFromToken(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;

    try {
        const token = authHeader.split(' ')[1];
        return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
        return null;
    }
}

// GET - Get appointment details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const decoded = getUserFromToken(request);
        if (!decoded) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        await connectDB();

        const appointment = await Appointment.findOne({
            _id: id,
            patientId: decoded.userId,
        })
            .populate('doctorId', 'name specialization avatar consultationFee phone')
            .populate('hospitalId', 'name address phone')
            .lean();

        if (!appointment) {
            return NextResponse.json(
                { success: false, message: 'Appointment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                id: appointment._id.toString(),
                date: appointment.date,
                timeSlot: appointment.timeSlot,
                status: appointment.status,
                symptoms: appointment.symptoms,
                notes: appointment.notes,
                doctor: appointment.doctorId ? {
                    id: (appointment.doctorId as { _id: { toString: () => string } })._id.toString(),
                    name: (appointment.doctorId as { name: string }).name,
                    specialization: (appointment.doctorId as { specialization: string }).specialization,
                    avatar: (appointment.doctorId as { avatar?: string }).avatar,
                    consultationFee: (appointment.doctorId as { consultationFee: number }).consultationFee,
                    phone: (appointment.doctorId as { phone: string }).phone,
                } : null,
                hospital: appointment.hospitalId ? {
                    id: (appointment.hospitalId as { _id: { toString: () => string } })._id.toString(),
                    name: (appointment.hospitalId as { name: string }).name,
                    address: (appointment.hospitalId as { address: object }).address,
                    phone: (appointment.hospitalId as { phone: string }).phone,
                } : null,
                createdAt: appointment.createdAt,
            },
        });
    } catch (error) {
        console.error('Get appointment error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch appointment' },
            { status: 500 }
        );
    }
}

// PUT - Cancel appointment
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const decoded = getUserFromToken(request);
        if (!decoded) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (status !== 'cancelled') {
            return NextResponse.json(
                { success: false, message: 'Invalid status' },
                { status: 400 }
            );
        }

        await connectDB();

        const appointment = await Appointment.findOneAndUpdate(
            {
                _id: id,
                patientId: decoded.userId,
                status: { $in: ['pending', 'confirmed'] },
            },
            { status: 'cancelled' },
            { new: true }
        );

        if (!appointment) {
            return NextResponse.json(
                { success: false, message: 'Appointment not found or cannot be cancelled' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Appointment cancelled successfully',
        });
    } catch (error) {
        console.error('Cancel appointment error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to cancel appointment' },
            { status: 500 }
        );
    }
}
