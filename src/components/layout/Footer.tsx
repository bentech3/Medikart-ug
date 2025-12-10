import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
                M
              </div>
              <div>
                <h3 className="text-lg font-bold">MediKart UG</h3>
                <p className="text-xs text-muted-foreground">Your Health, Delivered</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Uganda's trusted online pharmacy delivering quality medicines to your doorstep across Kampala and beyond.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  All Categories
                </Link>
              </li>
              <li>
                <Link to="/prescription" className="text-muted-foreground hover:text-primary transition-colors">
                  Upload Prescription
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-muted-foreground hover:text-primary transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/pharmacist" className="text-muted-foreground hover:text-primary transition-colors">
                  Pharmacist Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/category/pain-fever" className="text-muted-foreground hover:text-primary transition-colors">
                  Pain & Fever
                </Link>
              </li>
              <li>
                <Link to="/category/antibiotics" className="text-muted-foreground hover:text-primary transition-colors">
                  Antibiotics
                </Link>
              </li>
              <li>
                <Link to="/category/baby-care" className="text-muted-foreground hover:text-primary transition-colors">
                  Baby Care
                </Link>
              </li>
              <li>
                <Link to="/category/supplements" className="text-muted-foreground hover:text-primary transition-colors">
                  Supplements
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+256 700 123 456</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@medikart.ug</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Plot 45, Kampala Road<br />Kampala, Uganda</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-muted-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 MediKart UG. All rights reserved. Licensed by National Drug Authority.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
