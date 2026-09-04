# HOMEPAGE ARCHITECTURE AUDIT
**Project:** Aura Coffee Solutions — Homepage  
**Version:** 1.0  
**Date:** 25/08/2026  
**Author:** Architecture Audit — Conversation 02  
**Cross-referenced with:** [`AURA-DESIGN-DIRECTION.md`](./AURA-DESIGN-DIRECTION.md)

---

## 1. FILE TREE

```
src/
├── app/
│   ├── globals.css          (3.5 KB)   — Design tokens + utility classes
│   ├── layout.tsx           (1.5 KB)   — Root layout, AppProvider, metadata
│   └── page.tsx             (1.3 KB)   — Homepage composition (9 sections)
│
├── components/
│   ├── shared/
│   │   ├── Navbar.tsx       (13.4 KB)  — Fixed header, auth, cart, mobile menu
│   │   ├── CartDrawer.tsx   (14.6 KB)  — Right-side quote/cart drawer
│   │   ├── AuthModal.tsx    (10.4 KB)  — Login / register modal
│   │   ├── Toast.tsx        (2.4 KB)   — Notification stack
│   │   └── index.ts
│   │
│   └── store/
│       ├── Hero.tsx             (5.7 KB)   — Section 01
│       ├── CylindricalCarousel  (15.8 KB)  — Section 02
│       ├── EquipmentConfigurator(14.9 KB)  — Section 03
│       ├── BeansSelection.tsx   (17.6 KB)  — Section 04
│       ├── StartupFilmstrip.tsx (6.8 KB)   — Section 05
│       ├── SLABadges.tsx        (4.4 KB)   — Section 06
│       ├── ProjectConfigurator  (12.7 KB)  — Section 07
│       ├── SolutionsSection.tsx (8.0 KB)   — Section 08
│       ├── StoreFooter.tsx      (6.1 KB)   — Section 09
│       └── index.ts
│
├── stores/
│   └── AppContext.tsx        (6.9 KB)   — Global state (auth, cart, toasts)
│
└── types/
    └── index.ts             (1.6 KB)   — All TypeScript interfaces
```

---

## 2. HOMEPAGE COMPOSITION MAP

```
page.tsx
│
├── <Navbar />               [shared]   Fixed z-40, scroll-aware
├── <Hero />                 [01]       Above-the-fold hero
├── <CylindricalCarousel />  [02]       6-pillar rotating ring
├── <EquipmentConfigurator/> [03]       3-tier machine selector + spec sheet
├── <BeansSelection />       [04]       4-bean showcase + hotspot overlay
├── <StartupFilmstrip />     [05]       4-step horizontal scroll
├── <SLABadges />            [06]       3-card SLA commitment
├── <ProjectConfigurator />  [07]       Model selector + 2 sliders
├── <SolutionsSection />     [08]       3-column pricing packages
├── <StoreFooter />          [09]       Brand info + newsletter + copyright
│
├── <AuthModal />            [overlay]  Global — reads AppContext
├── <CartDrawer />           [overlay]  Global — reads AppContext
└── <Toast />                [overlay]  Global — reads AppContext
```

---

## 3. COMPONENT-BY-COMPONENT ANALYSIS

---

### 3.0 · `layout.tsx`

**Purpose:** Root shell. Wraps all pages with fonts, metadata, AppProvider, and ambient background.

| Property | Current Value |
|---|---|
| Language | `vi` |
| Font stack | System fallback (`-apple-system … Inter … Roboto`) — defined in globals.css via CSS variables |
| Background | `#0d0a08` dark espresso |
| Global overlay | `radial-gradient(#c89b3c 1px, transparent 1px)` — 24px dot grid, `opacity-[0.025]` |
| State provider | `AppProvider` wraps `{children}` |

**Violations vs. Design Direction:**

| # | Violation | Rule |
|---|---|---|
| L-01 | System font stack used — no Google Fonts imported (Cormorant Garamond, DM Sans absent) | Typography System |
| L-02 | Dot-grid ambient overlay present in `layout.tsx` body | Layout Anti-Patterns |
| L-03 | No Lenis smooth scroll initialization | Motion System |
| L-04 | Dark background `#0d0a08` — Design Direction mandates cream `#F5EFE6` as primary page background | Color System |

