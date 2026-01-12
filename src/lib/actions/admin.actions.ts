'use server';

import { connectDB } from '@/lib/db';
import { Admin, Hospital, Doctor, Appointment, Patient } from '@/models';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export type ActionResult<T = null> = {
    success: boolean;
    message: string;
    data?: T;
};

export async function verifyHospital(hospitalId: string): Promise<ActionResult> {
    try {
        await connectDB();

        await Hospital.findByIdAndUpdate(hospitalId, { isVerified: true });
        revalidatePath('/hospitals');

        return { success: true, message: 'Hospital verified successfully' };
    } catch (error) {
        console.error('Verify hospital error:', error);
        return { success: false, message: 'Failed to verify hospital' };
    }
}

export async function rejectHospital(hospitalId: string): Promise<ActionResult> {
    try {
        await connectDB();

        await Hospital.findByIdAndDelete(hospitalId);
        revalidatePath('/hospitals');

        return { success: true, message: 'Hospital registration rejected' };
    } catch (error) {
        console.error('Reject hospital error:', error);
        return { success: false, message: 'Failed to reject hospital' };
    }
}

export async function toggleHospitalStatus(hospitalId: string): Promise<ActionResult> {
    try {
        await connectDB();

        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return { success: false, message: 'Hospital not found' };
        }

        hospital.isActive = !hospital.isActive;
        await hospital.save();
        revalidatePath('/hospitals');

        return {
            success: true,
            message: `Hospital ${hospital.isActive ? 'activated' : 'suspended'}`,
        };
    } catch (error) {
        console.error('Toggle hospital status error:', error);
        return { success: false, message: 'Failed to update hospital status' };
    }
}

export async function getPlatformStats() {
    try {
        await connectDB();

        const [totalHospitals, verifiedHospitals, totalDoctors, totalPatients, totalAppointments, pendingVerifications] =
            await Promise.all([
                Hospital.countDocuments(),
                Hospital.countDocuments({ isVerified: true }),
                Doctor.countDocuments(),
                Patient.countDocuments(),
                Appointment.countDocuments(),
                Hospital.countDocuments({ isVerified: false }),
            ]);

        return {
            totalHospitals,
            verifiedHospitals,
            totalDoctors,
            totalPatients,
            totalAppointments,
            pendingVerifications,
        };
    } catch (error) {
        console.error('Get platform stats error:', error);
        return {
            totalHospitals: 0,
            verifiedHospitals: 0,
            totalDoctors: 0,
            totalPatients: 0,
            totalAppointments: 0,
            pendingVerifications: 0,
        };
    }
}

export async function getAdminByEmail(email: string) {
    try {
        await connectDB();
        const admin = await Admin.findOne({ email }).lean();
        return admin;
    } catch (error) {
        console.error('Get admin error:', error);
        return null;
    }
}

export async function createSuperAdmin(
    name: string,
    email: string,
    password: string
): Promise<ActionResult> {
    try {
        await connectDB();

        const existing = await Admin.findOne({ email });
        if (existing) {
            return { success: false, message: 'Admin already exists' };
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        await Admin.create({
            name,
            email,
            password: hashedPassword,
            role: 'superadmin',
            isActive: true,
        });

        return { success: true, message: 'Super admin created' };
    } catch (error) {
        console.error('Create admin error:', error);
        return { success: false, message: 'Failed to create admin' };
    }
}

export async function getWeeklyAppointmentTrends() {
    try {
        await connectDB();

        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const appointments = await Appointment.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        return appointments.map((a) => ({
            date: a._id,
            count: a.count,
        }));
    } catch (error) {
        console.error('Get weekly trends error:', error);
        return [];
    }
}
