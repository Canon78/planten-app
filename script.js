// --- DATABASE EN INITIELE DATA ---
let plantenDatabase = JSON.parse(localStorage.getItem('herbarium_planten')) || [
  {
    id: 1,
    nlNaam: "Paardenbloem",
    latNaam: "Taraxacum officinale",
    familie: "Asteraceae (Composietenfamilie)",
    leerjaren: [3],
    bladvorm: "Veerspletig, diep ingesneden in een wortelrozet",
    bladrand: "Grof getand, tanden wijzen achterwaarts",
    vrucht: "Nootje met een steeltje en vruchtpluis (pluisbol)",
    bloei: "April - Oktober (Hoogtepunt in het voorjaar)",
    categorie: "Onkruid / Wilde plant",
    standplaats: "Volle zon",
    bodem: "Humusrijk / Universeel",
    water: "Gemiddeld",
    bladbehoud: "Bladverliezend",
    vermeerderen: "Penwortel & Pluiszaad via wind",
    grootte: "5 tot 40 cm",
    locatieSchool: "Speelplaats & Binnentuin zone A",
    beschrijving: "Bekend onkruid met een holle stengel die wit melksap bevat. Zeer belangrijke vroege voedselbron voor bijen.",
    foto: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    nlNaam: "Madeliefje",
    latNaam: "Bellis perennis",
    familie: "Asteraceae (Composietenfamilie)",
    leerjaren: [3],
    bladvorm: "Spathelvormig, omgekeerd eirond in rozet",
    bladrand: "Gekarteld tot vrijwel gaafrandig",
    vrucht: "Klein nootje zonder pluis",
    bloei: "Vrijwel het hele jaar (Zolang het niet vriest)",
    categorie: "Onkruid / Wilde plant",
    standplaats: "Volle zon",
    bodem: "Humusrijk / Universeel",
    water: "Gemiddeld",
    bladbehoud: "Groenblijvend (bladhoudend)",
    vermeerderen: "Zaad & Uitlopers",
    grootte: "5 tot 15 cm",
    locatieSchool: "Grasveld bij de sportvelden",
    beschrijving: "Klassieke graslandplant. De bloemhoofdjes sluiten 's nachts en bij regenweer.",
    foto: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80"
  }
];

let actieveFilterLetter = "";
let isBewerken = false;
let bewerkPlantId = null;

// FLASHCARD VARIABELEN
let gefilterdeFlashcards = [];
let huidigeFCIndex = 0;

// QUIZ VARIABELEN
let quizVragen = [];
let huidigeVraagIndex = 0;
let score = 0;
let quizTimer = null;
let timerBarInterval = null;
let gekozenTimerTijd = 0;

// WA TCHTWOORD VOOR BEHEER
let isIngelogdAlsAdmin = false;
const ADMIN_WACHTWOORD = "docent123";

// --- STARTUP LOGICA ---
document.addEventListener("DOMContentLoaded", () => {
  opslaanInLocalStorage();
  maakAlfabetKnoppen();
  toonPlanten(plantenDatabase);
  
  // Paste listener instellen voor afbeeldingen
  const pasteArea = document.getElementById("paste-area");
  if (pasteArea) {
    pasteArea.addEventListener("click", () => {
      alert("Druk op CTRL+V (of Cmd+V op Mac) om je gekopieerde afbeelding hier te plakken!");
    });
  }

  document.addEventListener("paste", (e) => {
    const adminTab = document.getElementById("admin-tab");
    if (adminTab && adminTab.classList.contains("active")) {
      verwerkPlakEvent(e);
    }
  });

  // Back to top scroll listener
  window.addEventListener("scroll", controleerScrollPositie);
});

function opslaanInLocalStorage() {
  localStorage.setItem('herbarium_planten', JSON.stringify(plantenDatabase));
}

