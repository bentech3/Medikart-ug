import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileCheck, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PromoSection: React.FC = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Prescription",
      description: "Take a photo or upload your prescription",
    },
    {
      icon: FileCheck,
      title: "Pharmacist Verification",
      description: "Our licensed pharmacists verify your prescription",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Get your medicines delivered within hours",
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-primary text-primary-foreground">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Order Prescription Medicines Easily
          </h2>
          <p className="text-primary-foreground/80">
            Simply upload your prescription and we'll take care of the rest. 
            Our licensed pharmacists ensure you get the right medicines.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative text-center"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-primary-foreground/20" />
              )}
              
              {/* Step Circle */}
              <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/20 mb-4">
                <step.icon className="h-8 w-8" />
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-primary-foreground/70">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/prescription">
            <Button size="lg" variant="hero-outline" className="gap-2">
              Upload Prescription Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
