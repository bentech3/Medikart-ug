import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Package, MapPin, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <>
      <Helmet>
        <title>Order Confirmed - MediKart UG</title>
      </Helmet>
      
      <Layout>
        <div className="container py-12">
          <div className="max-w-lg mx-auto text-center">
            {/* Success Animation */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-success/20 rounded-full animate-ping" />
              <div className="relative flex items-center justify-center w-24 h-24 bg-success rounded-full">
                <CheckCircle className="h-12 w-12 text-success-foreground" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-2">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. We're preparing your medicines for delivery.
            </p>

            {/* Order Details Card */}
            <div className="bg-card p-6 rounded-xl border border-border mb-6 text-left">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-bold text-lg text-primary">{orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-warning/20 text-warning rounded-full text-sm font-medium">
                    <Package className="h-3 w-3" />
                    Processing
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Estimated Delivery
                </p>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">2-4 hours</p>
                    <p className="text-sm text-muted-foreground">
                      We'll SMS you when your order is on the way
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-muted p-4 rounded-xl mb-6 text-left">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Our pharmacist will verify your order
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Your medicines will be carefully packed
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  A delivery rider will bring your order
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={`/track-order?id=${orderId}`} className="flex-1">
                <Button size="lg" className="w-full gap-2">
                  Track Order
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/" className="flex-1">
                <Button size="lg" variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default OrderConfirmation;
