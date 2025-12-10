import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, CreditCard, Phone, Truck, Check } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { useToast } from '@/hooks/use-toast';
import { useCreateOrder } from '@/hooks/useOrders';

const paymentMethods = [
  {
    id: 'mtn-momo',
    name: 'MTN Mobile Money',
    icon: '🟡',
    description: 'Pay using MTN MoMo',
  },
  {
    id: 'airtel-money',
    name: 'Airtel Money',
    icon: '🔴',
    description: 'Pay using Airtel Money',
  },
  {
    id: 'cash',
    name: 'Cash on Delivery',
    icon: '💵',
    description: 'Pay when you receive',
  },
];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const createOrder = useCreateOrder();
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('mtn-momo');
  const [isProcessing, setIsProcessing] = useState(false);
  const [momoPhone, setMomoPhone] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    alternatePhone: '',
    address: '',
    landmark: '',
    city: 'Kampala',
    notes: '',
  });

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 50000 ? 0 : 5000;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateDeliveryForm = () => {
    if (!formData.fullName.trim()) return 'Please enter your full name';
    if (!formData.phone.trim()) return 'Please enter your phone number';
    if (!formData.address.trim()) return 'Please enter your delivery address';
    return null;
  };

  const handleContinueToPayment = () => {
    const error = validateDeliveryForm();
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    // Validate mobile money phone number if not cash
    if (paymentMethod !== 'cash' && !momoPhone.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your mobile money phone number',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing for mobile money
      if (paymentMethod !== 'cash') {
        toast({
          title: 'Processing Payment',
          description: `A payment prompt has been sent to ${momoPhone}. Please check your phone to confirm.`,
        });
        // Simulate waiting for payment confirmation
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const order = await createOrder.mutateAsync({
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
        deliveryAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          alternatePhone: formData.alternatePhone.trim() || undefined,
          address: formData.address.trim(),
          landmark: formData.landmark.trim() || undefined,
          city: formData.city.trim(),
          notes: formData.notes.trim() || undefined,
        },
        paymentMethod,
        deliveryFee,
        total,
        notes: formData.notes.trim() || undefined,
      });
      
      clearCart();
      
      toast({
        title: 'Order Placed Successfully!',
        description: paymentMethod === 'cash' 
          ? 'Your order has been placed. Pay on delivery.'
          : 'Payment confirmed! Your order is being processed.',
      });
      
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      toast({
        title: 'Order Failed',
        description: 'Unable to place your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Checkout - MediKart UG</title>
      </Helmet>
      
      <Layout>
        <div className="container py-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[
              { num: 1, label: 'Delivery' },
              { num: 2, label: 'Payment' },
            ].map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      step >= s.num
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                  </div>
                  <span
                    className={`font-medium ${
                      step >= s.num ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < 1 && (
                  <div
                    className={`w-16 h-0.5 ${
                      step > 1 ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="bg-card p-6 rounded-xl border border-border animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-semibold">Delivery Address</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+256 700 123 456"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alternatePhone">Alternate Phone (Optional)</Label>
                      <Input
                        id="alternatePhone"
                        name="alternatePhone"
                        type="tel"
                        value={formData.alternatePhone}
                        onChange={handleInputChange}
                        placeholder="+256 700 000 000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Plot 45, Kampala Road"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="landmark">Landmark</Label>
                        <Input
                          id="landmark"
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleInputChange}
                          placeholder="Near City Hall"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City/Town</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Kampala"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any special instructions for delivery..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full mt-6"
                    onClick={handleContinueToPayment}
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-card p-6 rounded-xl border border-border animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-semibold">Payment Method</h2>
                  </div>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>

                  {paymentMethod !== 'cash' && (
                    <div className="mt-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="momoPhone">
                          {paymentMethod === 'mtn-momo' ? 'MTN' : 'Airtel'} Mobile Money Number *
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="momoPhone"
                            type="tel"
                            className="pl-10"
                            placeholder="+256 7XX XXX XXX"
                            value={momoPhone}
                            onChange={(e) => setMomoPhone(e.target.value)}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          You will receive a payment prompt on this number to confirm payment.
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cash' && (
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        💵 You will pay <strong>{formatPrice(total)}</strong> in cash when your order is delivered.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        `Pay ${formatPrice(total)}`
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-xl border border-border sticky top-24">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-success">FREE</span>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-border pt-3">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-muted rounded-lg flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Estimated delivery: 2-4 hours within Kampala
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Checkout;
