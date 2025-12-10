import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useFeaturedProducts, formatPrice } from '@/hooks/useProducts';
import ProductCard from '@/components/product/ProductCard';

const FeaturedProducts: React.FC = () => {
  const { data: products, isLoading, error } = useFeaturedProducts();

  if (error) {
    return (
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container text-center text-muted-foreground">
          Failed to load products. Please try again.
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Featured Products
            </h2>
            <p className="text-muted-foreground mt-1">
              Top-selling medicines and healthcare products
            </p>
          </div>
          <Link
            to="/categories"
            className="hidden sm:flex items-center gap-2 text-primary font-medium hover:underline"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products?.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard
                  product={{
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
                    inStock: product.stock > 0,
                    rating: 4.5,
                    reviews: Math.floor(Math.random() * 100) + 10,
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <Link
          to="/categories"
          className="mt-8 flex sm:hidden items-center justify-center gap-2 text-primary font-medium"
        >
          View All Products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
