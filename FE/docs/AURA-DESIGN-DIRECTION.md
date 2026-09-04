# AURA DESIGN DIRECTION
**Project:** Aura Coffee Solutions — Homepage Redesign  
**Version:** 1.0  
**Status:** Approved Art Direction  
**Source:** Grill-me interview session + codebase audit — 25/08/2026  
**Referenced by:** `HOMEPAGE-COMPOSITION.md`, `HOMEPAGE-ARCHITECTURE-AUDIT.md`

---

## THE BRIEF

> Aura Coffee là một B2B coffee solutions provider.  
> Homepage phải cảm giác như bước vào một **atelier rang cà phê Nhật Bản** —  
> không phải một vendor, không phải một dashboard.  
>  
> Khách hàng B2B phải **khao khát** trước khi họ **mua**.

**Reference universe:** Fuglen Tokyo · Middle State Coffee · Standart Magazine

---

## BRAND POSITIONING

| Dimension | Direction |
|---|---|
| **Business model** | B2B — giữ nguyên. Bán cho chủ quán, chuỗi F&B, khách sạn |
| **Aesthetic model** | B2C luxury — cảm giác brand lifestyle cao cấp cho khách B2B |
| **Brand archetype** | *The Artisan Alchemist* — người biến kỹ thuật thành nghệ thuật |
| **Brand voice** | Thầm lặng. Tự tin. Không cần chứng minh. Nói ít, gợi nhiều |
| **Shift from → to** | Vendor trình bày spec → Atelier kể câu chuyện |

---

## 3 GOLDEN RULES

Mọi quyết định design phải pass qua 3 rules này. Nếu vi phạm bất kỳ rule nào — revise trước khi code.

---

### Rule 1 — Less Color, More Air
> Màu sắc là điểm nhấn, không phải nền.  
> **80% cream · 15% espresso ink · 5% copper.**  
> Copper xuất hiện ≤ 3 điểm mỗi section: logo, primary CTA, một highlight duy nhất.

### Rule 2 — One Section, One Emotion
> Mỗi section phải gợi lên đúng **một** cảm xúc.  
> Nếu không thể hoàn thiện câu: _"Section này khiến visitor cảm thấy ___"_ — section đó cần redesign.

### Rule 3 — Spec Speaks Last
> **Cảm xúc → Câu chuyện → Thông số kỹ thuật.**  
> Không bao giờ đặt spec, số liệu kỹ thuật, hay giá trước narrative.

---

## COLOR SYSTEM

**Chuyển hoàn toàn từ dark-on-light sang light-on-dark.**  
Cream/ivory là nền chính — đây là thay đổi lớn nhất, chi phối toàn bộ aesthetic.

```css
/* ── Grounds ── */
--cream-base:      #F5EFE6;   /* Primary background — warm ivory */
--cream-deep:      #EDE4D7;   /* Surface 01 — aged paper */
--cream-shadow:    #D9CCBB;   /* Surface 02 — hairlines, dividers */

/* ── Ink ── */
--espresso-ink:    #1A1208;   /* Primary text — maximum contrast */
--espresso-mid:    #3D2B1F;   /* Secondary text, subheadings */
--espresso-light:  #6B4C3B;   /* Tertiary — captions, metadata, labels */

/* ── Accent ── */
--copper-accent:   #A0622A;   /* Brand accent — use sparingly */
--copper-light:    #C8884A;   /* Hover state for copper elements */
--copper-glow:     #E8B070;   /* Highlight moments, active states */

/* ── Dark Contrast (overlays & close section only) ── */
--espresso-dark:   #1A1208;   /* Contact section BG + CartDrawer BG */
```

**Color discipline:**
- Copper never appears as a border colour on section backgrounds
- No glassmorphism (`backdrop-filter: blur`) on in-page layout elements — only on floating overlays (modal, drawer, toast)
- No gradient on text (current Hero H1 used `bg-gradient-to-r from-white via-[#f5e4c8] to-[#c89b3c]` — forbidden)
- No Tailwind arbitrary hex colour classes in JSX — all values via CSS variables

---

## TYPOGRAPHY SYSTEM

**Serif for poetry and authority. Sans for data and utility.**

### Fonts

