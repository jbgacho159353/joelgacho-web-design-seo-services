# Design Plan — Pixlurk Portfolio Website
Joel B. Gacho · joelgacho.com

---

## Design Rationale
The design replicates the visual style and animation patterns of **reeni-wp.laralink.com** —
a professional, dark-first portfolio with a typing role animation, split hero layout, and smooth
scroll-triggered reveals. The brand accent colour is **#F97316 (orange)**, consistent across
both dark and light modes.

---

## Wireframe Descriptions

### Navigation (sticky, 74px tall)
```
[ LOGO ] ─────────── [ About | Skills | Experience | Projects | Contact ] ─── [ ☀ ] [ ☰ ]
```
- Logo left: swaps between dark-bg variant (dark mode) and white-bg variant (light mode)
- Centre: horizontal nav links; active link highlighted with bg tint
- Right: theme toggle icon + hamburger (mobile only)
- Backdrop blur + semi-transparent bg; gains drop shadow when scrolled

### Hero (full-viewport height)
```
╔══════════════════════════════════════════════════════╗
║  Hello.                                              ║
║  I'm Joel B. Gacho                     ┌──────────┐  ║
║  I'm a [typing: WordPress Web Designer]│ [3+ yrs] │  ║
║                                        │   Photo  │  ║
║  Building responsive websites …       │          │  ║
║                                        │ [15+ st] │  ║
║  [ Call Now ]  [ Mail Me ]             └──────────┘  ║
║  📍 Bacolod City   [in] [🌐]                         ║
║                       ↕ scroll line                  ║
╚══════════════════════════════════════════════════════╝
```
- Background: decorative blurred radial blobs (orange, very low opacity)
- Image: organic blob-shape border, animated morph
- Floating badges: "3+ Years" and "15+ Sites" with float animation
- Typing animation cycles: WordPress Web Designer → SEO Specialist → Elementor Pro Expert → Conversion Optimiser

### About (alternate bg)
Two-column: text + stats left, personal info table right.
Stats grid: 3+ yrs, 15+ sites, 40% speed, 0 bugs — count-up animation.

### Skills
Two-column progress bars (Web Design + SEO), then full-width tool tags below.
Bars animate left-to-right when scrolled into view.

### Experience (alternate bg)
Vertical timeline with orange line + dot marker, card per role.
Cards: role title, company (orange), date badge, bullet list.

### Education
Two-column: formal education card (orange left border) + cert cards list.

### Projects
3-column grid (→ 2-col tablet → 1-col mobile).
Cards: gradient placeholder thumb → project title → description → tag pills.
Hover: orange overlay with "View Project →", card lifts.

### Contact (alternate bg)
Two-column: info sidebar left, form right.
Form fields: bg-elevated fill, orange focus ring.

### Footer (single row)
Logo | copyright | nav links — centred on mobile.

---

## Color Palette

| Token             | Dark Mode    | Light Mode   |
|-------------------|--------------|--------------|
| `--bg-primary`    | `#0c0c0c`    | `#ffffff`    |
| `--bg-surface`    | `#111111`    | `#f7f7f7`    |
| `--bg-card`       | `#181818`    | `#ffffff`    |
| `--bg-elevated`   | `#1f1f1f`    | `#efefef`    |
| `--text-primary`  | `#ffffff`    | `#0c0c0c`    |
| `--text-secondary`| `#9a9a9a`    | `#666666`    |
| `--accent`        | `#F97316`    | `#F97316`    |
| `--accent-light`  | `#fb923c`    | `#fb923c`    |
| `--border`        | `rgba(255,255,255,0.07)` | `rgba(0,0,0,0.09)` |
| `--gradient`      | `linear-gradient(135deg, #F97316 0%, #fb923c 100%)` | same |

---

## Typography

| Role     | Font   | Weight | Size (desktop) |
|----------|--------|--------|----------------|
| H1       | Syne   | 800    | clamp(2.4–4.2rem) |
| H2       | Syne   | 700    | clamp(1.75–2.5rem) |
| H3       | Syne   | 700    | clamp(1–1.25rem) |
| Typing   | Syne   | 600    | clamp(1.1–1.55rem) |
| Body     | Inter  | 400    | 1rem / line-height 1.78 |
| Labels   | Inter  | 700    | 0.72rem uppercase |

Fonts loaded from Google Fonts with `preconnect` and `display=swap` for performance.

---

## Logo Usage Rules

| Context        | File to use                                | CSS class     |
|----------------|--------------------------------------------|---------------|
| Dark mode nav  | `Pixlurk.com logo - for black bg.png`      | `.logo--dark` |
| Light mode nav | `Pixlurk.com logo - for white bg.png`      | `.logo--light`|
| Dark mode footer | `Pixlurk.com logo - for black bg.png`    | `.logo--dark` |
| Light mode footer | `Pixlurk.com logo - for white bg.png`   | `.logo--light`|

CSS handles the swap automatically via:
```css
[data-theme="light"] .logo--dark  { display: none;  }
[data-theme="light"] .logo--light { display: block; }
```

---

## Spacing & Grid

- Container max-width: 1200px, 28px side padding
- Section padding: 110px top/bottom (desktop), 80px (tablet/mobile)
- Section header bottom margin: 70px
- Card gap: 28px
- Border radius: 14px (cards), 9px (buttons/inputs)

### Breakpoints
| Name     | Max-width |
|----------|-----------|
| Tablet   | 1024px    |
| Mobile   | 768px     |
| SM Mobile| 480px     |

---

## Animation Details

### Typing / Role Animation
- JS typewriter effect in `main.js → typeRole()`
- Typing speed: 100ms/char | Deleting: 55ms/char
- Pause at word end: 2200ms | Pause before next word: 450ms
- Roles: WordPress Web Designer → SEO Specialist → Elementor Pro Expert → Conversion Optimiser
- Blinking cursor via CSS animation (`blink` keyframe, 0.75s step-end)

### Blob Shape Animation
- Hero image container uses CSS `border-radius` morph (`blobMorph` keyframe, 8s ease-in-out infinite)
- Background blob uses same morph on the glow element

### Floating Badges
- `floatBadge` keyframe: translateY(0) → translateY(-8px), 4s ease-in-out infinite
- Badge 2 has 2s animation-delay for offset effect

### Scroll Reveals
- `[data-animate]` elements: opacity 0 + translate offset
- IntersectionObserver adds `.is-visible` at 12% visibility
- Sibling elements stagger by 80ms
- Supported types: `fade-up`, `fade-right`, `fade-left`, `zoom-in`

### Skill Bars
- `width: 0` → `width: var(--pct)` transition: 1.35s cubic-bezier
- Triggered by IntersectionObserver at 25% threshold

### Stat Counters
- JS count-up over 1400ms (16ms steps) when About section enters viewport

---

## Dark / Light Mode Behaviour

1. Default: dark mode
2. User toggles → `data-theme` attribute on `<html>` flips
3. Preference saved to `localStorage` key `pixlurk-theme`
4. On page load: reads localStorage → falls back to `prefers-color-scheme`
5. All colours use CSS custom properties → instant theme switch, no flash

---

## Future Enhancement Notes
- **Testimonials section**: add when client quotes are available
- **Blog section**: integrate if a blog is launched
- **Project images**: replace gradient placeholders with actual screenshots
- **CV download**: link the "Download CV" button to a hosted PDF
- **Contact form backend**: wire up Formspree, Netlify Forms, or EmailJS
- **Analytics**: uncomment the GA4 snippet and replace `G-XXXXXXXXXX`
- **SEO plugin**: compatible with Rank Math / Yoast if moved to WordPress
