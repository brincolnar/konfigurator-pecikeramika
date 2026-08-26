const fireplaceTypes = {
  ravni: {
    title: "Ravni kamin",
    description: "Frontalni pogled na ogenj za čiste, umirjene linije prostora.",
    nextLabel: "Nadaljuj na obliko kamina",
  },
  vogalni: {
    title: "Vogalni kamin",
    description: "Ogenj poudari stik dveh sten in ustvari širši pogled v prostoru.",
    nextLabel: "Nadaljuj na obliko kamina",
  },
  tristranski: {
    title: "Tristranski kamin — v pripravi",
    description:
      "Konfigurator za tristranske kamine še pripravljamo, zato te izvedbe zaenkrat ni mogoče sestaviti do ponudbe. Če vas zanima, nas kontaktirajte in ponudbo pripravimo ročno.",
    nextLabel: "Konfigurator še ni na voljo",
  },
};

const vogalniShapes = {
  osnovna: {
    title: "Osnovna vogalni kamin",
    description: "Čista vogalna izvedba brez dodatne police.",
    image: "./vogalni/oblika/osnovna.png",
    vstavekImage: "./vogalni/vstavek/osnoven_vstavek.png",
    resetkiImage: "./vogalni/resetki/osnoven_resetka.png",
  },
  polica: {
    title: "Vogalni kamin s polico",
    description: "Vogalni kamin z dodano polico.",
    image: "./vogalni/oblika/polica.png",
    vstavekImage: "./vogalni/vstavek/polica_vstavek.png",
    resetkiImage: "./vogalni/resetki/polica_resetka.png",
  },
};

const vogalniDrvaImages = {
  osnovna: {
    zZracniki: {
      desno: "./vogalni/drva/osnoven_drvadesno_zracnik.png",
      levo: "./vogalni/drva/osnoven_drvalevo_zracnik.png",
      spodaj: null,
    },
    brezZracnikov: {
      desno: "./vogalni/drva/osnoven_drvadesno.png",
      levo: "./vogalni/drva/osnoven_drvalevo.png",
      spodaj: null,
    },
  },
  polica: {
    zZracniki: {
      desno: "./vogalni/drva/polica_drva_desno_zracnik.png",
      levo: "./vogalni/drva/polica_drvaleva_zracnik.png",
      spodaj: "./vogalni/drva/polica_drva_spodaj_zracniki.png",
    },
    brezZracnikov: {
      desno: "./vogalni/drva/polica_drva_desnno.png",
      levo: "./vogalni/drva/polica_drvaleva.png",
      spodaj: "./vogalni/drva/polica_drva_spodaj.jpg",
    },
  },
};

const straightFireplaceShapes = {
  osnovni: {
    title: "Osnovni ravni kamin",
    description: "Čista ravna izvedba brez dodatne police.",
    image: "./ravni/oblika/enostaven.png",
    vstavekImage: "./ravni/vstavek/osnoven_vstavek.png",
  },
  polica: {
    title: "Ravni kamin s polico",
    description: "Ravni kamin z dodano uporabno in vizualno polico.",
    image: "./ravni/oblika/polica.png",
    vstavekImage: "./ravni/vstavek/polica_vstavek.png",
  },
};

const cards = document.querySelectorAll(".fireplace-card");
const shapeCards = document.querySelectorAll(".shape-card");
const vstavekCards = document.querySelectorAll("[data-vstavek]");
const selectedTitle = document.querySelector("#selected-title");
const selectedDescription = document.querySelector("#selected-description");
const nextStepButton = document.querySelector("[data-next-step]");
const backToTypesButton = document.querySelector("[data-back-to-types]");
const backToShapeButton = document.querySelector("[data-back-to-shape]");
const backToVstavekButton = document.querySelector("[data-back-to-vstavek]");
const fireplaceTypeStep = document.querySelector('[data-step="fireplace-type"]');
const straightShapeStep = document.querySelector('[data-step="ravni-shape"]');
const vstavekStep = document.querySelector('[data-step="ravni-vstavek"]');
const resetkiStep = document.querySelector('[data-step="ravni-resetki"]');
const fireplaceOverlay = document.querySelector("[data-fireplace-overlay]");
const shapeOverlay = document.querySelector("[data-shape-overlay]");
const vstavekOverlay = document.querySelector("[data-vstavek-overlay]");
const resetkiShapeOverlay = document.querySelector("[data-resetki-shape-overlay]");
const resetkiVstavekOverlay = document.querySelector("[data-resetki-vstavek-overlay]");
const resetkiOverlay = document.querySelector("[data-resetki-overlay]");

