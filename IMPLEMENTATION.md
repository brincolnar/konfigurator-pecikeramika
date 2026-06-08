# Konfigurator Peči Keramika — Implementation Overview

## Tech Stack

| Layer | Technology |
|---|---|
| Bundler | Vite 8 |
| Language | Vanilla JavaScript (ES modules) |
| Styling | Plain CSS (custom properties) |
| Font | Plus Jakarta Sans (Google Fonts) |
| Assets | Pre-rendered PNG/JPG layers (no canvas) |

No frameworks, no build-time templates — just a single-page HTML file with one JS file and one CSS file.

---

## File Structure

```
konfigurator-pecikeramika/
├── index.html          — All markup for every step (hidden/shown via CSS)
├── app.js              — All interaction logic
├── styles.css          — All styling
├── kamini/             — Fireplace type selection images
│   ├── ravni.jpg
│   ├── vogalni.jpg
│   └── tristranski.jpg
├── layers/             — Room background and layer images
│   ├── soba.png        — Room background (used in ravni steps)
│   ├── ravni-kamin-osnovni.png
│   └── ravni-kamin-polica.png
├── ravni/              — Ravni kamin assets
│   ├── oblika/         — enostaven.png, polica.png
│   ├── vstavek/        — osnoven_vstavek.png, polica_vstavek.png
│   ├── resetki/        — zračnika.png, zračnika_polica.png
│   └── drva/           — 9 images (shape × vent × side)
└── vogalni/            — Vogalni kamin assets
    ├── oblika/         — osnovna.png, polica.png
    ├── vstavek/        — osnoven_vstavek.png, polica_vstavek.png
    ├── resetki/        — osnoven_resetka.png, polica_resetka.png
    └── drva/           — 12 images (shape × vent × side)
```

---

## Architecture: Step-Based Navigation

The configurator is a **linear wizard** with branching based on the chosen fireplace type. All steps are rendered in the HTML at load time; visibility is toggled with an `is-hidden` CSS class.

A single `currentStep` string variable tracks where the user is. The "Nadaljuj" (Continue) button and all back-buttons call named `show*Step()` functions that manipulate `classList` and update `currentStep`.

### Step IDs

| `currentStep` value | Description |
|---|---|
| `fireplace-type` | Choose fireplace type |
| `ravni-shape` | Choose straight fireplace shape |
| `ravni-vstavek` | Choose insert for straight fireplace |
| `ravni-resetki` | Choose vents for straight fireplace |
| `ravni-drva` | Choose wood position for straight fireplace |
| `vogalni-shape` | Choose corner fireplace shape |
| `vogalni-vstavek` | Choose insert for corner fireplace |
| `vogalni-resetki` | Choose vents for corner fireplace |
| `vogalni-drva` | Choose wood position for corner fireplace |

---

## Step-by-Step Flow

### Step 1 — Fireplace Type (`fireplace-type`)

Three cards: **Ravni**, **Vogalni**, **Tristranski**.

- Clicking a card calls `selectFireplace(type)`, updates `aria-checked`, and refreshes the summary panel (title, description, button label).
- Tristranski is disabled (button is greyed out, `nextStepButton.disabled = true`).
- "Nadaljuj" routes to `ravni-shape` or `vogalni-shape` depending on selection.

**State:** `selectedFireplaceType` (`"ravni"` | `"vogalni"` | `"tristranski"`)

---

### Ravni Kamin Flow

#### Step 2 — Shape (`ravni-shape`)

Two options: **Osnovni** / **S polico**.

- Preview: layered images over a room background (`soba.png`). The fireplace shape image is placed as an absolutely-positioned overlay (`data-fireplace-overlay`).
- Selecting a shape updates `selectedStraightShape` and swaps `fireplaceOverlay.src` to `./ravni/oblika/enostaven.png` or `./ravni/oblika/polica.png`.

**State:** `selectedStraightShape` (`"osnovni"` | `"polica"`)

**Shape data (`straightFireplaceShapes`):**
```
osnovni → oblika/enostaven.png + vstavek/osnoven_vstavek.png
polica  → oblika/polica.png   + vstavek/polica_vstavek.png
```

---

#### Step 3 — Insert (`ravni-vstavek`)

One option: **Standardni vstavek** (only one choice exists currently).

- Preview shows: shape overlay (`data-shape-overlay`) + insert overlay (`data-vstavek-overlay`).
- Insert image is hidden until the user clicks the card; clicking it shows `shape.vstavekImage`.

---

#### Step 4 — Vents (`ravni-resetki`)

Two options: **Brez zračnikov** / **Z zračniki**.

- Preview shows: shape + vstavek overlays, plus a vent overlay (`data-resetki-overlay`) that is toggled visible/hidden based on the selection.
- Vent image varies by shape:

```
osnovni → resetki/zračnika.png
polica  → resetki/zračnika_polica.png
```

---

#### Step 5 — Wood Position (`ravni-drva`)

Three options: **Desno** / **Levo** / **Spodaj**.

