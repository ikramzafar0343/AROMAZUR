# AROMAZUR - Premium Fragrance Shopify Theme

A modern, luxury e-commerce theme for fragrance retailers built with Shopify Liquid (Online Store 2.0). Inspired by the French Riviera, this theme delivers an elegant shopping experience with smooth animations, advanced filtering, and premium product showcases.

## 🌟 Features

### Design & UX
- **Premium Design Language**: Clean, modern interface with luxury aesthetics
- **Smooth Animations**: CSS-powered marquees, scroll animations, and hover effects
- **Responsive Design**: Fully responsive across all devices
- **Accessibility**: WCAG-compliant with proper ARIA labels and keyboard navigation
- **Performance Optimized**: Lazy loading, optimized images, and efficient CSS/JS

### E-Commerce Features
- **Advanced Product Filtering**: Category, price range, scent profiles, and destination filters
- **Smart Sorting**: Featured, price (low/high), newest
- **Shopping Cart Modal**: Slide-in cart with real-time updates
- **Product Variants**: Full variant selection with quantity controls
- **Product Galleries**: Image galleries with thumbnails and zoom
- **Related Products**: Smart product recommendations

### Specialized Collection Pages
- **Shop All**: Complete product catalog with advanced filtering
- **New Arrivals**: Latest products with "NEW" badges
- **Scent Voyage**: Destination-inspired fragrances with location filtering
- **Perfumes**: Premium fragrance collection with scent profile filters
- **Candles**: Scented candles with burn time and scent family details
- **Contact Form**: Validated contact form with success states

### Header & Navigation
- **Fixed Header**: Sticky navigation with smooth scrolling
- **Animated Announcement Bar**: Left-to-right marquee with countdown timer
- **Mega Menus**: Rich dropdown menus with product previews
- **Mobile Menu**: Slide-out navigation for mobile devices
- **Search Functionality**: Integrated search with toggle panel
- **Cart Icon**: Real-time cart count badge

### Homepage Sections
- **Hero Section**: Full-width hero with video/image backgrounds
- **Collection Slider**: Animated product collection cards
- **Featured Products**: Curated product showcases
- **Heritage Section**: Brand story and values
- **Newsletter Marquee**: Animated promotional cards
- **Customer Reviews**: Testimonial section
- **Environments**: Lifestyle imagery showcase
- **FAQ Section**: Expandable FAQ accordions
- **Newsletter CTA**: Email subscription form

## 📁 Project Structure

```
AROMAZUR/
├── assets/
│   ├── base.css          # Main stylesheet with design tokens
│   ├── theme.js          # JavaScript for interactivity
│   └── news-*.svg        # Newsletter marquee icons
│
├── config/
│   ├── settings_data.json    # Theme settings data
│   └── settings_schema.json   # Theme settings schema
│
├── layout/
│   └── theme.liquid      # Main theme layout
│
├── locales/
│   └── en.default.json   # English translations
│
├── sections/
│   ├── header.liquid              # Main header with navigation
│   ├── footer.liquid              # Footer with links
│   ├── home-hero.liquid           # Homepage hero section
│   ├── home-collection-slider.liquid  # Animated collection cards
│   ├── home-featured-products.liquid  # Featured products grid
│   ├── home-heritage.liquid       # Brand heritage section
│   ├── home-newsletter-marquee.liquid  # Newsletter cards marquee
│   ├── home-newsletter-cta.liquid # Newsletter subscription
│   ├── home-reviews.liquid        # Customer reviews
│   ├── home-environments.liquid   # Lifestyle images
│   ├── home-faq.liquid            # FAQ accordion
│   ├── main-product.liquid        # Product detail page
│   ├── main-collection.liquid     # Default collection page
│   ├── main-shop-all.liquid       # Shop All collection page
│   ├── main-new.liquid            # New Arrivals page
│   ├── main-scent-voyage.liquid   # Scent Voyage page
│   ├── main-perfumes.liquid       # Perfumes collection page
│   ├── main-candles.liquid        # Candles collection page
│   ├── main-contact.liquid        # Contact form page
│   ├── main-cart.liquid           # Shopping cart page
│   ├── main-search.liquid         # Search results page
│   └── main-404.liquid            # 404 error page
│
└── templates/
    ├── index.json         # Homepage template
    ├── product.json       # Product page template
    ├── collection.json    # Collection page template
    ├── shop-all.json      # Shop All template
    ├── page.json          # Generic page template
    ├── cart.json          # Cart page template
    ├── search.json        # Search page template
    ├── list-collections.json  # Collections list
    └── 404.json           # 404 page template
```

