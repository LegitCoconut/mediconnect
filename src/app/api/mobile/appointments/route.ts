import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Appointment, Doctor } from '@/models';
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

// GET - Get user's appointments
export async function GET(request: NextRequest) {
    try {
        const decoded = getUserFromToken(request);
        if (!decoded) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status'); // upcoming, past, all

        const query: Record<string, unknown> = { patientId: decoded.userId };
        const now = new Date();

        if (status === 'upcoming') {
            query.date = { $gte: now };
            query.status = { $in: ['pending', 'confirmed'] };
        } else if (status === 'past') {
            query.$or = [
                { date: { $lt: now } },
                { status: { $in: ['completed', 'cancelled'] } }
            ];
        }

        const appointments = await Appointment.find(query)
            .populate('doctorId', 'name specialization avatar consultationFee')
            .populate('hospitalId', 'name address')
            .sort({ date: -1 })
            .lean();

        const data = appointments.map((apt) => ({
            id: apt._id.toString(),
            date: apt.date,
            timeSlot: apt.timeSlot,
            status: apt.status,
            symptoms: apt.symptoms,
            notes: apt.notes,
            doctor: apt.doctorId ? {
                id: (apt.doctorId as { _id: { toString: () => string } })._id.toString(),
                name: (apt.doctorId as { name: string }).name,
                specialization: (apt.doctorId as { specialization: string }).specialization,
                avatar: (apt.doctorId as { avatar?: string }).avatar,
                consultationFee: (apt.doctorId as { consultationFee: number }).consultationFee,
            } : null,
            hospital: apt.hospitalId ? {
                id: (apt.hospitalId as { _id: { toString: () => string } })._id.toString(),
                name: (apt.hospitalId as { name: string }).name,
            } : null,
            createdAt: apt.createdAt,
        }));

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Get appointments error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch appointments' },
            { status: 500 }
        );
    }
}

// POST - Create new appointment
export async function POST(request: NextRequest) {
    try {
        const decoded = getUserFromToken(request);
        if (!decoded) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { doctorId, date, timeSlot, symptoms } = body;

        if (!doctorId || !date || !timeSlot) {
            return NextResponse.json(
                { success: false, message: 'Doctor, date, and time slot are required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Get doctor to get hospitalId
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return NextResponse.json(
                { success: false, message: 'Doctor not found' },
                { status: 404 }
            );
        }

        // Check if slot is already booked
        const existingAppointment = await Appointment.findOne({
            doctorId,
            date: new Date(date),
            timeSlot,
            status: { $in: ['pending', 'confirmed'] },
        });

        if (existingAppointment) {
            return NextResponse.json(
                { success: false, message: 'This slot is already booked' },
                { status: 409 }
            );
        }

        const appointment = await Appointment.create({
            hospitalId: doctor.hospitalId,
            doctorId,
            patientId: decoded.userId,
            date: new Date(date),
            timeSlot,
            symptoms,
            status: 'pending',
        });

        return NextResponse.json({
            success: true,
            message: 'Appointment booked successfully',
            data: {
                id: appointment._id.toString(),
                date: appointment.date,
                timeSlot: appointment.timeSlot,
                status: appointment.status,
            },
        });
    } catch (error) {
        console.error('Create appointment error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to book appointment' },
            { status: 500 }
        );
    }
}
