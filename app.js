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
    image: "./layers/ravni-kamin-osnovni.png",
  },
  polica: {
    title: "Ravni kamin s polico",
    description: "Ravni kamin z dodano uporabno in vizualno polico.",
    image: "./layers/ravni-kamin-polica.png",
  },
};

const cards = document.querySelectorAll(".fireplace-card");
const shapeCards = document.querySelectorAll(".shape-card");
const selectedTitle = document.querySelector("#selected-title");
const selectedDescription = document.querySelector("#selected-description");
const nextStepButton = document.querySelector("[data-next-step]");
const backToTypesButton = document.querySelector("[data-back-to-types]");
const fireplaceTypeStep = document.querySelector('[data-step="fireplace-type"]');
const straightShapeStep = document.querySelector('[data-step="ravni-shape"]');
const fireplaceOverlay = document.querySelector("[data-fireplace-overlay]");

let selectedFireplaceType = "ravni";
let selectedStraightShape = "osnovni";

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
  nextStepButton.textContent = "Nadaljuj na mere prostora";
  selectStraightShape(selectedStraightShape);
};

const showFireplaceTypeStep = () => {
  straightShapeStep.classList.add("is-hidden");
  fireplaceTypeStep.classList.remove("is-hidden");
  selectFireplace(selectedFireplaceType);
};

cards.forEach((card) => {
  card.addEventListener("click", () => selectFireplace(card.dataset.fireplace));
});

shapeCards.forEach((card) => {
  card.addEventListener("click", () => selectStraightShape(card.dataset.shape));
});

nextStepButton.addEventListener("click", showStraightShapeStep);
backToTypesButton.addEventListener("click", showFireplaceTypeStep);
