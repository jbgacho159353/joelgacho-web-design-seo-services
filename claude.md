# Claude Code — Pixlurk Portfolio Website
Joel B. Gacho · joelgacho.com
Built with plain HTML, CSS, and vanilla JS. No frameworks or build tools required.

---

## Project Structure

```
pixlurk - portfolio website/
├── index.html          ← Single-page portfolio (all sections)
├── css/
│   └── style.css       ← All styles, theme tokens, responsive rules
├── js/
│   └── main.js         ← Dark/light toggle, typing animation, scroll effects
├── assets/
│   ├── Hero-image.png                          ← Hero portrait photo
│   ├── Pixlurk.com logo - for black bg.png     ← White logo (dark mode)
│   └── Pixlurk.com logo - for white bg.png     ← Dark logo (light mode)
├── claude.md           ← This file: full code documentation
└── design.md           ← Design plan, wireframes, color palette, logo rules
```

---

## Quick-Start Checklist

- [ ] Open `index.html` in a browser to preview
- [ ] Replace project `href="#"` with real URLs in the Projects section
- [ ] Add actual project screenshots to `assets/` and update `<img src>`
- [ ] Replace `G-XXXXXXXXXX` in the GA4 comment with your Measurement ID
- [ ] Update the `href` on the "Download CV" button to your hosted PDF
- [ ] Activate a contact form backend (see Contact section below)

---

## Customisation Guide

### Change brand accent color
In `css/style.css`, update these `:root` tokens:
```css
--accent:       #F97316;  /* main orange */
--accent-hover: #ea6a0a;  /* darker hover state */
--accent-light: #fb923c;  /* lighter variant */
--accent-glow:  rgba(249, 115, 22, 0.18);  /* transparent tint */
--gradient:     linear-gradient(135deg, #F97316 0%, #fb923c 100%);
```

### Change typing roles
In `js/main.js`, update the `roles` array:
```js
const roles = [
  'WordPress Web Designer',
  'SEO Specialist',
  'Elementor Pro Expert',
  'Conversion Optimiser',
];
```

### Add a real project
Replace a placeholder card in the Projects section of `index.html`:
```html
<!-- 1. Update href with real URL -->
<a href="https://your-project-url.com" ...>

<!-- 2. Replace placeholder div with a real screenshot -->
<div class="project-card__thumb">
  <img src="assets/project-screenshot.jpg"
       alt="Descriptive alt text for the project screenshot"
       loading="lazy" decoding="async"
       width="600" height="375">
  <div class="project-card__overlay" aria-hidden="true">
    <span>View Project →</span>
  </div>
</div>

<!-- 3. Update title, description, and tags -->
<h3 class="project-card__title">Your Project Title</h3>
<p  class="project-card__desc">Short description…</p>
<ul class="project-card__tags" role="list">
  <li>WordPress</li><li>Elementor</li>
</ul>
```

### Activate Google Analytics 4
Uncomment this block in `<head>` of `index.html` and replace the ID:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Activate contact form
Replace the `<form>` action with your preferred service:

**Formspree** (free tier available):
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Netlify Forms** (if deployed on Netlify):
```html
<form netlify name="contact" method="POST">
```

---

## Section Map (index.html)

| HTML comment                | Section ID     | Content source |
|-----------------------------|----------------|----------------|
| `NAVIGATION`                | —              | Logo + nav links |
| `HERO SECTION`              | `#hero`        | Name, typing role, summary, CTAs |
| `ABOUT ME SECTION`          | `#about`       | Professional summary, personal info |
| `SKILLS SECTION`            | `#skills`      | Progress bars + tool tags |
| `EXPERIENCE SECTION`        | `#experience`  | 3 work history entries |
| `EDUCATION SECTION`         | `#education`   | BS IT + 4 certs |
| `PROJECTS SECTION`          | `#projects`    | 6 placeholder project cards |
| `CONTACT SECTION`           | `#contact`     | Form + contact details |
| `FOOTER`                    | `#footer`      | Logo, copyright, nav |

---

## JavaScript Features (js/main.js)

| Feature              | How it works |
|----------------------|--------------|
| Theme toggle         | Sets `data-theme` on `<html>`, saves to `localStorage` |
| Typing animation     | `typeRole()` — chars typed at 100ms, deleted at 55ms, 2.2s pause |
| Hamburger menu       | Toggles `.is-open` on `#hamburger` + `#mobileMenu` |
| Active nav highlight | `IntersectionObserver` on `section[id]` elements |
| Skill bar animation  | `IntersectionObserver` adds `.is-animated` to `.skill__fill` |
| Scroll reveals       | `IntersectionObserver` adds `.is-visible` to `[data-animate]` |
| Stat counters        | Count-up from 0 to `data-count` over 1400ms |
| Header shadow        | Adds `.is-scrolled` to header when `scrollY > 20` |

---

## CSS Architecture (css/style.css)

All theme values are CSS custom properties on `:root`.
The `[data-theme="light"]` block overrides only the values that change.
No JavaScript is needed to swap colours — the CSS handles everything.

```
1.  Root tokens & theme switching
2.  Reset & base
3.  Typography
4.  Layout utilities
5.  Scroll-reveal animation classes
6.  Buttons
7.  Logo switching
8.  Navigation
9.  Hero section
10. About section
11. Skills section
12. Experience / Timeline section
13. Education section
14. Projects section
15. Contact section
16. Footer
17. Responsive — tablet (≤ 1024px)
18. Responsive — mobile (≤ 768px)
19. Responsive — small mobile (≤ 480px)
20. Accessibility utilities
```

---

## SEO Compliance Notes

- **H1**: `Joel B. Gacho` — appears once, in the Hero section
- **H2**: Section titles (About Me, Skills & Expertise, Work Experience, etc.)
- **H3**: Job titles, project names, section sub-headings
- **H4**: Degree title, certification names
- **Meta title**: `Joel Gacho | WordPress Web Designer & SEO Specialist`
- **Meta description**: matches professional summary from CV
- **Canonical**: update `<link rel="canonical">` to live domain
- **OG tags**: Facebook/LinkedIn preview ready
- **Twitter card**: `summary_large_image` type
- **Alt text**: All images have descriptive alt attributes
- **Lazy loading**: All images except the hero use `loading="lazy"`
- **Semantic HTML**: `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`, ARIA labels
- **robots**: `index, follow`

---

## Performance Notes

- Fonts: self-hosted woff2 in `assets/fonts/` (`@font-face` in style.css, `display=swap`),
  preloaded in `<head>` — no Google Fonts request, no render-blocking third-party CSS
- Hero image: `fetchpriority="high"` + responsive `srcset` (480/768/1024w), preload mirrors it
- All other images: `loading="lazy" decoding="async"`, explicit width/height, WebP with
  640w srcset variants for card thumbnails, 100px variants for avatars
- JS: `<script defer>` — non-blocking
- CSS: pages load `css/style.min.css` — regenerate after editing style.css via `npm run build:css`
- No jQuery, no CSS framework — pure vanilla stack
