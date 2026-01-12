import NextAuth, { AuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import { Hospital, Admin, Doctor } from '@/models';
import bcrypt from 'bcryptjs';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role: 'hospital' | 'admin' | 'superadmin' | 'doctor';
            isVerified?: boolean;
            hospitalId?: string;
            departmentId?: string;
        };
    }

    interface User {
        id: string;
        email: string;
        name: string;
        role: 'hospital' | 'admin' | 'superadmin' | 'doctor';
        isVerified?: boolean;
        hospitalId?: string;
        departmentId?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: 'hospital' | 'admin' | 'superadmin' | 'doctor';
        isVerified?: boolean;
        hospitalId?: string;
        departmentId?: string;
    }
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'hospital-login',
            name: 'Hospital Login',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials): Promise<User | null> {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    await connectDB();

                    const hospital = await Hospital.findOne({ email: credentials.email });

                    if (!hospital) {
                        throw new Error('No hospital found with this email');
                    }

                    if (!hospital.isActive) {
                        throw new Error('This hospital account has been suspended');
                    }

                    const isValid = await bcrypt.compare(credentials.password, hospital.password);
                    if (!isValid) {
                        throw new Error('Invalid password');
                    }

                    return {
                        id: hospital._id.toString(),
                        email: hospital.email,
                        name: hospital.name,
                        role: 'hospital',
                        isVerified: hospital.isVerified,
                        hospitalId: hospital._id.toString(),
                    };
                } catch (error: any) {
                    console.error("Authorization Error:", error);
                    throw new Error(error.message || 'An error occurred during authentication.');
                }
            },
        }),
        CredentialsProvider({
            id: 'admin-login',
            name: 'Admin Login',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials): Promise<User | null> {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    await connectDB();

                    const admin = await Admin.findOne({ email: credentials.email });
                    if (!admin) {
                        throw new Error('Invalid admin credentials');
                    }

                    if (!admin.isActive) {
                        throw new Error('This admin account has been deactivated');
                    }

                    const isValid = await bcrypt.compare(credentials.password, admin.password);
                    if (!isValid) {
                        throw new Error('Invalid password');
                    }

                    return {
                        id: admin._id.toString(),
                        email: admin.email,
                        name: admin.name,
                        role: admin.role as 'admin' | 'superadmin',
                    };
                } catch (error: any) {
                    console.error("Authorization Error:", error);
                    throw new Error(error.message || 'An error occurred during authentication.');
                }
            },
        }),
        CredentialsProvider({
            id: 'doctor-login',
            name: 'Doctor Login',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials): Promise<User | null> {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    await connectDB();

                    const doctor = await Doctor.findOne({ email: credentials.email });
                    if (!doctor) {
                        throw new Error('No doctor found with this email');
                    }

                    if (!doctor.isActive) {
                        throw new Error('This doctor account has been deactivated');
                    }

                    const isValid = await bcrypt.compare(credentials.password, doctor.password);
                    if (!isValid) {
                        throw new Error('Invalid password');
                    }

                    return {
                        id: doctor._id.toString(),
                        email: doctor.email,
                        name: doctor.name,
                        role: 'doctor',
                        hospitalId: doctor.hospitalId.toString(),
                        departmentId: doctor.departmentId.toString(),
                    };
                } catch (error: any) {
                    console.error("Doctor Authorization Error:", error);
                    throw new Error(error.message || 'An error occurred during authentication.');
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.isVerified = user.isVerified;
                token.hospitalId = user.hospitalId;
                token.departmentId = user.departmentId;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.isVerified = token.isVerified;
                session.user.hospitalId = token.hospitalId;
                session.user.departmentId = token.departmentId;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
