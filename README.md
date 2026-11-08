# Becky's Calligraphy Landing Page

A plain HTML/CSS/JS rebuild of [wellspringwrites.com](https://www.wellspringwrites.com/) (currently on Squarespace). It has no build step and can be hosted anywhere.

## Pages
| File | Live page |
|---|---|
| `index.html` | / (Home) |
| `about.html` | /about |
| `portfolio.html` | /portfolio |
| `contact.html` | /contact |

## Structure
```
css/styles.css          all styles (desktop + mobile breakpoints at 900px / 760px / 420px)
js/main.js              mobile menu, footer year, contact form placeholder
assets/
  brand/                logo
  about/                Becky's portrait
  client-logos/         12 "Notable Clients" logos
  home/                 home page photos, numbered in page order (01–15)
  portfolio/            4 service photos + gallery-01…06
```

## Preview locally
```bash
python3 -m http.server 8417
```
Then open http://localhost:8417

## Known to-dos
- **Contact form is visual only.** It is not connected to anything yet. To wire it up, use Formspree or Netlify Forms, then remove the submit handler in `js/main.js`.
- **Testimonials** button links to the live Squarespace page; that page hasn't been rebuilt.
- The header and footer are repeated in each HTML file. Change all four when editing them.
- Images are the high-res originals (~13 MB total). Compress or resize them before launch for faster loading.
