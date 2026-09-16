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

let actieveFlashcards = [];
let huidigeFlashIndex = 0;
let geselecteerdeLetter = "ALLES";

let huidigeQuizVraag = null;
let isIngelogdAlsBeheerder = false;
let quizSessieActief = false;
let huidigeVraagNummer = 0;
let quizScoreTeller = 0;
let maxVragenPerSessie = 10;
let quizBezigMetAnimatie = false;

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

// 2. HERBARIUM (ALLE INFO NETJE ONDER ELKAAR)
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
          <p style="font-style: italic; color: #555; margin-bottom: 8px;">${p.wetenschappelijk || 'Geen wetenschappelijke naam'}</p>
          
          <div class="kaart-details">
            ${p.vindplaats ? `<div class="vindplaats-badge">📍 <strong>Schooltuin:</strong> ${p.vindplaats}</div>` : ''}
            <p><strong>Categorie:</strong> ${p.categorie || '-'}</p>
            <p><strong>Standplaats:</strong> ${p.standplaats || '-'}</p>
            <p><strong>Bodemtype:</strong> ${p.bodemtype || '-'}</p>
            <p><strong>Bladvorm:</strong> ${p.bladvorm || '-'}</p>
            <p><strong>Bladrand:</strong> ${p.bladrand || '-'}</p>
            <p><strong>Bladbehoud:</strong> ${p.bladbehoud || '-'}</p>
            <p><strong>Bloeitijd:</strong> ${p.bloeitijd || '-'}</p>
            <p><strong>Vrucht / Zaad:</strong> ${p.vrucht || '-'}</p>
            <p><strong>Waterbehoefte:</strong> ${p.waterbehoefte || '-'}</p>
            <p><strong>Vermeerderen:</strong> ${p.vermeerderen || '-'}</p>
            <p><strong>Maximale Grootte:</strong> ${p.grootte || '-'}</p>
            ${p.beschrijving ? `<p style="margin-top:6px; background:#f9f9f9; padding:6px; border-radius:4px;">💡 <strong>Notities/Weetje:</strong> ${p.beschrijving}</p>` : ''}
          </div>
          
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
  actieveFlashcards = [...plantenDatabase];
  huidigeFlashIndex = 0;
  toonFlashcard();
}

function toonFlashcard() {
  const voorkant = document.getElementById("flashcardVoorkant");
  const achterkant = document.getElementById("flashcardAchterkant");
  const teller = document.getElementById("flashcardTeller");
  const cardElement = document.querySelector(".flip-card");

  if (cardElement) cardElement.classList.remove("omgedraaid");

  if (actieveFlashcards.length === 0) {
    voorkant.innerHTML = `
      <div class="card-placeholder">
        🎉 Proficiat!<br><br>Je hebt alle planten uit de stapel verwerkt!
      </div>
    `;
    achterkant.innerHTML = `<div>Druk op 'Herstel uitgestelde kaarten' om opnieuw te oefenen.</div>`;
    teller.innerText = "0 / 0";
    return;
  }

  if (huidigeFlashIndex >= actieveFlashcards.length) huidigeFlashIndex = 0;
  if (huidigeFlashIndex < 0) huidigeFlashIndex = actieveFlashcards.length - 1;

  const item = actieveFlashcards[huidigeFlashIndex];

  voorkant.innerHTML = `
    <img src="${item.foto || 'https://via.placeholder.com/300'}" alt="${item.naam}">
    <h3 style="color:#2e7d32;">Hoe heet deze plant?</h3>
    <div style="margin-top:5px;">${toonLeerjaren(item)}</div>
  `;

  achterkant.innerHTML = `
    <h3 class="fiche-titel">${item.naam}</h3>
    <div class="fiche-latijn">${item.wetenschappelijk || 'Geen wetenschappelijke naam'}</div>
    
    <div class="fiche-details">
      ${item.vindplaats ? `<div class="vindplaats-badge">📍 <strong>Schooltuin:</strong> ${item.vindplaats}</div>` : ''}
      <p><strong>Leerjaren:</strong> ${item.leerjaren ? item.leerjaren.join(', ') : (item.leerjaar || '1')}</p>
      <p><strong>Categorie:</strong> ${item.categorie || '-'}</p>
      <p><strong>Standplaats:</strong> ${item.standplaats || '-'}</p>
      <p><strong>Bodemtype:</strong> ${item.bodemtype || '-'}</p>
      <p><strong>Bladvorm:</strong> ${item.bladvorm || '-'}</p>
      <p><strong>Bladrand:</strong> ${item.bladrand || '-'}</p>
      <p><strong>Bladbehoud:</strong> ${item.bladbehoud || '-'}</p>
      <p><strong>Bloeitijd:</strong> ${item.bloeitijd || '-'}</p>
      <p><strong>Vrucht / Zaad:</strong> ${item.vrucht || '-'}</p>
      <p><strong>Waterbehoefte:</strong> ${item.waterbehoefte || '-'}</p>
      <p><strong>Vermeerderen:</strong> ${item.vermeerderen || '-'}</p>
      <p><strong>Maximale Grootte:</strong> ${item.grootte || '-'}</p>
      ${item.beschrijving ? `<p style="margin-top:8px; background:#f9f9f9; padding:6px; border-radius:4px;">💡 <strong>Notities/Weetje:</strong> ${item.beschrijving}</p>` : ''}
    </div>
  `;

  teller.innerText = `${huidigeFlashIndex + 1} / ${actieveFlashcards.length}`;
}

