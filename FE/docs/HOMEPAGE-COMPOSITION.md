# HOMEPAGE COMPOSITION
**Project:** Aura Coffee Solutions — Homepage Redesign
**Document Code:** `HOMEPAGE-COMPOSITION`
**Version:** 2.0 — Art Direction (Pre-Implementation)
**Companion Documents:** `AURA-DESIGN-DIRECTION.md` · `AURA-BRAND-DIRECTION.md` · `HOMEPAGE-AUDIT.md`
**Rule:** One viewport = one primary idea. Editorial and cinematic, not ecommerce dashboard.

---

## COMPOSITION OVERVIEW

The homepage is a **linear editorial sequence** — structured like a magazine feature, paced like a documentary.
Each section occupies a psychological beat. The visitor is never asked to decide before they have been made to *feel*.

```
LOUD → QUIET → LOUD → LOUD → QUIET → LOUD → QUIET → MEDIUM → MEDIUM → CLOSE
 01      02      03     04      05      06      07       08       09      10
```

Total sections: 10 + Navbar + Footer
Scroll direction: vertical, smooth (Lenis)
Color base: warm cream `#F5EFE6` — the page breathes, not glows

---

## SECTION MAP

| # | Component | Rhythm | Primary Emotion | One-Line Purpose |
|---|---|---|---|---|
| 00 | `Navbar` | — | Invisible presence | Wayfinding; appears only when needed |
| 01 | `Hero` | LOUD | Desire / Wonder | Make them stop scrolling |
| 02 | `PhilosophySection` | QUIET | Trust / Introspection | Earn belief before selling anything |
| 03 | `SixPillars` | LOUD | Breadth / Confidence | Show the full scope of capability |
| 04 | `EquipmentConfigurator` | LOUD | Craftsmanship / Precision | The machines that make it real |
| 05 | `BeansSelection` | QUIET | Terroir / Provenance | Where the coffee comes from, and why it matters |
| 06 | `ProcessTrack` | LOUD | Clarity / Momentum | How we take you from nothing to open |
| 07 | `CommitmentStatement` | QUIET | Reliability / Calm | We will not abandon you after launch |
| 08 | `ProjectBuilder` | MEDIUM | Agency / Participation | Let them configure their own reality |
| 09 | `SolutionsSection` | MEDIUM | Decision / Clarity | Three paths — choose without pressure |
| 10 | `ContactSection` | CLOSE | Readiness / Invitation | The closing handshake |
| 11 | `SiteFooter` | BASE | Utility / Closure | Quietly useful, never loud |

---

## SECTION COMPOSITIONS

---

### 00 · Navbar

**Section purpose:**
Transparent at top — feels like part of the Hero cinema. Solidifies to cream when scrolling begins. Never competes with the content below it.

**Dominant visual:**
The wordmark `Aura Coffee` in Cormorant Garamond Light. The copper bean SVG monogram (1.5px stroke, no fill) is the single visual anchor.

**Text hierarchy:**
- Wordmark: Cormorant Garamond Light — not bold, not all-caps
- Nav links: DM Sans 13px, `--espresso-mid` to `--espresso-ink` on hover
- CTA: DM Sans 13px 500, copper fill button

**CTA:**
Single: `Nhan Bao Gia` — copper fill, right-aligned

**Scroll behavior:**
- `scrollY === 0`: fully transparent, white text
- `scrollY > 40px`: cream `#F5EFE6` at 96% opacity — CSS transition 200ms, no JS animation

**Animation opportunity:**
Background opacity transition only. Nothing else moves.

**Mobile behavior:**
Hamburger icon left. Bean monogram centered. Cart/Quote icon right. Full-screen drawer on open — no backdrop blur.

---

### 01 · Hero — "The First Sip"

**Section purpose:**
The single most important viewport on the entire page. Create desire before any product is named. The visitor must feel something within 3 seconds.

**Dominant visual:**
Full-bleed ambient video: slow-motion espresso extraction — a viscous golden thread dropping into a matte ceramic cup, steam parting. No cuts. No motion graphics overlay. The video *is* the section.