let selectedFireplaceType = "ravni";
let selectedStraightShape = "osnovni";
let selectedVstavek = "standardni";
let selectedVogalniShape = "osnovna";

const selectFireplace = (selectedType) => {
  const selected = fireplaceTypes[selectedType];

  if (!selected) {
    return;
  }

  cards.forEach((card) => {
    card.setAttribute("aria-checked", String(card.dataset.fireplace === selectedType));
  });

  selectedFireplaceType = selectedType;
  selectedTitle.textContent = selected.title;
  selectedDescription.textContent = selected.description;
  nextStepButton.textContent = selected.nextLabel;
  nextStepButton.disabled = selectedType === "tristranski";
};

const selectStraightShape = (selectedShape) => {
  const selected = straightFireplaceShapes[selectedShape];

  if (!selected) {
    return;
  }

  selectedStraightShape = selectedShape;

  shapeCards.forEach((card) => {
    card.setAttribute("aria-checked", String(card.dataset.shape === selectedShape));
  });

  fireplaceOverlay.src = selected.image;
  selectedTitle.textContent = selected.title;
  selectedDescription.textContent = selected.description;
};

const showStraightShapeStep = () => {
  if (selectedFireplaceType !== "ravni") {
    return;
  }

  fireplaceTypeStep.classList.add("is-hidden");
  straightShapeStep.classList.remove("is-hidden");
  nextStepButton.textContent = "Nadaljuj na izbor vstavka";
  selectStraightShape(selectedStraightShape);
};

const showVstavekStep = () => {
  straightShapeStep.classList.add("is-hidden");
  vstavekStep.classList.remove("is-hidden");
  const shape = straightFireplaceShapes[selectedStraightShape];
  shapeOverlay.src = shape.image;
  vstavekOverlay.src = "";
  vstavekOverlay.classList.add("is-hidden");
  vstavekCards.forEach((c) => c.setAttribute("aria-checked", "false"));
  const nextLabel = "Nadaljuj na izbor zračnikov";
  nextStepButton.textContent = nextLabel;
  selectedTitle.textContent = "Standardni vstavek";
  selectedDescription.textContent = "Klasični vstavek za ravni kamin.";
};

const resetkiOverlayImages = {
  osnovni: "./ravni/resetki/zračnika.png",
  polica: "./ravni/resetki/zračnika_polica.png",
};

const showResetkiStep = () => {
  vstavekStep.classList.add("is-hidden");
  resetkiStep.classList.remove("is-hidden");
  const shape = straightFireplaceShapes[selectedStraightShape];
  resetkiShapeOverlay.src = shape.image;
  resetkiVstavekOverlay.src = shape.vstavekImage;
  resetkiOverlay.src = resetkiOverlayImages[selectedStraightShape];
  resetkiOverlay.classList.add("is-hidden");
  resetkiCards.forEach((c) => c.setAttribute("aria-checked", "false"));
  nextStepButton.textContent = "Nadaljuj na položaj drv";
  selectedTitle.textContent = "Izbira zračnikov";
  selectedDescription.textContent = "Izberite ali želite vidne prezračevalne rešetke.";
};

const showFireplaceTypeStep = () => {
  straightShapeStep.classList.add("is-hidden");
  vstavekStep.classList.add("is-hidden");
  resetkiStep.classList.add("is-hidden");
  drvaStep.classList.add("is-hidden");
  vogalniShapeStep.classList.add("is-hidden");
  vogalniVstavekStep.classList.add("is-hidden");
  vogalniResetkiStep.classList.add("is-hidden");
  vogalniDrvaStep.classList.add("is-hidden");
  mereStep.classList.add("is-hidden");
  ponudbaStep.classList.add("is-hidden");
  fireplaceTypeStep.classList.remove("is-hidden");
  selectFireplace(selectedFireplaceType);
};

const showShapeStepFromVstavek = () => {
  vstavekStep.classList.add("is-hidden");
  straightShapeStep.classList.remove("is-hidden");
  nextStepButton.textContent = "Nadaljuj na izbor vstavka";
  selectStraightShape(selectedStraightShape);
};

const showVstavekStepFromResetki = () => {
  resetkiStep.classList.add("is-hidden");
  vstavekStep.classList.remove("is-hidden");
  const shape = straightFireplaceShapes[selectedStraightShape];
  shapeOverlay.src = shape.image;
  nextStepButton.textContent = "Nadaljuj na izbor zračnikov";
  selectedTitle.textContent = "Standardni vstavek";
  selectedDescription.textContent = "Klasični vstavek za ravni kamin.";
};