---

### 3.1 · `globals.css`

**Purpose:** Design tokens and shared utility classes.

**Current token inventory:**

```css
/* Color tokens (partial) */
--color-primary: #c89b3c
--color-bg-espresso: #0d0a08
--color-tile-1/2/3: dark surface tiles

/* Utility classes defined */
.glass-panel           — warm glassmorphism card surface
.glass-panel-hover     — hover state variant
.glass-panel-subtle    — lighter variant
.glass-panel-glow      — copper-glow radial bg variant
.glass-nav             — navbar scroll state
.espresso-3d-shadow    — deep box-shadow for 3D cards
.no-scrollbar          — hides scrollbar on overflow containers
.transform-style-3d    — preserve-3d for CylindricalCarousel
.backface-hidden
.perspective-1000/1300/1500/2000
```

**Violations vs. Design Direction:**

| # | Violation | Rule |
|---|---|---|
| G-01 | Missing full cream-based color token set (`--cream-base`, `--espresso-ink`, `--copper-accent`, etc.) | Color System |
| G-02 | Dark background tokens only — no light/cream surface tokens | Color System |
| G-03 | No typography scale tokens (`--text-display`, `--text-hero`, etc.) | Typography System |
| G-04 | No spacing tokens (`--space-unit`, `--section-y`, `--container-x`) | Layout System |
| G-05 | `glass-panel` class remains — will be forbidden on in-page layout elements | Global Forbidden List |
| G-06 | `.glass-panel-glow` with `radial-gradient` — forbidden on content sections | Layout Anti-Patterns |
| G-07 | No atomic UI component primitives (`Button`, `Badge`, `SectionLabel`, etc.) | Implementation Prerequisites |

---

### 3.2 · `Navbar.tsx`

**State:** `scrolled`, `mobileMenuOpen`, `userDropdownOpen` (3 local states)  
**Context:** `user`, `isLoggedIn`, `logout`, `setIsAuthModalOpen`, `setAuthModalMode`, `cartCount`, `setIsCartOpen`

**Structure:**
- Fixed `<header>` with scroll-aware background swap (`glass-nav` class applied at `scrollY > 15`)
- Desktop: Logo · 4 nav links · Hotline · Cart button · User dropdown / Login button · Primary CTA
- Mobile: Logo · Cart icon · Hamburger → slide-down menu with all items

**Issues:**

| # | Issue | Rule |
|---|---|---|
| N-01 | Logo uses gradient background (`from-[#c89b3c] to-[#996515]`) — forbidden | Navbar Spec |
| N-02 | Logo uses `Coffee` fill icon — spec requires SVG outline only | Navbar Spec |
| N-03 | Wordmark `AURA COFFEE` is all-caps font-bold — spec: Cormorant Garamond Light, not all-caps | Typography + Navbar |
| N-04 | `glass-nav` class applies `backdrop-filter: blur` — forbidden on navbar | Navbar Spec |
| N-05 | Hotline phone number displayed in desktop nav — removed from redesign | Navbar Spec |
| N-06 | Dedicated Login button visible in nav — should be hidden behind account icon | UX Clarity |
| N-07 | Nav background turns dark glass on scroll — should turn cream `#F5EFE6` at 96% opacity | Navbar Spec |
| N-08 | `scrollY > 15` threshold — spec requires `scrollY > 40` | Navbar Spec |
| N-09 | `animate-pulse` on cart badge count — forbidden (only live dot in footer allowed) | Motion System |
| N-10 | Framer Motion used for mobile menu — CSS `max-height` transition preferred | Motion System |
| N-11 | All NAV_LINKS point to `href: '#'` — not wired to section anchors | UX / Navigation |

---

### 3.3 · `Hero.tsx`

**State:** None  
**Context:** None  
**Imports:** `framer-motion` (mount animations only)

**Structure:**
- Ambient radial gradient glow blob behind content
- Apple-style pill badge (tagline label)
- H1 with gradient text span
- Subtitle `<p>`
- 2 CTA buttons (primary + secondary)
- 4 trust badge cards (icon + text grid)