Fallback (no video / prefers-reduced-motion): a single full-bleed photograph of espresso in extraction, warm amber tones, 30% dark scrim.

Overlay cap: `rgba(26, 18, 8, 0.35)` — no heavier.

**Text hierarchy:**
```
[LABEL]  AURA COFFEE SOLUTIONS · HE THONG GIAI PHAP F&B CAO CAP
         DM Sans 11px · uppercase · tracking 0.14em · cream 70%

[H1]     Nghe thuat ca phe.
         Cormorant Garamond 300 Italic · clamp(72px, 9vw, 120px) · white · lh 0.95

[SUB]    Dong hanh cung cac khong gian thuong thuc hang dau Viet Nam.
         DM Sans 400 · 16px · white 70% · max 56 chars
```

Text position: **left-aligned, bottom-anchored** — `bottom: clamp(48px, 8vh, 96px)` · `left: var(--container-x)`

**Image usage:**
Video / photograph functions as emotional context, not decoration. It must communicate: *luxury, craft, unhurried time*.

**CTA:**
Single ghost button: `Kham Pha Giai Phap ->`
- 1px cream border · DM Sans 14px · no fill at rest
- On hover: cream fill, espresso text, 200ms ease

**Scroll behavior:**
Lenis-driven. Text and CTA have a subtle parallax offset (y: 0 to y: -20px at 100vh scroll). Video does not parallax — it is anchored.

**Animation opportunity:**
- Label fades in: opacity 0 to 1, y: 8px to 0, delay 0.3s, duration 0.7s
- H1 word-reveal: stagger 0.04s/word, opacity + y: 16px to 0, duration 0.8s
- Subtitle fades in after H1 completes: delay 0.7s, duration 0.6s
- CTA button fades in last: delay 1.1s
- Max 4 animated elements total — H1 words count as one unit

**Mobile behavior:**
Same layout, left-anchored, bottom text. H1 scales to clamp(48px, 8vw, 72px). Subtitle truncates gracefully. Video plays muted inline on mobile — falls back to still image if autoplay blocked.

---

### 02 · Philosophy Section — "The Quiet Atelier Beat"

**Section purpose:**
A decompression chamber after the Hero's intensity. No product. No spec. No CTA.
One idea: *"Perfect coffee is not an accident."*
The visitor is invited to think, not to buy.

**Dominant visual:**
Typography *is* the dominant visual. The pull-quote at `clamp(28px, 3.5vw, 48px)` Cormorant Garamond 300 Italic becomes a visual object, not just text.

A single copper horizontal rule (1px, `--copper-accent`, 80px wide) sits above the quote as a mute editorial mark. Not a border. A breath.

Background: pure `--cream-base`. No image. No texture. No card.

**Text hierarchy:**
```
[RULE]   1px copper hairline, 80px wide, centered above quote

[QUOTE]  "Mot tach ca phe hoan hao khong den tu may man.
          Do la ban giao huong giua do cao vung dat Cau Dat,
          bieu do nhiet chuan xac tung giay, va co may duoc
          hieu chinh den tung phan muoi bar ap suat."
          Cormorant Garamond 300 Italic · clamp(22px, 3vw, 36px) · espresso-ink
          max-width: 780px · centered · line-height: 1.55
```

**Image usage:**
None. Whitespace is the image.

**CTA:**
None. Silence is the message.

**Scroll behavior:**
Standard — no parallax. The section rests.

**Animation opportunity:**
Word-by-word reveal: each word fades in with `y: 12px to 0`, stagger 0.04s, triggered `whileInView` threshold 0.3.
The copper rule draws from center outward (scaleX: 0 to 1, duration 0.6s, ease out) before words begin.

**Mobile behavior:**
Centered column, `padding: clamp(80px, 14vh, 140px) var(--container-x)`. Quote font size: clamp(22px, 5vw, 32px). The rule shortens to 60px.

---