cards.forEach((card) => {
  card.addEventListener("click", () => selectFireplace(card.dataset.fireplace));
});

shapeCards.forEach((card) => {
  card.addEventListener("click", () => selectStraightShape(card.dataset.shape));
});

vstavekCards.forEach((card) => {
  card.addEventListener("click", () => {
    vstavekCards.forEach((c) => c.setAttribute("aria-checked", "false"));
    card.setAttribute("aria-checked", "true");
    const shape = straightFireplaceShapes[selectedStraightShape];
    vstavekOverlay.src = shape.vstavekImage;
    vstavekOverlay.classList.remove("is-hidden");
  });
});

const resetkiCards = document.querySelectorAll("[data-resetki]");

resetkiCards.forEach((card) => {
  card.addEventListener("click", () => {
    resetkiCards.forEach((c) => c.setAttribute("aria-checked", "false"));
    card.setAttribute("aria-checked", "true");
    if (card.dataset.resetki === "z-zracniki") {
      resetkiOverlay.classList.remove("is-hidden");
    } else {
      resetkiOverlay.classList.add("is-hidden");
    }
  });
});

const drvaStep = document.querySelector('[data-step="ravni-drva"]');
const drvaShapeOverlay = document.querySelector("[data-drva-shape-overlay]");
const drvaVstavekOverlay = document.querySelector("[data-drva-vstavek-overlay]");
const drvaResetkiOverlay = document.querySelector("[data-drva-resetki-overlay]");
const drvaOverlay = document.querySelector("[data-drva-overlay]");
const backToResetkiButton = document.querySelector("[data-back-to-resetki]");
const drvaCards = document.querySelectorAll("[data-drva]");
const drvaPreview = drvaStep.querySelector(".room-preview");
const drvaRoomImage = drvaStep.querySelector(".room-image");

const drvaImages = {
  osnovni: {
    zZracniki: {
      desno: "./ravni/drva/drvadesno.jpg",
      levo: "./ravni/drva/drvalevo.jpg",
      spodaj: "./ravni/drva/drvaspodajzracnik.png",
    },
    brezZracnikov: {
      desno: "./ravni/drva/drvadesnobrezzracnikov.png",
      levo: "./ravni/drva/drvalevobrezzracnikov.png",
      spodaj: "",
    },
  },
  polica: {
    zZracniki: {
      desno: "./ravni/drva/drvadesnopolicazracnik.png",
      levo: "./ravni/drva/drvalevopolicazracnik.png",
      spodaj: "./ravni/drva/drvaspodajpolicazracnik.png",
    },
    brezZracnikov: {
      desno: "./ravni/drva/policadrvadesno.png",
      levo: "./ravni/drva/policadrvalevo.png",
      spodaj: "./ravni/drva/drvaspodajpolica.png",
    },
  },
};

const showDrvaStep = () => {
  resetkiStep.classList.add("is-hidden");
  drvaStep.classList.remove("is-hidden");
  const shape = straightFireplaceShapes[selectedStraightShape];
  drvaShapeOverlay.src = shape.image;
  drvaVstavekOverlay.src = shape.vstavekImage;
  const hasZracniki = Array.from(resetkiCards).find((c) => c.dataset.resetki === "z-zracniki")?.getAttribute("aria-checked") === "true";
  drvaResetkiOverlay.src = resetkiOverlayImages[selectedStraightShape];
  if (hasZracniki) {
    drvaResetkiOverlay.classList.remove("is-hidden");
  } else {
    drvaResetkiOverlay.classList.add("is-hidden");
  }
  drvaRoomImage.classList.remove("is-hidden");
  drvaShapeOverlay.classList.remove("is-hidden");
  drvaVstavekOverlay.classList.remove("is-hidden");
  drvaPreview.classList.remove("is-single");
  drvaOverlay.src = "";
  drvaOverlay.classList.remove("is-static");
  drvaOverlay.classList.add("is-hidden");
  drvaCards.forEach((c) => c.setAttribute("aria-checked", "false"));
  nextStepButton.textContent = "Nadaljuj na mere prostora";
  selectedTitle.textContent = "Položaj drv";
  selectedDescription.textContent = "Izberite na kateri strani bodo drva.";
};

const showResetkiStepFromDrva = () => {
  drvaStep.classList.add("is-hidden");
  resetkiStep.classList.remove("is-hidden");
  nextStepButton.textContent = "Nadaljuj na položaj drv";
  selectedTitle.textContent = "Izbira zračnikov";
  selectedDescription.textContent = "Izberite ali želite vidne prezračevalne rešetke.";
};

