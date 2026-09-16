let plantenDatabase = JSON.parse(localStorage.getItem("plantenDatabase")) || [
  {
    naam: "Duizendblad",
    wetenschappelijk: "Achillea millefolium",
    leerjaar: "1",
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

let huidigeFlashIndex = 0;
let isOmgedraaid = false;
let geselecteerdeLetter = "ALLES";
let huidigeQuizVraag = null;

// 1. TABBLADEN NAVIGATIE
function openTab(tabId) {
  if (tabId === 'beheer') {
    const wachtwoord = prompt("Voer de beheercode in om toegang te krijgen:");
    if (wachtwoord !== "docent1234") {
      alert("Foutieve code! Toegang geweigerd.");
      return;
    }
  }

  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('actief'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('actief'));

  document.getElementById(tabId).classList.add('actief');
  
  const geklikteKnop = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.getAttribute('onclick').includes(tabId));
  if (geklikteKnop) geklikteKnop.classList.add('actief');

  if (tabId === 'herbarium') laadHerbarium();
  if (tabId === 'flashcards') startFlashcards();
}

// 2. HERBARIUM
function laadHerbarium() {
  const container = document.getElementById("herbariumGrid");
  container.innerHTML = "";

  plantenDatabase.sort((a, b) => a.naam.localeCompare(b.naam));
  maakAlfabetBalk();

  plantenDatabase.forEach(p => {
    const eersteLetter = p.naam.charAt(0).toUpperCase();
    const hoortBijLetter = (geselecteerdeLetter === "ALLES" || eersteLetter === geselecteerdeLetter);

    if (hoortBijLetter) {
      container.innerHTML += `
        <div class="plant-kaart" data-naam="${p.naam.toLowerCase()}">
          <img src="${p.foto || 'https://via.placeholder.com/300'}" alt="${p.naam}">
          <h3>${p.naam} <span style="font-size:12px; color:#666;">(Yr ${p.leerjaar || 1})</span></h3>
          <p><em>${p.wetenschappelijk || ''}</em></p>
          <p><strong>Standplaats:</strong> ${p.standplaats || '-'}</p>
          <p><strong>Bodemtype:</strong> ${p.bodemtype || '-'}</p>
          <p><strong>Bladbehoud:</strong> ${p.bladbehoud || '-'}</p>
          <p style="margin-top:8px; font-size:13px; color:#555;">${p.beschrijving || ''}</p>
        </div>
      `;
    }
  });
}

function maakAlfabetBalk() {
  const alfabetBalk = document.getElementById("alfabetBalk");
  if (!alfabetBalk) return;

  const alfabet = ["ALLES", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
  
  alfabetBalk.innerHTML = alfabet.map(letter => `
    <button class="letter-btn ${geselecteerdeLetter === letter ? 'actief' : ''}" 
            onclick="filterOpLetter('${letter}')">
      ${letter}
    </button>
  `).join("");
}

function filterOpLetter(letter) {
  geselecteerdeLetter = letter;
  document.getElementById("zoekHerbarium").value = ""; 
  laadHerbarium();
}

function filterHerbarium() {
  const zoekTerm = document.getElementById("zoekHerbarium").value.toLowerCase();
  const kaarten = document.querySelectorAll("#herbariumGrid .plant-kaart");

  kaarten.forEach(kaart => {
    const naam = kaart.getAttribute("data-naam");
    kaart.style.display = naam.includes(zoekTerm) ? "block" : "none";
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

// 4. QUIZ (Met Leerjaar en Quiz-typen)
function startQuiz() {
  const geselecteerdLeerjaar = document.getElementById("quizLeerjaar").value;
  const quizType = document.getElementById("quizType").value;

  // Filter op leerjaar
  let geschiktePlanten = plantenDatabase;
  if (geselecteerdLeerjaar !== "ALLES") {
    geschiktePlanten = plantenDatabase.filter(p => String(p.leerjaar) === geselecteerdLeerjaar);
  }

  if (geschiktePlanten.length < 2) {
    alert("Er zijn minimaal 2 planten nodig in dit leerjaar om een quiz te starten!");
    return;
  }

  // Kies willekeurige juist plant
  const juistePlant = geschiktePlanten[Math.floor(Math.random() * geschiktePlanten.length)];

  // Kies willekeurige foute opties
  const fouteOpties = plantenDatabase
    .filter(p => p.naam !== juistePlant.naam)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const alleOpties = [juistePlant, ...fouteOpties].sort(() => 0.5 - Math.random());
  huidigeQuizVraag = { juistePlant, quizType };

  const vraagElement = document.getElementById("quizVraag");
  const optiesElement = document.getElementById("quizOpties");
  optiesElement.innerHTML = "";

  if (quizType === "fotoNaarNaam") {
    vraagElement.innerHTML = `
      <img src="${juistePlant.foto}" style="max-height:180px; border-radius:8px; margin-bottom:10px;"><br>
      <strong>Welke plant is dit?</strong>
    `;
    alleOpties.forEach(optie => {
      optiesElement.innerHTML += `<button class="quiz-optie-btn" onclick="controleerQuizAntwoord('${optie.naam}')">${optie.naam}</button>`;
    });

  } else if (quizType === "naamNaarFoto") {
    vraagElement.innerHTML = `<strong>Kies de foto van: <span style="color:#2e7d32;">${juistePlant.naam}</span></strong>`;
    alleOpties.forEach(optie => {
      optiesElement.innerHTML += `
        <div class="quiz-foto-optie" onclick="controleerQuizAntwoord('${optie.naam}')">
          <img src="${optie.foto}" alt="${optie.naam}">
        </div>
      `;
    });

  } else if (quizType === "wetenschappelijk") {
    vraagElement.innerHTML = `<strong>Wat is de wetenschappelijke naam van <span style="color:#2e7d32;">${juistePlant.naam}</span>?</strong>`;
    alleOpties.forEach(optie => {
      optiesElement.innerHTML += `<button class="quiz-optie-btn" onclick="controleerQuizAntwoord('${optie.naam}')"><em>${optie.wetenschappelijk || 'Geen Latijnse naam'}</em></button>`;
    });
  }
}

function controleerQuizAntwoord(gekozenNaam) {
  if (gekozenNaam === huidigeQuizVraag.juistePlant.naam) {
    alert("🎉 Juist beantwoord! Goed gedaan!");
  } else {
    alert(`❌ Helaas, dat is niet juist. Het juiste antwoord was: ${huidigeQuizVraag.juistePlant.naam}`);
  }
  startQuiz();
}

// 5. BEHEER: PLANT TOEVOEGEN
function voegPlantToe(e) {
  e.preventDefault();

  const nieuwePlant = {
    naam: document.getElementById("naam").value,
    wetenschappelijk: document.getElementById("wetenschappelijk").value,
    leerjaar: document.getElementById("leerjaar").value,
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