### 03 · Six Pillars — "The Architectural Ecosystem"

**Section purpose:**
Establish Aura as a complete end-to-end partner — not a machine vendor, not a roastery, but a full-stack coffee systems atelier.
The visitor understands: *"They do everything I need."*

**Dominant visual:**
Asymmetric 40/60 two-column layout.

**Left column (40%):**
Large chapter index in DM Sans 11px uppercase + the 6 pillar numerals (01 through 06) in Cormorant Garamond at clamp(48px, 6vw, 80px), weight 200. These numerals are architectural — structural objects, not decorative flourishes.

**Right column (60%):**
Vertical editorial list of 6 pillars, each separated by a 1px `--cream-shadow` hairline. Each row: pillar title in DM Sans 16px 500 `--espresso-ink`, one-line description in DM Sans 14px `--espresso-light`. No icons. No bullets. No cards.

An ambient background image sits at **8% opacity** behind the entire section — a wide-angle shot of a highland coffee farm or roastery interior. It provides atmosphere, not information.

**Text hierarchy:**
```
[LABEL]    CHUONG 01 · GIAI PHAP TOAN DIEN
           DM Sans 11px · uppercase · tracking 0.14em · espresso-light

[HEADLINE] Sau tru cot.
           Cormorant Garamond 400 · clamp(40px, 5vw, 64px) · espresso-ink

[NUMERALS] 01 through 06
           Cormorant Garamond 200 · clamp(48px, 6vw, 80px) · espresso-light

[PILLAR]   Hat Ca Phe Dac San (title) — DM Sans 500 · 16px · espresso-ink
           One-line description — DM Sans 400 · 14px · espresso-light
```

**Image usage:**
Ambient background only — opacity 0.08, no overlay gradient. `fill` layout, `aria-hidden`. Not a content image.

**CTA:**
None. This section proves depth, it does not sell.

**Scroll behavior:**
Standard Lenis. Left column is sticky until all 6 pillars are visible on larger viewports (optional).

**Animation opportunity:**
- Section headline: fade up from y:40px, duration 0.9s, cubic-bezier(0.16, 1, 0.3, 1)
- Pillar rows: stagger entry, 0.08s delay between rows, whileInView

**Mobile behavior:**
Single column. Numerals stack in a small muted horizontal row above each pillar entry. Ambient image disabled below 768px.

---

### 04 · Equipment Configurator — "Precision Instruments"

**Section purpose:**
Let the machines speak for themselves. One machine at a time. The visitor sees craftsmanship and asks: *"Can I have this in my space?"*

**Dominant visual:**
60/40 asymmetric horizontal split.

**Left (60%):** Full-height machine portrait photograph — matte brushed steel, wooden portafilter handle, dial faces. Natural directional studio lighting. No floating graphics, no spec overlays on the image.

**Right (40%):** Typographic spec ledger. Machine name in Cormorant Garamond 32px. Key metrics in a clean `<dl>` structure — DM Sans 14px, alternating `--cream-deep` tint rows, no borders.

A tier selector above the spec panel: three machine names as plain text links — DM Sans 13px. Active tier: 2px copper underline. No buttons, no pills.

**Text hierarchy:**
```
[LABEL]    THIET BI CHIET XUAT · CHUONG 04
           DM Sans 11px · uppercase · tracking 0.14em

[HEADLINE] Co may cua su chinh xac.
           Cormorant Garamond 400 Italic · clamp(32px, 4vw, 56px)

[MACHINE]  Sanremo Opera 2.0
           Cormorant Garamond 400 · 32px · espresso-ink

[SPEC]     Ap suat: 9 bar · Noi hoi kep: 0.3L + 5L
           DM Sans 400 · 14px · data rows
```

**Image usage:**
Primary content image — full narrative weight. Each tier switch crossfades the image (opacity 0 to 1, 0.4s ease-out, no scale). Three unique machine portraits — no URL collisions.

