# Notary Nexxus Portal — design prototype

Clickable, light/dark prototype of the Notary Nexxus signing-service portal (test data only).

- `portal/index.html` + `portal/src/` — source (styles, core, orders, forms, directory, app)
- `portal/dist/notary-nexxus-portal.html` — single-file bundle for sharing
- Rebuild the bundle: `portal/build.sh`
- Run locally: `python3 -m http.server 4173 --directory portal` → http://localhost:4173
