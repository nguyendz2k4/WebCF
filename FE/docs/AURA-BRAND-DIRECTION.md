# AURA BRAND DIRECTION
**Brand Expression & Visual Identity Manual for Aura Coffee Solutions**  
**Document Code:** `AURA-BRAND-DIRECTION`  
**Version:** 1.0 — Approved Brand Direction  
**Companion Documents:** `AURA-DESIGN-DIRECTION.md`, `HOMEPAGE-COMPOSITION.md`, `HOMEPAGE-AUDIT.md`  

---

## 1. EXECUTIVE BRAND ESSENCE

### 1.1 The Atelier Ethos
Aura Coffee Solutions is not a commodity vendor, nor is it a sterile SaaS platform. Aura is an **atelier of coffee mastery**—situated at the intersection of Japanese craftsmanship (*monozukuri*), Nordic roasting precision, and the rich terroir of Vietnam's Central Highlands.

```
       [ FUGLEN TOKYO ]             [ STANDART MAGAZINE ]          [ MIDDLE STATE COFFEE ]
    Timeless cafe lifestyle        Sensory editorial depth          Roasting craft & terroir
               \                              |                              /
                \                             |                             /
                 ▼                            ▼                            ▼
               ┌─────────────────────────────────────────────────────────────┐
               │                    AURA COFFEE ATELIER                      │
               │   "Where technical precision transforms into sensory desire"  │
               └─────────────────────────────────────────────────────────────┘
```

### 1.2 The Core Transformation
The homepage redesign represents a fundamental repositioning of how B2B clients experience Aura:

| Dimension | Legacy Vendor / SaaS Aesthetic | Aura Editorial Atelier Expression |
|---|---|---|
| **Primary Interaction** | Transactional spec-browsing, pricing grids | Curated sensory journey, narrative desire |
| **First Impression** | Dark dashboard, glowing neon, feature bullet cards | Tactile warm cream ground, timeless editorial serif, spacious air |
| **Emotional Anchor** | "Look at our catalog and machine specs" | "Step into our roasting atelier and taste the harvest" |
| **B2B Relationship** | Buyer vs. Vendor (discount-driven) | Roaster & Architect partner to Restaurateur / Hotelier |
| **Tone of Voice** | Promotional, feature-dense, tech-jargon | Quiet, authoritative, poetic, deeply respectful |
| **Visual Pace** | Cluttered cards, competing CTAs, visual noise | Editorial rhythm: Loud $\rightarrow$ Quiet $\rightarrow$ Loud $\rightarrow$ Close |

---

## 2. SIGNATURE COLOR SYSTEM

