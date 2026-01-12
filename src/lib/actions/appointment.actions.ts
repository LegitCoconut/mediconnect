'use server';

import { connectDB } from '@/lib/db';
import { Appointment, Doctor, Patient, Prescription } from '@/models';
import { revalidatePath } from 'next/cache';

export type ActionResult<T = null> = {
    success: boolean;
    message: string;
    data?: T;
};

export async function getAppointmentsByHospital(
    hospitalId: string,
    filters?: {
        status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
        doctorId?: string;
        date?: Date;
    }
) {
    try {
        await connectDB();

        const query: Record<string, unknown> = { hospitalId };
        if (filters?.status) query.status = filters.status;
        if (filters?.doctorId) query.doctorId = filters.doctorId;
        if (filters?.date) {
            const startOfDay = new Date(filters.date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(filters.date);
            endOfDay.setHours(23, 59, 59, 999);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        const appointments = await Appointment.find(query)
            .populate('doctorId', 'name specialization avatar')
            .populate('patientId', 'name email phone')
            .sort({ date: -1, timeSlot: 1 })
            .lean();

        return appointments.map((a) => ({
            ...a,
            _id: a._id.toString(),
            hospitalId: a.hospitalId.toString(),
            doctorId: typeof a.doctorId === 'object' ? { ...a.doctorId, _id: (a.doctorId as { _id: { toString: () => string } })._id.toString() } : a.doctorId.toString(),
            patientId: typeof a.patientId === 'object' ? { ...a.patientId, _id: (a.patientId as { _id: { toString: () => string } })._id.toString() } : a.patientId.toString(),
        }));
    } catch (error) {
        console.error('Get appointments error:', error);
        return [];
    }
}

export async function getAppointmentsByDoctor(doctorId: string, date?: string) {
    try {
        await connectDB();

        const query: Record<string, unknown> = { doctorId };

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        const appointments = await Appointment.find(query)
            .populate('patientId', 'name email phone')
            .sort({ date: 1, timeSlot: 1 })
            .lean();

        return appointments.map((apt) => ({
            id: apt._id.toString(),
            date: apt.date,
            timeSlot: apt.timeSlot,
            status: apt.status,
            symptoms: apt.symptoms,
            notes: apt.notes,
            patient: apt.patientId ? {
                id: (apt.patientId as { _id: { toString: () => string } })._id.toString(),
                name: (apt.patientId as { name: string }).name,
                email: (apt.patientId as { email: string }).email,
                phone: (apt.patientId as { phone?: string }).phone,
            } : null,
            createdAt: apt.createdAt,
        }));
    } catch (error) {
        console.error('Get doctor appointments error:', error);
        return [];
    }
}

export async function updateAppointmentStatus(
    appointmentId: string,
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<ActionResult> {
    try {
        await connectDB();

        await Appointment.findByIdAndUpdate(appointmentId, { status });
        revalidatePath('/appointments');
        revalidatePath('/doctor/appointments');

        return { success: true, message: `Appointment ${status}` };
    } catch (error) {
        console.error('Update appointment status error:', error);
        return { success: false, message: 'Failed to update appointment' };
    }
}

export async function addAppointmentNotes(
    appointmentId: string,
    notes: string
): Promise<ActionResult> {
    try {
        await connectDB();

        await Appointment.findByIdAndUpdate(appointmentId, { notes });
        revalidatePath('/appointments');

        return { success: true, message: 'Notes added successfully' };
    } catch (error) {
        console.error('Add notes error:', error);
        return { success: false, message: 'Failed to add notes' };
    }
}

export async function getAppointmentById(appointmentId: string) {
    try {
        await connectDB();

        const appointment = await Appointment.findById(appointmentId)
            .populate('doctorId', 'name specialization avatar consultationFee')
            .populate('patientId', 'name email phone dateOfBirth gender')
            .lean();

        if (!appointment) return null;

        return {
            ...appointment,
            _id: appointment._id.toString(),
            hospitalId: appointment.hospitalId.toString(),
        };
    } catch (error) {
        console.error('Get appointment error:', error);
        return null;
    }
}

export async function getTodaysAppointments(hospitalId: string) {
    try {
        await connectDB();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const appointments = await Appointment.find({
            hospitalId,
            date: { $gte: today, $lt: tomorrow },
        })
            .populate('doctorId', 'name specialization')
            .populate('patientId', 'name phone')
            .sort({ timeSlot: 1 })
            .lean();

        return appointments.map((a) => ({
            ...a,
            _id: a._id.toString(),
        }));
    } catch (error) {
        console.error('Get today appointments error:', error);
        return [];
    }
}

export async function getAppointmentStats(hospitalId: string) {
    try {
        await connectDB();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [total, pending, confirmed, todayCount] = await Promise.all([
            Appointment.countDocuments({ hospitalId }),
            Appointment.countDocuments({ hospitalId, status: 'pending' }),
            Appointment.countDocuments({ hospitalId, status: 'confirmed' }),
            Appointment.countDocuments({
                hospitalId,
                date: { $gte: today, $lt: new Date(today.getTime() + 86400000) },
            }),
        ]);

        return { total, pending, confirmed, todayCount };
    } catch (error) {
        console.error('Get stats error:', error);
        return { total: 0, pending: 0, confirmed: 0, todayCount: 0 };
    }
}

// Prescription functions
export type MedicineInput = {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
};

export async function createPrescription(
    appointmentId: string,
    diagnosis: string,
    medicines: MedicineInput[],
    notes?: string
): Promise<ActionResult> {
    try {
        await connectDB();

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return { success: false, message: 'Appointment not found' };
        }

        // Check if prescription already exists
        const existing = await Prescription.findOne({ appointmentId });
        if (existing) {
            return { success: false, message: 'Prescription already exists for this appointment' };
        }

        await Prescription.create({
            appointmentId,
            hospitalId: appointment.hospitalId,
            doctorId: appointment.doctorId,
            patientId: appointment.patientId,
            diagnosis,
            medicines,
            notes,
        });

        // Mark appointment as completed
        await Appointment.findByIdAndUpdate(appointmentId, { status: 'completed' });

        revalidatePath('/doctor/appointments');

        return { success: true, message: 'Prescription created successfully' };
    } catch (error) {
        console.error('Create prescription error:', error);
        return { success: false, message: 'Failed to create prescription' };
    }
}

export async function getPrescriptionByAppointment(appointmentId: string) {
    try {
        await connectDB();

        const prescription = await Prescription.findOne({ appointmentId })
            .populate('patientId', 'name email')
            .lean();

        if (!prescription) return null;

        return {
            id: prescription._id.toString(),
            diagnosis: prescription.diagnosis,
            notes: prescription.notes,
            medicines: prescription.medicines,
            patient: prescription.patientId ? {
                id: (prescription.patientId as { _id: { toString: () => string } })._id.toString(),
                name: (prescription.patientId as { name: string }).name,
                email: (prescription.patientId as { email: string }).email,
            } : null,
            createdAt: prescription.createdAt,
        };
    } catch (error) {
        console.error('Get prescription error:', error);
        return null;
    }
}
