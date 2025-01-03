
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Factory, ShieldCheck, BarChart3, Package } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 py-32 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/armssteel.jpeg"
            alt="Steel Mill Background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            ARMS Steel<br />Inventory Management System

          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Streamline your steel mill operations with our advanced inventory tracking and management solution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto bg-orange-600">
                Get Started
              </Button>
            </Link>
            {/* <Link href="/dashboard">
              <Button size="lg" variant="default" className="bg-orange-600 w-full sm:w-auto">
                View Dashboard
              </Button>
            </Link> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Factory className="w-10 h-10" />}
              title="Real-time Tracking"
              description="Monitor your inventory levels and movements in real-time"
            />
            <FeatureCard
              icon={<ShieldCheck className="w-10 h-10" />}
              title="Quality Control"
              description="Maintain quality standards with detailed product tracking"
            />
            <FeatureCard
              icon={<BarChart3 className="w-10 h-10" />}
              title="Analytics"
              description="Comprehensive reports and analytics for informed decision-making"
            />
            <FeatureCard
              icon={<Package className="w-10 h-10" />}
              title="Stock Management"
              description="Efficient stock management with automated alerts"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Optimize Your Operations?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join leading steel manufacturers in transforming their inventory management
          </p>
          <Link href="/login">
            <Button size="lg">Start Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}