| Role | Family | Source |
|---|---|---|
| **Display / Headline** | Cormorant Garamond | Google Fonts |
| **Body / UI / Data** | DM Sans | Google Fonts |

### Type Scale

```css
/* ── Display ── */
--text-display:  clamp(72px, 10vw, 160px);   /* Hero opener, chapter titles */
--text-hero:     clamp(48px, 7vw, 96px);     /* Section hero headline */
--text-section:  clamp(32px, 4vw, 56px);     /* Section h2 */
--text-pull:     clamp(22px, 2.5vw, 36px);   /* Pull-quote, Philosophy text */
--text-card:     clamp(18px, 2vw, 24px);     /* Card / panel title */

/* ── Body ── */
--text-body:     16px;   /* line-height: 1.75 */
--text-data:     14px;   /* line-height: 1.6 — specs, table rows */
--text-caption:  13px;   /* line-height: 1.6 — metadata, credits */
--text-label:    11px;   /* uppercase, tracking: 0.12em — category labels */
```

### Usage Rules

| Context | Font | Weight | Style |
|---|---|---|---|
| Page title, chapter opener | Cormorant Garamond | 300–400 | Italic |
| Section H2 | Cormorant Garamond | 400 | Regular |
| Pull-quote, tagline | Cormorant Garamond | 300 | Italic |
| Navigation, buttons, labels | DM Sans | 400–500 | Regular |
| Spec tables, data, meta | DM Sans | 400 | Regular |
| Price display | Cormorant Garamond | 400 | Regular (neutral — not copper) |

**Forbidden:**
- System font stack on any branded element
- All-caps headings (labels only — 11px max)
- `font-bold` (700+) on Cormorant Garamond — too heavy for editorial feel
- `tracking-tight` on serif headlines — serif has its own natural spacing

---

## LAYOUT SYSTEM

### Grid & Spacing

```css
--space-unit:    8px;
--section-y:     clamp(80px, 10vh, 140px);   /* Section top/bottom padding */
--container-max: 1280px;
--container-x:   clamp(24px, 5vw, 80px);     /* Side padding */
```

### Column Ratios

Break the 50/50 grid monotony. Use asymmetric splits:

| Section | Desktop Split | Rationale |
|---|---|---|
| Equipment | 60 / 40 | Image dominant |
| Beans Origin | 65 / 35 | Image + data |
| Project Builder | 50 / 50 | Tool — balanced |
| Six Pillars | 40 / 60 | Label left, list right |
| Solutions | 33 / 33 / 33 | 3-column editorial |

### Layout Anti-Patterns (Forbidden)

- `max-w-7xl mx-auto` as the only container pattern — vary widths per section
- Symmetric centered layout on every section
- `glass-panel` class applied to any in-page content section
- Card borders on list items, spec rows, or process steps
- `rounded-3xl` on any non-overlay element
- Gradient orb backgrounds (`radial-gradient` for decorative glow blobs)
- Dot-grid overlay on `layout.tsx` body background

---

## CARD RULES

**Current state: ~32 bordered glass surfaces. Target: ≤ 8 across the entire page.**

Cards (bordered surfaces with background tint) are **permitted only for:**
- Solution package columns (3 max, typographic columns — not boxes)
- CartDrawer item list entries
- AuthModal form container

Cards are **forbidden for:**
- Section wrappers
- Spec tables and data rows
- Trust / SLA metrics
- Process steps
- Pillar list items
- Bean selector rows
- Any element that already has clear visual separation via whitespace or hairlines

---

## IMAGE RULES

**Images are compositions, not decoration. Every image must carry narrative weight.**

| Rule | Requirement |
|---|---|
| **Format** | Next.js `<Image />` — no raw `<img>` tags |
| **Sizing** | Explicit `width` / `height` or `fill` with aspect-ratio container — prevents CLS |
| **Overlay** | Maximum `rgba(26,18,8,0.30)` dark tint. No full-section gradients. |
| **Opacity** | Full-opacity for primary images. Ambient backgrounds max 15–20% opacity. |
| **Uniqueness** | No duplicate image URLs across sections |
| **Role** | Each image communicates one specific thing: machine quality, origin terrain, process moment |

