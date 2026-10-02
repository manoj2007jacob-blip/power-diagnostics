---
name: power-diagnostics-theme
description: >-
  Design and Theme Guidelines for Power Diagnostics UAE.
  Enforces the corporate Theme Blue color palette across all hero banners, page headers,
  interactive buttons, action cards, and UI accents across the entire application,
  excluding third-party social media (WhatsApp, LinkedIn, Facebook, Instagram, Phone).
---

# Power Diagnostics Theme & Styling Guidelines

## 1. Primary Corporate Color Palette (Theme Blue)
- **Primary Accent**: `#2563eb` (Vibrant Royal / Electric Blue)
- **Dark Accent**: `#1d4ed8` (Deep Corporate Blue)
- **Navy Accent**: `#1e3a8a` / `#1e40af` (Substation Deep Blue)
- **Hero & Primary Button Gradient**: `linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)`
- **Text On Blue**: `#ffffff` (Pure White with high contrast)

## 2. Hero Sections & Banners
- All Page Hero Headers (Shop/Products, Brands, Rental, Repair, Supply, Career, Contact, News/Blog) MUST use the **Theme Blue** gradient:
  ```scss
  .rental-hero-section, .page-hero-section {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
    color: #ffffff;
    min-height: 34vh;
  }
  ```

## 3. Buttons & Action CTAs
- **Primary Buttons & Add-To-Cart Buttons**:
  - Background: `linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important`
  - Text Color: `#ffffff !important`
  - Icon Color: `#ffffff !important`
  - Hover: `linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important` with `translateY(-2px)` and shadow.

## 4. Exceptions (Third-Party Branding Only)
- **WhatsApp**: Green `#25D366`
- **LinkedIn**: LinkedIn Blue `#0a66c2`
- **Facebook**: Facebook Blue `#1877f2`
- **Instagram**: Instagram Gradient `linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)`
- **Phone Hotline**: Hot Red/Orange or Phone Blue as defined.
