# Solomon M. Hailemariam - Portfolio

Single-page, dark-theme developer portfolio (HTML5, CSS3, vanilla JavaScript - no framework, no build step).

## Structure

```
index.html        page structure only
css/styles.css    "Tech Premium" design system (dark theme)
js/config.js      single source of truth for all personal data and links
js/main.js        renders config data and wires up interactions
images/           profile picture and project images
package.json      project metadata
```

Every name, link, skill, project and paragraph lives in `js/config.js`.
`index.html` contains structure; `main.js` reads the config and builds the content.
A value left as `""` or `[]` in the config is simply not rendered.

## Run locally

Any static file server works:

```bash
# option 1
npm start

# option 2
python -m http.server 8080

# option 3
npx serve .
```

Then open http://localhost:3000 (or the port shown).

Opening `index.html` directly with `file://` also works in most browsers.

## Sections

Home / About / Skills / Projects / How I build / Experience and training / Contact.

- Desktop: fixed 260px left sidebar with vertical navigation and an active cyan indicator bar.
- Mobile: top bar with logo and a full-screen slide-in menu.
- Skills: accessible tab switcher (`role="tablist"`, arrow-key navigation).
- Projects: alternating case-study rows with a "How it works" workflow toggle.
- Scroll reveal and active navigation highlighting use `IntersectionObserver`.
- `prefers-reduced-motion` disables animation.
