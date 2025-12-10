import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromoSection from '@/components/home/PromoSection';

const Index: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>MediKart UG - Uganda's Trusted Online Pharmacy</title>
        <meta
          name="description"
          content="Order genuine medicines online in Uganda. Fast delivery in Kampala and nationwide. Upload prescriptions, shop vitamins, and get healthcare products delivered to your door."
        />
      </Helmet>
      
      <Layout>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <PromoSection />
      </Layout>
    </>
  );
};

export default Index;