// --- NAVIGATIE & TABS ---
function switchTab(tabId, btnElement) {
  if (tabId === "admin-tab" && !isIngelogdAlsAdmin) {
    const invoer = prompt("🔑 Voer het beheerder wachtwoord in:");
    if (invoer === ADMIN_WACHTWOORD) {
      isIngelogdAlsAdmin = true;
      alert("Succesvol ingelogd als beheerder!");
    } else {
      if (invoer !== null) alert("Fout wachtwoord!");
      return;
    }
  }

  document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(el => el.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  if (btnElement) btnElement.classList.add("active");

  if (tabId === "flashcard-tab") {
    filterFlashcardsOpJaar();
  } else if (tabId === "admin-tab") {
    laadBeheerLijst();
  }
}

// --- TAB 1: BIBLIOTHEEK LOGICA ---
function maakAlfabetKnoppen() {
  const container = document.getElementById("alphabet-filter");
  if (!container) return;
  container.innerHTML = "";

  const alleBtn = document.createElement("button");
  alleBtn.className = "letter-btn active";
  alleBtn.innerText = "ALLE";
  alleBtn.onclick = () => filterOpLetter("", alleBtn);
  container.appendChild(alleBtn);

  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    const btn = document.createElement("button");
    btn.className = "letter-btn";
    btn.innerText = letter;
    btn.onclick = () => filterOpLetter(letter, btn);
    container.appendChild(btn);
  }
}

function filterOpLetter(letter, btnEl) {
  actieveFilterLetter = letter;
  document.querySelectorAll(".letter-btn").forEach(b => b.classList.remove("active"));
  btnEl.classList.add("active");
  pasFiltersToe();
}

function zoekPlanten() {
  pasFiltersToe();
}

function pasFiltersToe() {
  const zoekTerm = document.getElementById("search-input").value.toLowerCase().trim();
  const filterJaar = document.getElementById("filter-jaar").value;
  const filterCategorie = document.getElementById("filter-categorie").value;
  const filterStandplaats = document.getElementById("filter-standplaats").value;
  const filterBodem = document.getElementById("filter-bodem").value;
  const filterBlad = document.getElementById("filter-blad").value;

  const resultaten = plantenDatabase.filter(p => {
    const matchZoek = 
      p.nlNaam.toLowerCase().includes(zoekTerm) ||
      p.latNaam.toLowerCase().includes(zoekTerm) ||
      (p.familie && p.familie.toLowerCase().includes(zoekTerm)) ||
      (p.bladvorm && p.bladvorm.toLowerCase().includes(zoekTerm)) ||
      (p.locatieSchool && p.locatieSchool.toLowerCase().includes(zoekTerm));

    const matchLetter = actieveFilterLetter === "" || p.nlNaam.toUpperCase().startsWith(actieveFilterLetter);
    const matchJaar = filterJaar === "" || (p.leerjaren && p.leerjaren.includes(parseInt(filterJaar)));
    const matchCategorie = filterCategorie === "" || p.categorie === filterCategorie;
    const matchStandplaats = filterStandplaats === "" || p.standplaats === filterStandplaats;
    const matchBodem = filterBodem === "" || p.bodem === filterBodem;
    const matchBlad = filterBlad === "" || p.bladbehoud === filterBlad;

    return matchZoek && matchLetter && matchJaar && matchCategorie && matchStandplaats && matchBodem && matchBlad;
  });

  toonPlanten(resultaten);
}

