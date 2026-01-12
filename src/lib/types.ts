export type Hospital = {
  id: string;
  name: string;
  location: string;
  services: string[];
  operatingHours: string;
  isVerified: boolean;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  hospitalId: string;
  avatarUrl: string;
};

export type Appointment = {
  id: string;
  patientName: string;
  doctor: Doctor;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
};

export type Prescription = {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  medication: string;
  dosage: string;
  instructions: string;
};