**Issues:**

| # | Issue | Rule |
|---|---|---|
| H-01 | Pill badge tagline present — forbidden in hero | Hero Spec |
| H-02 | H1 uses gradient text (`bg-gradient-to-r from-white via-[#f5e4c8] to-[#c89b3c]`) — forbidden | Hero Spec / Color System |
| H-03 | Text layout is centered — spec requires left-aligned, bottom-anchored | Hero Spec |
| H-04 | Two CTA buttons — spec allows single ghost button only | Hero Spec / UX Clarity |
| H-05 | Trust badge icon grid (4 cards) — forbidden | Hero Spec |
| H-06 | Ambient glow blob (`radial-gradient` decorative) — forbidden | Layout Anti-Patterns |
| H-07 | H1 font: system bold — spec: Cormorant Garamond 300 Italic ~80–96px | Typography |
| H-08 | No full-bleed video/image — spec: ambient video (espresso extraction) | Hero Spec |
| H-09 | All mount-triggered animations (not `whileInView`) — below fold items violated | Motion System |
| H-10 | `font-bold tracking-tight` on H1 — forbidden for redesign | Typography |
| H-11 | No background image/video at all — hero renders empty dark space | Hero Spec |

---

### 3.4 · `CylindricalCarousel.tsx`

**State:** `rotationAngle`, `activeMobileIndex`, `isDragging` (3 local states)  
**Refs:** `dragStartX`, `currentAngleRef`  
**Context:** None  
**Animations:** `setInterval(20ms)` auto-rotation loop (continuous RAF-equivalent)

**Data:** `PILLARS` — 6 items inline (6 Unsplash image URLs, all different)

**Structure (desktop):** Perspective 3D cylinder with 6 rotatable cards, drag-to-rotate, bottom nav arrows  
**Structure (mobile):** Single-card display with swipe-to-advance + dot indicator

**Issues:**

| # | Issue | Rule |
|---|---|---|
| C-01 | `setInterval`-based auto-rotation loop — forbidden (no continuous animation loops) | Motion System |
| C-02 | Auto-rotating carousel pattern — explicitly eliminated in redesign direction | Motion System |
| C-03 | Component to be renamed `SixPillars` and rearchitected as editorial list | Component Naming |
| C-04 | `glass-panel` + `espresso-3d-shadow` on each card (6 × 2 = 12 glassmorphism surfaces) | Card Rules / Global Forbidden |
| C-05 | `rounded-3xl` on 6 + 1 card surfaces — forbidden | Layout Anti-Patterns |
| C-06 | `scale-[1.02]` hover on cards — scale animation forbidden | Motion System |
| C-07 | `group-hover:scale-105` on background images inside cards — forbidden | Motion System |
| C-08 | Section label uses pill badge with icon + border + bg — forbidden | Global Forbidden List |
| C-09 | `backdrop-filter: blur` on non-overlay element (card surfaces) — forbidden | Color System |
| C-10 | Mouse/touch drag interactivity on 3D ring — eliminated with carousel removal | Motion System |

---

### 3.5 · `EquipmentConfigurator.tsx`

**State:** `selectedKey: 'home' | 'medium' | 'chain'`  
**Context:** `addToCart`, `setIsCartOpen`, `addToast`  
**Data:** `EQUIPMENT_TIERS` — 3 items inline (3 Unsplash images)  
**Animations:** Framer Motion `AnimatePresence` + `motion.img` for image crossfade

**Structure:**
- Section label (text only, no pill) — partial compliance
- Left 7/12: Machine visualizer card (fullbleed image + badge + price + features + 2 CTA buttons)
- Right 5/12: 3-tab selector buttons + spec sheet table

**Issues:**