drvaCards.forEach((card) => {
  card.addEventListener("click", () => {
    drvaCards.forEach((c) => c.setAttribute("aria-checked", "false"));
    card.setAttribute("aria-checked", "true");
    const hasZracniki = Array.from(resetkiCards).find((c) => c.dataset.resetki === "z-zracniki")?.getAttribute("aria-checked") === "true";
    const shapeSet = drvaImages[selectedStraightShape];
    const set = hasZracniki ? shapeSet.zZracniki : shapeSet.brezZracnikov;
    const src = set[card.dataset.drva];
    if (src) {
      drvaRoomImage.classList.add("is-hidden");
      drvaShapeOverlay.classList.add("is-hidden");
      drvaVstavekOverlay.classList.add("is-hidden");
      drvaResetkiOverlay.classList.add("is-hidden");
      drvaPreview.classList.add("is-single");
      drvaOverlay.src = src;
      drvaOverlay.classList.add("is-static");
      drvaOverlay.classList.remove("is-hidden");
    } else {
      drvaOverlay.src = "";
      drvaOverlay.classList.add("is-hidden");
    }
  });
});

backToResetkiButton.addEventListener("click", () => {
  showResetkiStepFromDrva();
  currentStep = "ravni-resetki";
});

// ─── Vogalni kamin ────────────────────────────────────────────────────────────

const vogalniShapeStep = document.querySelector('[data-step="vogalni-shape"]');
const vogalniVstavekStep = document.querySelector('[data-step="vogalni-vstavek"]');
const vogalniResetkiStep = document.querySelector('[data-step="vogalni-resetki"]');
const vogalniDrvaStep = document.querySelector('[data-step="vogalni-drva"]');

const vogalniShapeCards = document.querySelectorAll("[data-vogalni-shape]");
const vogalniVstavekCards = document.querySelectorAll("[data-vogalni-vstavek]");
const vogalniResetkiCards = document.querySelectorAll("[data-vogalni-resetki]");
const vogalniDrvaCards = document.querySelectorAll("[data-vogalni-drva]");
const vogalniDrvaSpodajCard = document.querySelector("[data-vogalni-drva-spodaj]");

const vogalniShapePreview = document.querySelector("[data-vogalni-shape-preview]");
const vogalniVstavekPreview = document.querySelector("[data-vogalni-vstavek-preview]");
const vogalniResetkiPreview = document.querySelector("[data-vogalni-resetki-preview]");
const vogalniDrvaPreview = document.querySelector("[data-vogalni-drva-preview]");

const backToTypesFromVogalniButton = document.querySelector("[data-back-to-types-from-vogalni]");
const backToVogalniShapeButton = document.querySelector("[data-back-to-vogalni-shape]");
const backToVogalniVstavekButton = document.querySelector("[data-back-to-vogalni-vstavek]");
const backToVogalniResetkiButton = document.querySelector("[data-back-to-vogalni-resetki]");

const selectVogalniShape = (shape) => {
  const selected = vogalniShapes[shape];
  if (!selected) return;
  selectedVogalniShape = shape;
  vogalniShapeCards.forEach((c) => c.setAttribute("aria-checked", String(c.dataset.vogalniShape === shape)));
  vogalniShapePreview.src = selected.image;
  selectedTitle.textContent = selected.title;
  selectedDescription.textContent = selected.description;
  vogalniDrvaSpodajCard.classList.toggle("is-hidden", shape === "osnovna");
};

const showVogalniShapeStep = () => {
  fireplaceTypeStep.classList.add("is-hidden");
  vogalniShapeStep.classList.remove("is-hidden");
  nextStepButton.textContent = "Nadaljuj na izbor vstavka";
  selectVogalniShape(selectedVogalniShape);
};

const showVogalniVstavekStep = () => {
  vogalniShapeStep.classList.add("is-hidden");
  vogalniVstavekStep.classList.remove("is-hidden");
  const shape = vogalniShapes[selectedVogalniShape];
  vogalniVstavekPreview.src = shape.vstavekImage;
  vogalniVstavekCards.forEach((c) => c.setAttribute("aria-checked", "false"));
  nextStepButton.textContent = "Nadaljuj na izbor zračnikov";
  selectedTitle.textContent = "Standardni vstavek";
  selectedDescription.textContent = "Klasični vstavek za vogalni kamin.";
};