**CTA:**
- Primary: `Them vao Ho So` — copper fill button, DM Sans 14px 500
- Secondary: `Dat Lich Demo ->` — plain text link, espresso-mid, hover copper

**Scroll behavior:**
Standard. No parallax on the machine image — it should feel solid and grounded.

**Animation opportunity:**
- Section entry: right panel fades up from y:40px, duration 0.9s
- Machine image: opacity crossfade on tier change, 0.4s ease-out (no scale, no slide)
- Spec rows: stagger fade-in on first appearance, 0.06s between rows

**Mobile behavior:**
Vertical stack. Machine portrait fills 50vh with `object-fit: cover`. Spec panel below, full width. Tier selector becomes a horizontal scroll row. Both CTAs stack vertically with 12px gap.

---

### 05 · Beans & Origin — "Provenance & Sensory Notes"

**Section purpose:**
Transport the visitor to the highlands. Establish that Aura's coffee is a product of a specific geography, not a generic commodity.
The feeling: *terroir, elevation, harvest.*

**Dominant visual:**
Four-column typographic provenance grid on `--cream-deep` ground. Each column is one origin: origin name + region in DM Sans 11px uppercase, sensory tasting descriptors in Cormorant Garamond italic, SCA score in copper — `clamp(22px, 2.5vw, 28px)`.

An ambient landscape image sits at **15% opacity** behind the section — wide-angle highland mist photograph, horizontal. Atmospheric only.

**Text hierarchy:**
```
[LABEL]    CHUONG 05 · NGUON GOC & HUONG VI
           DM Sans 11px · uppercase · tracking 0.14em

[HEADLINE] Hanh trinh Cau Dat.
           Cormorant Garamond 400 Italic · clamp(32px, 4vw, 56px)

[ORIGIN]   CAU DAT · LAM DONG
           DM Sans 11px · uppercase · tracking 0.12em · espresso-light

[NOTES]    "Bergamot, hoa lai, mat ong hoa ca phe"
           Cormorant Garamond 300 Italic · clamp(18px, 2vw, 22px)

[SCA]      87.5
           Cormorant Garamond 400 · clamp(22px, 2.5vw, 28px) · copper-accent

[META]     ELEVATION 1,650M · ANAEROBIC NATURAL
           DM Sans 11px · uppercase · tracking 0.12em · espresso-light
```

**Image usage:**
Ambient background at 15% opacity — atmosphere only. No per-bean images in the grid. If a bean detail panel expands, a unique editorial close-up enters via opacity fade-in (0.4s).

**CTA:**
Per bean: `Them vao Ho So ->` — text link, DM Sans 13px, espresso-mid to copper on hover. No button.

**Scroll behavior:**
Standard. Ambient background scrolls at 0.8x speed for subtle depth.

**Animation opportunity:**
- Column grid: stagger fade-up, 0.1s per column, whileInView
- SCA score: count-up number animation on entry (0 to 87.5, duration 1s, ease-out)
- Detail panel on bean select: height 0 to auto + opacity 0 to 1, 0.4s ease-out

**Mobile behavior:**
2x2 grid below 768px; 1-column stack below 480px. Ambient image disabled below 768px. SCA scores remain visible.

---

### 06 · Process Track — "The 4 Movements of Launch"

**Section purpose:**
Answer the unspoken anxiety of every B2B client: *"How complicated is this to set up?"*
The answer must feel: calm, structured, inevitable — four clean steps and you are open.

**Dominant visual:**
Horizontal snap-scroll filmstrip. Each panel is 75vw wide, full-height. The left 25vw of the previous panel is visible — implying continuation. Each panel: full-bleed editorial photograph in the left 60%, clean numbered step in the right 40%.

Step numeral: Cormorant Garamond 200 at clamp(80px, 10vw, 140px) — the number is the dominant visual inside the right column.

Navigation: `<-` `->` arrow text buttons top-right, DM Sans 13px, espresso-mid. Not carousel dots.