| # | Issue | Rule |
|---|---|---|
| E-01 | Raw `<img>` tags used for machine images — must use `next/image <Image />` | Image Rules |
| E-02 | Left card uses `glass-panel` class — forbidden on in-page elements | Global Forbidden List |
| E-03 | Left card has `rounded-3xl` — forbidden | Layout Anti-Patterns |
| E-04 | Left card has `shadow-2xl` box-shadow — forbidden on in-page cards | Global Forbidden List |
| E-05 | Right spec table rows use bordered cards (`rounded-xl bg-black/60`) — forbidden | Card Rules |
| E-06 | Spec table wrapper uses `glass-panel` + `rounded-3xl` — forbidden | Global Forbidden List |
| E-07 | Machine image crossfade uses `scale: 1.04 → 1` — scale motion forbidden | Motion System |
| E-08 | `group-hover:scale-105` on background image — forbidden | Motion System |
| E-09 | 2 competing CTA buttons — secondary should be text link, not `<button>` | UX Clarity |
| E-10 | `addToCart` called inside "Đặt Lịch Trải Nghiệm" — adds to cart when booking a demo (logic bug) | Logic Bug |
| E-11 | Feature chips use `rounded-xl bg-black/60 border` cards (4 items) — spec rows as cards | Card Rules |
| E-12 | Price displayed in copper monospace — spec: Cormorant Garamond neutral, not copper | Typography |
| E-13 | Ambient glow blob (`absolute top-1/2 right-10`) — decorative radial gradient forbidden | Layout Anti-Patterns |

---

### 3.6 · `BeansSelection.tsx`

**State:** `selectedBeanId`, `activeHotspot: 'origin' | 'roast' | 'extract' | null`  
**Context:** `addToCart`, `addToast`  
**Data:** `COFFEE_BEANS` — 4 items inline (4 Unsplash images)  
**Animations:** Framer Motion `motion.div` (hotspot popups) + `motion.p` (expanded description)

**Structure:**
- Left 6/12: Fixed background image with 3 hotspot interactive overlays + score bar + CTA
- Right 6/12: Static bag image block + 4-item bean selector list with expandable descriptions

**Issues:**

| # | Issue | Rule |
|---|---|---|
| B-01 | Left card uses `glass-panel` + `rounded-3xl` + `shadow-2xl` — forbidden | Global Forbidden List |
| B-02 | Raw `<img>` for background image and bag image — must use `<Image />` | Image Rules |
| B-03 | Background image has heavy gradient overlay — cap at `rgba(26,18,8,0.30)` maximum | Image Rules |
| B-04 | Hotspot popups use inline glassmorphism (`bg-[#1c1511]/95 backdrop-blur-xl border`) | Global Forbidden List |
| B-05 | Hotspot trigger uses `onMouseEnter/Leave` only — no keyboard/touch accessibility | Accessibility |
| B-06 | Right selector rows use bordered card divs per item — spec: open typography, no borders | Card Rules |
| B-07 | Price in copper per row — copper overused as data color | Color System |
| B-08 | `group-hover:scale-102` on main image — scale animation forbidden | Motion System |
| B-09 | Score bar: `rounded-2xl bg-black/75 backdrop-blur-xl` — glassmorphism on layout | Global Forbidden List |
| B-10 | Section label uses pill badge — forbidden | Global Forbidden List |
| B-11 | "Chọn Loại Hạt Này" button per item — spec says text link only, no button per bean | UX Clarity |

---

### 3.7 · `StartupFilmstrip.tsx`

**State:** None  
**Context:** None  
**Refs:** `scrollContainerRef` (horizontal scroll)  
**Data:** `FILMSTRIP_STEPS` — 4 items inline (images reused from other sections)

**Structure:**
- Section header with left/right nav arrows
- Horizontal `overflow-x-auto snap-x` scroll container
- 4 cards: `300–360px` fixed width, fullbleed image, step number badge, icon, title, description

**Issues:**

| # | Issue | Rule |
|---|---|---|
| F-01 | Component to be renamed `ProcessTrack` | Component Naming |
| F-02 | Each card: `glass-panel` + `rounded-3xl` + `shadow-2xl` — 4 × 3 forbidden surfaces | Global Forbidden List |
| F-03 | Raw `<img>` on all 4 cards — must use `<Image />` | Image Rules |
| F-04 | Image URLs duplicated from CylindricalCarousel — `photo-1514432...`, `photo-1501339...`, `photo-1442512...`, `photo-1495474...` | Image Rules |
| F-05 | `opacity-45` on background images — max permitted is 15–20% for ambient, full-opacity for primary | Image Rules |
| F-06 | `group-hover:opacity-60 group-hover:scale-105` — scale animation forbidden | Motion System |
| F-07 | Section label uses pill badge — forbidden | Global Forbidden List |
| F-08 | Step number badge uses `rounded-full bg-black/65 border` — card-within-card surface | Card Rules |
| F-09 | No scroll/entry animation (`whileInView` absent entirely) | Motion System |

