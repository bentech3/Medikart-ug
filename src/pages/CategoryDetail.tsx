import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useProductsByCategory, categories, getCategoryById } from '@/hooks/useProducts';
import ProductCard from '@/components/product/ProductCard';

const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const category = getCategoryById(categoryId || '');
  const { data: products, isLoading, error } = useProductsByCategory(categoryId);

  if (!category) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <Link to="/categories" className="text-primary hover:underline">
            View All Categories
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category.name} - MediKart UG</title>
        <meta
          name="description"
          content={`Buy ${category.name.toLowerCase()} products online in Uganda. ${category.description}. Fast delivery in Kampala.`}
        />
      </Helmet>
      
      <Layout>
        <div className="container py-8">
          {/* Breadcrumb */}
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            All Categories
          </Link>

          {/* Category Header */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl">{category.icon}</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {category.name}
              </h1>
              <p className="text-muted-foreground">
                {category.description} • {products?.length || 0} products
              </p>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Failed to load products. Please try again.</p>
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, index) => (
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
                      reviews: 20,
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default CategoryDetail;