function toonPlanten(lijst) {
  const grid = document.getElementById("plant-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (lijst.length === 0) {
    grid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #666;'>Geen planten gevonden die aan deze criteria voldoen.</p>";
    return;
  }

  const gesorteerd = [...lijst].sort((a, b) => a.nlNaam.localeCompare(b.nlNaam));

  gesorteerd.forEach(plant => {
    const card = document.createElement("div");
    card.className = "plant-card";

    const leerjarenText = plant.leerjaren && plant.leerjaren.length > 0 ? plant.leerjaren.map(j => j + "e").join(", ") : "Alle";
    const fotoUrl = plant.foto || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80';

    card.innerHTML = `
      <img src="${fotoUrl}" alt="${plant.nlNaam}">
      <div class="plant-card-content">
        <h3>${plant.nlNaam}</h3>
        <em>${plant.latNaam}</em>
        <div class="plant-details">
          ${plant.familie ? `<span><strong>Familie:</strong> ${plant.familie}</span>` : ''}
          ${plant.categorie ? `<span><strong>Categorie:</strong> ${plant.categorie}</span>` : ''}
          ${plant.locatieSchool ? `<span style="color: #2e7d32; font-weight: bold; margin-top: 3px; display: block;">📍 Schoollocatie: ${plant.locatieSchool}</span>` : ''}
          ${plant.bladvorm ? `<span><strong>Bladvorm:</strong> ${plant.bladvorm}</span>` : ''}
          ${plant.bloei ? `<span><strong>Bloei:</strong> ${plant.bloei}</span>` : ''}
          ${plant.standplaats ? `<span><strong>Standplaats:</strong> ${plant.standplaats}</span>` : ''}
          <span style="color: #2e7d32; font-weight: bold; margin-top: 5px;">🎓 Leerjaar: ${leerjarenText}</span>
          ${plant.beschrijving ? `<p style="font-size:0.85rem; color:#555; margin-top:8px; border-top:1px solid #eee; padding-top:6px;">💡 <em>${plant.beschrijving}</em></p>` : ''}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// --- TAB 2: FLASHCARDS LOGICA ---
function filterFlashcardsOpJaar() {
  const geselecteerdJaar = document.getElementById("fc-jaar-select").value;
  if (geselecteerdJaar === "alle") {
    gefilterdeFlashcards = [...plantenDatabase];
  } else {
    const yr = parseInt(geselecteerdJaar);
    gefilterdeFlashcards = plantenDatabase.filter(p => p.leerjaren && p.leerjaren.includes(yr));
  }
  
  huidigeFCIndex = 0;
  toonFlashcard();
}

function toonFlashcard() {
  const fc = document.getElementById("flashcard");
  if (fc) fc.classList.remove("flipped");

  if (gefilterdeFlashcards.length === 0) {
    document.getElementById("fc-img").src = "";
    document.getElementById("fc-nl").innerText = "Geen planten";
    document.getElementById("fc-lat").innerText = "";
    document.getElementById("fc-details").innerHTML = "<p>Er zijn geen planten geselecteerd voor dit leerjaar.</p>";
    document.getElementById("fc-counter").innerText = "0 / 0";
    return;
  }

  const plant = gefilterdeFlashcards[huidigeFCIndex];
  document.getElementById("fc-img").src = plant.foto || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80';
  document.getElementById("fc-nl").innerText = plant.nlNaam;
  document.getElementById("fc-lat").innerText = plant.latNaam;

  let detailsHTML = "";
  if (plant.familie) detailsHTML += `<p><strong>Familie:</strong> ${plant.familie}</p>`;
  if (plant.locatieSchool) detailsHTML += `<p style="color:#2e7d32;"><strong>📍 Schoollocatie:</strong> ${plant.locatieSchool}</p>`;
  if (plant.bladvorm) detailsHTML += `<p><strong>Bladvorm:</strong> ${plant.bladvorm}</p>`;
  if (plant.bladrand) detailsHTML += `<p><strong>Bladrand:</strong> ${plant.bladrand}</p>`;
  if (plant.vrucht) detailsHTML += `<p><strong>Vrucht:</strong> ${plant.vrucht}</p>`;
  if (plant.bloei) detailsHTML += `<p><strong>Bloeitijd:</strong> ${plant.bloei}</p>`;
  if (plant.standplaats) detailsHTML += `<p><strong>Standplaats:</strong> ${plant.standplaats}</p>`;
  if (plant.beschrijving) detailsHTML += `<p style="margin-top:8px; font-style:italic; background:#f9f9f9; padding:5px; border-radius:4px;">💡 ${plant.beschrijving}</p>`;

  document.getElementById("fc-details").innerHTML = detailsHTML;
  document.getElementById("fc-counter").innerText = `${huidigeFCIndex + 1} / ${gefilterdeFlashcards.length}`;
}

function draaiFlashcardOm() {
  const fc = document.getElementById("flashcard");
  if (fc) fc.classList.toggle("flipped");
}

function volgendeFlashcard() {
  if (gefilterdeFlashcards.length === 0) return;
  huidigeFCIndex = (huidigeFCIndex + 1) % gefilterdeFlashcards.length;
  toonFlashcard();
}

function vorigeFlashcard() {
  if (gefilterdeFlashcards.length === 0) return;
  huidigeFCIndex = (huidigeFCIndex - 1 + gefilterdeFlashcards.length) % gefilterdeFlashcards.length;
  toonFlashcard();
}

function schudFlashcards() {
  for (let i = gefilterdeFlashcards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gefilterdeFlashcards[i], gefilterdeFlashcards[j]] = [gefilterdeFlashcards[j], gefilterdeFlashcards[i]];
  }
  huidigeFCIndex = 0;
  toonFlashcard();
}

// --- TAB 3: QUIZ LOGICA ---
function startQuizMetInstellingen() {
  const mode = document.getElementById("quiz-mode-select").value;
  const jaar = document.getElementById("quiz-jaar-select").value;
  gekozenTimerTijd = parseInt(document.getElementById("timer-select").value);

  let pool = [...plantenDatabase];
  if (jaar !== "alle") {
    const yr = parseInt(jaar);
    pool = pool.filter(p => p.leerjaren && p.leerjaren.includes(yr));
  }

  if (pool.length < 4) {
    alert("Er zijn minimaal 4 planten nodig in de gekozen categorie om een quiz te kunnen spelen!");
    return;
  }

  // Schud pool
  pool.sort(() => Math.random() - 0.5);

  quizVragen = pool.map(juistePlant => {
    let optiesPool = plantenDatabase.filter(p => p.id !== juistePlant.id);
    optiesPool.sort(() => Math.random() - 0.5);
    let fouteOpties = optiesPool.slice(0, 3);
    let opties = [juistePlant, ...fouteOpties];
    opties.sort(() => Math.random() - 0.5);

    return {
      juistePlant: juistePlant,
      opties: opties,
      mode: mode
    };
  });

  if (quizVragen.length > 10) quizVragen = quizVragen.slice(0, 10);

  huidigeVraagIndex = 0;
  score = 0;

  document.getElementById("quiz-settings-card").classList.add("hidden");
  document.getElementById("result-card").classList.add("hidden");
  document.getElementById("quiz-card").classList.remove("hidden");

  toonQuizVraag();
}

function toonQuizVraag() {
  clearInterval(quizTimer);
  clearInterval(timerBarInterval);

  const feedbackBox = document.getElementById("feedback-box");
  feedbackBox.classList.add("hidden");
  feedbackBox.className = "feedback-box hidden";
  document.getElementById("next-btn").classList.add("hidden");

  const vraag = quizVragen[huidigeVraagIndex];
  const totaal = quizVragen.length;

  document.getElementById("question-count").innerText = `Vraag ${huidigeVraagIndex + 1} van ${totaal}`;
  document.getElementById("score-display").innerText = `Score: ${score}`;
  document.getElementById("progress-bar").style.width = `${((huidigeVraagIndex) / totaal) * 100}%`;

  const imgContainer = document.getElementById("image-container");
  const plantImg = document.getElementById("plant-img");
  const qTitle = document.getElementById("question-title");
  const qDesc = document.getElementById("question-desc");
  const optContainer = document.getElementById("options-container");

  optContainer.innerHTML = "";

  if (vraag.mode === "foto-naar-naam") {
    imgContainer.classList.remove("hidden");
    plantImg.src = vraag.juistePlant.foto || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80';
    qTitle.classList.add("hidden");
    qDesc.innerText = "Welke plant is dit?";

    vraag.opties.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerText = `${opt.nlNaam} (${opt.latNaam})`;
      btn.onclick = () => controleerAntwoord(opt.id, vraag.juistePlant.id, btn);
      optContainer.appendChild(btn);
    });

  } else if (vraag.mode === "naam-naar-foto") {
    imgContainer.classList.add("hidden");
    qTitle.classList.remove("hidden");
    qTitle.innerText = `${vraag.juistePlant.nlNaam} (${vraag.juistePlant.latNaam})`;
    qDesc.innerText = "Kies de juiste foto bij deze plant:";

    optContainer.style.gridTemplateColumns = "1fr 1fr";

    vraag.opties.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "option-img-btn";
      const img = document.createElement("img");
      img.src = opt.foto || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80';
      btn.appendChild(img);
      btn.onclick = () => controleerAntwoord(opt.id, vraag.juistePlant.id, btn);
      optContainer.appendChild(btn);
    });

  } else if (vraag.mode === "eigenschap-naar-naam") {
    imgContainer.classList.add("hidden");
    qTitle.classList.add("hidden");

    let hints = [];
    if (vraag.juistePlant.familie) hints.push(`<strong>Familie:</strong> ${vraag.juistePlant.familie}`);
    if (vraag.juistePlant.bladvorm) hints.push(`<strong>Bladvorm:</strong> ${vraag.juistePlant.bladvorm}`);
    if (vraag.juistePlant.bloei) hints.push(`<strong>Bloeitijd:</strong> ${vraag.juistePlant.bloei}`);
    if (vraag.juistePlant.locatieSchool) hints.push(`<strong>📍 Schoollocatie:</strong> ${vraag.juistePlant.locatieSchool}`);

    qDesc.innerHTML = "<strong>Herbarium Kenmerken:</strong><br>" + hints.join("<br>");

    vraag.opties.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerText = `${opt.nlNaam} (${opt.latNaam})`;
      btn.onclick = () => controleerAntwoord(opt.id, vraag.juistePlant.id, btn);
      optContainer.appendChild(btn);
    });
  }

  // Timer Afhandeling
  const timerDisplay = document.getElementById("timer-display");
  const timerBarContainer = document.getElementById("timer-bar-container");
  const timerBar = document.getElementById("timer-bar");

  if (gekozenTimerTijd > 0) {
    timerDisplay.classList.remove("hidden");
    timerBarContainer.classList.remove("hidden");
    let tijdOver = gekozenTimerTijd;
    document.getElementById("time-left").innerText = tijdOver;
    timerBar.style.width = "100%";

    const stap = 100 / gekozenTimerTijd;

    quizTimer = setInterval(() => {
      tijdOver--;
      document.getElementById("time-left").innerText = tijdOver;
      timerBar.style.width = `${tijdOver * stap}%`;

      if (tijdOver <= 0) {
        clearInterval(quizTimer);
        tijdIsOm(vraag.juistePlant.id);
      }
    }, 1000);
  } else {
    timerDisplay.classList.add("hidden");
    timerBarContainer.classList.add("hidden");
  }
}

function controleerAntwoord(gekozenId, juistId, gekozenKnop) {
  clearInterval(quizTimer);

  const alleKnoppen = document.querySelectorAll("#options-container button");
  alleKnoppen.forEach(b => b.disabled = true);

  const feedbackBox = document.getElementById("feedback-box");
  feedbackBox.classList.remove("hidden");

  const isJuist = gekozenId === juistId;

  if (isJuist) {
    score++;
    gekozenKnop.classList.add("correct");
    feedbackBox.className = "feedback-box correct";
    feedbackBox.innerText = "🎉 Uitstekend! Dat is het juiste antwoord.";
  } else {
    gekozenKnop.classList.add("wrong");
    feedbackBox.className = "feedback-box wrong";
    const juistePlant = plantenDatabase.find(p => p.id === juistId);
    feedbackBox.innerText = `❌ Helaas! Het juiste antwoord was: ${juistePlant.nlNaam} (${juistePlant.latNaam})`;
  }

  document.getElementById("score-display").innerText = `Score: ${score}`;
  document.getElementById("next-btn").classList.remove("hidden");
}

function tijdIsOm(juistId) {
  const alleKnoppen = document.querySelectorAll("#options-container button");
  alleKnoppen.forEach(b => b.disabled = true);

  const feedbackBox = document.getElementById("feedback-box");
  feedbackBox.classList.remove("hidden");
  feedbackBox.className = "feedback-box wrong";

  const juistePlant = plantenDatabase.find(p => p.id === juistId);
  feedbackBox.innerText = `⏱️ Tijd is om! Het juiste antwoord was: ${juistePlant.nlNaam} (${juistePlant.latNaam})`;

  document.getElementById("next-btn").classList.remove("hidden");
}

function volgendeVraag() {
  huidigeVraagIndex++;
  if (huidigeVraagIndex < quizVragen.length) {
    toonQuizVraag();
  } else {
    toonEindResultaat();
  }
}

function toonEindResultaat() {
  document.getElementById("quiz-card").classList.add("hidden");
  document.getElementById("result-card").classList.remove("hidden");

  document.getElementById("final-score").innerText = score;
  document.getElementById("total-questions").innerText = quizVragen.length;
}

function herstartQuiz() {
  startQuizMetInstellingen();
}

function stopQuizAndReturn() {
  clearInterval(quizTimer);
  document.getElementById("quiz-card").classList.add("hidden");
  document.getElementById("result-card").classList.add("hidden");
  document.getElementById("quiz-settings-card").classList.remove("hidden");
}

function verstuurNaarGoogleForms() {
  const status = document.getElementById("submit-status");
  status.style.color = "#2e7d32";
  status.innerText = "✅ Resultaat is succesvol opgeslagen!";
}

// --- TAB 4: BEHEER LOGICA ---
function voegPlantToe(e) {
  e.preventDefault();

  const nlNaam = document.getElementById("new-nl").value.trim();
  const latNaam = document.getElementById("new-lat").value.trim();
  const familie = document.getElementById("new-familie").value.trim();
  const locatieSchool = document.getElementById("new-locatie-school").value.trim();

  const leerjaren = [];
  if (document.getElementById("jaar-3").checked) leerjaren.push(3);
  if (document.getElementById("jaar-4").checked) leerjaren.push(4);
  if (document.getElementById("jaar-5").checked) leerjaren.push(5);
  if (document.getElementById("jaar-6").checked) leerjaren.push(6);

  const bladvorm = document.getElementById("new-bladvorm").value.trim();
  const bladrand = document.getElementById("new-bladrand").value.trim();
  const vrucht = document.getElementById("new-vrucht").value.trim();
  const bloei = document.getElementById("new-bloei").value.trim();
  const categorie = document.getElementById("new-categorie").value;
  const standplaats = document.getElementById("new-standplaats").value;
  const bodem = document.getElementById("new-bodem").value;
  const water = document.getElementById("new-water").value.trim();
  const bladbehoud = document.getElementById("new-blad").value;
  const vermeerderen = document.getElementById("new-vermeerderen").value.trim();
  const grootte = document.getElementById("new-grootte").value.trim();
  const beschrijving = document.getElementById("new-desc").value.trim();

  let foto = document.getElementById("new-foto").value.trim();
  const fotoData = document.getElementById("new-foto-data").value;

  if (fotoData) {
    foto = fotoData;
  }

  if (isBewerken && bewerkPlantId !== null) {
    const idx = plantenDatabase.findIndex(p => p.id === bewerkPlantId);
    if (idx !== -1) {
      plantenDatabase[idx] = {
        id: bewerkPlantId,
        nlNaam, latNaam, familie, locatieSchool, leerjaren, bladvorm, bladrand,
        vrucht, bloei, categorie, standplaats, bodem, water,
        bladbehoud, vermeerderen, grootte, beschrijving, foto
      };
      alert("Plant succesvol bijgewerkt!");
    }
  } else {
    const nieuwePlant = {
      id: Date.now(),
      nlNaam, latNaam, familie, locatieSchool, leerjaren, bladvorm, bladrand,
      vrucht, bloei, categorie, standplaats, bodem, water,
      bladbehoud, vermeerderen, grootte, beschrijving, foto
    };
    plantenDatabase.push(nieuwePlant);
    alert("Nieuwe plant succesvol toegevoegd aan het herbarium!");
  }

  opslaanInLocalStorage();
  resetFormulier();
  laadBeheerLijst();
  pasFiltersToe();
}

function resetFormulier() {
  isBewerken = false;
  bewerkPlantId = null;
  document.getElementById("add-plant-form").reset();
  document.getElementById("new-foto-data").value = "";
  document.getElementById("img-preview-container").classList.add("hidden");
  document.getElementById("submit-btn").innerText = "➕ Plant Toevoegen aan Herbarium";
}

function laadBeheerLijst() {
  const lijst = document.getElementById("admin-plant-list");
  if (!lijst) return;
  lijst.innerHTML = "";

  const gesorteerd = [...plantenDatabase].sort((a, b) => a.nlNaam.localeCompare(b.nlNaam));

  gesorteerd.forEach(plant => {
    const item = document.createElement("div");
    item.className = "admin-plant-item";

    const leerjarenLabel = plant.leerjaren && plant.leerjaren.length > 0 
      ? plant.leerjaren.map(j => j + "e").join(", ") 
      : "Alle";

    const fotoUrl = plant.foto || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80';

    item.innerHTML = `
      <div class="admin-plant-info">
        <img src="${fotoUrl}" alt="${plant.nlNaam}" class="admin-plant-thumb">
        <div class="admin-plant-details">
          <strong>${plant.nlNaam}</strong> 
          <span class="admin-lat-naam">(${plant.latNaam})</span>
          <div class="admin-plant-meta">
            <span>🎓 Jaar ${leerjarenLabel}</span>
            ${plant.categorie ? ` • <span>🏷️ ${plant.categorie}</span>` : ''}
            ${plant.locatieSchool ? ` • <span style="color:#2e7d32;">📍 ${plant.locatieSchool}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="admin-plant-actions">
        <button type="button" class="btn-edit" onclick="startBewerken(${plant.id})">✏️ Bewerken</button>
        <button type="button" class="btn-delete" onclick="verwijderPlant(${plant.id})">🗑️ Wissen</button>
      </div>
    `;
    lijst.appendChild(item);
  });
}

function startBewerken(id) {
  const plant = plantenDatabase.find(p => p.id === id);
  if (!plant) return;

  isBewerken = true;
  bewerkPlantId = id;

  document.getElementById("new-nl").value = plant.nlNaam || "";
  document.getElementById("new-lat").value = plant.latNaam || "";
  document.getElementById("new-familie").value = plant.familie || "";
  document.getElementById("new-locatie-school").value = plant.locatieSchool || "";

  document.getElementById("jaar-3").checked = plant.leerjaren ? plant.leerjaren.includes(3) : false;
  document.getElementById("jaar-4").checked = plant.leerjaren ? plant.leerjaren.includes(4) : false;
  document.getElementById("jaar-5").checked = plant.leerjaren ? plant.leerjaren.includes(5) : false;
  document.getElementById("jaar-6").checked = plant.leerjaren ? plant.leerjaren.includes(6) : false;

  document.getElementById("new-bladvorm").value = plant.bladvorm || "";
  document.getElementById("new-bladrand").value = plant.bladrand || "";
  document.getElementById("new-vrucht").value = plant.vrucht || "";
  document.getElementById("new-bloei").value = plant.bloei || "";
  document.getElementById("new-categorie").value = plant.categorie || "Onkruid / Wilde plant";
  document.getElementById("new-standplaats").value = plant.standplaats || "Geen voorkeur (Zon tot Schaduw)";
  document.getElementById("new-bodem").value = plant.bodem || "Geen voorkeur / Elke bodemsoort";
  document.getElementById("new-water").value = plant.water || "";
  document.getElementById("new-blad").value = plant.bladbehoud || "Bladverliezend";
  document.getElementById("new-vermeerderen").value = plant.vermeerderen || "";
  document.getElementById("new-grootte").value = plant.grootte || "";
  document.getElementById("new-desc").value = plant.beschrijving || "";

  if (plant.foto && plant.foto.startsWith("data:image")) {
    document.getElementById("new-foto").value = "";
    document.getElementById("new-foto-data").value = plant.foto;
    document.getElementById("img-preview").src = plant.foto;
    document.getElementById("img-preview-container").classList.remove("hidden");
  } else {
    document.getElementById("new-foto").value = plant.foto || "";
    document.getElementById("new-foto-data").value = "";
    if (plant.foto) {
      document.getElementById("img-preview").src = plant.foto;
      document.getElementById("img-preview-container").classList.remove("hidden");
    } else {
      document.getElementById("img-preview-container").classList.add("hidden");
    }
  }

  document.getElementById("submit-btn").innerText = "💾 Wijzigingen Opslaan";
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function verwijderPlant(id) {
  if (confirm("Weet je zeker dat je deze plant wilt verwijderen uit de database?")) {
    plantenDatabase = plantenDatabase.filter(p => p.id !== id);
    opslaanInLocalStorage();
    laadBeheerLijst();
    pasFiltersToe();
  }
}

// --- FOTO UPLOAD & PASTE FUNCTIES ---
function verwerkBestandUpload(input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById("new-foto-data").value = e.target.result;
      document.getElementById("img-preview").src = e.target.result;
      document.getElementById("img-preview-container").classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
}

function verwerkPlakEvent(e) {
  const items = (e.clipboardData || e.originalEvent.clipboardData).items;
  for (let index in items) {
    const item = items[index];
    if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.onload = function(event) {
        document.getElementById("new-foto-data").value = event.target.result;
        document.getElementById("img-preview").src = event.target.result;
        document.getElementById("img-preview-container").classList.remove("hidden");
        alert("Afbeelding succesvol geplakt!");
      };
      reader.readAsDataURL(blob);
    }
  }
}

// --- FLOATING BACK TO TOP BUTTON ---
function controleerScrollPositie() {
  const btn = document.getElementById("back-to-top-btn");
  if (!btn) return;
  if (window.scrollY > 300) {
    btn.classList.add("show");
  } else {
    btn.classList.remove("show");
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