---

### 3.8 · `SLABadges.tsx`

**State:** None  
**Context:** None  
**Data:** `SLA_ITEMS` — 3 items inline (no images)

**Structure:**
- Section header (plain text label — partial compliance)
- 3-column grid of cards: icon + metric badge + title + subtitle + description + footer note

**Issues:**

| # | Issue | Rule |
|---|---|---|
| S-01 | Component to be renamed `CommitmentStatement` | Component Naming |
| S-02 | 3 × `glass-panel` + `rounded-3xl` + `shadow-2xl` cards — forbidden | Global Forbidden List |
| S-03 | Ambient glow blob per card (`radial-gradient` decorative) — forbidden | Layout Anti-Patterns |
| S-04 | `group-hover:scale-125` on glow blob — scale animation forbidden | Motion System |
| S-05 | Metric badge: `rounded-full bg-white/[0.04] border` — card-within-card | Card Rules |
| S-06 | Icon container: `rounded-2xl bg-white/[0.06] border` — card surface on every metric | Card Rules |
| S-07 | `ShieldCheck emerald` introduces 4th color — violates 3-color palette | Color System |
| S-08 | SLA data should be typography-led — no cards at all in redesign | Card Rules |

---

### 3.9 · `ProjectConfigurator.tsx`

**State:** `selectedModelId`, `capacity`, `budget` (3 local states)  
**Context:** `addToCart`, `setIsCartOpen`, `addToast`  
**Data:** `MODEL_OPTIONS` — 5 items inline  
**Computed:** `currentModel` + `dynamicRecommendation` (both `useMemo` — rule-based logic)

**Structure:**
- Left 6/12: Dropdown selector + 2 range sliders
- Right 6/12: Dynamic recommendation output (3 nested cards) + primary CTA

**Issues:**

| # | Issue | Rule |
|---|---|---|
| P-01 | Left card: `glass-panel` + `rounded-3xl` + `shadow-2xl` — forbidden | Global Forbidden List |
| P-02 | Right card: `glass-panel-glow` + `rounded-3xl` + `shadow-2xl` — forbidden | Global Forbidden List |
| P-03 | 3 nested cards inside right panel (`rounded-2xl bg-black/55 border`) — card-within-card | Card Rules |
| P-04 | `"Khuyến nghị AI"` label — explicitly forbidden | Global Forbidden List |
| P-05 | `handleRequestQuote` adds to cart AND opens cart — two side effects on single click | UX Logic |
| P-06 | `select` element uses arbitrary hex (`border border-[#c89b3c]/20`) — must use CSS variables | Global Forbidden List |
| P-07 | Section label uses pill badge — forbidden | Global Forbidden List |

---

### 3.10 · `SolutionsSection.tsx`

**State:** None  
**Context:** `addToCart`, `setIsCartOpen`, `addToast`  
**Data:** `PACKAGES` — 3 items inline

**Structure:**
- Centered section header with pill badge
- 3-column grid, middle card highlighted with `glass-panel-glow` + `scale-[1.02]`
- Each card: target label + name + description + price + feature list + CTA button

**Issues:**

| # | Issue | Rule |
|---|---|---|
| SO-01 | 3 × cards with `glass-panel` / `glass-panel-glow` + `rounded-3xl` — permitted only as typographic columns (no bg tint, no borders) | Card Rules |
| SO-02 | Featured card `scale-[1.02]` static scale — forbidden on content card | Motion System |
| SO-03 | Checkmark feature items use `rounded-full bg-[#c89b3c]/20 border` mini-badge — excess cards | Card Rules |
| SO-04 | Section label uses pill badge — forbidden | Global Forbidden List |
| SO-05 | `handleAddPackage` assigns same Unsplash URL for all 3 packages in cart | Image Rules |
| SO-06 | Arbitrary hex in JSX (`hover:border-[#c89b3c]/40`) | Global Forbidden List |

