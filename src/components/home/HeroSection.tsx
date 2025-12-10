import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden gradient-hero py-12 lg:py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Shield className="h-4 w-4" />
              Licensed by National Drug Authority
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Your Trusted
              <span className="text-primary"> Online Pharmacy</span>
              <br />
              in Uganda
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
              Get genuine medicines delivered to your doorstep in Kampala and across Uganda. 
              Fast, safe, and convenient healthcare at your fingertips.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/categories">
                <Button size="xl" variant="hero" className="w-full sm:w-auto">
                  Shop Medicines
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/prescription">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  Upload Prescription
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-5 w-5 text-primary" />
                <span>Free delivery over 50K</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-5 w-5 text-primary" />
                <span>2-hour express delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>100% genuine medicines</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in hidden lg:block">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=500&fit=crop"
                alt="Medicine delivery"
                className="rounded-2xl shadow-xl"
              />
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Order Delivered!</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="absolute -top-4 -right-4 bg-card p-4 rounded-xl shadow-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">50K+</p>
                  <p className="text-xs text-muted-foreground">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