function draaiFlashcardOm() {
  const cardElement = document.querySelector(".flip-card");
  if (cardElement && actieveFlashcards.length > 0) {
    cardElement.classList.toggle("omgedraaid");
  }
}

function volgendeFlashcard() {
  if (actieveFlashcards.length === 0) return;
  huidigeFlashIndex = (huidigeFlashIndex + 1) % actieveFlashcards.length;
  toonFlashcard();
}

function vorigeFlashcard() {
  if (actieveFlashcards.length === 0) return;
  huidigeFlashIndex = (huidigeFlashIndex - 1 + actieveFlashcards.length) % actieveFlashcards.length;
  toonFlashcard();
}

function markeerAlsGekend(event) {
  event.stopPropagation();
  if (actieveFlashcards.length === 0) return;

  actieveFlashcards.splice(huidigeFlashIndex, 1);
  if (huidigeFlashIndex >= actieveFlashcards.length) huidigeFlashIndex = 0;
  toonFlashcard();
}

function herstelStapel() {
  startFlashcards();
}

// 4. QUIZ
function startNieuweQuizSessie() {
  const geselecteerdLeerjaar = document.getElementById("quizLeerjaar").value;
  
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

  huidigeVraagNummer = 0;
  quizScoreTeller = 0;
  quizSessieActief = true;
  document.getElementById("quizScoreboard").style.display = "flex";

  volgendeQuizVraag();
}

function volgendeQuizVraag() {
  quizBezigMetAnimatie = false;

  if (huidigeVraagNummer >= maxVragenPerSessie) {
    toonQuizEindresultaat();
    return;
  }

  huidigeVraagNummer++;
  document.getElementById("quizVraagTeller").innerText = `${huidigeVraagNummer} / ${maxVragenPerSessie}`;
  document.getElementById("quizScore").innerText = quizScoreTeller;

  const geselecteerdLeerjaar = document.getElementById("quizLeerjaar").value;
  const quizType = document.getElementById("quizType").value;

  let geschiktePlanten = plantenDatabase;
  if (geselecteerdLeerjaar !== "ALLES") {
    geschiktePlanten = plantenDatabase.filter(p => {
      const jaren = p.leerjaren || (p.leerjaar ? [String(p.leerjaar)] : ["1"]);
      return jaren.includes(geselecteerdLeerjaar);
    });
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
      optiesElement.innerHTML += `
        <button class="quiz-optie-btn" data-naam="${optie.naam}" onclick="controleerQuizAntwoord('${optie.naam}', this)">
          ${optie.naam}
        </button>
      `;
    });

  } else if (quizType === "naamNaarFoto") {
    vraagElement.innerHTML = `<strong>Kies de foto van: <span style="color:#2e7d32;">${juistePlant.naam}</span></strong>`;
    alleOpties.forEach(optie => {
      optiesElement.innerHTML += `
        <div class="quiz-foto-optie" data-naam="${optie.naam}" onclick="controleerQuizAntwoord('${optie.naam}', this)">
          <img src="${optie.foto}" alt="${optie.naam}">
        </div>
      `;
    });

  } else if (quizType === "wetenschappelijk") {
    vraagElement.innerHTML = `<strong>Wat is de wetenschappelijke naam van <span style="color:#2e7d32;">${juistePlant.naam}</span>?</strong>`;
    alleOpties.forEach(optie => {
      optiesElement.innerHTML += `
        <button class="quiz-optie-btn" data-naam="${optie.naam}" onclick="controleerQuizAntwoord('${optie.naam}', this)">
          <em>${optie.wetenschappelijk || 'Geen Latijnse naam'}</em>
        </button>
      `;
    });
  }
}

function controleerQuizAntwoord(gekozenNaam, gekliktElement) {
  if (quizBezigMetAnimatie) return;
  quizBezigMetAnimatie = true;

  const isJuist = (gekozenNaam === huidigeQuizVraag.juistePlant.naam);

  if (isJuist) {
    gekliktElement.classList.add("juist");
    quizScoreTeller++;
    document.getElementById("quizScore").innerText = quizScoreTeller;
  } else {
    gekliktElement.classList.add("fout");

    const alleElementen = document.querySelectorAll("#quizOpties [data-naam]");
    alleElementen.forEach(el => {
      if (el.getAttribute("data-naam") === huidigeQuizVraag.juistePlant.naam) {
        el.classList.add("juist");
      }
    });
  }

  setTimeout(() => {
    volgendeQuizVraag();
  }, 1500);
}

function toonQuizEindresultaat() {
  document.getElementById("quizScoreboard").style.display = "none";
  const vraagElement = document.getElementById("quizVraag");
  const optiesElement = document.getElementById("quizOpties");

  vraagElement.innerHTML = `
    <h2 style="color:#2e7d32; margin-bottom:10px;">🏆 Quiz Afgerond!</h2>
    <p style="font-size:18px;">Je behaalde <strong>${quizScoreTeller}</strong> van de <strong>${maxVragenPerSessie}</strong> punten.</p>
  `;

  optiesElement.innerHTML = `
    <button class="submit-btn" style="max-width:300px; margin:20px auto;" onclick="startNieuweQuizSessie()">
      🔄 Opnieuw Proberen
    </button>
  `;
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
    plantenDatabase[editIndex] = plantData;
    alert("Plant succesvol bijgewerkt!");
  } else {
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

  const jaren = p.leerjaren || (p.leerjaar ? [String(p.leerjaar)] : ["1"]);
  document.querySelectorAll('input[name="leerjaarCheck"]').forEach(cb => {
    cb.checked = jaren.includes(cb.value);
  });

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
