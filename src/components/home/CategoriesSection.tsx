import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/data/products';
import { cn } from '@/lib/utils';

const CategoriesSection: React.FC = () => {
  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Shop by Category
            </h2>
            <p className="text-muted-foreground mt-1">
              Find the medicines you need
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className={cn(
                "group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br transition-all duration-300 hover:scale-105 hover:shadow-lg",
                category.color
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative z-10 text-center">
                <span className="text-4xl mb-3 block">{category.icon}</span>
                <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                <p className="text-xs text-muted-foreground hidden md:block">
                  {category.description}
                </p>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        <Link
          to="/categories"
          className="mt-6 flex sm:hidden items-center justify-center gap-2 text-primary font-medium"
        >
          View All Categories
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default CategoriesSection;
