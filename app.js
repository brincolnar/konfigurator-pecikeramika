const fireplaceTypes = {
  ravni: {
    title: "Ravni kamin",
    description: "Frontalni pogled na ogenj za čiste, umirjene linije prostora.",
    nextLabel: "Nadaljuj na obliko kamina",
  },
  vogalni: {
    title: "Vogalni kamin",
    description: "Ogenj poudari stik dveh sten in ustvari širši pogled v prostoru.",
    nextLabel: "Oblike za vogalni kamin kmalu",
  },
  tristranski: {
    title: "Tristranski kamin",
    description: "Primeren za izrazit osrednji element z večstranskim pogledom na plamen.",
    nextLabel: "Oblike za tristranski kamin kmalu",
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
  nextStepButton.disabled = selectedType !== "ravni";
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

let currentStep = "fireplace-type";

nextStepButton.addEventListener("click", () => {
  if (currentStep === "fireplace-type") {
    showStraightShapeStep();
    currentStep = "ravni-shape";
  } else if (currentStep === "ravni-shape") {
    showVstavekStep();
    currentStep = "ravni-vstavek";
  } else if (currentStep === "ravni-vstavek") {
    showResetkiStep();
    currentStep = "ravni-resetki";
  } else if (currentStep === "ravni-resetki") {
    showDrvaStep();
    currentStep = "ravni-drva";
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
