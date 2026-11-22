# Portfolio 3

## Run

```sh
npm install
npm run dev
```

Production: `npm run build`, then `npm run preview`.

## Edit content

- `src/data.js`: name, initials, role, introduction, about, details, skills, projects, email, GitHub and LinkedIn.
- Portrait: put your image in `public/images/`, then set `profile.portrait` to `${import.meta.env.BASE_URL}images/your-photo.webp`. Recommended: portrait WebP/AVIF, about 900 px tall. No other person's portrait is used.
- Work: replace the three illustrative SVG previews or change each project's `image`, `description`, `year`, `category`, and `url`. The four real projects and screenshots were imported from the existing portfolios. Years are unset because they were not provided.
- Email, GitHub, LINE, project repositories, live demos and Resume are populated from the existing portfolios. LinkedIn remains unset.
- `src/styles.css`: colors, typography, responsive layouts and motion.
- `src/App.jsx`: sections and interactions; `src/components/Magnetic.jsx`: magnetic effect.
- `index.html`: page title, metadata and document language.

## Behavior

Native smooth scrolling preserves anchors and keyboard scrolling. Menu supports Escape, focus cycling and scroll locking. Project rows expand on click; pointer devices receive a floating image and touch devices see inline images. Reduced motion disables smooth scrolling, marquee, magnetic movement, and reveal transitions. Browser cursor stays visible.

## Assets

Manrope is self-hosted, licensed under SIL Open Font License (see public/fonts/OFL.txt). Project screenshots and portrait are optimized copies of the assets in ../portfolio/photos. The original SVG placeholders remain available for future use. No remote image requests.

## Profile photo picker

The hero uses the cutout portrait configured as `profile.portrait` in `src/data.js`.