const showVogalniResetkiStep = () => {
  vogalniVstavekStep.classList.add("is-hidden");
  vogalniResetkiStep.classList.remove("is-hidden");
  const shape = vogalniShapes[selectedVogalniShape];
  vogalniResetkiPreview.src = shape.vstavekImage;
  vogalniResetkiCards.forEach((c) => c.setAttribute("aria-checked", "false"));
  nextStepButton.textContent = "Nadaljuj na položaj drv";
  selectedTitle.textContent = "Izbira zračnikov";
  selectedDescription.textContent = "Izberite ali želite vidne prezračevalne rešetke.";
};

const showVogalniDrvaStep = () => {
  vogalniResetkiStep.classList.add("is-hidden");
  vogalniDrvaStep.classList.remove("is-hidden");
  const shape = vogalniShapes[selectedVogalniShape];
  const hasZracniki = Array.from(vogalniResetkiCards).find((c) => c.dataset.vogalniResetki === "z-zracniki")?.getAttribute("aria-checked") === "true";
  if (hasZracniki) {
    vogalniDrvaPreview.src = selectedVogalniShape === "osnovna"
      ? "./vogalni/drva/osnoven_brezdrv_zracnik.png"
      : "./vogalni/drva/polica_brezdrv_zracnik.png";
  } else {
    vogalniDrvaPreview.src = shape.vstavekImage;
  }
  vogalniDrvaCards.forEach((c) => c.setAttribute("aria-checked", "false"));
  nextStepButton.textContent = "Nadaljuj na mere prostora";
  selectedTitle.textContent = "Položaj drv";
  selectedDescription.textContent = "Izberite na kateri strani bodo drva.";
};

const showVogalniShapeFromVstavek = () => {
  vogalniVstavekStep.classList.add("is-hidden");
  vogalniShapeStep.classList.remove("is-hidden");
  nextStepButton.textContent = "Nadaljuj na izbor vstavka";
  selectVogalniShape(selectedVogalniShape);
};

const showVogalniVstavekFromResetki = () => {
  vogalniResetkiStep.classList.add("is-hidden");
  vogalniVstavekStep.classList.remove("is-hidden");
  const shape = vogalniShapes[selectedVogalniShape];
  vogalniVstavekPreview.src = shape.vstavekImage;
  nextStepButton.textContent = "Nadaljuj na izbor zračnikov";
  selectedTitle.textContent = "Standardni vstavek";
  selectedDescription.textContent = "Klasični vstavek za vogalni kamin.";
};

const showVogalniResetkiFromDrva = () => {
  vogalniDrvaStep.classList.add("is-hidden");
  vogalniResetkiStep.classList.remove("is-hidden");
  nextStepButton.textContent = "Nadaljuj na položaj drv";
  selectedTitle.textContent = "Izbira zračnikov";
  selectedDescription.textContent = "Izberite ali želite vidne prezračevalne rešetke.";
};

vogalniShapeCards.forEach((card) => {
  card.addEventListener("click", () => selectVogalniShape(card.dataset.vogalniShape));
});

vogalniVstavekCards.forEach((card) => {
  card.addEventListener("click", () => {
    vogalniVstavekCards.forEach((c) => c.setAttribute("aria-checked", "false"));
    card.setAttribute("aria-checked", "true");
  });
});

vogalniResetkiCards.forEach((card) => {
  card.addEventListener("click", () => {
    vogalniResetkiCards.forEach((c) => c.setAttribute("aria-checked", "false"));
    card.setAttribute("aria-checked", "true");
    const shape = vogalniShapes[selectedVogalniShape];
    vogalniResetkiPreview.src = card.dataset.vogalniResetki === "z-zracniki"
      ? shape.resetkiImage
      : shape.vstavekImage;
  });
});

vogalniDrvaCards.forEach((card) => {
  card.addEventListener("click", () => {
    vogalniDrvaCards.forEach((c) => c.setAttribute("aria-checked", "false"));
    card.setAttribute("aria-checked", "true");
    const hasZracniki = Array.from(vogalniResetkiCards).find((c) => c.dataset.vogalniResetki === "z-zracniki")?.getAttribute("aria-checked") === "true";
    const shapeSet = vogalniDrvaImages[selectedVogalniShape];
    const set = hasZracniki ? shapeSet.zZracniki : shapeSet.brezZracnikov;
    const src = set[card.dataset.vogalniDrva];
    if (src) vogalniDrvaPreview.src = src;
  });
});

backToTypesFromVogalniButton.addEventListener("click", () => {
  showFireplaceTypeStep();
  currentStep = "fireplace-type";
});

backToVogalniShapeButton.addEventListener("click", () => {
  showVogalniShapeFromVstavek();
  currentStep = "vogalni-shape";
});

