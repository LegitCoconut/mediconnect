'use server';

import { connectDB } from '@/lib/db';
import { Department } from '@/models';
import { revalidatePath } from 'next/cache';

export type CreateDepartmentInput = {
    hospitalId: string;
    name: string;
    description?: string;
};

export type ActionResult<T = null> = {
    success: boolean;
    message: string;
    data?: T;
};

export async function createDepartment(
    input: CreateDepartmentInput
): Promise<ActionResult<{ id: string }>> {
    try {
        await connectDB();

        // Check if department already exists
        const existing = await Department.findOne({
            hospitalId: input.hospitalId,
            name: input.name,
        });
        if (existing) {
            return { success: false, message: 'Department already exists' };
        }

        const department = await Department.create({
            hospitalId: input.hospitalId,
            name: input.name,
            description: input.description,
            isActive: true,
        });

        revalidatePath('/departments');
        return {
            success: true,
            message: 'Department created successfully',
            data: { id: department._id.toString() },
        };
    } catch (error) {
        console.error('Create department error:', error);
        return { success: false, message: 'Failed to create department' };
    }
}

export async function updateDepartment(
    departmentId: string,
    data: Partial<{ name: string; description: string; isActive: boolean }>
): Promise<ActionResult> {
    try {
        await connectDB();

        await Department.findByIdAndUpdate(departmentId, { $set: data });
        revalidatePath('/departments');

        return { success: true, message: 'Department updated successfully' };
    } catch (error) {
        console.error('Update department error:', error);
        return { success: false, message: 'Failed to update department' };
    }
}

export async function deleteDepartment(departmentId: string): Promise<ActionResult> {
    try {
        await connectDB();

        await Department.findByIdAndDelete(departmentId);
        revalidatePath('/departments');

        return { success: true, message: 'Department deleted successfully' };
    } catch (error) {
        console.error('Delete department error:', error);
        return { success: false, message: 'Failed to delete department' };
    }
}

export async function getDepartmentsByHospital(hospitalId: string) {
    try {
        await connectDB();

        const departments = await Department.find({ hospitalId, isActive: true })
            .sort({ name: 1 })
            .lean();

        return departments.map((d) => ({
            id: d._id.toString(),
            hospitalId: d.hospitalId.toString(),
            name: d.name,
            description: d.description,
            isActive: d.isActive,
            createdAt: d.createdAt,
        }));
    } catch (error) {
        console.error('Get departments error:', error);
        return [];
    }
}

export async function getDepartmentById(departmentId: string) {
    try {
        await connectDB();
        const department = await Department.findById(departmentId).lean();
        if (!department) return null;

        return {
            id: department._id.toString(),
            hospitalId: department.hospitalId.toString(),
            name: department.name,
            description: department.description,
            isActive: department.isActive,
        };
    } catch (error) {
        console.error('Get department error:', error);
        return null;
    }
}