**Text hierarchy:**
```
[LABEL]    CHUONG 06 · TRIEN KHAI
           DM Sans 11px · uppercase · tracking 0.14em

[HEADLINE] Bon buoc den khai truong.
           Cormorant Garamond 400 · clamp(32px, 4vw, 56px)

[NUMERAL]  01
           Cormorant Garamond 200 · clamp(80px, 10vw, 140px) · espresso-light · opacity 0.4

[STEP]     Khao sat mat bang
           Cormorant Garamond 400 Italic · 28px · espresso-ink

[DESC]     One sentence · DM Sans 400 · 16px · espresso-mid · max-width 320px
```

**Image usage:**
Four unique editorial photographs — consultation, blueprint/2D-3D, machine installation, post-launch service visit. No URL collisions with Hero or other sections.

**CTA:**
None within steps. Navigation arrows only: `<- Truoc` · `Tiep theo ->`

**Scroll behavior:**
Outer section: standard vertical scroll. Inner filmstrip: horizontal CSS scroll-snap (`scroll-snap-type: x mandatory`). Lenis respects the horizontal container boundary.

**Animation opportunity:**
- Section header: fade up, duration 0.9s
- On snap: incoming panel step text fades up from y:20px, 0.5s ease-out
- Numeral: pure opacity 0 to 1, no movement, on panel snap

**Mobile behavior:**
85vw panels. Arrow nav replaced by swipe gesture — a small `Vuot de xem ->` label appears for 2s then fades. Images fill 100% panel width with step content below. Panel height auto.

---

### 07 · Commitment Statement — "The Unshakable Standard"

**Section purpose:**
A moment of institutional confidence. No badges. No icons. No proof theater.
Three truths stated plainly: *uptime, response time, roast integrity.*

**Dominant visual:**
Typography only, on `--cream-deep` background. Three numbered editorial statements in Cormorant Garamond italic — a vertical ledger. Each statement separated by a 1px `--cream-shadow` hairline.

**Text hierarchy:**
```
[LABEL]     CHUONG 07 · CAM KET VAN HANH
            DM Sans 11px · uppercase · tracking 0.14em

[HEADLINE]  Tieu chuan khong thoa hiep.
            Cormorant Garamond 400 · clamp(32px, 4vw, 48px)

[INDEX]     01 · 02 · 03
            DM Sans 11px · uppercase · espresso-light

[STAT]      99.4%
            Cormorant Garamond 400 · clamp(40px, 5vw, 64px) · espresso-ink

[STATEMENT] Thoi gian hoat dong on dinh cam ket hang nam.
            Cormorant Garamond 300 Italic · clamp(18px, 2vw, 24px) · espresso-mid

[DETAIL]    4h phan hoi ky thuat tai cho · 63 tinh thanh
            DM Sans 400 · 13px · espresso-light · uppercase · tracking 0.1em
```

**Image usage:**
None. This section earns trust through restraint — an image here would dilute the authority of the statement.

**CTA:**
None. The commitment itself is the message.

**Scroll behavior:**
Standard.

**Animation opportunity:**
- Each statement row: fade up from y:24px, stagger 0.15s between rows, whileInView threshold 0.25
- Stats (99.4%, 4h): count-up animation, duration 1.2s, ease-out

**Mobile behavior:**
Single column. Hairlines become full-width. Stat numbers shrink to clamp(36px, 8vw, 56px) — still dominant. Section padding increased to preserve breathing room.

---

### 08 · Project Builder — "The Barista Architect"

**Section purpose:**
Give the B2B client a sense of agency and authorship. They are not filling in a form — they are configuring *their* coffee program.
The interaction must feel like selecting materials in an architect's workbook.

**Dominant visual:**
50/50 split, separated by a 1px `--cream-shadow` vertical hairline.

**Left panel:** Interactive configurator — dropdown selects and range sliders styled as tactile material selectors. `--cream-deep` backgrounds, copper focus ring, DM Sans 14px. Labels at 11px uppercase. Each selection row separated by hairline.

**Right panel:** Live recommendation output — a typographic "project brief" that updates in real time. Output in Cormorant Garamond 400 with DM Sans 14px spec details. Styled as a printed dossier, not a modal.