backToVogalniVstavekButton.addEventListener("click", () => {
  showVogalniVstavekFromResetki();
  currentStep = "vogalni-vstavek";
});

backToVogalniResetkiButton.addEventListener("click", () => {
  showVogalniResetkiFromDrva();
  currentStep = "vogalni-resetki";
});

let currentStep = "fireplace-type";

nextStepButton.addEventListener("click", () => {
  if (currentStep === "fireplace-type") {
    if (selectedFireplaceType === "ravni") {
      showStraightShapeStep();
      currentStep = "ravni-shape";
    } else if (selectedFireplaceType === "vogalni") {
      showVogalniShapeStep();
      currentStep = "vogalni-shape";
    }
  } else if (currentStep === "ravni-shape") {
    showVstavekStep();
    currentStep = "ravni-vstavek";
  } else if (currentStep === "ravni-vstavek") {
    showResetkiStep();
    currentStep = "ravni-resetki";
  } else if (currentStep === "ravni-resetki") {
    showDrvaStep();
    currentStep = "ravni-drva";
  } else if (currentStep === "vogalni-shape") {
    showVogalniVstavekStep();
    currentStep = "vogalni-vstavek";
  } else if (currentStep === "vogalni-vstavek") {
    showVogalniResetkiStep();
    currentStep = "vogalni-resetki";
  } else if (currentStep === "vogalni-resetki") {
    showVogalniDrvaStep();
    currentStep = "vogalni-drva";
  } else if (currentStep === "ravni-drva" || currentStep === "vogalni-drva") {
    showMereStep();
    currentStep = "mere-prostora";
  } else if (currentStep === "mere-prostora") {
    const error = validateMere(collectMere());

    if (error) {
      mereError.textContent = error;
      mereError.classList.remove("is-hidden");
      return;
    }

    mereError.classList.add("is-hidden");
    showPonudbaStep();
    currentStep = "ponudba";
  } else if (currentStep === "ponudba") {
    sendPonudba();
  }
});

backToTypesButton.addEventListener("click", () => {
  showFireplaceTypeStep();
  currentStep = "fireplace-type";
});

backToShapeButton.addEventListener("click", () => {
  showShapeStepFromVstavek();
  currentStep = "ravni-shape";
});

backToVstavekButton.addEventListener("click", () => {
  showVstavekStepFromResetki();
  currentStep = "ravni-vstavek";
});

// ─── Mere prostora + ponudba ──────────────────────────────────────────────────

const WEB3FORMS_ACCESS_KEY = import.meta.env.PK_WEB3FORMS_KEY ?? "";
const PONUDBA_EMAIL = "colnar.brin3@gmail.com";

const mereStep = document.querySelector('[data-step="mere-prostora"]');
const ponudbaStep = document.querySelector('[data-step="ponudba"]');
const mereForm = document.querySelector("[data-mere-form]");
const mereEyebrow = document.querySelector("[data-mere-eyebrow]");
const mereError = document.querySelector("[data-mere-error]");
const backToDrvaButton = document.querySelector("[data-back-to-drva]");
const backToMereButton = document.querySelector("[data-back-to-mere]");
const ponudbaPreview = document.querySelector("[data-ponudba-preview]");
const ponudbaStatus = document.querySelector("[data-ponudba-status]");
const recapKonfiguracija = document.querySelector("[data-recap-konfiguracija]");
const recapMere = document.querySelector("[data-recap-mere]");
const recapKontakt = document.querySelector("[data-recap-kontakt]");

const checkedLabel = (nodeList, fallback = "Ni izbrano") => {
  const checked = Array.from(nodeList).find((c) => c.getAttribute("aria-checked") === "true");
  return checked?.querySelector(".shape-title")?.textContent.trim() ?? fallback;
};

const collectConfiguration = () => {
  if (selectedFireplaceType === "vogalni") {
    return {
      "Tip kamina": fireplaceTypes.vogalni.title,
      Oblika: vogalniShapes[selectedVogalniShape].title,
      Vstavek: checkedLabel(vogalniVstavekCards),
      Zračniki: checkedLabel(vogalniResetkiCards),
      "Položaj drv": checkedLabel(vogalniDrvaCards),
    };
  }

  return {
    "Tip kamina": fireplaceTypes.ravni.title,
    Oblika: straightFireplaceShapes[selectedStraightShape].title,
    Vstavek: checkedLabel(vstavekCards),
    Zračniki: checkedLabel(resetkiCards),
    "Položaj drv": checkedLabel(drvaCards),
  };
};

