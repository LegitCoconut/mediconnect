'use server';

import { connectDB } from '@/lib/db';
import { User } from '@/models';

export async function getPatientById(patientId: string) {
    try {
        await connectDB();

        const patient = await User.findById(patientId).lean();

        if (!patient) return null;

        return {
            id: patient._id.toString(),
            name: patient.name,
            email: patient.email,
            phone: patient.phone,
            profileImage: patient.profileImage,
            dateOfBirth: patient.dateOfBirth,
            gender: patient.gender,
            bloodGroup: patient.bloodGroup,
            height: patient.height,
            weight: patient.weight,
            address: patient.address,
            emergencyContact: patient.emergencyContact,
            medicalHistory: patient.medicalHistory,
            createdAt: patient.createdAt,
        };
    } catch (error) {
        console.error('Get patient error:', error);
        return null;
    }
}
