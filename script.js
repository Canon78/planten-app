let plantenDatabase = JSON.parse(localStorage.getItem("plantenDatabase")) || [
  {
    naam: "Duizendblad",
    wetenschappelijk: "Achillea millefolium",
    leerjaren: ["1", "2"],
    vindplaats: "Binnentuin vak A",
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
let isIngelogdAlsBeheerder = false;

// 1. TABBLADEN NAVIGATIE
function openTab(tabId) {
  if (tabId === 'beheer' && !isIngelogdAlsBeheerder) {
    const wachtwoord = prompt("Voer de beheercode in om toegang te krijgen:");
    if (wachtwoord !== "docent1234") {
      alert("Foutieve code! Toegang geweigerd.");
      return;
    }
    isIngelogdAlsBeheerder = true;
  }

  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('actief'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('actief'));

  document.getElementById(tabId).classList.add('actief');
  
  const geklikteKnop = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.getAttribute('onclick').includes(tabId));
  if (geklikteKnop) geklikteKnop.classList.add('actief');

  if (tabId === 'herbarium') laadHerbarium();
  if (tabId === 'flashcards') startFlashcards();
}

function toonLeerjaren(p) {
  const jaren = p.leerjaren || (p.leerjaar ? [String(p.leerjaar)] : ["1"]);
  return jaren.map(j => `<span class="leerjaar-tag">Jaar ${j}</span>`).join(" ");
}

// 2. HERBARIUM
function laadHerbarium() {
  const container = document.getElementById("herbariumGrid");
  container.innerHTML = "";

  plantenDatabase.sort((a, b) => a.naam.localeCompare(b.naam));
  maakAlfabetBalk();

  plantenDatabase.forEach((p, index) => {
    const eersteLetter = p.naam.charAt(0).toUpperCase();
    const hoortBijLetter = (geselecteerdeLetter === "ALLES" || eersteLetter === geselecteerdeLetter);

    if (hoortBijLetter) {
      container.innerHTML += `
        <div class="plant-kaart" data-zoek="${p.naam.toLowerCase()} ${(p.vindplaats || '').toLowerCase()}">
          <img src="${p.foto || 'https://via.placeholder.com/300'}" alt="${p.naam}">
          <h3>${p.naam} ${toonLeerjaren(p)}</h3>
          <p><em>${p.wetenschappelijk || ''}</em></p>
          ${p.vindplaats ? `<div class="vindplaats-badge">📍 <strong>Schooltuin:</strong> ${p.vindplaats}</div>` : ''}
          <p><strong>Standplaats:</strong> ${p.standplaats || '-'}</p>
          <p><strong>Bodemtype:</strong> ${p.bodemtype || '-'}</p>
          <p><strong>Bladbehoud:</strong> ${p.bladbehoud || '-'}</p>
          <p style="margin-top:8px; font-size:13px; color:#555;">${p.beschrijving || ''}</p>
          
          <div class="kaart-acties">
            <button class="actie-btn bewerk" onclick="laadPlantOmToBewerken(${index})">✏️ Bewerken</button>
            <button class="actie-btn verwijder" onclick="verwijderPlant(${index})">🗑️ Verwijderen</button>
          </div>
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
    const zoekData = kaart.getAttribute("data-zoek");
    kaart.style.display = zoekData.includes(zoekTerm) ? "block" : "none";
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
      ${toonLeerjaren(item)}
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
        ${item.vindplaats ? `<p style="font-size:13px; color:#1b5e20;">📍 <strong>Vindplaats:</strong> ${item.vindplaats}</p>` : ''}
        <p style="font-size:13px; margin-top:8px;"><strong>Leerjaren:</strong> ${item.leerjaren ? item.leerjaren.join(', ') : (item.leerjaar || '1')}</p>
        <p style="font-size:13px;"><strong>Standplaats:</strong> ${item.standplaats}</p>
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

// 4. QUIZ
function startQuiz() {
  const geselecteerdLeerjaar = document.getElementById("quizLeerjaar").value;
  const quizType = document.getElementById("quizType").value;

  let geschiktePlanten = plantenDatabase;
  if (geselecteerdLeerjaar !== "ALLES") {
    geschiktePlanten = plantenDatabase.filter(p => {
      const jaren = p.leerjaren || (p.leerjaar ? [String(p.leerjaar)] : ["1"]);
      return jaren.includes(geselecteerdLeerjaar);
    });
  }

  if (geschiktePlanten.length < 2) {
    alert("Er zijn minimaal 2 planten nodig in dit leerjaar om een quiz te starten!");
    return;
  }

  const juistePlant = geschiktePlanten[Math.floor(Math.random() * geschiktePlanten.length)];

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

// 5. BEHEER: TOEVOEGEN, BEWERKEN EN VERWIJDEREN
function voegPlantToe(e) {
  e.preventDefault();

  const editIndex = parseInt(document.getElementById("editIndex").value);
  const aangevinkt = Array.from(document.querySelectorAll('input[name="leerjaarCheck"]:checked')).map(cb => cb.value);

  const plantData = {
    naam: document.getElementById("naam").value,
    leerjaren: aangevinkt.length > 0 ? aangevinkt : ["1"],
    vindplaats: document.getElementById("vindplaats").value,
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

  if (editIndex >= 0) {
    // Bestaande plant bijwerken
    plantenDatabase[editIndex] = plantData;
    alert("Plant succesvol bijgewerkt!");
  } else {
    // Nieuwe plant toevoegen
    plantenDatabase.push(plantData);
    alert("Nieuwe plant succesvol opgeslagen!");
  }

  localStorage.setItem("plantenDatabase", JSON.stringify(plantenDatabase));
  annuleerBewerken();
  openTab('herbarium');
}

function laadPlantOmToBewerken(index) {
  if (!isIngelogdAlsBeheerder) {
    const wachtwoord = prompt("Voer de beheercode in om te kunnen bewerken:");
    if (wachtwoord !== "docent1234") {
      alert("Foutieve code! Toegang geweigerd.");
      return;
    }
    isIngelogdAlsBeheerder = true;
  }

  const p = plantenDatabase[index];
  document.getElementById("editIndex").value = index;

  document.getElementById("naam").value = p.naam || "";
  document.getElementById("wetenschappelijk").value = p.wetenschappelijk || "";
  document.getElementById("vindplaats").value = p.vindplaats || "";
  document.getElementById("bladvorm").value = p.bladvorm || "";
  document.getElementById("bladrand").value = p.bladrand || "";
  document.getElementById("vrucht").value = p.vrucht || "";
  document.getElementById("bloeitijd").value = p.bloeitijd || "";
  document.getElementById("categorie").value = p.categorie || "";
  document.getElementById("standplaats").value = p.standplaats || "";
  document.getElementById("bodemtype").value = p.bodemtype || "";
  document.getElementById("bladbehoud").value = p.bladbehoud || "";
  document.getElementById("waterbehoefte").value = p.waterbehoefte || "";
  document.getElementById("vermeerderen").value = p.vermeerderen || "";
  document.getElementById("grootte").value = p.grootte || "";
  document.getElementById("foto").value = p.foto || "";
  document.getElementById("beschrijving").value = p.beschrijving || "";

  // Vink de juiste leerjaren aan
  const jaren = p.leerjaren || (p.leerjaar ? [String(p.leerjaar)] : ["1"]);
  document.querySelectorAll('input[name="leerjaarCheck"]').forEach(cb => {
    cb.checked = jaren.includes(cb.value);
  });

  // Vormgeving van het formulier aanpassen
  document.getElementById("formTitel").innerText = `Plant Bewerken: ${p.naam}`;
  document.getElementById("submitBtn").innerText = "Plant Bijwerken";
  document.getElementById("annuleerBtn").style.display = "inline-block";

  openTab('beheer');
}

function annuleerBewerken() {
  document.getElementById("plantForm").reset();
  document.getElementById("editIndex").value = "-1";
  document.getElementById("formTitel").innerText = "Plant Toevoegen aan Database";
  document.getElementById("submitBtn").innerText = "Plant Opslaan";
  document.getElementById("annuleerBtn").style.display = "none";
}

function verwijderPlant(index) {
  if (!isIngelogdAlsBeheerder) {
    const wachtwoord = prompt("Voer de beheercode in om te verwijderen:");
    if (wachtwoord !== "docent1234") {
      alert("Foutieve code! Toegang geweigerd.");
      return;
    }
    isIngelogdAlsBeheerder = true;
  }

  const plant = plantenDatabase[index];
  if (confirm(`Weet je zeker dat je "${plant.naam}" wilt verwijderen?`)) {
    plantenDatabase.splice(index, 1);
    localStorage.setItem("plantenDatabase", JSON.stringify(plantenDatabase));
    laadHerbarium();
  }
}

// ON LOAD
document.addEventListener("DOMContentLoaded", () => {
  laadHerbarium();
});