const collectMere = () => {
  const data = new FormData(mereForm);
  const value = (name) => String(data.get(name) ?? "").trim();

  return {
    sirinaProstora: value("sirinaProstora"),
    dolzinaProstora: value("dolzinaProstora"),
    visinaProstora: value("visinaProstora"),
    sirinaStene: value("sirinaStene"),
    dimnik: value("dimnik"),
    rok: value("rok"),
    ime: value("ime"),
    epasta: value("epasta"),
    telefon: value("telefon"),
    kraj: value("kraj"),
    opombe: value("opombe"),
  };
};

const validateMere = (mere) => {
  const missing = [];
  if (!mere.sirinaProstora) missing.push("širina prostora");
  if (!mere.dolzinaProstora) missing.push("dolžina prostora");
  if (!mere.visinaProstora) missing.push("višina prostora");
  if (!mere.ime) missing.push("ime in priimek");
  if (!mere.epasta) missing.push("e-pošta");

  if (missing.length > 0) {
    return `Prosimo, izpolnite obvezna polja: ${missing.join(", ")}.`;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mere.epasta)) {
    return "Vnesite veljaven e-poštni naslov.";
  }

  return "";
};

const currentPreviewSrc = () => {
  if (selectedFireplaceType === "vogalni") {
    return vogalniDrvaPreview.src;
  }

  return drvaOverlay.classList.contains("is-hidden") || !drvaOverlay.getAttribute("src")
    ? drvaShapeOverlay.src
    : drvaOverlay.src;
};

const renderRecap = (list, entries) => {
  list.innerHTML = "";
  entries
    .filter(([, value]) => value !== "")
    .forEach(([label, value]) => {
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = value;
      list.append(dt, dd);
    });
};

const showMereStep = () => {
  drvaStep.classList.add("is-hidden");
  vogalniDrvaStep.classList.add("is-hidden");
  mereStep.classList.remove("is-hidden");
  mereError.classList.add("is-hidden");
  mereEyebrow.textContent = fireplaceTypes[selectedFireplaceType].title;
  nextStepButton.disabled = false;
  nextStepButton.textContent = "Nadaljuj na ponudbo";
  selectedTitle.textContent = "Mere prostora";
  selectedDescription.textContent = "Vnesite mere prostora in kontaktne podatke za pripravo ponudbe.";
};

const showDrvaStepFromMere = () => {
  mereStep.classList.add("is-hidden");
  ponudbaStep.classList.add("is-hidden");
  if (selectedFireplaceType === "vogalni") {
    vogalniDrvaStep.classList.remove("is-hidden");
  } else {
    drvaStep.classList.remove("is-hidden");
  }
  nextStepButton.disabled = false;
  nextStepButton.textContent = "Nadaljuj na mere prostora";
  selectedTitle.textContent = "Položaj drv";
  selectedDescription.textContent = "Izberite na kateri strani bodo drva.";
};

const showPonudbaStep = () => {
  const mere = collectMere();

  mereStep.classList.add("is-hidden");
  ponudbaStep.classList.remove("is-hidden");
  ponudbaStatus.classList.add("is-hidden");
  ponudbaStatus.classList.remove("is-error", "is-success");

  const previewSrc = currentPreviewSrc();
  ponudbaPreview.src = previewSrc;
  ponudbaPreview.classList.toggle("is-hidden", !previewSrc);

  renderRecap(recapKonfiguracija, Object.entries(collectConfiguration()));
  renderRecap(recapMere, [
    ["Širina prostora", `${mere.sirinaProstora} cm`],
    ["Dolžina prostora", `${mere.dolzinaProstora} cm`],
    ["Višina prostora", `${mere.visinaProstora} cm`],
    ["Širina stene za kamin", mere.sirinaStene ? `${mere.sirinaStene} cm` : ""],
    ["Obstoječi dimnik", mere.dimnik],
    ["Želeni rok izvedbe", mere.rok],
  ]);
  renderRecap(recapKontakt, [
    ["Ime in priimek", mere.ime],
    ["E-pošta", mere.epasta],
    ["Telefon", mere.telefon],
    ["Kraj montaže", mere.kraj],
    ["Opombe", mere.opombe],
  ]);

  nextStepButton.disabled = false;
  nextStepButton.textContent = "Pošlji ponudbo";
  selectedTitle.textContent = "Vaša ponudba";
  selectedDescription.textContent = `Preverite povzetek in pošljite povpraševanje na ${PONUDBA_EMAIL}.`;
};

