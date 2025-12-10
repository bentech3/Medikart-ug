import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ShoppingCart, 
  Heart, 
  Minus, 
  Plus, 
  Star, 
  Shield, 
  Truck, 
  AlertCircle,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProductById, useProductsByCategory, formatPrice } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import ProductCard from '@/components/product/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useProductById(id);
  const { data: categoryProducts } = useProductsByCategory(product?.category);

  const relatedProducts = categoryProducts?.filter((p) => p.id !== product?.id).slice(0, 4) || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </Layout>
    );
  }

  const inStock = product.stock > 0;
  const rating = 4.5;
  const reviews = 42;

  const handleAddToCart = () => {
    if (!inStock) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      genericName: product.brand || '',
      description: product.description || '',
      price: Number(product.price),
      originalPrice: product.original_price ? Number(product.original_price) : undefined,
      image: product.image || '/placeholder.svg',
      category: product.category,
      manufacturer: product.brand || 'Generic',
      dosage: product.dosage || '',
      requiresPrescription: product.requires_prescription,
      inStock: inStock,
      rating,
      reviews,
    }, quantity);
    
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} has been added to your cart.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>{product.name} - MediKart UG</title>
        <meta
          name="description"
          content={`Buy ${product.name} online in Uganda. ${product.description}`}
        />
      </Helmet>

      <Layout>
        <div className="container py-6">
          {/* Breadcrumb */}
          <Link
            to={`/category/${product.category}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to {product.category.replace('-', ' & ')}
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.requires_prescription && (
                  <Badge variant="destructive" className="text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Prescription Required
                  </Badge>
                )}
                {product.original_price && (
                  <Badge className="bg-accent text-accent-foreground">
                    {Math.round((1 - Number(product.price) / Number(product.original_price)) * 100)}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {product.name}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {product.brand} • {product.dosage}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(rating)
                            ? 'fill-accent text-accent'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{rating}</span>
                </div>
                <span className="text-muted-foreground">
                  ({reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(Number(product.price))}
                </span>
                {product.original_price && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(Number(product.original_price))}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    inStock ? 'bg-success' : 'bg-destructive'
                  }`}
                />
                <span className={inStock ? 'text-success' : 'text-destructive'}>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground">{product.description}</p>

              {/* Manufacturer */}
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Manufacturer:</span> {product.brand}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!inStock}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!inStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  disabled={!inStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>

                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium text-sm">100% Genuine</p>
                    <p className="text-xs text-muted-foreground">NDA Approved</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Fast Delivery</p>
                    <p className="text-xs text-muted-foreground">2-hour express</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Related Products
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={{
                      id: p.id,
                      name: p.name,
                      genericName: p.brand || '',
                      description: p.description || '',
                      price: Number(p.price),
                      originalPrice: p.original_price ? Number(p.original_price) : undefined,
                      image: p.image || '/placeholder.svg',
                      category: p.category,
                      manufacturer: p.brand || 'Generic',
                      dosage: p.dosage || '',
                      requiresPrescription: p.requires_prescription,
                      inStock: p.stock > 0,
                      rating: 4.5,
                      reviews: 20,
                    }}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </Layout>
    </>
  );
};

export default ProductDetail;