---

### 3.11 · `StoreFooter.tsx`

**State:** `email`, `subscribed`  
**Context:** `addToast`

**Structure:**
- 3-column grid: Brand info + newsletter form + social links
- Copyright bar with legal links

**Issues:**

| # | Issue | Rule |
|---|---|---|
| FT-01 | Component to be renamed `SiteFooter` | Component Naming |
| FT-02 | Logo icon uses gradient fill div — spec: SVG outline only | Navbar/Brand Spec |
| FT-03 | Wordmark `AURA COFFEE SOLUTIONS` all-caps font-bold — spec: Cormorant Garamond Light | Typography |
| FT-04 | Social links (`Instagram`, `LinkedIn`, `YouTube`) point to generic root domains — not wired | Content |
| FT-05 | Footer legal links all `href="#"` — not wired | Content |

---

### 3.12 · `AppContext.tsx`

**State managed:** Auth (`user`, modal open/mode), Cart (`cart[]`, drawer open), Toasts  
**Persistence:** `localStorage` for `user` and `cart` with hydration effect

**Issues:**

| # | Issue | Rule |
|---|---|---|
| AC-01 | `addToCart` calls `addToast` internally, then components also call `addToast` — duplicate toast per add-to-cart action | UX Logic |
| AC-02 | `DEMO_USERS` hardcoded in context file — should move to `src/data/` | Architecture |
| AC-03 | Toast auto-dismissal uses `setTimeout` inside `addToast` — stale closure risk on rapid adds | Engineering |

---

### 3.13 · `types/index.ts`

**Types defined:** `User`, `CartItem`, `EquipmentTier`, `CoffeeBean`, `PillarItem`, `SolutionPackage`, `ToastNotification`

**Issues:**

| # | Issue | Rule |
|---|---|---|
| T-01 | All data currently lives inline in component files — types exist but constants need extraction to `src/data/` | Implementation Prerequisites |
| T-02 | `CartItem.category` has unused `'service'` variant — no current component uses it | Engineering |

---

## 4. GLOBAL VIOLATION SUMMARY

### 4.1 · Violation Count by Category

| Category | Count | Severity |
|---|---|---|
| `glass-panel` on in-page elements | ~18 instances | 🔴 Critical |
| Raw `<img>` instead of `<Image />` | ~14 instances | 🔴 Critical |
| `rounded-3xl` on content sections | ~16 instances | 🔴 Critical |
| Section header pill badges | 6 sections | 🔴 Critical |
| `setInterval`/continuous animation | 1 (CylindricalCarousel) | 🔴 Critical |
| Gradient text on headings | 1 (Hero H1) | 🔴 Critical |
| Missing Cormorant Garamond + DM Sans | 1 (global) | 🔴 Critical |
| Centered hero layout | 1 | 🔴 Critical |
| Scale animation on cards/images | ~9 instances | 🟠 High |
| Duplicate image URLs across sections | 4+ URLs reused | 🟠 High |
| Lenis not initialized | 1 | 🟠 High |
| Decorative radial glow blobs | 6 sections | 🟡 Medium |
| Arbitrary hex values in JSX | 50+ instances | 🟡 Medium |
| "Khuyến nghị AI" label | 1 | 🟡 Medium |
| `animate-pulse` outside footer | 1 (Navbar badge) | 🟡 Medium |

---

### 4.2 · Card Surface Count

Design Direction target: **≤ 8 bordered surfaces total** across the entire page.

| Section | Bordered Card Surfaces |
|---|---|
| Hero | 4 (trust badge cards) |
| CylindricalCarousel | 6 (pillar cards) |
| EquipmentConfigurator | 1 (machine vis) + 1 (spec table) + 4 (feature chips) = **6** |
| BeansSelection | 1 (left showcase) + 4 (bean rows) + 1 (score bar) = **6** |
| StartupFilmstrip | 4 (step cards) |
| SLABadges | 3 (SLA cards) + 3×2 (icon+metric chips) = **9** |
| ProjectConfigurator | 1 + 1 + 3 (nested) = **5** |
| SolutionsSection | 3 (package columns) |
| **TOTAL** | **≈ 41 surfaces** |