**Forbidden:**
- `via-[#120d0a]/65` style heavy gradient occlusion
- Same Unsplash URL used across 3+ sections
- Images used purely as background texture behind text grids
- `opacity-45` on background images inside cards

---

## MOTION SYSTEM

**Motion serves storytelling. If removing it doesn't hurt comprehension — remove it.**

### The 4 Permitted Animation Types

```
1. TEXT REVEAL      Words appear with subtle fade + slight translate-Y
                    duration: 0.8s · stagger: 0.04s/word · trigger: whileInView

2. SECTION ENTRY    Fade up from y:40px to y:0
                    duration: 0.9s · ease: cubic-bezier(0.16, 1, 0.3, 1)
                    trigger: whileInView, threshold: 0.15

3. IMAGE TRANSITION  Opacity crossfade between states (e.g. equipment tier change)
                    duration: 0.4s · ease: ease-out
                    NO scale · NO slide

4. HOVER COPPER     Color transition to copper on interactive elements
                    duration: 0.25s · ease: ease
```

### Scroll Infrastructure

- **Lenis** must be initialized in `layout.tsx` as the scroll driver
- Framer Motion `whileInView` for all section entry animations
- No `setInterval` or RAF loops for continuous background animation

### Forbidden Motion

- `scale` animation on any content card or section element
- Spring / bounce easing
- Auto-rotating carousels (eliminates CylindricalCarousel pattern)
- `animate-pulse` except on the single live status dot indicator (footer only)
- Mount-triggered animations below the fold (must be `whileInView`)
- Simultaneous animations of more than 3 elements in one viewport

---

## SECTION RHYTHM

**Pattern: LOUD → QUIET → LOUD → QUIET → CLOSE**

```
LOUD  = high visual density, strong imagery, active content
QUIET = minimal elements, generous whitespace, typography-led
CLOSE = dark tonal shift, single intent, emotional resolution
```

| # | Section | Rhythm | Primary Emotion |
|---|---|---|---|
| 00 | Navbar | — | Invisible until needed |
| 01 | Hero | LOUD | Desire / wonder |
| 02 | Philosophy | QUIET | Trust / introspection |
| 03 | Six Pillars | LOUD | Breadth / confidence |
| 04 | Equipment | LOUD | Craftsmanship / precision |
| 05 | Beans & Origin | QUIET | Terroir / provenance |
| 06 | Process | LOUD | Clarity / momentum |
| 07 | Commitment | QUIET | Reliability / calm |
| 08 | Project Builder | MEDIUM | Agency / participation |
| 09 | Solutions | MEDIUM | Decision / clarity |
| 10 | Contact / CTA | CLOSE | Readiness / invitation |
| 11 | Footer | BASE | Closure / utility |

---

## HERO SPECIFICATION

**Concept: "The First Sip"**

- Full-bleed ambient video: slow-motion espresso extraction, cream swirl, steam rising
- Text overlay: **left-aligned**, bottom-anchored — not centered
- Overlay darkness: maximum `rgba(26,18,8,0.35)`

| Element | Spec |
|---|---|
| Label | `AURA COFFEE SOLUTIONS` — DM Sans 11px uppercase tracking-wide, cream 70% |
| H1 | `Nghệ thuật cà phê.` — Cormorant Garamond 300 Italic, ~80–96px, white |
| Sub | One sentence, max 56 chars — DM Sans 16px, white 70% |
| CTA | Single ghost button — 1px cream border, DM Sans 14px |

**Forbidden in Hero:**
- Pill / badge tagline
- 4 trust icons grid
- Second CTA button
- Gradient text on H1
- Centered layout
- Any card container
- Ambient glow blob

---

## NAVBAR SPECIFICATION

- Transparent at `scrollY === 0`
- Cream `#F5EFE6` at 96% opacity when `scrollY > 40px`
- Transition: `200ms ease` — CSS only, no JS animation
- No `backdrop-filter: blur`

| Element | Spec |
|---|---|
| Logo icon | Coffee bean outline — SVG, copper solid `#A0622A`, 1.5px stroke, no fill |
| Wordmark | `Aura Coffee` — Cormorant Garamond Light, not all-caps |
| Nav links | 4 links — DM Sans 13px `--espresso-mid` → `--espresso-ink` on hover |
| CTA | `Nhận Báo Giá` — copper fill, DM Sans 13px 500, single button |

