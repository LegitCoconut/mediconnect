import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { appointments } from "@/lib/data";
import { MoreHorizontal, Calendar as CalendarIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const statusStyles = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
    confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/20",
    completed: "bg-green-500/20 text-green-400 border-green-500/20",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/20",
};

export default function AppointmentsPage() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Appointments</CardTitle>
                    <CardDescription>Schedule and manage patient appointments.</CardDescription>
                </div>
                <Button>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    New Appointment
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead className="hidden md:table-cell">Doctor</TableHead>
                            <TableHead className="hidden sm:table-cell">Date & Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                                <TableCell className="font-medium">{appointment.patientName}</TableCell>
                                <TableCell className="hidden md:table-cell">{appointment.doctor.name}</TableCell>
                                <TableCell className="hidden sm:table-cell">{appointment.date} at {appointment.time}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={statusStyles[appointment.status]}>
                                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Confirm</DropdownMenuItem>
                                            <DropdownMenuItem>Cancel</DropdownMenuItem>
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