**Text hierarchy:**
```
[LABEL]    CHUONG 08 · CAU HINH GIAI PHAP
           DM Sans 11px · uppercase · tracking 0.14em

[HEADLINE] Thiet ke quay bar cua ban.
           Cormorant Garamond 400 · clamp(32px, 4vw, 56px)

[FIELD]    Quy mo khong gian (label)
           DM Sans 11px · uppercase · tracking 0.12em · espresso-light
           DM Sans 400 · 15px · espresso-ink (select value)

[OUTPUT]   Giai phap de xuat: Espresso Bar Compact
           Cormorant Garamond 400 Italic · 24px · espresso-ink

[SPEC]     May: Sanremo Opera · May xay: Mythos 2 · Luong hat: 8kg/tuan
           DM Sans 400 · 14px · espresso-light
```

**Image usage:**
None. The interaction *is* the visual. The live output panel evolving in real-time is the dominant experience.

**CTA:**
Single: `Nhan Bao Gia & Ban Ve Bar ->` — copper fill button, DM Sans 14px 500. Appears at bottom of right panel after any selection is made (fades in at 0.3s).

**Scroll behavior:**
Standard. Left panel may be sticky within the section on desktop.

**Animation opportunity:**
- Section entry: both panels fade up together, duration 0.9s
- Output update: right panel content fades opacity 0.6 to 1 on each state change, 0.2s ease
- CTA: opacity 0 to 1 on first interaction, duration 0.4s

**Mobile behavior:**
Vertical stack. Configurator first, output below. Vertical hairline becomes horizontal. CTA full-width.

---

### 09 · Solutions Section — "Curated Service Frameworks"

**Section purpose:**
Present three business models without pressure. The visitor identifies themselves — boutique café, hotel lounge, commercial chain — and sees a clear path.

**Dominant visual:**
3-column editorial broadsheet. Columns separated by 1px `--cream-shadow` hairlines — no borders, no cards, no shadows.

Middle column is the recommended tier: it sits on `--cream-deep` background (a tonal shift, not a neon highlight). Other two columns remain on `--cream-base`.

Each column: tier label in DM Sans 11px uppercase, package name in Cormorant Garamond 32px, pull-description in DM Sans 16px, price in Cormorant Garamond 48px (neutral espresso-ink — not copper), feature list in DM Sans 14px with 1px hairline rows.

**Text hierarchy:**
```
[LABEL]    CHUONG 09 · MO HINH DICH VU
           DM Sans 11px · uppercase · tracking 0.14em

[HEADLINE] Ba mo hinh. Mot tieu chuan.
           Cormorant Garamond 400 · clamp(32px, 4vw, 56px)

[TIER]     BOUTIQUE SPECIALTY · PACKAGE 01
           DM Sans 11px · uppercase · tracking 0.14em · espresso-light

[NAME]     Specialty Espresso Lab
           Cormorant Garamond 400 · 32px · espresso-ink

[PRICE]    48.000.000 d
           Cormorant Garamond 400 · 48px · espresso-ink (neutral — not copper)

[FEATURE]  DM Sans 400 · 14px · espresso-light · hairline rows
```

**Image usage:**
None. The typography is the product display.

**CTA:**
- Featured (middle) column: `Nhan Bao Gia` — copper fill button
- Other columns: `Nhan Bao Gia ->` — text link, espresso-mid to copper on hover

**Scroll behavior:**
Standard.

**Animation opportunity:**
- Columns stagger: left to center to right, 0.12s apart, fade up from y:24px, duration 0.8s
- Middle column enters 0.08s later — subtle asymmetric reveal

**Mobile behavior:**
1-column stack. Featured package renders first. Pricing remains visible. Feature lists collapse to 4 items with a `+ Xem them` text link.

---

### 10 · Contact Section — "The Nocturne Close"

**Section purpose:**
A tonal shift to darkness — warm, intimate. The page has moved from daylight to evening. This is the invitation to begin a real conversation.

