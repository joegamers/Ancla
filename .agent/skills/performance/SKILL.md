---
name: performance
description: Comprehensive performance optimization skill for web applications. Covers assets, rendering, and loading strategies.
license: MIT
---

# Web Performance Optimization

Performance is a feature. Fast sites provide better user experiences and convert better.

## Asset Optimization

- **Images:** Use modern formats (WebP, AVIF). Scale images to their display size. Use lazy loading (`loading="lazy"`) for non-critical images.
- **JavaScript:** Minimize and compress bundles. Use code-splitting to ship less code. Defer or use `async` for non-critical scripts.
- **CSS:** Minify and remove unused styles. Inline critical CSS for faster initial render.

## Loading Strategy

- **Critical Path:** Prioritize content needed for the first paint.
- **Resource Hints:** Use `preconnect`, `dns-prefetch`, and `preload` to anticipate future needs.
- **Caching:** Implement robust caching strategies with `Cache-Control` headers and Service Workers.

## Rendering Optimization

- **Main Thread:** Keep the main thread free for user interactions.
- **Animation:** Use CSS transforms and opacity for smooth 60fps animations. Avoid layouts shifts.
- **Virtualization:** For long lists, only render what's in the viewport.

## Key Performance Indicators (KPIs)

- **TTFB:** Time to First Byte.
- **FCP:** First Contentful Paint.
- **LCP:** Largest Contentful Paint (Core Web Vital).
- **INP:** Interaction to Next Paint (Core Web Vital).
- **CLS:** Cumulative Layout Shift (Core Web Vital).
