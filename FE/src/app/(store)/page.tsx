import React from 'react';
import {
  Hero,
  PhilosophySection,
  SixPillars,
  EquipmentConfigurator,
  BeansSelection,
  ProcessTrack,
  CommitmentStatement,
  ProjectBuilder,
  SolutionsSection,
  ContactSection,
  SiteFooter,
} from '@/components/store';
import { Navbar, AuthModal, CartDrawer, CheckoutModal, Toast } from '@/components/shared';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh' }}>
      {/* ── Global Overlay Navigation ── */}
      <Navbar />

      {/* 01 · Hero */}
      <Hero />

      {/* 02 · Philosophy — empty editorial beat */}
      <PhilosophySection />

      {/* 03 · Six Pillars — ecosystem map */}
      <SixPillars />

      {/* 04 · Equipment — full-bleed machine portrait */}
      <EquipmentConfigurator />

      {/* 05 · Beans & Origin — provenance */}
      <BeansSelection />

      {/* 06 · Process — four-step horizontal track */}
      <ProcessTrack />

      {/* 07 · Commitment — typography-only trust */}
      <CommitmentStatement />

      {/* 08 · Project Builder — configurator */}
      <ProjectBuilder />

      {/* 09 · Solutions — three packages */}
      <SolutionsSection />

      {/* 10 · Contact / CTA — dark close */}
      <ContactSection />

      {/* 11 · Footer — typographic base */}
      <SiteFooter />

      {/* ── Global Overlays ── */}
      <AuthModal />
      <CartDrawer />
      <CheckoutModal />
      <Toast />
    </main>
  );
}
