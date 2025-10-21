'use client';

import dynamic from 'next/dynamic';
import { useSmoothAnchorScroll } from '@/hooks/useSmoothAnchorScroll';

import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import WhyUsSection from '@/components/sections/WhyUsSection';
import ProcessSection from '@/components/sections/ProcessSection';

// Cargas diferidas
const ProjectsSection = dynamic(() => import('@/components/sections/ProjectsSection'), {
  loading: () => <SectionSkeleton />,
});
const PlansSection = dynamic(() => import('@/components/sections/PlansSection'), {
  loading: () => <SectionSkeleton />,
});
const FaqSection = dynamic(() => import('@/components/sections/FaqSection'), {
  loading: () => <SectionSkeleton />,
});
const CtaFinalSection = dynamic(() => import('@/components/sections/CtaFinalSection'), {
  loading: () => <SectionSkeleton noHeading />,
});
const ContactSection = dynamic(() => import('@/components/sections/ContactSection'), {
  loading: () => <SectionSkeleton />,
});

function SectionSkeleton({ noHeading = false }) {
  return (
    <section className="py-16">
      <div className="w-[92%] max-w-[1200px] mx-auto animate-pulse">
        {!noHeading && <div className="h-7 w-64 bg-slate-200 rounded mb-3" />}
        {!noHeading && <div className="h-4 w-3/4 bg-slate-200 rounded mb-8" />}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-slate-100 rounded-2xl border border-slate-200" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  useSmoothAnchorScroll(); // respeta el offset global

  return (
  <>
    <HeroSection />
    <PlansSection />      
    {/* <ProjectsSection /> */} 
    <ProcessSection />   
    <WhyUsSection />      
    <FaqSection />        
    <ContactSection />    
  </>
);
}