**Dominant visual:**
Full-width dark section: `--espresso-dark` (`#1A1208`) background. White and cream typography. A single copper accent: the submit button.

Centered layout — the only centered section on the page. Centering here signals arrival.

**Text hierarchy:**
```
[LABEL]    CHUONG 10 · LIEN HE
           DM Sans 11px · uppercase · tracking 0.14em · cream 50%

[HEADLINE] Bat dau cuoc doi thoai.
           Cormorant Garamond 300 Italic · clamp(40px, 6vw, 80px) · white · lh 1.1

[SUB]      Chung toi san sang khao sat, thiet ke, va dong hanh cung ban tu ngay dau.
           DM Sans 400 · 18px · cream 70%

[PHONE]    0909 000 247
           DM Sans 400 · 16px · cream 70% · hover copper
```

**Image usage:**
None. The darkness is the atmosphere.

**CTA:**
Single: `Lien He Tu Van Ngay ->` — copper fill button (`#A0622A`), DM Sans 14px 500, 200ms ease hover to `--copper-light`.

**Scroll behavior:**
Standard. Section uses larger padding before the footer.

**Animation opportunity:**
- Headline: word-reveal, fade + y:20px to 0, stagger 0.05s, duration 0.8s
- CTA: fades in after headline completes, delay 0.9s
- CTA hover: single 0.4s box-shadow expand, eases back — not a repeating pulse

**Mobile behavior:**
Centered. H2 clamp reduces to clamp(36px, 8vw, 56px). CTA full-width. Phone number displayed below the button.

---

### 11 · Site Footer — "The Base"

**Section purpose:**
Utility and closure. Quietly useful. Not decorative.

**Dominant visual:**
4-column typographic grid on `--espresso-dark` background. Column proportions: `30% 20% 25% 25%`. The only animated element: a single `animate-pulse` green dot next to `Ky Su Truc 24/7`.

**Text hierarchy:**
```
[WORDMARK]  Aura Coffee
            Cormorant Garamond Light · 20px · cream 90%

[TAGLINE]   Atelier Giai Phap Ca Phe
            DM Sans 400 · 13px · cream 50%

[COL HEAD]  GIAI PHAP · THIET BI · LIEN HE
            DM Sans 11px · uppercase · tracking 0.12em · cream 40%

[LINK]      DM Sans 400 · 14px · cream 70% to cream 100% on hover

[COPYRIGHT] 2026 Aura Coffee Solutions
            DM Sans 400 · 12px · cream 30%
```

**CTA:**
Newsletter subscribe: email input + `->` arrow submit. Input: 1px cream 20% border. Button: cream text, no fill. Hover: cream fill, espresso text.

**Animation opportunity:**
None except the single `animate-pulse` live dot. Footer is utility; animation here serves no storytelling purpose.

**Mobile behavior:**
2x2 column grid below 768px. Wordmark + tagline span full width. Newsletter subscribe collapses to full-width stack.

---

## GLOBAL COMPOSITION RULES

### One Viewport = One Primary Idea

Every section must be able to complete this sentence without ambiguity:

> *"This section makes the visitor feel ___."*

If the answer includes "and also" — the section has too many ideas.

### Copper Economy

Copper (`#A0622A`) appears at most **3 times per viewport** across the full page:
- Logo bean mark (Navbar)
- Primary CTA per section (1 per section, never adjacent)
- Single editorial highlight per section (SCA score, copper rule, active state)

### Air Is Architecture

Whitespace is not empty space — it is structural. `--section-y: clamp(80px, 10vh, 140px)` is the breathing rhythm between each emotional beat. Never compress this to fit more content.

### Image Uniqueness Contract

No photo URL may appear in more than one section. Each image has one role:
- Hero: atmosphere and desire
- Equipment tiers 1–3: three distinct machine portraits
- Process steps 1–4: four distinct consultative moments
- Beans (ambient): highland terrain landscape
- Pillars (ambient): roastery interior

