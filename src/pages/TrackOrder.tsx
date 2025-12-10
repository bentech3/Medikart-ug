import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  FileCheck,
  Clock,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useOrderById } from '@/hooks/useOrders';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/data/products';

const orderSteps = [
  {
    id: 'pending',
    label: 'Order Placed',
    description: 'Your order has been received',
    icon: FileCheck,
  },
  {
    id: 'verified',
    label: 'Verified',
    description: 'Order verified and ready to pack',
    icon: CheckCircle,
  },
  {
    id: 'packed',
    label: 'Packed',
    description: 'Your medicines are being packed',
    icon: Package,
  },
  {
    id: 'on-the-way',
    label: 'On the Way',
    description: 'Rider is delivering your order',
    icon: Truck,
  },
  {
    id: 'delivered',
    label: 'Delivered',
    description: 'Order delivered successfully',
    icon: CheckCircle,
  },
];

const statusMap: Record<string, string> = {
  'pending': 'pending',
  'confirmed': 'verified',
  'processing': 'packed',
  'shipped': 'on-the-way',
  'delivered': 'delivered',
};

const TrackOrder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('id') || '';
  const { user } = useAuth();
  
  const [orderId, setOrderId] = useState(initialOrderId);
  const [searchedOrderId, setSearchedOrderId] = useState(initialOrderId);
  
  const { data: order, isLoading, error } = useOrderById(searchedOrderId || undefined);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setSearchedOrderId(orderId.trim());
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    const mappedStatus = statusMap[order.status] || order.status;
    return orderSteps.findIndex((step) => step.id === mappedStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-UG', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <>
      <Helmet>
        <title>Track Order - MediKart UG</title>
        <meta
          name="description"
          content="Track your medicine order in real-time. See delivery status and estimated arrival time."
        />
      </Helmet>
      
      <Layout>
        <div className="container py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
              Track Your Order
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Enter your order ID to see the delivery status
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Track'
                  )}
                </Button>
              </div>
            </form>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Error State */}
            {error && searchedOrderId && (
              <div className="text-center py-12">
                <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Error Loading Order</h2>
                <p className="text-muted-foreground">
                  Please try again or check if the order ID is correct.
                </p>
              </div>
            )}

            {/* Order Status */}
            {order && !isLoading && (
              <div className="animate-fade-in">
                {/* Order Info Card */}
                <div className="bg-card p-6 rounded-xl border border-border mb-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-bold text-lg font-mono">{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Placed On</p>
                      <p className="font-medium">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                      <span className="text-sm font-medium text-primary">
                        Total: {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="bg-card p-6 rounded-xl border border-border mb-6">
                  <h2 className="font-semibold mb-6">Delivery Progress</h2>
                  
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border" />
                    <div
                      className="absolute left-5 top-5 w-0.5 bg-primary transition-all duration-500"
                      style={{
                        height: currentStepIndex >= 0 
                          ? `${(currentStepIndex / (orderSteps.length - 1)) * 100}%`
                          : '0%',
                      }}
                    />

                    {/* Steps */}
                    <div className="space-y-6">
                      {orderSteps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        
                        return (
                          <div key={step.id} className="flex gap-4">
                            <div
                              className={cn(
                                "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                                isCompleted
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "bg-card border-border text-muted-foreground"
                              )}
                            >
                              <step.icon className="h-5 w-5" />
                              {isCurrent && (
                                <span className="absolute -inset-1 rounded-full border-2 border-primary animate-ping" />
                              )}
                            </div>
                            <div className="flex-1 pt-1">
                              <p
                                className={cn(
                                  "font-medium",
                                  isCompleted ? "text-foreground" : "text-muted-foreground"
                                )}
                              >
                                {step.label}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-card p-6 rounded-xl border border-border mb-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Delivery Address
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {typeof order.delivery_address === 'object' && order.delivery_address && (
                      <>
                        <p className="font-medium text-foreground">
                          {(order.delivery_address as any).fullName}
                        </p>
                        <p>{(order.delivery_address as any).address}</p>
                        {(order.delivery_address as any).landmark && (
                          <p>Near: {(order.delivery_address as any).landmark}</p>
                        )}
                        <p>{(order.delivery_address as any).city}</p>
                        <p className="mt-2">Phone: {(order.delivery_address as any).phone}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Rider Info (shown when on-the-way) */}
                {order.status === 'shipped' && (
                  <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      Your Rider
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                          🏍️
                        </div>
                        <div>
                          <p className="font-medium">MediKart Delivery</p>
                          <p className="text-sm text-muted-foreground">Delivery Rider</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* No Order Found */}
            {!order && searchedOrderId && !isLoading && !error && (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
                <p className="text-muted-foreground">
                  We couldn't find an order with ID "{searchedOrderId}".
                  <br />
                  Please check the order ID and try again.
                </p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default TrackOrder;
