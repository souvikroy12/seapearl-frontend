import React from 'react';
import Hero from '../components/Hero'; 
import Showcase from '../components/Showcase'; 
import Rooms from '../components/Rooms';
import UniqueProperties from '../components/UniqueProperties';
import VibePlanner from '../components/VibePlanner';
import TrendingDestinations from '../components/TrendingDestinations';
import Services from '../components/Services';
import ExtraServices from '../components/ExtraServices';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import LatestUpdates from '../components/LatestUpdates';
import FAQ from '../components/FAQ';

const Home = () => {
  return (
    <>
      {/* 1. INTRO & ACTION LAYERS */}
      <Hero />
      <Showcase /> 

      {/* 2. CORE EXPERIENCES & PROPERTIES ACCOMMODATIONS */}
      <Rooms />
      <UniqueProperties />
      
      {/* 3. INTERACTIVE DISCOVERY HUBS */}
      <VibePlanner /> 
      <TrendingDestinations />

      {/* 4. VALUE INCLUSIONS & AMENITIES */}
      <Services />
      <ExtraServices />

      {/* 5. TRUST, PROOF & CLOSURE PIPELINES */}
      <Gallery />
      <Testimonials />
      <LatestUpdates />
      <FAQ />
    </>
  );
};

export default Home;