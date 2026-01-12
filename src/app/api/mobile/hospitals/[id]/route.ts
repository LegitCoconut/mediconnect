import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Hospital, Doctor, Department } from '@/models';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();

        // Get hospital details
        const hospital = await Hospital.findById(id)
            .select('name phone address departments logo operatingHours description')
            .lean();

        if (!hospital) {
            return NextResponse.json(
                { success: false, message: 'Hospital not found' },
                { status: 404 }
            );
        }

        // Get departments
        const departments = await Department.find({ hospitalId: id, isActive: true })
            .select('name description')
            .lean();

        // Get doctors with their departments
        const doctors = await Doctor.find({ hospitalId: id, isActive: true })
            .select('name specialization qualifications experience consultationFee avatar schedule departmentId')
            .populate('departmentId', 'name')
            .lean();

        const data = {
            id: hospital._id.toString(),
            name: hospital.name,
            phone: hospital.phone,
            address: hospital.address,
            logo: hospital.logo,
            operatingHours: hospital.operatingHours,
            description: hospital.description,
            departments: departments.map((d) => ({
                id: d._id.toString(),
                name: d.name,
                description: d.description,
            })),
            doctors: doctors.map((d) => ({
                id: d._id.toString(),
                name: d.name,
                specialization: d.specialization,
                qualifications: d.qualifications,
                experience: d.experience,
                consultationFee: d.consultationFee,
                avatar: d.avatar,
                schedule: d.schedule,
                department: d.departmentId
                    ? {
                        id: (d.departmentId as { _id: { toString: () => string }; name: string })._id.toString(),
                        name: (d.departmentId as { name: string }).name,
                    }
                    : null,
            })),
        };

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('Get hospital details error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch hospital details' },
            { status: 500 }
        );
    }
}
