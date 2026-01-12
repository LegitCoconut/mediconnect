'use server';

import { connectDB } from '@/lib/db';
import { Appointment, Doctor, User } from '@/models';

export async function getHospitalDashboardStats(hospitalId: string) {
    try {
        await connectDB();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

        // Count appointments
        const [
            totalAppointments,
            todayAppointments,
            pendingAppointments,
            completedAppointments,
            thisMonthAppointments,
            lastMonthAppointments,
            activeDoctors,
            uniquePatients
        ] = await Promise.all([
            Appointment.countDocuments({ hospitalId }),
            Appointment.countDocuments({ hospitalId, date: { $gte: today, $lt: tomorrow } }),
            Appointment.countDocuments({ hospitalId, status: 'pending' }),
            Appointment.countDocuments({ hospitalId, status: 'completed' }),
            Appointment.countDocuments({ hospitalId, createdAt: { $gte: thisMonthStart } }),
            Appointment.countDocuments({ hospitalId, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
            Doctor.countDocuments({ hospitalId, isActive: true }),
            Appointment.distinct('patientId', { hospitalId }).then(ids => ids.length)
        ]);

        // Get recent appointments
        const recentAppointments = await Appointment.find({ hospitalId })
            .populate('patientId', 'name email')
            .populate('doctorId', 'name specialization')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        const formattedRecent = recentAppointments.map(apt => ({
            id: apt._id.toString(),
            patient: (apt.patientId as { name?: string })?.name || 'Unknown',
            doctor: (apt.doctorId as { name?: string })?.name || 'Unknown',
            status: apt.status,
            date: apt.date,
            timeSlot: apt.timeSlot
        }));

        // Calculate growth
        const appointmentGrowth = lastMonthAppointments > 0
            ? Math.round(((thisMonthAppointments - lastMonthAppointments) / lastMonthAppointments) * 100)
            : thisMonthAppointments > 0 ? 100 : 0;

        return {
            totalAppointments,
            todayAppointments,
            pendingAppointments,
            completedAppointments,
            activeDoctors,
            uniquePatients,
            appointmentGrowth,
            recentAppointments: formattedRecent
        };
    } catch (error) {
        console.error('Get hospital stats error:', error);
        return {
            totalAppointments: 0,
            todayAppointments: 0,
            pendingAppointments: 0,
            completedAppointments: 0,
            activeDoctors: 0,
            uniquePatients: 0,
            appointmentGrowth: 0,
            recentAppointments: []
        };
    }
}

export async function getDoctorDashboardStats(doctorId: string) {
    try {
        await connectDB();
        void User; // Ensure User model is registered

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());

        const [
            totalAppointments,
            todayAppointments,
            pendingAppointments,
            completedAppointments,
            thisWeekAppointments,
            uniquePatients
        ] = await Promise.all([
            Appointment.countDocuments({ doctorId }),
            Appointment.countDocuments({ doctorId, date: { $gte: today, $lt: tomorrow } }),
            Appointment.countDocuments({ doctorId, status: 'pending' }),
            Appointment.countDocuments({ doctorId, status: 'completed' }),
            Appointment.countDocuments({ doctorId, date: { $gte: thisWeekStart } }),
            Appointment.distinct('patientId', { doctorId }).then(ids => ids.length)
        ]);

        // Get today's appointments
        const todaysAppointmentsList = await Appointment.find({
            doctorId,
            date: { $gte: today, $lt: tomorrow }
        })
            .populate('patientId', 'name email phone')
            .sort({ timeSlot: 1 })
            .lean();

        const formattedToday = todaysAppointmentsList.map(apt => ({
            id: apt._id.toString(),
            patient: {
                name: (apt.patientId as { name?: string })?.name || 'Unknown',
                email: (apt.patientId as { email?: string })?.email,
                phone: (apt.patientId as { phone?: string })?.phone
            },
            status: apt.status,
            timeSlot: apt.timeSlot,
            symptoms: apt.symptoms
        }));

        return {
            totalAppointments,
            todayAppointments,
            pendingAppointments,
            completedAppointments,
            thisWeekAppointments,
            uniquePatients,
            todaysAppointmentsList: formattedToday
        };
    } catch (error) {
        console.error('Get doctor stats error:', error);
        return {
            totalAppointments: 0,
            todayAppointments: 0,
            pendingAppointments: 0,
            completedAppointments: 0,
            thisWeekAppointments: 0,
            uniquePatients: 0,
            todaysAppointmentsList: []
        };
    }
}
