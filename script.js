// INITIALE DATABASES
let plantenDatabase = JSON.parse(localStorage.getItem("plantenDatabase")) || [
  {
    naam: "Duizendblad",
    wetenschappelijk: "Achillea millefolium",
    bladvorm: "Veerdelig",
    bladrand: "Gekarteld / Ingesneden",
    vrucht: "Nootje",
    bloeitijd: "Juni – September",
    categorie: "Vaste plant",
    standplaats: "Zonnig (volle zon)",
    bodemtype: "Goed doorlatend, droog tot licht vochtig",
    bladbehoud: "Bladverliezend",
    waterbehoefte: "Laag",
    vermeerderen: "Delen / Scheuren",
    grootte: "40 - 80 cm",
    foto: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80",
    beschrijving: "Aromatisch blad. Aantrekkelijk voor bijen en vlinders. Weetje: Genoemd naar Achilles die de plant gebruikte op het slagveld."
  }
];

const plagenDatabase = [
  {
    naam: "Spintmijt",
    type: "Mijt",
    herkenning: "Fijne spinnenwebjes onder het blad met gele spikkeling.",
    bestrijding: "Luchtvochtigheid verhogen of roofmijten inzetten.",
    foto: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80"
  },
  {
    naam: "Trips",
    type: "Schadelijk insect",
    herkenning: "Zilverachtige vlekken met zwarte stipjes op het blad.",
    bestrijding: "Aangedane bladeren wegsnijden, roofwantsen inzetten.",
    foto: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80"
  }
];

let huidigeFlashIndex = 0;
let isOmgedraaid = false;

// 1. TABBLADEN NAVIGATIE
function openTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('actief'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('actief'));

  document.getElementById(tabId).classList.add('actief');
  
  // Zoek de knop en maak deze actief
  const geklikteKnop = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.getAttribute('onclick').includes(tabId));
  if (geklikteKnop) geklikteKnop.classList.add('actief');

  if (tabId === 'herbarium') laadHerbarium();
  if (tabId === 'flashcards') startFlashcards();
  if (tabId === 'plantendokter') toonPlagen();
}

// 2. HERBARIUM
function laadHerbarium() {
  const container = document.getElementById("herbariumGrid");
  container.innerHTML = "";

  plantenDatabase.forEach(p => {
    container.innerHTML += `
      <div class="plant-kaart">
        <img src="${p.foto || 'https://via.placeholder.com/300'}" alt="${p.naam}">
        <h3>${p.naam}</h3>
        <p><em>${p.wetenschappelijk || ''}</em></p>
        <p><strong>Standplaats:</strong> ${p.standplaats || '-'}</p>
        <p><strong>Bodemtype:</strong> ${p.bodemtype || '-'}</p>
        <p><strong>Bladbehoud:</strong> ${p.bladbehoud || '-'}</p>
        <p style="margin-top:8px; font-size:13px; color:#555;">${p.beschrijving || ''}</p>
      </div>
    `;
  });
}

function filterHerbarium() {
  const zoekTerm = document.getElementById("zoekHerbarium").value.toLowerCase();
  const kaarten = document.querySelectorAll("#herbariumGrid .plant-kaart");

  kaarten.forEach(kaart => {
    const tekst = kaart.innerText.toLowerCase();
    kaart.style.display = tekst.includes(zoekTerm) ? "block" : "none";
  });
}

// 3. FLASHCARDS
function startFlashcards() {
  huidigeFlashIndex = 0;
  toonFlashcard();
}

function toonFlashcard() {
  const inhoud = document.getElementById("flashcardInhoud");
  const teller = document.getElementById("flashcardTeller");
  if (plantenDatabase.length === 0) return;

  const item = plantenDatabase[huidigeFlashIndex];
  isOmgedraaid = false;

  inhoud.innerHTML = `
    <div>
      <img src="${item.foto}" style="max-height:120px; border-radius:6px; margin-bottom:10px;">
      <h3>Hoe heet deze plant?</h3>
    </div>
  `;

  teller.innerText = `${huidigeFlashIndex + 1} / ${plantenDatabase.length}`;
}

function draaiFlashcardOm() {
  if (plantenDatabase.length === 0) return;
  const inhoud = document.getElementById("flashcardInhoud");
  const item = plantenDatabase[huidigeFlashIndex];

  if (!isOmgedraaid) {
    inhoud.innerHTML = `
      <div>
        <h2 style="color:#2e7d32;">${item.naam}</h2>
        <p><em>${item.wetenschappelijk}</em></p>
        <p style="font-size:13px; margin-top:8px;"><strong>Standplaats:</strong> ${item.standplaats}</p>
        <p style="font-size:13px;"><strong>Bloeitijd:</strong> ${item.bloeitijd}</p>
      </div>
    `;
    isOmgedraaid = true;
  } else {
    toonFlashcard();
  }
}

function volgendeFlashcard() {
  if (plantenDatabase.length === 0) return;
  huidigeFlashIndex = (huidigeFlashIndex + 1) % plantenDatabase.length;
  toonFlashcard();
}

function vorigeFlashcard() {
  if (plantenDatabase.length === 0) return;
  huidigeFlashIndex = (huidigeFlashIndex - 1 + plantenDatabase.length) % plantenDatabase.length;
  toonFlashcard();
}

// 4. PLANTENDOKTER
function toonPlagen() {
  const container = document.getElementById("plagenGrid");
  const zoekTerm = document.getElementById("zoekDokter")?.value.toLowerCase() || "";
  container.innerHTML = "";

  plagenDatabase.filter(p => p.naam.toLowerCase().includes(zoekTerm)).forEach(p => {
    container.innerHTML += `
      <div class="plaag-kaart">
        <img src="${p.foto}" alt="${p.naam}">
        <h3>${p.naam}</h3>
        <p><strong>Herkenning:</strong> ${p.herkenning}</p>
        <p><strong>Bestrijding:</strong> ${p.bestrijding}</p>
      </div>
    `;
  });
}

// 5. BEHEER: PLANT TOEVOEGEN
function voegPlantToe(e) {
  e.preventDefault();

  const nieuwePlant = {
    naam: document.getElementById("naam").value,
    wetenschappelijk: document.getElementById("wetenschappelijk").value,
    bladvorm: document.getElementById("bladvorm").value,
    bladrand: document.getElementById("bladrand").value,
    vrucht: document.getElementById("vrucht").value,
    bloeitijd: document.getElementById("bloeitijd").value,
    categorie: document.getElementById("categorie").value,
    standplaats: document.getElementById("standplaats").value,
    bodemtype: document.getElementById("bodemtype").value,
    bladbehoud: document.getElementById("bladbehoud").value,
    waterbehoefte: document.getElementById("waterbehoefte").value,
    vermeerderen: document.getElementById("vermeerderen").value,
    grootte: document.getElementById("grootte").value,
    foto: document.getElementById("foto").value,
    beschrijving: document.getElementById("beschrijving").value
  };

  plantenDatabase.push(nieuwePlant);
  localStorage.setItem("plantenDatabase", JSON.stringify(plantenDatabase));

  alert("Plant succesvol opgeslagen!");
  document.getElementById("plantForm").reset();
  openTab('herbarium');
}

// ON LOAD
document.addEventListener("DOMContentLoaded", () => {
  laadHerbarium();
});
