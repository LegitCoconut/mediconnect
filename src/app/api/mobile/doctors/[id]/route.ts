import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Doctor } from '@/models';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();

        const doctor = await Doctor.findById(id)
            .select('-password')
            .populate('departmentId', 'name')
            .populate('hospitalId', 'name address phone')
            .lean();

        if (!doctor) {
            return NextResponse.json(
                { success: false, message: 'Doctor not found' },
                { status: 404 }
            );
        }

        // Get today's day name for available slots
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = days[new Date().getDay()];

        const data = {
            id: doctor._id.toString(),
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone,
            specialization: doctor.specialization,
            qualifications: doctor.qualifications,
            experience: doctor.experience,
            consultationFee: doctor.consultationFee,
            avatar: doctor.avatar,
            schedule: doctor.schedule,
            todaySlots: doctor.schedule?.get?.(today) || doctor.schedule?.[today as keyof typeof doctor.schedule],
            hospital: doctor.hospitalId
                ? {
                    id: (doctor.hospitalId as { _id: { toString: () => string } })._id.toString(),
                    name: (doctor.hospitalId as { name: string }).name,
                    address: (doctor.hospitalId as { address: { city: string; state: string } }).address,
                    phone: (doctor.hospitalId as { phone: string }).phone,
                }
                : null,
            department: doctor.departmentId
                ? {
                    id: (doctor.departmentId as { _id: { toString: () => string } })._id.toString(),
                    name: (doctor.departmentId as { name: string }).name,
                }
                : null,
            isActive: doctor.isActive,
        };

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('Get doctor details error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch doctor details' },
            { status: 500 }
        );
    }
}
