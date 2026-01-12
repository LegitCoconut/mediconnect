import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Hospital } from '@/models';

export async function GET() {
    try {
        await connectDB();

        const hospitals = await Hospital.find({ isVerified: true, isActive: true })
            .select('name email phone address departments logo operatingHours description')
            .sort({ name: 1 })
            .lean();

        const data = hospitals.map((h) => ({
            id: h._id.toString(),
            name: h.name,
            phone: h.phone,
            address: {
                city: h.address?.city || '',
                state: h.address?.state || '',
            },
            departments: h.departments || [],
            logo: h.logo,
            description: h.description,
        }));

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('Get hospitals error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch hospitals' },
            { status: 500 }
        );
    }
}
