# TODO - Performance fixes (Shop load lag)

- [ ] CartContext.jsx: optimize enriched cart items (useMemo productById map)
- [ ] Shop.jsx: prevent per-card translation API fan-out; only translate after bulk names ready (gate by isBulkLoading)
- [ ] Shop.jsx: memoize categories + filteredProducts
- [ ] ImageSlider.jsx/css: reduce heavy motion on low-power (prefers-reduced-motion), adjust video preload
- [ ] Build + smoke test (Home, Shop navigation, Cart +/-)

