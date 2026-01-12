import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  HeartPulse,
  Download,
  Smartphone,
  Hospital,
  Stethoscope,
  Calendar,
  Pill,
  Bell,
  User,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';

const mobileScreenshots = [
  { src: '/home.png', alt: 'Home Screen', title: 'Home Screen' },
  { src: '/search.png', alt: 'Doctor Search', title: 'Doctor Search' },
  { src: '/search_hospita.png', alt: 'Hospital Search', title: 'Hospital Search' },
  { src: '/doctor_profile.png', alt: 'Doctor Profile', title: 'Doctor Profile' },
  { src: '/upcoming_appoint.png', alt: 'Appointments', title: 'Appointments' },
  { src: '/past_appoint.png', alt: 'History', title: 'Past Appointments' },
  { src: '/appoint_details.png', alt: 'Details', title: 'Appointment Details' },
  { src: '/tdy_medicine.png', alt: 'Medicines', title: "Today's Medicines" },
];

const webScreenshots = [
  { src: '/home_login.png', alt: 'Landing Page', title: 'Landing Page' },
  { src: '/hospital_dash.png', alt: 'Hospital Dashboard', title: 'Hospital Dashboard' },
  { src: '/hospital_appointments.png', alt: 'Appointments', title: 'Manage Appointments' },
  { src: '/hospital_doctor_add.png', alt: 'Add Doctor', title: 'Add Doctor' },
  { src: '/hospital_dept_add.png', alt: 'Add Department', title: 'Add Department' },
  { src: '/patient_profile_view.png', alt: 'Patient Profile', title: 'Patient Profiles' },
  { src: '/doctor_dash.png', alt: 'Doctor Dashboard', title: 'Doctor Dashboard' },
  { src: '/doctor_appintment.png', alt: 'Doctor Appointments', title: 'Doctor Appointments' },
];

const features = [
  {
    icon: Hospital,
    title: 'Hospital Discovery',
    description: 'Browse and search for nearby hospitals and clinics with detailed information.'
  },
  {
    icon: Stethoscope,
    title: 'Find Doctors',
    description: 'Find doctors by name, specialty, department, or hospital. View their profiles and availability.'
  },
  {
    icon: Calendar,
    title: 'Easy Booking',
    description: 'Book appointments with just a few taps. Select your preferred date and time slot.'
  },
  {
    icon: Pill,
    title: 'Digital Prescriptions',
    description: 'Access your prescriptions digitally with detailed medicine information and dosage.'
  },
  {
    icon: Bell,
    title: 'Medicine Reminders',
    description: 'Never miss a dose with automatic reminders for your medications.'
  },
  {
    icon: User,
    title: 'Health Profile',
    description: 'Manage your personal health details, medical history, and emergency contacts.'
  },
];

const portalFeatures = [
  {
    icon: Shield,
    title: 'Hospital Management',
    description: 'Complete dashboard for hospitals to manage doctors, departments, and appointments.'
  },
  {
    icon: Clock,
    title: 'Schedule Management',
    description: 'Doctors can set their availability and manage consultation schedules.'
  },
  {
    icon: CheckCircle,
    title: 'Prescription System',
    description: 'Create digital prescriptions with diagnosis, medicines, and dosage instructions.'
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
        {/* background grid overlay (non-interactive) */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>

        {/* main content */}
        <div className="relative z-10 w-[80%] mx-auto px-4 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <Image
                  src="/logo.png"
                  alt="MediConnect"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
                <h1 className="font-headline text-4xl lg:text-5xl font-bold">
                  MediConnect
                </h1>
              </div>

              <p className="text-xl text-muted-foreground mb-8 max-w-xl">
                Your complete healthcare ecosystem. Connect with hospitals, book
                appointments, manage prescriptions, and take control of your health
                journey.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="gap-2">
                  <a href="/mediconnect.apk" download>
                    <Download className="h-5 w-5" />
                    Download App (APK)
                  </a>
                </Button>

                <Button asChild size="lg" variant="outline" className="gap-2">
                  <Link href="/hospital/login">
                    <Hospital className="h-5 w-5" />
                    Hospital Portal
                  </Link>
                </Button>

                <Button asChild size="lg" variant="outline" className="gap-2">
                  <Link href="/doctor/login">
                    <Stethoscope className="h-5 w-5" />
                    Doctor Portal
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-2xl pointer-events-none"></div>

                <Image
                  src="/home.png"
                  alt="MediConnect App"
                  width={280}
                  height={560}
                  className="relative rounded-3xl shadow-2xl border-8 border-background"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Mobile App Features */}
      <section className="py-20 bg-muted/30">
        <div className="w-[80%] mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Smartphone className="h-8 w-8 text-primary" />
              <h2 className="font-headline text-3xl font-bold">Mobile App Features</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your healthcare on the go
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Screenshots */}
      <section className="py-20">
        <div className="w-[80%] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold mb-4">App Screenshots</h2>
            <p className="text-muted-foreground">See the app in action</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mobileScreenshots.map((screenshot, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative group w-full max-w-[240px]">
                  <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    width={240}
                    height={480}
                    className="w-full h-auto rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-2xl">
                    <p className="text-white text-sm font-medium text-center">{screenshot.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Web Portal Features */}
      <section className="py-20 bg-primary/5">
        <div className="w-[80%] mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Hospital className="h-8 w-8 text-primary" />
              <h2 className="font-headline text-3xl font-bold">Professional Web Portal</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful dashboards for hospitals and doctors to manage their operations
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {portalFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {webScreenshots.map((screenshot, index) => (
              <div key={index} className="relative group overflow-hidden rounded-xl shadow-lg border">
                <Image
                  src={screenshot.src}
                  alt={screenshot.alt}
                  width={600}
                  height={400}
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-white font-semibold text-lg">{screenshot.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="w-[80%] mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Download the MediConnect app now and take the first step towards seamless healthcare management.
          </p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <a href="/mediconnect.apk" download>
              <Download className="h-5 w-5" />
              Download MediConnect APK
            </a>
          </Button>
        </div>
      </section>

      {/* Login Options */}
      <section className="py-20">
        <div className="w-[80%] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold mb-4">Access Your Portal</h2>
            <p className="text-muted-foreground">Login to manage your institution or practice</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Admin Login</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/hospital/login">Hospital Login</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/doctor/login">Doctor Login</Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/register">Register Institution</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="w-[80%] mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Image src="/logo.png" alt="MediConnect" width={20} height={20} className="h-5 w-5 object-contain" />
            <span className="font-semibold">MediConnect</span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} MediConnect. Built for better healthcare.
          </p>
        </div>
      </footer>
    </div>
  );
}
