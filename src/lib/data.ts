import type { Hospital, Doctor, Appointment, Prescription } from './types';

export const hospitals: Hospital[] = [
  {
    id: 'hosp1',
    name: 'Green Valley General',
    location: 'Maple Creek, USA',
    services: ['Emergency', 'Cardiology', 'Orthopedics'],
    operatingHours: '24/7',
    isVerified: true,
  },
  {
    id: 'hosp2',
    name: 'Oakside Community Hospital',
    location: 'Willow Springs, USA',
    services: ['Pediatrics', 'Neurology', 'Oncology'],
    operatingHours: '8 AM - 10 PM',
    isVerified: false,
  },
  {
    id: 'hosp3',
    name: 'Pinehurst Medical Center',
    location: 'Cedar Falls, USA',
    services: ['Surgery', 'Dermatology', 'Radiology'],
    operatingHours: '24/7',
    isVerified: true,
  },
];

export const doctors: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Emily Carter',
    specialty: 'Cardiology',
    hospitalId: 'hosp1',
    avatarUrl: 'https://picsum.photos/seed/doc1/100/100',
    qualifications: 'M.D., F.A.C.C.',
    dateOfBirth: '1985-05-20',
    status: 'approved',
    consultationTimings: [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }],
    maxPatients: 20,
  },
  {
    id: 'doc2',
    name: 'Dr. Benjamin Lee',
    specialty: 'Neurology',
    hospitalId: 'hosp1',
    avatarUrl: 'https://picsum.photos/seed/doc2/100/100',
    qualifications: 'M.D., Ph.D.',
    dateOfBirth: '1978-11-12',
    status: 'approved',
    consultationTimings: [{ day: 'Tuesday', startTime: '10:00', endTime: '18:00' }],
    maxPatients: 15,
  },
  {
    id: 'doc3',
    name: 'Dr. Olivia Rodriguez',
    specialty: 'Pediatrics',
    hospitalId: 'hosp1',
    avatarUrl: 'https://picsum.photos/seed/doc3/100/100',
    qualifications: 'M.D.',
    dateOfBirth: '1990-01-30',
    status: 'pending',
    consultationTimings: [{ day: 'Wednesday', startTime: '08:00', endTime: '16:00' }],
    maxPatients: 25,
  },
    {
    id: 'doc4',
    name: 'Dr. Samuel Jones',
    specialty: 'Orthopedics',
    hospitalId: 'hosp1',
    avatarUrl: 'https://picsum.photos/seed/doc4/100/100',
    qualifications: 'M.D.',
    dateOfBirth: '1982-07-22',
    status: 'on-leave',
    consultationTimings: [{ day: 'Friday', startTime: '09:00', endTime: '17:00' }],
    maxPatients: 18,
  },
];

export const appointments: Appointment[] = [
  {
    id: 'apt1',
    patientName: 'John Doe',
    doctor: doctors[0],
    date: '2024-08-15',
    time: '10:00 AM',
    status: 'confirmed',
  },
  {
    id: 'apt2',
    patientName: 'Jane Smith',
    doctor: doctors[1],
    date: '2024-08-16',
    time: '2:30 PM',
    status: 'pending',
  },
  {
    id: 'apt3',
    patientName: 'Robert Johnson',
    doctor: doctors[0],
    date: '2024-08-12',
    time: '11:00 AM',
    status: 'completed',
  },
  {
    id: 'apt4',
    patientName: 'Mary Williams',
    doctor: doctors[2],
    date: '2024-08-18',
    time: '9:00 AM',
    status: 'cancelled',
  },
];

export const prescriptions: Prescription[] = [
    { id: 'pre1', patientName: 'John Doe', doctorName: 'Dr. Emily Carter', date: '2024-08-12', medication: 'Lisinopril', dosage: '10mg', instructions: 'Once daily' },
    { id: 'pre2', patientName: 'Alice Brown', doctorName: 'Dr. Samuel Jones', date: '2024-08-10', medication: 'Ibuprofen', dosage: '200mg', instructions: 'As needed for pain' },
];