const showMereStepFromPonudba = () => {
  ponudbaStep.classList.add("is-hidden");
  mereStep.classList.remove("is-hidden");
  nextStepButton.disabled = false;
  nextStepButton.textContent = "Nadaljuj na ponudbo";
  selectedTitle.textContent = "Mere prostora";
  selectedDescription.textContent = "Vnesite mere prostora in kontaktne podatke za pripravo ponudbe.";
};

const buildPonudbaText = (konfiguracija, mere) => {
  const lines = [
    "NOVO POVPRAŠEVANJE — Konfigurator Peči Keramika",
    "",
    "IZBRANA KONFIGURACIJA",
    ...Object.entries(konfiguracija).map(([label, value]) => `  ${label}: ${value}`),
    "",
    "MERE PROSTORA",
    `  Širina prostora: ${mere.sirinaProstora} cm`,
    `  Dolžina prostora: ${mere.dolzinaProstora} cm`,
    `  Višina prostora: ${mere.visinaProstora} cm`,
    `  Širina stene za kamin: ${mere.sirinaStene ? `${mere.sirinaStene} cm` : "ni podano"}`,
    `  Obstoječi dimnik: ${mere.dimnik}`,
    `  Želeni rok izvedbe: ${mere.rok}`,
    "",
    "KONTAKT",
    `  Ime in priimek: ${mere.ime}`,
    `  E-pošta: ${mere.epasta}`,
    `  Telefon: ${mere.telefon || "ni podano"}`,
    `  Kraj montaže: ${mere.kraj || "ni podano"}`,
    "",
    "OPOMBE",
    `  ${mere.opombe || "ni opomb"}`,
  ];

  return lines.join("\n");
};

const setPonudbaStatus = (message, variant) => {
  ponudbaStatus.textContent = message;
  ponudbaStatus.classList.remove("is-hidden", "is-error", "is-success");
  if (variant) {
    ponudbaStatus.classList.add(variant);
  }
};

const openMailtoFallback = (subject, body) => {
  const href = `mailto:${PONUDBA_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
};

const sendPonudba = async () => {
  const mere = collectMere();
  const konfiguracija = collectConfiguration();
  const subject = `Povpraševanje za kamin — ${konfiguracija["Tip kamina"]} (${mere.ime})`;
  const body = buildPonudbaText(konfiguracija, mere);

  if (!WEB3FORMS_ACCESS_KEY) {
    setPonudbaStatus(
      "Pošiljanje prek strežnika ni nastavljeno (manjka PK_WEB3FORMS_KEY). Odpiramo vaš e-poštni odjemalec s pripravljenim sporočilom.",
      "is-error",
    );
    openMailtoFallback(subject, body);
    return;
  }

  nextStepButton.disabled = true;
  nextStepButton.textContent = "Pošiljanje ...";
  setPonudbaStatus("Pošiljamo ponudbo ...");

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject,
        from_name: "Konfigurator Peči Keramika",
        replyto: mere.epasta,
        botcheck: "",
        message: body,
        ...konfiguracija,
        "Ime in priimek": mere.ime,
        "E-pošta stranke": mere.epasta,
        Telefon: mere.telefon,
        "Kraj montaže": mere.kraj,
        "Širina prostora (cm)": mere.sirinaProstora,
        "Dolžina prostora (cm)": mere.dolzinaProstora,
        "Višina prostora (cm)": mere.visinaProstora,
        "Širina stene (cm)": mere.sirinaStene,
        Dimnik: mere.dimnik,
        "Rok izvedbe": mere.rok,
        Opombe: mere.opombe,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Pošiljanje ni uspelo.");
    }

    setPonudbaStatus(
      `Hvala! Povpraševanje je bilo poslano na ${PONUDBA_EMAIL}. Ponudbo vam pošljemo na ${mere.epasta}.`,
      "is-success",
    );
    nextStepButton.textContent = "Ponudba poslana";
    nextStepButton.disabled = true;
  } catch (error) {
    setPonudbaStatus(
      `Ponudbe ni bilo mogoče poslati (${error.message}). Poskusite znova ali nam pišite na ${PONUDBA_EMAIL}.`,
      "is-error",
    );
    nextStepButton.textContent = "Poskusi znova";
    nextStepButton.disabled = false;
  }
};

backToDrvaButton.addEventListener("click", () => {
  showDrvaStepFromMere();
  currentStep = selectedFireplaceType === "vogalni" ? "vogalni-drva" : "ravni-drva";
});

backToMereButton.addEventListener("click", () => {
  showMereStepFromPonudba();
  currentStep = "mere-prostora";
});
