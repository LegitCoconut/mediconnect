import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Doctor, Appointment } from '@/models';

// GET - Get available slots for a doctor on a specific date
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const dateStr = searchParams.get('date');

        if (!dateStr) {
            return NextResponse.json(
                { success: false, message: 'Date is required' },
                { status: 400 }
            );
        }

        await connectDB();

        const doctor = await Doctor.findById(id).lean();
        if (!doctor) {
            return NextResponse.json(
                { success: false, message: 'Doctor not found' },
                { status: 404 }
            );
        }

        // Get day of week
        const date = new Date(dateStr);
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = days[date.getDay()];

        // Get schedule for that day
        const daySchedule = doctor.schedule?.get?.(dayName) ||
            (doctor.schedule as Record<string, { slots: string[]; isAvailable: boolean }>)?.[dayName];

        if (!daySchedule || !daySchedule.isAvailable) {
            return NextResponse.json({
                success: true,
                data: {
                    date: dateStr,
                    dayName,
                    isAvailable: false,
                    slots: [],
                    bookedSlots: [],
                    availableSlots: [],
                },
            });
        }

        const allSlots = daySchedule.slots || [];

        // Get booked slots for that date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const bookedAppointments = await Appointment.find({
            doctorId: id,
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ['pending', 'confirmed'] },
        }).select('timeSlot').lean();

        const bookedSlots = bookedAppointments.map((a) => a.timeSlot);
        const availableSlots = allSlots.filter((slot: string) => !bookedSlots.includes(slot));

        return NextResponse.json({
            success: true,
            data: {
                date: dateStr,
                dayName,
                isAvailable: true,
                slots: allSlots,
                bookedSlots,
                availableSlots,
            },
        });
    } catch (error) {
        console.error('Get slots error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch slots' },
            { status: 500 }
        );
    }
}
