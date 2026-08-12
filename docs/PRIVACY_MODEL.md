# Privacy Model

- No analytics, tracking pixels, advertising SDKs or telemetry by default.
- Structured health records stay on the device in the compatibility store and IndexedDB mirror unless the user exports them.
- Health values are not placed in URLs.
- Production code does not log health payloads.
- Service Worker caches static application assets only; personal exports and documents are not cached automatically.
- JSON backup is unencrypted. `.mhos` is encrypted locally with a user password through Web Crypto.
- Original PDFs/images are not persisted by default.
- Runtime has no provider transmission path, API key, telemetry or required backend.
