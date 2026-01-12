import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Prescription } from '@/models';
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

// GET - Get user's prescriptions
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

        const prescriptions = await Prescription.find({ patientId: decoded.userId })
            .populate('doctorId', 'name specialization')
            .populate('hospitalId', 'name')
            .sort({ createdAt: -1 })
            .lean();

        const data = prescriptions.map((p) => ({
            id: p._id.toString(),
            diagnosis: p.diagnosis,
            notes: p.notes,
            medicines: p.medicines.map((m) => ({
                name: m.name,
                dosage: m.dosage,
                frequency: m.frequency,
                duration: m.duration,
                instructions: m.instructions,
            })),
            doctor: p.doctorId ? {
                id: (p.doctorId as { _id: { toString: () => string } })._id.toString(),
                name: (p.doctorId as { name: string }).name,
                specialization: (p.doctorId as { specialization: string }).specialization,
            } : null,
            hospital: p.hospitalId ? {
                id: (p.hospitalId as { _id: { toString: () => string } })._id.toString(),
                name: (p.hospitalId as { name: string }).name,
            } : null,
            createdAt: p.createdAt,
        }));

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Get prescriptions error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch prescriptions' },
            { status: 500 }
        );
    }
}
