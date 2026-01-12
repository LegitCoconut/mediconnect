import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getPatientById } from "@/lib/actions/patient.actions";
import { ArrowLeft, User, Phone, Mail, Calendar, Droplets, Ruler, Scale, AlertTriangle, Pill, Heart, Scissors, Users } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface PatientPageProps {
    params: Promise<{ id: string }>;
}

interface MedicalHistory {
    allergies?: string[];
    chronicConditions?: string[];
    currentMedications?: string[];
    pastSurgeries?: string[];
    familyHistory?: string[];
}

export default async function PatientDetailPage({ params }: PatientPageProps) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'doctor') {
        redirect("/doctor/login");
    }

    const resolvedParams = await params;
    const patient = await getPatientById(resolvedParams.id);

    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-muted-foreground">Patient not found</p>
                <Link href="/doctor/appointments">
                    <Button variant="outline" className="mt-4">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Appointments
                    </Button>
                </Link>
            </div>
        );
    }

    const medicalHistory: MedicalHistory = patient.medicalHistory || {};

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Link href="/doctor/appointments">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="font-headline text-3xl font-bold">{patient.name}</h1>
                    <p className="text-muted-foreground">Patient Details</p>
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
                            <InfoItem icon={Mail} label="Email" value={patient.email} />
                            <InfoItem icon={Phone} label="Phone" value={patient.phone || 'Not provided'} />
                            <InfoItem
                                icon={Calendar}
                                label="Date of Birth"
                                value={patient.dateOfBirth ? format(new Date(patient.dateOfBirth), 'MMM dd, yyyy') : 'Not provided'}
                            />
                            <InfoItem label="Gender" value={patient.gender || 'Not provided'} />
                            <InfoItem icon={Droplets} label="Blood Group" value={patient.bloodGroup || 'Not provided'} />
                            <InfoItem icon={Ruler} label="Height" value={patient.height ? `${patient.height} cm` : 'Not provided'} />
                            <InfoItem icon={Scale} label="Weight" value={patient.weight ? `${patient.weight} kg` : 'Not provided'} />
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
                        <CardContent className="space-y-2">
                            <p className="font-medium">{patient.emergencyContact.name || 'Not provided'}</p>
                            <p className="text-muted-foreground">{patient.emergencyContact.relation}</p>
                            <p>{patient.emergencyContact.phone}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Allergies */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-500" /> Allergies
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(medicalHistory.allergies?.length ?? 0) > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {medicalHistory.allergies!.map((allergy: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="bg-red-100 text-red-800">
                                        {allergy}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No known allergies</p>
                        )}
                    </CardContent>
                </Card>

                {/* Chronic Conditions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-pink-500" /> Chronic Conditions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(medicalHistory.chronicConditions?.length ?? 0) > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {medicalHistory.chronicConditions!.map((condition: string, i: number) => (
                                    <Badge key={i} variant="secondary">{condition}</Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No chronic conditions</p>
                        )}
                    </CardContent>
                </Card>

                {/* Current Medications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Pill className="h-5 w-5 text-blue-500" /> Current Medications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(medicalHistory.currentMedications?.length ?? 0) > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                                {medicalHistory.currentMedications!.map((med: string, i: number) => (
                                    <li key={i}>{med}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">No current medications</p>
                        )}
                    </CardContent>
                </Card>

                {/* Past Surgeries */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Scissors className="h-5 w-5 text-purple-500" /> Past Surgeries
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(medicalHistory.pastSurgeries?.length ?? 0) > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                                {medicalHistory.pastSurgeries!.map((surgery: string, i: number) => (
                                    <li key={i}>{surgery}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">No past surgeries</p>
                        )}
                    </CardContent>
                </Card>

                {/* Family History */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-green-500" /> Family History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(medicalHistory.familyHistory?.length ?? 0) > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {medicalHistory.familyHistory!.map((item: string, i: number) => (
                                    <Badge key={i} variant="outline">{item}</Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No family history recorded</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function InfoItem({ icon: Icon, label, value }: { icon?: React.ElementType; label: string; value: string }) {
    return (
        <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
                {Icon && <Icon className="h-3 w-3" />} {label}
            </p>
            <p className="font-medium">{value}</p>
        </div>
    );
}
