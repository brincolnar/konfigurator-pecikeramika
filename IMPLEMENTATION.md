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
| `tristranski-oblika` | Three-sided fireplace shape |
| `tristranski-vstavek` | Choose insert for three-sided fireplace |
| `tristranski-zracniki` | Choose vents for three-sided fireplace |
| `tristranski-drva` | Choose wood position for three-sided fireplace |
| `mere-prostora` | Enter room dimensions and contact details (shared by both types) |
| `ponudba` | Review the recap and send the inquiry by e-mail |
| `done` | Sent; the button restarts the configurator |

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

## Mere Prostora & Ponudba

All three flows — ravni, vogalni and tristranski — converge on two shared closing steps.

**`mere-prostora`** — a plain `<form data-mere-form>` (never natively submitted; `novalidate`).
Required: width, length and height of the room, name, e-mail. Optional: wall width,
existing chimney, desired timeline, phone, location, notes. `validateMere()` runs on
"Nadaljuj" and renders a Slovene message into `[data-mere-error]`; the step only advances
when it returns an empty string. The back button routes to whichever drva step matches
`selectedFireplaceType`.

**`ponudba`** — recap plus send. `collectConfiguration()` reads the chosen options back out
of the `aria-checked` attributes (the same source of truth the CSS uses; it branches per
fireplace type, and tristranski has no shape option), `collectMere()`
reads the form, and `renderRecap()` writes them into three `<dl>` lists, dropping empty
values. The preview image is whatever the last step was showing (`currentPreviewSrc()`).

### E-mail delivery

Submitting POSTs JSON to the [Web3Forms](https://web3forms.com) API; Web3Forms delivers to
the address the access key was registered with — **colnar.brin3@gmail.com**. The payload
carries a preformatted plain-text `message` (see `buildPonudbaText()`) plus each field
individually, `replyto` set to the customer's address, and an empty `botcheck` honeypot.

The key comes from `PK_WEB3FORMS_KEY` (see `.env.example`; the non-default `PK_`
prefix is enabled via `envPrefix` in `vite.config.js`); it is a public,
send-only key and is inlined into the bundle at build time by design. Set it in
`.env` locally and as an environment variable in Vercel.

If the key is missing, `sendPonudba()` falls back to opening a `mailto:` link with the same
text prefilled, so no inquiry is silently lost.

There are **no prices** anywhere in the flow — the offer is an inquiry, and pricing is
prepared manually after it arrives.

After a successful send the step machine moves to `done` and the button becomes
"Konfiguriraj nov kamin", which resets the form and returns to the type selection.

---

## What Is Not Yet Implemented

- PDF / printable export of the offer — the recap is on-screen and in the e-mail only.
- No URL routing; browser back/forward does not navigate between steps.
