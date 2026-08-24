import React from 'react';
import {
  Hero,
  CylindricalCarousel,
  EquipmentConfigurator,
  BeansSelection,
  StartupFilmstrip,
  SLABadges,
  ProjectConfigurator,
  SolutionsSection,
  StoreFooter,
} from '@/components/store';
import { Navbar, AuthModal, CartDrawer, Toast } from '@/components/shared';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d0a08] text-[#f5f5f7] relative">
      {/* Top Header Navigation */}
      <Navbar />

      {/* 01. Hero Section */}
      <Hero />

      {/* 02. 3D Cylindrical Ring Showcase */}
      <CylindricalCarousel />

      {/* 03. Equipment Configurator & Spec Sheet */}
      <EquipmentConfigurator />

      {/* 04. Specialty Beans Curation & Origin */}
      <BeansSelection />

      {/* 05. Build-out: Setup Quán Theo Filmstrip Vận Hành */}
      <StartupFilmstrip />

      {/* 06. SLA & Maintenance Guarantees */}
      <SLABadges />

      {/* 07. Interactive Project Configurator */}
      <ProjectConfigurator />

      {/* 08. Turnkey Solutions & Packages */}
      <SolutionsSection />

      {/* 09. Structured Store Footer & Newsletter */}
      <StoreFooter />

      {/* Global Overlays */}
      <AuthModal />
      <CartDrawer />
      <Toast />
    </main>
  );
}