**Removed from Navbar:**
- Hotline phone number
- `backdrop-filter: blur` glass effect
- Multiple CTAs (login button hidden behind account icon)
- Gradient logo background

---

## CART / QUOTE DRAWER SPECIFICATION

- Slide-in from right, full viewport height
- Background: `--espresso-dark` (`#1A1208`) — deliberate dark contrast vs cream page
- Header: `Hồ Sơ Dự Án` (not "Giỏ Hàng")
- CTA label: `Nhận Báo Giá` (not "Checkout")
- Item list: Open typography — no card borders, no rounded containers per item
- Form fields: DM Sans 14px, cream-tinted backgrounds, copper focus ring
- No `rounded-2xl` card around form section

---

## UX CLARITY RULES

**Current homepage has 6+ competing primary CTAs. Target: 1 clear primary per section.**

| Section | Permitted CTAs | Primary |
|---|---|---|
| Navbar | 1 | `Nhận Báo Giá` |
| Hero | 1 | `Khám Phá Giải Pháp →` |
| Philosophy | 0 | — |
| Six Pillars | 0 | — |
| Equipment | 2 | `Thêm vào Hồ Sơ` (primary) + `Đặt Lịch Demo` (text link) |
| Beans | 1 per item | Text link only — no button |
| Process | 0 | — |
| Commitment | 0 | — |
| Project Builder | 1 | `Nhận Báo Giá & Bản Vẽ Bar` |
| Solutions | 1 per column | Text link (non-featured) + copper button (featured) |
| Contact | 1 | `Liên Hệ Tư Vấn Ngay` |
| Footer | 1 | Newsletter submit arrow |

---

## WHAT IS FORBIDDEN GLOBALLY

The following patterns are banned across the entire redesign. No exceptions.

```
✗ glass-panel class on any in-page layout element
✗ backdrop-filter: blur on non-floating elements
✗ rounded-3xl on content sections
✗ box-shadow on any in-page card
✗ Arbitrary hex values in JSX (use CSS variables only)
✗ Multiple competing primary CTA buttons per section
✗ Gold/copper used as border colour on section backgrounds
✗ setInterval-based rotation or animation loops
✗ Framer Motion spring / bounce easing
✗ Scale animations on static content
✗ Gradient text on headings
✗ All-caps headings above 11px
✗ Section header pill badge (category label replaces it — no border, no background)
✗ animate-pulse except live status dot in footer
✗ More than 4 typography sizes active in one section
✗ Raw <img> tags (use Next.js <Image /> always)
✗ Duplicate image URLs across sections
✗ Trust badge / icon grids
✗ "Khuyến nghị AI" labels (misleading — rule-based logic only)
```

---

## COMPONENT NAMING CONVENTIONS

When new components are created during implementation, use these names:

| Old Name | New Name | Reason |
|---|---|---|
| `CylindricalCarousel` | `SixPillars` | Carousel replaced by editorial list |
| `SLABadges` | `CommitmentStatement` | Cards replaced by typography |
| `StartupFilmstrip` | `ProcessTrack` | "Filmstrip" implies legacy card pattern |
| `StoreFooter` | `SiteFooter` | "Store" implies e-commerce |
| `CartDrawer` | `QuoteDrawer` | Aligns with B2B quote flow |
| *(new)* | `PhilosophySection` | Empty beat between Hero and Pillars |
| *(new)* | `ContactSection` | Dark close section with single CTA |

---

## IMPLEMENTATION PREREQUISITES

Before any component is touched, these must be completed:

1. **`globals.css`** — full token set (colors, typography, spacing) as specified above
2. **`layout.tsx`** — Lenis initialization, Google Fonts import (Cormorant Garamond + DM Sans), remove dot-grid overlay
3. **`src/components/ui/`** — atomic primitives: `Button`, `Badge`, `SectionLabel`, `Hairline`, `Input`, `Select`
4. **`src/data/`** — extracted data constants from all component files

---

*This document is the single source of truth for all design decisions on the Aura Coffee homepage redesign.  
Any deviation from this direction requires explicit revision to this document before implementation.*
