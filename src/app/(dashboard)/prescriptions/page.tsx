import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { prescriptions } from "@/lib/data";
import { MoreHorizontal, FilePlus2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function PrescriptionsPage() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Prescriptions</CardTitle>
                    <CardDescription>Create and manage patient prescriptions.</CardDescription>
                </div>
                <Button>
                    <FilePlus2 className="mr-2 h-4 w-4" />
                    New Prescription
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead className="hidden sm:table-cell">Doctor</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead>Medication</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {prescriptions.map((prescription) => (
                            <TableRow key={prescription.id}>
                                <TableCell className="font-medium">{prescription.patientName}</TableCell>
                                <TableCell className="hidden sm:table-cell">{prescription.doctorName}</TableCell>
                                <TableCell className="hidden md:table-cell">{prescription.date}</TableCell>
                                <TableCell>{prescription.medication}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Print</DropdownMenuItem>
                                            <DropdownMenuItem>Send to Pharmacy</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
