
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { doctors } from "@/lib/data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const statusStyles: { [key: string]: string } = {
    approved: "bg-green-500/20 text-green-400 border-green-500/20",
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
    "on-leave": "bg-blue-500/20 text-blue-400 border-blue-500/20",
};

export default function HospitalDoctorsPage() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Doctors</CardTitle>
                    <CardDescription>Manage your hospital's medical staff.</CardDescription>
                </div>
                <Button asChild>
                    <Link href="/hospital/doctors/add">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Doctor
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Specialty</TableHead>
                            <TableHead className="hidden md:table-cell">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {doctors.map((doctor) => (
                            <TableRow key={doctor.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={doctor.avatarUrl} alt={doctor.name} />
                                            <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">{doctor.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{doctor.specialty}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <Badge variant="outline" className={statusStyles[doctor.status]}>
                                        {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1).replace('-', ' ')}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                                            <DropdownMenuItem>Manage Schedule</DropdownMenuItem>
                                            <DropdownMenuItem>View Appointments</DropdownMenuItem>
                                            {doctor.status === 'pending' && <DropdownMenuItem disabled>Approval Pending</DropdownMenuItem>}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive focus:text-destructive">Deactivate</DropdownMenuItem>
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
