import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { categories, getProductsByCategory } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';

const Categories: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>All Categories - MediKart UG</title>
        <meta
          name="description"
          content="Browse all medicine categories at MediKart UG. Pain relief, antibiotics, baby care, supplements, cosmetics, and first aid products."
        />
      </Helmet>
      
      <Layout>
        <div className="container py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            All Categories
          </h1>
          <p className="text-muted-foreground mb-8">
            Browse our complete range of healthcare products
          </p>

          {categories.map((category) => {
            const categoryProducts = getProductsByCategory(category.id).slice(0, 4);
            
            return (
              <section key={category.id} className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {category.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/category/${category.id}`}
                    className="flex items-center gap-2 text-primary font-medium hover:underline"
                  >
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </Layout>
    </>
  );
};

export default Categories;
