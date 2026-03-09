---
name: core-web-vitals
description: Specialized skill for monitoring and optimizing Core Web Vitals (LCP, INP, CLS).
license: MIT
---

# Core Web Vitals

Core Web Vitals are a set of three specific metrics that Google uses to measure a page's user experience.

## The Three Metrics

### 1. Largest Contentful Paint (LCP)
- **Measures:** Loading performance.
- **Goal:** Render the largest block of content visible in the viewport within **2.5 seconds**.
- **Optimization:**
  - Optimize images (WebP/AVIF).
  - Use `<link rel="preload">` for LCP images.
  - Optimize server response times (TTFB).
  - Remove render-blocking resources.

### 2. Interaction to Next Paint (INP)
- **Measures:** Responsiveness.
- **Goal:** Provide visual feedback within **200 milliseconds** after a user interaction.
- **Optimization:**
  - Break up long tasks (> 50ms).
  - Avoid heavy main-thread JavaScript execution.
  - Optimize event handlers to yield the thread.
  - Use `requestAnimationFrame` and `requestIdleCallback`.

### 3. Cumulative Layout Shift (CLS)
- **Measures:** Visual stability.
- **Goal:** Maintain a CLS score of less than **0.1**.
- **Optimization:**
  - Always include `width` and `height` attributes on images and video elements.
  - Reserve space for ad slots and embeds.
  - Avoid inserting content above existing content.
  - Use `font-display: swap` to prevent FOIT/FLUT.

## Measurement Tools

- **Lighthouse:** Lab data and synthetic testing.
- **PageSpeed Insights:** Both lab and real-world (CrUX) data.
- **Search Console:** Real-user performance across your entire site.
- **Chrome DevTools:** Performance panel for deep-dive profiling.
