import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getPatientById } from "@/lib/actions/patient.actions";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, User, Phone, Mail, Calendar, Droplets, Ruler, Weight, AlertCircle, Pill, Activity, Users } from "lucide-react";

interface MedicalHistory {
    allergies?: string[];
    chronicConditions?: string[];
    currentMedications?: string[];
    pastSurgeries?: string[];
    familyHistory?: string[];
}

export default async function HospitalPatientDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.hospitalId) {
        redirect("/hospital/login");
    }

    const patient = await getPatientById(id);

    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-muted-foreground">Patient not found</p>
                <Link href="/hospital/appointments">
                    <Button variant="outline" className="mt-4">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Appointments
                    </Button>
                </Link>
            </div>
        );
    }

    const medicalHistory = patient.medicalHistory as MedicalHistory | undefined;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Link href="/hospital/appointments">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="font-headline text-3xl font-bold">{patient.name}</h1>
                    <p className="text-muted-foreground">Patient Profile</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" /> Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{patient.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="font-medium">{patient.phone || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                                    <p className="font-medium">
                                        {patient.dateOfBirth ? format(new Date(patient.dateOfBirth), 'MMM dd, yyyy') : 'Not provided'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Gender</p>
                                <p className="font-medium capitalize">{patient.gender || 'Not provided'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Health Metrics */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" /> Health Metrics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-red-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Blood Group</p>
                                    <p className="font-medium">{patient.bloodGroup || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Ruler className="h-4 w-4 text-blue-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Height</p>
                                    <p className="font-medium">{patient.height ? `${patient.height} cm` : 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Weight className="h-4 w-4 text-green-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Weight</p>
                                    <p className="font-medium">{patient.weight ? `${patient.weight} kg` : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Emergency Contact */}
                {patient.emergencyContact && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-red-500" /> Emergency Contact
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="font-medium">{patient.emergencyContact.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="font-medium">{patient.emergencyContact.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Relation</p>
                                    <p className="font-medium capitalize">{patient.emergencyContact.relation || 'N/A'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Address */}
                {patient.address && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium">
                                {[patient.address.street, patient.address.city, patient.address.state, patient.address.pincode]
                                    .filter(Boolean)
                                    .join(', ') || 'Not provided'}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Medical History */}
            <Card>
                <CardHeader>
                    <CardTitle>Medical History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span className="font-medium">Allergies</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {medicalHistory?.allergies?.length ? (
                                    medicalHistory.allergies.map((a, i) => (
                                        <span key={i} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">{a}</span>
                                    ))
                                ) : (
                                    <span className="text-muted-foreground text-sm">None recorded</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="h-4 w-4 text-orange-500" />
                                <span className="font-medium">Chronic Conditions</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {medicalHistory?.chronicConditions?.length ? (
                                    medicalHistory.chronicConditions.map((c, i) => (
                                        <span key={i} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">{c}</span>
                                    ))
                                ) : (
                                    <span className="text-muted-foreground text-sm">None recorded</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Pill className="h-4 w-4 text-blue-500" />
                                <span className="font-medium">Current Medications</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {medicalHistory?.currentMedications?.length ? (
                                    medicalHistory.currentMedications.map((m, i) => (
                                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{m}</span>
                                    ))
                                ) : (
                                    <span className="text-muted-foreground text-sm">None recorded</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="h-4 w-4 text-purple-500" />
                                <span className="font-medium">Past Surgeries</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {medicalHistory?.pastSurgeries?.length ? (
                                    medicalHistory.pastSurgeries.map((s, i) => (
                                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">{s}</span>
                                    ))
                                ) : (
                                    <span className="text-muted-foreground text-sm">None recorded</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-green-500" />
                                <span className="font-medium">Family History</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {medicalHistory?.familyHistory?.length ? (
                                    medicalHistory.familyHistory.map((f, i) => (
                                        <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">{f}</span>
                                    ))
                                ) : (
                                    <span className="text-muted-foreground text-sm">None recorded</span>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