## 🚀 Getting Started

### Prerequisites
- Shopify store (Online Store 2.0 compatible)
- Shopify CLI installed
- Node.js (for Shopify CLI)

### Local Development

1. **Install Shopify CLI** (if not already installed):
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. **Login to Shopify**:
   ```bash
   shopify auth login
   ```

3. **Navigate to theme directory**:
   ```bash
   cd AROMAZUR
   ```

4. **Start development server**:
   ```bash
   shopify theme dev --store YOUR-STORE.myshopify.com
   ```

5. **Open preview URL** shown in terminal (usually `https://127.0.0.1:9292`)

### Upload to Shopify

**Important**: Upload files in this order to avoid validation errors:

1. **Upload Section Files First**:
   - All `sections/*.liquid` files
   - This ensures templates can reference them

2. **Upload Template Files**:
   - All `templates/*.json` files

3. **Upload Assets**:
   - `assets/base.css`
   - `assets/theme.js`
   - `assets/*.svg` files

4. **Upload Configuration**:
   - `config/settings_schema.json`
   - `config/settings_data.json`

5. **Upload Layout & Locales**:
   - `layout/theme.liquid`
   - `locales/en.default.json`

**Note**: If uploading all files at once, validation warnings about missing sections are expected and will resolve once the upload completes.

## 🎨 Customization

### Design Tokens (CSS Variables)

The theme uses CSS custom properties for easy customization. Edit `assets/base.css`:

```css
:root {
  /* Colors */
  --color-bg: #ffffff;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-accent: #1a73e8;
  --color-border: #e5e7eb;
  --color-success: #10b981;
  
  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  --spacing-2xl: 4rem;
  --spacing-3xl: 6rem;
  
  /* Typography */
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-serif: Georgia, serif;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
}
```

### Header Customization

The header is hardcoded in `sections/header.liquid`. To customize:

- **Promotional Messages**: Edit the `promo_messages` variable (line 2)
- **Countdown Timer**: Modify `data-countdown-*` attributes (line 9)
- **Navigation Links**: Update the navigation structure (lines 100-400)
- **Mega Menu Content**: Edit mega menu sections for each category

### Collection Page Customization

Each collection page has its own section:

- **Shop All**: `sections/main-shop-all.liquid`
- **New Arrivals**: `sections/main-new.liquid`
- **Scent Voyage**: `sections/main-scent-voyage.liquid`
- **Perfumes**: `sections/main-perfumes.liquid`
- **Candles**: `sections/main-candles.liquid`

Each section includes:
- Hero header with configurable title/description
- Filter sidebar (categories, price range)
- Product grid with sorting
- Empty states
- Specialized content (scent profiles, destinations, etc.)

### Animations

The theme includes several CSS animations:

- **Marquee Animations**: Left-to-right scrolling for announcement bar and newsletter
- **Collection Slider**: Continuous auto-scroll with pause on hover
- **Scroll Animations**: Fade-in and slide-up effects on scroll
- **Hover Effects**: Product cards, buttons, and navigation links

Animation settings can be adjusted in `assets/base.css`:
- Duration: `--az-marquee-duration`, `--az-col-slider-duration`
- Keyframes: `@keyframes az-marquee-scroll`, `@keyframes az-col-marquee-ltr`

## 🔧 Technical Details

### JavaScript Functionality

`assets/theme.js` includes:

- **Countdown Timer**: Real-time countdown in header
- **Search Toggle**: Show/hide search panel
- **Mobile Menu**: Slide-out navigation
- **Cart Modal**: Shopping cart with add/remove/update
- **Product Filtering**: Category, price, scent profile filters
- **Product Sorting**: Dynamic product grid sorting
- **Product Page**: Gallery navigation, variant selection, quantity controls
- **Contact Form**: Form validation and submission
- **Marquee Animations**: JavaScript-driven marquees for better performance

### Liquid Templates