**Target: ≤ 8 → Reduction needed: ~33 surfaces (~80% elimination)**

---

### 4.3 · CTA Count Audit

Design Direction target: 1 clear primary CTA per section.

| Section | Current CTAs | Target |
|---|---|---|
| Navbar | 3 (Hotline, Login, Tư Vấn) | 1 |
| Hero | 2 buttons | 1 ghost button |
| CylindricalCarousel | 0 ✓ | 0 |
| EquipmentConfigurator | 2 buttons | 1 primary + 1 text link |
| BeansSelection | 5 (1 per bean + 1 overlay) | 1 text link per bean |
| SLABadges | 0 ✓ | 0 |
| ProjectConfigurator | 1 ✓ | 1 |
| SolutionsSection | 3 (one per card) | 1 copper + 2 text links |
| StoreFooter | 1 ✓ | 1 |

---

## 5. COMPONENT RENAME MAP

| Current Name | New Name | Structural Change |
|---|---|---|
| `CylindricalCarousel` | `SixPillars` | Replace rotating ring → editorial list |
| `SLABadges` | `CommitmentStatement` | Replace 3-card grid → typography-led |
| `StartupFilmstrip` | `ProcessTrack` | Horizontal scroll kept, remove glass cards |
| `StoreFooter` | `SiteFooter` | Rename only |
| `CartDrawer` | `QuoteDrawer` | Header relabeled; open typography item list |
| *(new)* | `PhilosophySection` | New quiet beat — Hero → SixPillars |
| *(new)* | `ContactSection` | Dark close section with single CTA |

---

## 6. DATA EXTRACTION PLAN

All inline data constants should move to `src/data/`:

```
src/data/
├── pillars.ts          ← from CylindricalCarousel
├── equipmentTiers.ts   ← from EquipmentConfigurator
├── coffeeBeans.ts      ← from BeansSelection
├── processSteps.ts     ← from StartupFilmstrip
├── slaItems.ts         ← from SLABadges
├── modelOptions.ts     ← from ProjectConfigurator
├── packages.ts         ← from SolutionsSection
└── demoUsers.ts        ← from AppContext
```

---

## 7. IMPLEMENTATION PREREQUISITES (Ordered)

These must be completed **before any section component is modified:**

```
1. globals.css      — Full token set: colors, typography scale, spacing
2. layout.tsx       — Google Fonts import, Lenis init, remove dot-grid
3. src/data/        — Extract all inline data constants
4. src/components/ui/
   ├── Button.tsx
   ├── Badge.tsx        (category label — no border, no bg)
   ├── SectionLabel.tsx (replaces pill badge pattern)
   ├── Hairline.tsx     (section divider)
   ├── Input.tsx
   └── Select.tsx
5. types/index.ts   — Update if needed after data extraction
```

---

## 8. SECTION IMPLEMENTATION ORDER

| Priority | Section | Rhythm | Complexity |
|---|---|---|---|
| 1 | `globals.css` + `layout.tsx` | — | Foundation |
| 2 | `PhilosophySection` (new) | QUIET | Low |
| 3 | `Hero` | LOUD | High (video, layout restructure) |
| 4 | `SixPillars` | LOUD | Medium |
| 5 | `EquipmentConfigurator` | LOUD | Medium |
| 6 | `BeansSelection` | QUIET | Medium |
| 7 | `ProcessTrack` | LOUD | Low |
| 8 | `CommitmentStatement` | QUIET | Low |
| 9 | `ProjectConfigurator` | MEDIUM | Medium |
| 10 | `SolutionsSection` | MEDIUM | Low |
| 11 | `ContactSection` (new) | CLOSE | Medium |
| 12 | `SiteFooter` | BASE | Low |
| 13 | `Navbar` | — | Medium |
| 14 | `QuoteDrawer` | — | Medium |

---

*This document cross-references every component in the current codebase against `AURA-DESIGN-DIRECTION.md`.  
No implementation should begin on any section before its prerequisite checklist items are completed.*
