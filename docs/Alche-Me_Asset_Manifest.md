# Alche-Me — Asset Manifest and Folder Guide

## First rule: do not generate every asset at once
Start with a small, coherent MVP asset set. Many visuals should be native UI, SVG, CSS, or procedural 3D geometry. Generate/import high-quality assets only when a screen or feature actually uses them. Avoid duplicated, oversized, unlicensed, or decorative-only assets.

## Folder map

```text
public/assets/
├── branding/       # logo, wordmark, app icon, favicon, monochrome variants
├── backgrounds/    # subtle, optimized backgrounds; avoid heavy full-screen textures
├── worlds/         # world thumbnails, map art, biome props, world-specific decorations
├── characters/     # optional mentor/avatar art; not needed for initial vertical slice
├── icons/          # custom SVG icons only when a suitable icon library is insufficient
├── illustrations/  # lesson diagrams, safety posters, explainers
├── laboratory/     # apparatus models, lab environment textures, instrument icons
├── molecules/      # molecule thumbnails, validated molecular structure files, 3D assets
├── elements/       # optional element tiles/icons; element data should live in structured data
├── audio/          # short UI sounds and optional ambience, all licensed
├── fonts/          # only properly licensed self-hosted font files
└── manifests/      # asset inventory, licenses, attribution and dimensions
```

## Must-have assets for Phase 01–03
1. **Logo/wordmark:** `branding/alche-me-wordmark.svg` and `branding/alche-me-mark.svg`; simple, crisp, usable on light/dark backgrounds. Keep text editable where possible.
2. **App icon/favicon:** square SVG/PNG exports in common sizes. No trademark imitation.
3. **Design references:** approved screenshots or mockups in `docs/design-references/` (not production assets). Include desktop and mobile dashboard, world map, level screen, lesson, quiz, and lab.
4. **UI icon set:** use a consistent licensed icon library initially; do not create hundreds of one-off icons.
5. **World thumbnails:** temporary neutral illustrations for only the first world(s) actually implemented. Use a consistent art direction and aspect ratio.
6. **Lesson diagrams:** only for the first implemented lesson; ensure formulas, labels, atom counts, and scientific representations are correct.
7. **Placeholder strategy:** use deliberate neutral placeholders for not-yet-built content, never broken image URLs or fake completed features.

## Assets for the 3D laboratory (Phase 07)
Create/import only the apparatus needed by the first selected experiment:
- beaker, conical flask, measuring cylinder, pipette/dropper, test tube and rack, wash bottle, thermometer, balance, burette/stand, volumetric flask, as relevant to the actual experiment.
- low-poly but accurate reusable models; correct scale relationships, pivots/origins, materials, transparent glass with restrained rendering cost.
- export preferred runtime models as `.glb`/GLTF; use `.blend` source files in a separate source-assets folder if desired.
- include optimized textures, sensible polygon counts, compressed textures where supported, and a manifest.
- do not create all apparatus before selecting the first experiment from the supplied lab manual.

## Molecule Studio assets (Phase 08)
- Prefer data-driven atoms/bonds and procedural sphere/cylinder geometry for the interactive builder.
- Optional static molecule examples must have scientifically checked atom connectivity, bond orders, charge, stereochemistry where relevant, and provenance.
- Keep source structure files (e.g. SDF/MOL/XYZ when appropriate) separate from preview images. Do not treat a decorative rendered molecule as authoritative chemical data.
- If using a chemistry toolkit, document exactly which calculations it supports in-browser and what needs a backend. Do not imply quantum-chemical accuracy from a visual model.

## Element assets
- The periodic table must contain structured, validated data for all 118 elements. Element properties belong in typed data files, not manually embedded in 118 separate images.
- Optional tiles may use atomic-number labels, symbols and carefully reviewed colors. Ensure color is not the only carrier of meaning.
- Verify units, significant figures, source, and licensing of any imported dataset.

## Audio and fonts
- Audio is optional for the MVP. Add only short, compressed, licensed sound effects with mute controls.
- Use system fonts or an open-licensed font family initially. Keep the license file and attribution for self-hosted fonts.

## Required asset manifest fields
For each asset record: `id`, `path`, `purpose`, `format`, `dimensions_or_polycount`, `source`, `license`, `attribution`, `optimized`, `used_by_feature`, `status`, `notes`.

## Naming conventions
- lowercase kebab-case names, e.g. `lab-beaker-250ml.glb`, `world-atomic-frontier.webp`, `alche-me-mark.svg`.
- Avoid names such as `final-final2.png` or `newlogo.png`.
- Keep editable/source files outside the production `public/assets` directory when they are not needed at runtime.
- Never commit API keys, account exports, private user data, or confidential files into the assets folder.

## Do not attach these
- Huge uncompressed images or videos without a clear use.
- Random Pinterest/Google images with unknown licenses.
- Screenshots of unrelated products to copy pixel-for-pixel.
- Fake “scientific” diagrams or AI-generated formulas that have not been checked.
- Every model/texture from an asset pack before the feature exists.
- API keys, passwords, `.env` files containing secrets, private account data, or copyrighted paid assets without permission.
