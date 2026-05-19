'use client';

import dynamic from 'next/dynamic';

const Navigation = dynamic(() => import('@/components/Navigation').then((m) => m.Navigation || m.default), { ssr: false });
const Hero = dynamic(() => import('@/components/Hero').then((m) => m.Hero || m.default), { ssr: false });
const Services = dynamic(() => import('@/components/Services').then((m) => m.Services || m.default), { ssr: false });
const Portfolio = dynamic(() => import('@/components/Portfolio').then((m) => m.Portfolio || m.default), { ssr: false });
const CTA = dynamic(() => import('@/components/CTA').then((m) => m.CTA || m.default), { ssr: false });
const Contact = dynamic(() => import('@/components/Contact').then((m) => m.Contact || m.default), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer').then((m) => m.Footer || m.default), { ssr: false });

export default function Home() {
  return (
    <>
      <Navigation />
      <Hero />
      <Services />
      <Portfolio />
      <CTA />
      <Contact />
      <Footer />
    </>
  );
}
