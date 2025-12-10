import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useSearchProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/product/ProductCard';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: results, isLoading, error } = useSearchProducts(query);

  return (
    <>
      <Helmet>
        <title>Search "{query}" - MediKart UG</title>
      </Helmet>
      
      <Layout>
        <div className="container py-8">
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <SearchIcon className="h-6 w-6 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Search Results
              </h1>
            </div>
            <p className="text-muted-foreground">
              {isLoading ? 'Searching...' : `${results?.length || 0} results for "${query}"`}
            </p>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Failed to search. Please try again.</p>
            </div>
          ) : results && results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {results.map((product, index) => (
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
              <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No results found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find any products matching "{query}".
                <br />
                Try searching with different keywords.
              </p>
              <Link to="/categories">
                <Button>Browse Categories</Button>
              </Link>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Search;