- When a wood position is selected, the preview switches from the layered room view to a **single full-bleed image** (no room background, no separate overlays). The room image and shape/vstavek overlays are hidden; a single pre-composited image replaces them.
- Image is chosen from the `drvaImages` lookup table, keyed by `[shape][hasZracniki][side]`:

```
drvaImages = {
  osnovni: {
    zZracniki:      { desno, levo, spodaj }
    brezZracnikov:  { desno, levo, spodaj }
  },
  polica: {
    zZracniki:      { desno, levo, spodaj }
    brezZracnikov:  { desno, levo, spodaj }
  }
}
```

- If the selected combination has no image (`src` is empty), the overlay remains hidden.

---

### Vogalni Kamin Flow

The vogalni flow mirrors the ravni flow in structure but uses **standalone images** (no room background layer composition). The preview area uses a single `is-single` class on `.room-preview` that removes the fixed aspect ratio — images are displayed at natural size.

#### Step 2 — Shape (`vogalni-shape`)

Two options: **Osnovna** / **S polico**.

- Preview is a single image swapped via `data-vogalni-shape-preview`.
- Selecting "osnovna" **hides** the "Drva spodaj" option in the later drva step (`vogalniDrvaSpodajCard.classList.toggle("is-hidden", shape === "osnovna")`).

**State:** `selectedVogalniShape` (`"osnovna"` | `"polica"`)

**Shape data (`vogalniShapes`):**
```
osnovna → oblika/osnovna.png + vstavek/osnoven_vstavek.png + resetki/osnoven_resetka.png
polica  → oblika/polica.png  + vstavek/polica_vstavek.png  + resetki/polica_resetka.png
```

---

#### Step 3 — Insert (`vogalni-vstavek`)

One option: **Standardni vstavek**.

- Preview shows the shape's `vstavekImage` immediately on step entry.

---

#### Step 4 — Vents (`vogalni-resetki`)

Two options: **Brez zračnikov** / **Z zračniki**.

- Clicking "Z zračniki" swaps the preview to `shape.resetkiImage`.
- Clicking "Brez zračnikov" reverts to `shape.vstavekImage`.

---

#### Step 5 — Wood Position (`vogalni-drva`)

Two or three options depending on shape: **Desno** / **Levo** / **Spodaj** (Spodaj hidden for "osnovna").

- On step entry, preview shows a "no wood" state image (with or without vent overlay based on prior selection).
- Clicking a side swaps the preview to the matching pre-composited image from `vogalniDrvaImages`:

```
vogalniDrvaImages = {
  osnovna: {
    zZracniki:      { desno, levo, spodaj: null }
    brezZracnikov:  { desno, levo, spodaj: null }
  },
  polica: {
    zZracniki:      { desno, levo, spodaj }
    brezZracnikov:  { desno, levo, spodaj }
  }
}
```

---

## State Variables

| Variable | Type | Default | Description |
|---|---|---|---|
| `selectedFireplaceType` | string | `"ravni"` | Currently selected fireplace type |
| `selectedStraightShape` | string | `"osnovni"` | Selected ravni shape |
| `selectedVstavek` | string | `"standardni"` | Selected insert (ravni) |
| `selectedVogalniShape` | string | `"osnovna"` | Selected vogalni shape |
| `currentStep` | string | `"fireplace-type"` | Controls which step is visible |

State is held in plain module-scope variables — no store, no framework.

---

## Image Strategy

Two rendering strategies are used:

**Layered composition (ravni steps 2–4):**  
Multiple `<img>` elements are absolutely stacked inside `.room-preview`. Each layer is toggled visible/hidden independently. The room background (`soba.png`) is always present; shape, insert, and vent images are overlaid on top.

**Pre-composited single image (ravni drva step + all vogalni steps):**  
A single pre-rendered image replaces the full preview. This is used when combining all visible elements (shape + vent + wood position) would require too many layers, or when a styled room view isn't needed.

---

## Summary Panel

The sticky right-hand panel (`aside.summary-panel`) shows the current selection's title and description and hosts the "Nadaljuj" (Continue) button. It updates reactively whenever the user changes a selection — there is no separate rendering pass; `selectedTitle.textContent` and `selectedDescription.textContent` are set directly in each selection handler.

---

## Styling Notes

- CSS custom properties are defined on `:root` and referenced throughout (`--pk-red`, `--pk-ink`, etc.).
- Active selection state is driven entirely by `aria-checked="true"` on button elements, styled in CSS (`.fireplace-card[aria-checked="true"]`, `.shape-card[aria-checked="true"]`).
- Responsive breakpoints at `1120px` (summary panel goes inline, room configurator goes single-column) and `820px` (mobile layout, single-column cards, reduced padding).

---

## What Is Not Yet Implemented

- **Tristranski kamin** — card exists but is disabled; no steps or assets.
- **Mere prostora** (room dimensions) — "Nadaljuj na mere prostora" is the final button label on both drva steps, but no step exists for it yet.
- Form submission / summary export — no output after the last step.
- No URL routing; browser back/forward does not navigate between steps.