- **Conditional Rendering**: Collection pages only render for specific collections
- **Product Data**: Automatic extraction of product metadata (scent families, burn times, etc.)
- **Dynamic Filtering**: Client-side filtering for instant results
- **Responsive Images**: Shopify image_url filter with width optimization

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Collection Page Setup

### Shop All Page
1. Create a collection with handle `all`
2. Add products to the collection
3. The `main-shop-all.liquid` section will automatically render

### New Arrivals Page
1. Create a collection with handle `new` or `new-arrivals`
2. Tag products with `new` tag for "NEW" badges
3. The `main-new.liquid` section will automatically render

### Scent Voyage Page
1. Create a collection with handle `voyage` or `scent-voyage`
2. Tag products with `destination:paris`, `destination:santorini`, etc.
3. The `main-scent-voyage.liquid` section will automatically render

### Perfumes Page
1. Create a collection with handle `perfumes` or `fragrances`
2. Tag products with scent profile tags (woody, fruity, floral, etc.)
3. The `main-perfumes.liquid` section will automatically render

### Candles Page
1. Create a collection with handle `candles`
2. Tag products with scent family tags (woody, fresh, fruity, floral, oriental)
3. Add burn time info to product descriptions (e.g., "50-60 Hours")
4. The `main-candles.liquid` section will automatically render

## 🐛 Troubleshooting

### Validation Errors During Upload
- **"Section type does not refer to an existing section file"**: Upload section files before template files
- **"Invalid schema"**: Check schema JSON syntax, ensure all required fields are present

### Animations Not Working
- Check browser console for JavaScript errors
- Verify `assets/theme.js` is loaded: `{{ 'theme.js' | asset_url | script_tag }}`
- Ensure CSS animations are not disabled in browser settings

### Filters Not Working
- Verify JavaScript is enabled
- Check browser console for errors
- Ensure product data attributes are present (`data-category`, `data-price`, etc.)

### Cart Modal Not Opening
- Verify cart icon has `data-cart-toggle` attribute
- Check that `initCartModal()` is called in `theme.js`
- Ensure cart modal HTML structure is present in header

## 📦 Data & import

The **`data/`** folder contains everything to populate the store via Shopify Admin:

| File | Purpose |
|------|--------|
| `collections.json` | Collection handles, titles, descriptions |
| `shopify_products_import.csv` | **Single product import file**: 21 products (Handle, Title, Body HTML, Vendor, Type, Tags, Variant, Inventory, SEO). Use this CSV only for Shopify product import. |
| `product_metafields_populated.json` | Metafield values per product (French, normalized: `family`, `intensity`, `coverage`, `top_notes`, `heart_notes`, `base_notes`, `emoji`, `badges`) |
| `metafields_definitions.json` | Metafield schema for Settings → Custom data → Products |
| `products.json` | Full product catalog (title, price, tags, collections) |

**Steps:** Import products from the CSV, then apply metafields from `product_metafields_populated.json` (Bulk editor or per product). Theme reads both legacy keys (`fragrance_family`, `coverage_days`, `notes_top`/`notes_heart`/`notes_base`) and new keys (`family`, `coverage`, `top_notes`/`heart_notes`/`base_notes`) for compatibility.

### Nav links (hardcoded)

#NEW, SALE, DIFFUSERS, DIFFUSER OILS, SCENT VOYAGE, CANDLES, and PERFUMES all point to Shop All with `?view=new`, `?view=sale`, `?view=diffusers`, `?view=fragrance-oils`, `?view=voyage`, `?view=candles`, or `?view=perfumes`. No collections or pages need to be created in Admin; the theme filters products by **Type** and **Tags** on the Shop All page. Use **Type** exactly: `Diffusers`, `Fragrance Oils`, `Coffrets`, `Candles`, `Perfumes`. Use **Tags** for filters: `new-arrivals`, `sale`, `diffusers`, `fragrance-oils`, `scent-voyage`, `hotel-collection`, `designer-collection`.






## 📚 Resources

- [Shopify Liquid Documentation](https://shopify.dev/docs/api/liquid)
- [Shopify Theme Development](https://shopify.dev/docs/themes)
- [Online Store 2.0](https://shopify.dev/docs/themes/architecture)

## 📄 License

This theme is proprietary and created for AROMAZUR. All rights reserved.

## 👥 Support

For theme support or customization requests, contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Shopify Compatibility**: Online Store 2.0+
"# AROMAZUR" 