### 2.1 The 80 / 15 / 5 Rule
Aura's visual atmosphere is defined by deliberate restraint. Color is never decorative background noise; it is atmospheric ground, ink, and rare metallic resonance.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│                               80% WARM CREAM GROUND                                      │
│                           (#F5EFE6 / #EDE4D7 / #D9CCBB)                                  │
│             Atmosphere of unbleached washi paper, natural light, steamed milk            │
│                                                                                          │
├────────────────────────────────────────┬─────────────────────────────────────────────────┤
│          15% ESPRESSO INK              │               5% RAW COPPER ACCENT              │
│       (#1A1208 / #3D2B1F / #6B4C3B)    │           (#A0622A / #C8884A / #E8B070)         │
│  Typography, hairlines, dark contrast  │    Rare focal point, primary CTA, brass mark    │
└────────────────────────────────────────┴─────────────────────────────────────────────────┘
```

### 2.2 Palette Specifications & Sensory Psychology

```css
/* ==========================================================================
   AURA SIGNATURE COLOR TOKENS
   ========================================================================== */

:root {
  /* --- Grounds (80%): Tactile, warm, inviting --- */
  --cream-base:       #F5EFE6; /* Primary canvas — tone of warm ivory porcelain */
  --cream-deep:       #EDE4D7; /* Surface 01 — aged parchment, alternate section ground */
  --cream-shadow:     #D9CCBB; /* Surface 02 — architectural hairlines, structural dividers */

  /* --- Inks (15%): Rich roast depth, botanical tannin --- */
  --espresso-ink:     #1A1208; /* Highest contrast text — darkest roast bean, sumi ink */
  --espresso-mid:     #3D2B1F; /* Subheadings & narrative body — steeped espresso */
  --espresso-light:   #6B4C3B; /* Metadata, captions, technical labels — light crema */

  /* --- Accents (5%): Metallic warmth, artisanal precision --- */
  --copper-accent:    #A0622A; /* Primary brand accent — hand-hammered copper kettle */
  --copper-light:     #C8884A; /* Interactive hover — warm flame on copper drum */
  --copper-glow:      #E8B070; /* Active state, delicate focus highlight — morning ray */

  /* --- Nocturne Close: Dedicated dark emotional anchor --- */
  --espresso-dark:    #1A1208; /* Contact closing section & Quote Drawer ground */
}
```

### 2.3 Color Usage Discipline & Anti-Patterns
To preserve the atelier aesthetic, strict color boundaries must be enforced:

* **DO:**
  * Use `--cream-base` as the universal background for light sections.
  * Use `--copper-accent` at a maximum of **3 touchpoints per viewport** (e.g., brand mark, active step, primary CTA).
  * Use `--cream-shadow` at 1px thickness for structural separation instead of drop shadows or card containers.
  * Transition to `--espresso-dark` only at the final Contact close and inside the interactive `QuoteDrawer`.
* **DON'T (Strictly Forbidden):**
  * ❌ **No gradient text** (`bg-gradient-to-r`, gold metallic text fades, or rainbow transitions).
  * ❌ **No neon or high-chroma primaries** (pure blues, vivid greens, corporate purples).
  * ❌ **No glowing radial blobs** (`radial-gradient` glow overlays behind cards or text).
  * ❌ **No full copper button groups** (never place two copper buttons next to each other).
  * ❌ **No copper border wrapping section containers** (copper is an accent, not a boundary wire).

---

## 3. TYPOGRAPHY PERSONALITY & HIERARCHY

### 3.1 Dual-Type Archetype

```
        CORMORANT GARAMOND                         DM SANS
     [ The Poetic Connoisseur ]             [ The Master Engineer ]
     • Display & Chapter Openers            • Operational Data & Specs
     • Editorial Serenity & Heritage        • Ergonomic UI & Navigation
     • Rhythmic Italic Flow                 • Clean Geometric Precision
```

### 3.2 Detailed Type Scale & Formatting Rules

| Role | Font Family | Weight / Style | Size Range | Line Height | Tracking | Application |
|---|---|---|---|---|---|---|
| **Display Hero** | Cormorant Garamond | 300 Italic | `clamp(72px, 10vw, 160px)` | 0.95 | `-0.02em` | Homepage opener, full-bleed chapter titles |
| **Headline H1/H2**| Cormorant Garamond | 400 Regular | `clamp(32px, 4.5vw, 64px)` | 1.15 | `-0.01em` | Section headlines, philosophy statements |
| **Editorial Pull** | Cormorant Garamond | 300 Italic | `clamp(22px, 2.5vw, 36px)` | 1.40 | `0` | Tasting notes, quotes, atelier manifestos |
| **Category Label**| DM Sans | 500 Medium | `11px` | 1.20 | `+0.14em` | Uppercase category identifiers, chapter indices |
| **Section Intro** | DM Sans | 400 Regular | `18px – 20px` | 1.65 | `0` | Lead paragraphs under section headlines |
| **Body Text**     | DM Sans | 400 Regular | `16px` | 1.75 | `+0.01em` | Narrative copy, process explanations |
| **Spec & Table**  | DM Sans | 400 Regular | `13px – 14px` | 1.50 | `+0.02em` | Equipment technical specs, origin elevations |
| **CTA Label**     | DM Sans | 500 Medium | `13px – 14px` | 1.00 | `+0.06em` | Action buttons, drawer triggers |

### 3.3 Editorial Typesetting Standards
1. **Never use Bold (700+) on Serif:** Cormorant Garamond is refined; heavy weights destroy its delicate stroke modulation. Use 300 (Light) or 400 (Regular).
2. **Strict Limit on Typography Scales:** No individual section may employ more than **3 active typography sizes** simultaneously.
3. **Bilingual Diacritics Care:** Vietnamese tone marks must render cleanly without clipping. Line-heights for Vietnamese Cormorant Garamond headlines must maintain a minimum of `1.15` to ensure accents (*dấu hỏi, ngã, nặng, sắc*) breathe naturally.
4. **Metadata Styling:** All technical markers (e.g., `01 / 06`, `ELEVATION 1,650M`, `SLOPE 18°`) must be set in DM Sans 11px uppercase with generous tracking (`0.12em–0.16em`).

---

## 4. IMAGERY DIRECTION & ART DIRECTION

### 4.1 Images as Compositions, Not Fillers
Images in the Aura universe are visual essays. Every photograph must capture an authentic moment of cultivation, roasting physics, extraction chemistry, or architectural hospitality.

```
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│       01. TERROIR       │      02. MACHINERY      │      03. EXTRACTION     │
│   Soil, Altitude, Crop  │  Machining, Steel, Heat │  Crema, Pour, Resonance │
├─────────────────────────┼─────────────────────────┼─────────────────────────┤
│ • Misty highland hills  │ • Hand-assembled boilers│ • Syrupy, viscous drop  │
│ • Shade-grown cherries  │ • Matte stainless steel │ • Dense microfoam swirl │
│ • Raised bamboo drying  │ • Precision pressure bar│ • Tactile matte ceramic │
│ • Red basaltic earth    │ • Machined portafilters │ • Steam rising gently   │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

### 4.2 Lighting, Grading & Texture Profile
* **Lighting:** Natural directional daylight (window light, early morning mountain fog, late afternoon warm raking sunlight). Avoid harsh ring-lights, clinical flash, or synthetic neon.
* **Color Grade:**
  * **Highlights:** Soft cream/ivory tint (no blown-out clinical 255/255/255 white).
  * **Shadows:** Warm espresso/brown undertone (never pure crushed digital black `#000000`).
  * **Saturation:** 85–90% natural saturation; muted earth tones with rich, authentic bean hues.
  * **Texture:** Organic fine film grain (Kodak Portra / Fuji Pro feel), capturing the tactile matte finish of roasted beans and brushed metals.
* **Image Treatment Anti-Patterns:**
  * ❌ No stock models wearing generic corporate suits pointing at clipboards.
  * ❌ No heavy dark gradient overlays (`via-black/80`) covering 70% of the image.
  * ❌ No synthetic 3D floating coffee beans with motion blur trails.
  * ❌ No AI-hallucinated surrealist coffee cups with floating islands.

### 4.3 Ambient Video Guidelines (Hero & Transitions)
* **Frame Rate:** Shot at 60fps/120fps, played at 0.5x–0.75x real-time speed.
* **Subject Matter:** Continuous, unhurried single-shot extraction: espresso dripping into a textured ceramic cup, steam parting in silence, roast beans cascading through a copper cooling tray.
* **Overlay:** Ambient dark scrim capped at `rgba(26, 18, 8, 0.30)`—just enough to ensure 100% WCAG AAA readability for white/cream typography while preserving cinematic beauty.

---

## 5. VISUAL MOTIFS & EDITORIAL ELEMENTS

```
  0.5px HAIRLINE           CHAPTER MARKER          ARCHITECTURAL GRID       SINGLE-LINE MARK
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│                  │    │   CHAPTER 02     │    │ 65%      │ 35%   │    │      ╭───╮       │
│──────────────────│    │   PROVENANCE     │    │ Photo    │ Data  │    │     │  ( )│      │
│                  │    │                  │    │ Essay    │ Ledger│    │      ╰───╯       │
└──────────────────┘    └──────────────────┘    └──────────────────┘    └──────────────────┘
  Subtle structural       Editorial cadence       Asymmetric dynamic      Delicate copper
   cream hairlines         numbering system        editorial layout         botanical bean
```

### 5.1 The 4 Signature Visual Motifs
1. **The Architectural Hairline (`--cream-shadow`):**
   Continuous 0.5px to 1px dividers spanning between columns and sections. Replaces bulky box shadows and cards, giving the page the structure of an architectural blueprint or fine-print broadsheet.
2. **The Chapter Index & Coordinate Badges:**
   Editorial index stamps (`01 / 06`, `CHAPTER III · EXTRACTION`, `LAT 11°56' N · ALT 1,650M`). These anchor the scientific credibility of the coffee craft.
3. **The Minimalist Bean Monogram:**
   A single-stroke SVG mark (1.5px stroke, `--copper-accent`, no fill). A clean botanical silhouette that represents the seed at the heart of the business.
4. **Asymmetric Editorial Spans (65/35 & 60/40):**
   Moving away from generic 50/50 split screens. One side acts as the full-bleed photographic hero; the other functions as a precise typographic ledger.

---

## 6. PREMIUM CUES VS. FALSE LUXURY

True luxury in digital design is an exercise in restraint and quiet confidence. False luxury relies on excessive visual tricks to disguise a lack of identity.

```
                           THE LUXURY SPECTRUM
                           
    FALSE LUXURY (SaaS / E-com)              TRUE EDITORIAL LUXURY (Aura)
 ┌────────────────────────────────┐       ┌────────────────────────────────┐
 │ • Neon gradients & gold foil   │       │ • Tactile cream & rich ink     │
 │ • Glassmorphic blur boxes      │  VS   │ • Generous empty space ("Ma")  │
 │ • 32 floating card containers  │       │ • Editorial serif typography   │
 │ • Urgent popups & discount tags│       │ • Restrained single-action CTA │
 │ • "AI Powered" marketing fluff │       │ • Honest technical specs & SLA │
 └────────────────────────────────┘       └────────────────────────────────┘
```

### 6.1 Contrast Matrix

| Element | False Luxury (Avoid at all costs) | True Editorial Luxury (Aura Standard) |
|---|---|---|
| **Containers** | Rounded frosted glass cards (`backdrop-filter: blur(12px)`) with glowing borders | Open typographic layouts bounded by 1px hairlines and generous whitespace |
| **Buttons** | Pulsing gold gradient buttons with drop shadows and shimmer effects | Solid warm copper button (`#A0622A`) or 1px hairline ghost button; crisp 200ms ease transition |
| **Trust Metrics** | Cluttered 4-icon badge grid with generic star icons and "100% Satisfaction Guarantee" | Single editorial typography commitment: *"99.4% Uptime SLA · 4-Hour Field Response Across 63 Provinces"* |
| **Badges & Pills** | Rounded pill badges with glowing borders (`border-amber-500/40 bg-amber-500/10`) | Minimalist uppercase text label with subtle bullet separator: `SOLUTION 01 · SPECIALTY ESPRESSO` |
| **E-Commerce Cart** | Floating cart icon with pulsating red count badge and "Buy Now" flash banners | Slide-out project ledger: `Hồ Sơ Dự Án` (Project Dossier) with customized equipment configuration |

---

## 7. EDITORIAL TONE OF VOICE & MESSAGING FRAMEWORK

### 7.1 Voice Dimensions
* **Quiet Authority:** We do not shout, use exclamation marks, or deploy hyperbole ("Cách mạng cà phê số 1"). We speak with the calm assurance of a master roaster who knows the quality of the cup speaks for itself.
* **Sensory Precision:** We combine poetic sensory language (*"hương hoa cam, vị ngọt mật ong rừng"*) with rigorous agronomic and mechanical metrics (*"chiết xuất ở 9.2 bar, nhiệt độ ổn định ±0.2°C"*).
* **Respectful Partnership:** We speak to B2B clients as fellow artisans, entrepreneurs, and visionaries, not leads to be funneled.

### 7.2 The "Spec Speaks Last" Hierarchy
Every section follows a strict narrative flow:

$$\text{Sensory Emotion} \longrightarrow \text{Origin \& Craft Story} \longrightarrow \text{Technical Specification}$$

```
[ STEP 1: EMOTION ]     "Từng giọt espresso là sự hội tụ của thổ nhưỡng và nhiệt năng."
        │
[ STEP 2: STORY ]       "Tuyển chọn từ độ cao 1.650m tại Cầu Đất, rang mẻ nhỏ trên máy drum hồng ngoại."
        │
[ STEP 3: SPEC ]        "Tỷ lệ trích xuất: 21.5% | TDS: 9.8% | Profile: Light-Medium Roast | Đóng gói van 1 chiều."
```

### 7.3 Vocabulary Guide (B2B Atelier vs. Generic SaaS)

| Context | Generic E-Commerce / SaaS (Forbidden) | Aura Atelier Language (Approved) |
|---|---|---|
| **Navigation** | Giỏ hàng / Mua hàng ngay | Hồ Sơ Dự Án / Khám Phá Giải Pháp |
| **Products** | Sản phẩm bán chạy / Hot Deals | Tuyển Chọn Mùa Vụ / Thiết Bị Tiêu Chuẩn |
| **Machine Specs**| Máy pha cà phê giá rẻ / Công nghệ AI | Hệ Thống Chiết Xuất Đa Nồi Hơi / Độ Ổn Định Nhiệt ±0.2°C |
| **B2B Service** | Dịch vụ bảo hành / Hỗ trợ 24/7 | Cam Kết Vận Hành Không Gián Đoạn / Kỹ Sư Thường Trực |
| **Call to Action** | Đăng ký ngay / Nhận ưu đãi khủng | Nhận Bản Vẽ Thiết Kế Quầy Bar & Dự Toán Chi Tiết |
| **Philosophy** | Chúng tôi là công ty giải pháp hàng đầu | Triết lý của sự tỉ mỉ: Cà phê ngon bắt đầu từ chuẩn xác kỹ thuật |

---

## 8. COFFEE-SPECIFIC SENSORY LEXICON

To reinforce our authentic coffee identity, all copy and metadata must utilize accurate specialty coffee nomenclature:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SENSORY & ORIGIN LEDGER                           │
├──────────────────────┬──────────────────────┬───────────────────────────────┤
│    TERROIR & CROP    │   ROASTING DYNAMICS  │     EXTRACTION METRICS        │
├──────────────────────┼──────────────────────┼───────────────────────────────┤
│ • Arabica Cầu Đất    │ • RoR (Rate of Rise) │ • Brew Ratio (1:2 - 1:2.2)    │
│ • Catimor / Typica   │ • First Crack (196°C)│ • Extraction Yield (18 - 22%) │
│ • 1,500m - 1,650m ASL│ • Agtron Gourmet #65 │ • Pre-infusion 4.5s @ 3 bar   │
│ • Anaerobic Natural  │ • Convection + Drum  │ • PID Dual Boiler Stability   │
│ • Fully Washed       │ • Degassing 14 Days  │ • Flat Burr 83mm Titanium     │
└──────────────────────┴──────────────────────┴───────────────────────────────┘
```

---

## 9. HOMEPAGE SECTION-BY-SECTION BRAND EXPRESSION

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [01 HERO]           "Nghệ thuật cà phê." — Cinematic visual desire          │
├──────────────────────────────────────────────────────────────────────────────┤
│ [02 PHILOSOPHY]     "Cà phê hoàn hảo không phải ngẫu nhiên." — Quiet moment  │
├──────────────────────────────────────────────────────────────────────────────┤
│ [03 SIX PILLARS]    "Giải pháp toàn diện từ nông trại đến tách cà phê."      │
├──────────────────────────────────────────────────────────────────────────────┤
│ [04 EQUIPMENT]      "Cỗ máy của sự chính xác." — Industrial artistry         │
├──────────────────────────────────────────────────────────────────────────────┤
│ [05 ORIGIN]         "Hành trình Cầu Đất." — Terroir and sensory landscape    │
├──────────────────────────────────────────────────────────────────────────────┤
│ [06 PROCESS]        "Khởi tạo không gian thưởng thức trong 4 bước."          │
├──────────────────────────────────────────────────────────────────────────────┤
│ [07 COMMITMENT]     "99.4% Uptime." — Quiet, unwavering SLA guarantee       │
├──────────────────────────────────────────────────────────────────────────────┤
│ [08 BUILDER]        "Thiết kế quầy bar và giải pháp riêng cho bạn."          │
├──────────────────────────────────────────────────────────────────────────────┤
│ [09 SOLUTIONS]      "Ba mô hình định hình chuẩn mực trải nghiệm."            │
├──────────────────────────────────────────────────────────────────────────────┤
│ [10 CONTACT]        "Bắt đầu cuộc đối thoại cùng chuyên gia Aura." (Dark)   │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 9.1 Detailed Section Expressions

#### Section 01: Hero — "The First Sip"
* **Brand Feeling:** Overwhelming desire, unhurried luxury, sensory invitation.
* **Palette:** `--cream-base` ground with deep warm espresso tones; high-contrast white typography over cinematic background video.
* **Key Copy:**
  * *Label:* `AURA COFFEE SOLUTIONS · HỆ THỐNG GIẢI PHÁP F&B CAO CẤP`
  * *H1:* `Nghệ thuật cà phê.` (*Cormorant Garamond 300 Italic*)
  * *Sub:* `Đồng hành cùng các không gian thưởng thức hàng đầu Việt Nam kiến tạo chuẩn mực mới.`
  * *Primary CTA:* `Khám Phá Giải Pháp →` (Single hairline ghost button, transitioning to solid copper on hover).

#### Section 02: Philosophy — "The Quiet Atelier Beat"
* **Brand Feeling:** Introspection, confidence, pause before momentum.
* **Palette:** Pure `--cream-base` background, `--espresso-ink` typography, zero decorative cards.
* **Key Copy:**
  * *"Một tách cà phê hoàn hảo không đến từ may mắn. Đó là bản giao hưởng giữa độ cao của vùng đất Cầu Đất, biểu đồ nhiệt chuẩn xác từng giây, và cỗ máy được hiệu chỉnh đến từng phần mười bar áp suất."*

#### Section 03: Six Pillars — "The Architectural Ecosystem"
* **Brand Feeling:** Institutional capability, structural mastery, end-to-end reliability.
* **Layout:** Asymmetrical 40/60 split with continuous 1px hairlines. Vertical editorial list instead of a generic rotating carousel.
* **Pillars Covered:** 
  1. Hạt Cà Phê Đặc Sản (Terroir & Roasting)
  2. Thiết Bị Pha Chế Chuẩn Mực (Espresso & Brewing Systems)
  3. Tư Vấn Thiết Kế Quầy Bar Công Thái Học (Bar Workflow Architecture)
  4. Đào Tạo Barista & Vận Hành Chuẩn (Academy & Sensory Calibration)
  5. Bảo Trì Định Kỳ & Kỹ Sư 24/7 (Preventative Engineering & SLA)
  6. Tối Ưu Chi Phí & Định Giá Thực Đơn (Menu Economics & Financial Modeling)

#### Section 04: Equipment — "Precision Instruments"
* **Brand Feeling:** Industrial sculptural beauty, Swiss watchmaking precision applied to espresso machines.
* **Layout:** 60% macro product image with natural lighting, 40% technical spec ledger.
* **Visual Anchor:** Highlighting Sanremo / La Marzocco brushed metal, tactile wooden portafilter handles, brass dials.

#### Section 05: Beans & Terroir — "Provenance & Sensory Notes"
* **Brand Feeling:** Gastronomic sophistication, botanical respect, highland mist.
* **Layout:** Single-row origin cards with sensory tasting wheels and topographic elevation lines.
* **Descriptors:** Bergamot, hoa lài, mật ong hoa cà phê, caramel cháy, sô-cô-la đen Đắk Lắk.

#### Section 06: Process Track — "The 4 Movements of Launch"
* **Brand Feeling:** Seamless project execution, architectural clarity, calm momentum.
* **Numbers:** Stamped editorial indices (`01`, `02`, `03`, `04`) in Cormorant Garamond 32px.
* **Stages:** Khảo sát mặt bằng $\rightarrow$ Thiết kế 2D/3D $\rightarrow$ Lắp đặt & Hiệu chỉnh $\rightarrow$ Khai trương & Đồng hành.

#### Section 07: Commitment Statement — "The Unshakable Standard"
* **Brand Feeling:** Utmost professional confidence.
* **Expression:** Typography-only statement on `--cream-deep` ground. No generic badge icons.
* **Core Metrics:** `4h` phản hồi kỹ thuật tại chỗ · `99.4%` thời gian hoạt động ổn định · `100%` mẻ rang kiểm nghiệm cupping.

#### Section 08: Project Builder — "The Barista Architect"
* **Brand Feeling:** Co-creation, agency, bespoke configuration.
* **Expression:** Interactive configurator disguised as an architectural workbook. Selection items feel like tactile materials (matte cream surfaces, copper border on select).

#### Section 09: Solutions — "Curated Service Frameworks"
* **Brand Feeling:** Clear decision pathways for different business scales (Boutique Specialty Café, Luxury Hotel Lounge, High-Volume Commercial Chain).
* **Layout:** 3-column editorial broadsheet. Middle column subtly highlighted with an ivory background shift, not a neon border.

#### Section 10: Contact — "The Nocturne Close"
* **Brand Feeling:** Warm evening hospitality, intimacy, closing the ledger with a handshake.
* **Palette:** Shifts dramatically to `--espresso-dark` (`#1A1208`) ground with warm cream typography and a glowing copper submission trigger.
* **Call to Action:** `Bắt Đầu Cuộc Đối Thoại Cùng Kỹ Sư Aura →`

---

## 10. BRAND CONSISTENCY & GOVERNANCE CHECKLIST

Before approving any UI mockups, copywriting, or component PRs for the homepage, verify against this 10-point audit:

- [ ] **1. Ground Dominance:** Is the background warm cream (`#F5EFE6` / `#EDE4D7`) and not stark digital white (`#FFFFFF`) or generic dark mode?
- [ ] **2. Copper Restraint:** Are there $\le 3$ copper elements visible in this viewport?
- [ ] **3. No Glassmorphic Clichés:** Are there zero `backdrop-filter: blur` containers in the page body layout?
- [ ] **4. Typography Harmony:** Is Cormorant Garamond strictly kept to 300–400 weight (never bold) and paired with DM Sans for technical data?
- [ ] **5. Asymmetric Grid:** Does the layout breathe with asymmetrical column splits (e.g. 60/40) rather than cookie-cutter centered boxes?
- [ ] **6. Hairline Structure:** Are separations achieved via 1px `--cream-shadow` lines and generous whitespace rather than bulky card boxes?
- [ ] **7. Narrative Sequence:** Does emotion and storytelling precede technical specifications?
- [ ] **8. Photographic Authenticity:** Does every image look like an editorial shoot from Standart Magazine with natural lighting?
- [ ] **9. B2B Terminology:** Are transactional terms like "Mua hàng", "Giỏ hàng", "Khuyến mãi" replaced by "Khám phá giải pháp", "Hồ sơ dự án", "Tuyển chọn"?
- [ ] **10. Single Focus:** Does the viewport convey exactly **one** primary emotion and offer **one** primary action?

---
*End of Aura Brand Direction Specification — Source of Truth for Design & Copywriting.*
