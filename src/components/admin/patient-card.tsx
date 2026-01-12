"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Calendar, Eye } from "lucide-react";
import type { PatientListItem } from "@/lib/actions/admin.actions";
import { format } from "date-fns";

interface PatientCardProps {
    patient: PatientListItem;
}

export function PatientCard({ patient }: PatientCardProps) {
    const formattedDOB = patient.dateOfBirth
        ? format(new Date(patient.dateOfBirth), "MMM d, yyyy")
        : "Not specified";

    const registeredDate = format(new Date(patient.createdAt), "MMM d, yyyy");

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold truncate">{patient.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{patient.email}</p>
                        </div>
                    </div>
                    {patient.gender && (
                        <Badge variant="outline" className="capitalize">
                            {patient.gender}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-3 pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span className="truncate">{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{patient.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>DOB: {formattedDOB}</span>
                </div>

                <div className="pt-2 text-xs text-muted-foreground">
                    Registered: {registeredDate}
                </div>
            </CardContent>

            <CardFooter className="border-t pt-4">
                <Button size="sm" variant="outline" className="w-full">
                    <Eye className="mr-1 h-4 w-4" />
                    View Details
                </Button>
            </CardFooter>
        </Card>
    );
}