### CTA Discipline

| Section | Primary CTA | Secondary |
|---|---|---|
| Navbar | `Nhan Bao Gia` (copper button) | — |
| Hero | `Kham Pha Giai Phap ->` (ghost button) | — |
| Philosophy | — | — |
| Six Pillars | — | — |
| Equipment | `Them vao Ho So` (copper button) | `Dat Lich Demo ->` (text link) |
| Beans | `Them vao Ho So ->` (text link, per bean) | — |
| Process | — | `<- ->` nav arrows only |
| Commitment | — | — |
| Project Builder | `Nhan Bao Gia & Ban Ve Bar ->` (copper button) | — |
| Solutions | `Nhan Bao Gia` (featured column only) | `Nhan Bao Gia ->` (text links) |
| Contact | `Lien He Tu Van Ngay ->` (copper button) | Phone text link |
| Footer | Newsletter `->` submit | — |

### Animation Budget

The entire page allows **4 animation types only**:

| Type | Spec | Trigger |
|---|---|---|
| Text Reveal | opacity 0 to 1 + y: 16px to 0, stagger 0.04s/word, 0.8s | whileInView, threshold 0.15 |
| Section Entry | opacity 0 to 1 + y: 40px to 0, 0.9s, cubic-bezier(0.16,1,0.3,1) | whileInView, threshold 0.15 |
| Image Crossfade | opacity 0 to 1, 0.4s ease-out. No scale. No slide. | State change (tier/bean select) |
| Hover Copper | Color to --copper-accent, 0.25s ease | :hover |

Max **3 elements animating simultaneously** in any viewport. Never more.

### Scroll Behavior Summary

| Section | Inner Scroll | Parallax |
|---|---|---|
| Hero | None | Text block: subtle y offset (−20px at 100vh) |
| Pillars | None | Optional: left column sticky |
| Equipment | None | None — machine is grounded |
| Beans | None | Ambient BG scrolls at 0.8x |
| Process Track | Horizontal CSS snap-scroll | None |
| All others | None | None |

### Mobile-First Behavior Summary

| Pattern | Desktop | Mobile |
|---|---|---|
| Column splits (60/40, 65/35) | Horizontal asymmetric | Vertical stack, image first |
| Typography scale | clamp max values | clamp min values, minimum 22px H2 |
| Ambient background images | Visible 8–15% opacity | Disabled below 768px |
| Process filmstrip | 75vw panels, arrow nav | 85vw panels, swipe gesture |
| Solutions grid | 3-column broadsheet | 1-column, featured tier first |
| Navbar | Full links + CTA | Hamburger + drawer |
| Hero video | Autoplay muted inline | Autoplay muted, fallback to still |

---

## EDITORIAL SEQUENCE — EMOTIONAL ARC

The visitor's emotional journey across the page:

```
[ENTER]      Wonder — the espresso drop. Desire before words.
                |
[TRUST]      Quiet — a single perfect sentence. No noise.
                |
[BREADTH]    Confidence — "They handle everything."
                |
[DESIRE]     Craft — the machine is beautiful. I want this.
                |
[DEPTH]      Provenance — the coffee has a story. I want to know it.
                |
[CLARITY]    Structure — four steps. Clear. Calm. Not complicated.
                |
[ASSURANCE]  Reliability — they will not disappear after launch.
                |
[AGENCY]     Co-creation — I built this myself. It's mine.
                |
[DECISION]   Clarity — three paths. I know which one I am.
                |
[INVITATION] Darkness, warmth. Begin the conversation.
```

This arc is not an accident. Each section must carry the visitor one step further.
No section is self-contained — each is a breath in a longer sentence.

---

*This document is the composition authority for the Aura Coffee homepage.
Deviations in implementation must be flagged and resolved here before code is written.*

*Companion references: `AURA-DESIGN-DIRECTION.md` (tokens, rules) · `AURA-BRAND-DIRECTION.md` (voice, imagery) · `HOMEPAGE-AUDIT.md` (current state)*
