"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Phone, MapPin, CheckCircle, XCircle, Ban, Eye } from "lucide-react";
import type { HospitalListItem } from "@/lib/actions/admin.actions";
import { verifyHospital, toggleHospitalStatus } from "@/lib/actions/admin.actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface HospitalCardProps {
    hospital: HospitalListItem;
}

export function HospitalCard({ hospital }: HospitalCardProps) {
    const { toast } = useToast();
    const router = useRouter();

    const handleVerify = async () => {
        const result = await verifyHospital(hospital.id);
        toast({
            title: result.success ? "Success" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });
        if (result.success) {
            router.refresh();
        }
    };

    const handleToggleStatus = async () => {
        const result = await toggleHospitalStatus(hospital.id);
        toast({
            title: result.success ? "Success" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });
        if (result.success) {
            router.refresh();
        }
    };

    const location = [hospital.address.city, hospital.address.state]
        .filter(Boolean)
        .join(", ") || "Location not specified";

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold truncate">{hospital.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{hospital.email}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        {hospital.isVerified ? (
                            <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Verified
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                                Pending
                            </Badge>
                        )}
                        {!hospital.isActive && (
                            <Badge variant="destructive" className="bg-red-500/10 text-red-600">
                                <Ban className="mr-1 h-3 w-3" />
                                Suspended
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-3 pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span className="truncate">{hospital.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">{location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{hospital.email}</span>
                </div>

                {hospital.departments.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                        {hospital.departments.slice(0, 3).map((dept) => (
                            <Badge key={dept} variant="outline" className="text-xs">
                                {dept}
                            </Badge>
                        ))}
                        {hospital.departments.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{hospital.departments.length - 3} more
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex gap-2 border-t pt-4">
                {!hospital.isVerified && (
                    <Button size="sm" onClick={handleVerify} className="flex-1">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Verify
                    </Button>
                )}
                <Button
                    size="sm"
                    variant={hospital.isActive ? "destructive" : "default"}
                    onClick={handleToggleStatus}
                    className="flex-1"
                >
                    {hospital.isActive ? (
                        <>
                            <XCircle className="mr-1 h-4 w-4" />
                            Suspend
                        </>
                    ) : (
                        <>
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Activate
                        </>
                    )}
                </Button>
                <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
