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

export type AdminSession = {
    id: string;
    name: string;
    email: string;
    role: 'superadmin' | 'admin';
};

export async function loginAdmin(
    email: string,
    password: string
): Promise<ActionResult<AdminSession>> {
    try {
        await connectDB();

        const admin = await Admin.findOne({ email, isActive: true });
        if (!admin) {
            return { success: false, message: 'Invalid email or password' };
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return { success: false, message: 'Invalid email or password' };
        }

        return {
            success: true,
            message: 'Login successful',
            data: {
                id: admin._id.toString(),
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        };
    } catch (error) {
        console.error('Admin login error:', error);
        return { success: false, message: 'Login failed. Please try again.' };
    }
}

export type HospitalListItem = {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: {
        city: string;
        state: string;
    };
    departments: string[];
    isVerified: boolean;
    isActive: boolean;
    createdAt: Date;
};

export async function getAllHospitals(): Promise<HospitalListItem[]> {
    try {
        await connectDB();

        const hospitals = await Hospital.find()
            .select('name email phone address departments isVerified isActive createdAt')
            .sort({ createdAt: -1 })
            .lean();

        return hospitals.map((h) => ({
            id: h._id.toString(),
            name: h.name,
            email: h.email,
            phone: h.phone,
            address: {
                city: h.address?.city || '',
                state: h.address?.state || '',
            },
            departments: h.departments || [],
            isVerified: h.isVerified,
            isActive: h.isActive,
            createdAt: h.createdAt,
        }));
    } catch (error) {
        console.error('Get all hospitals error:', error);
        return [];
    }
}

export type PatientListItem = {
    id: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth?: Date;
    gender?: string;
    createdAt: Date;
};

export async function getAllPatients(): Promise<PatientListItem[]> {
    try {
        await connectDB();

        const patients = await Patient.find()
            .select('name email phone dateOfBirth gender createdAt')
            .sort({ createdAt: -1 })
            .lean();

        return patients.map((p) => ({
            id: p._id.toString(),
            name: p.name,
            email: p.email,
            phone: p.phone,
            dateOfBirth: p.dateOfBirth,
            gender: p.gender,
            createdAt: p.createdAt,
        }));
    } catch (error) {
        console.error('Get all patients error:', error);
        return [];
    }
}
