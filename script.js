const standaardPlanten = [
  {
    id: 1,
    nlNaam: "Gewone esdoorn",
    latNaam: "Acer pseudoplatanus",
    familie: "Sapindaceae (Zeepboomfamilie)",
    leerjaren: ["3", "4", "5", "6"],
    categorie: "Boom",
    bladvorm: "Handlobbig (5 lobben)",
    bladrand: "Grof getand",
    vrucht: "Gefleugelde splitvrucht (helikoptertje)",
    standplaats: "Volle zon",
    bodemsoort: "Humusrijk / Universeel",
    waterbehoefte: "Gemiddeld (regelmatig)",
    bladbehoud: "Bladverliezend",
    bloeitijd: "Mei (hangende trossen)",
    vermeerderen: "Zaaien",
    grootte: "20 tot 30 meter",
    foto: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    beschrijving: "Opvallend grote knoppen met groene schubben. Vruchten hangen in V-vorm."
  },
  {
    id: 2,
    nlNaam: "Paardenbloem",
    latNaam: "Taraxacum officinale",
    familie: "Asteraceae (Composietenfamilie)",
    leerjaren: ["3", "4"],
    categorie: "Onkruid / Wilde plant",
    bladvorm: "Veerspletig in wortelrozet",
    bladrand: "Achterwaarts getand",
    vrucht: "Nootje met vruchtpluis (pluisbol)",
    standplaats: "Geen voorkeur (Zon tot Schaduw)",
    bodemsoort: "Geen voorkeur / Elke bodemsoort",
    waterbehoefte: "Verdraagt droogte én nattigheid",
    bladbehoud: "Bladverliezend",
    bloeitijd: "April - Oktober",
    vermeerderen: "Penwortel & Pluiszaad via wind",
    grootte: "5 tot 40 cm",
    foto: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=600&q=80",
    beschrijving: "Bekend onkruid met holle stengel en wit melksap. Groeit op vrijwel elke bodem."
  },
  {
    id: 3,
    nlNaam: "Monstera (Gatenplant)",
    latNaam: "Monstera deliciosa",
    familie: "Araceae (Aronskelkfamilie)",
    leerjaren: ["3", "4"],
    categorie: "Kamerplant",
    bladvorm: "Hartvormig met diepe insnijdingen/gaten",
    bladrand: "Gaafrandig (ingesneden)",
    vrucht: "Kolfvrucht (zelden binnenshuis)",
    standplaats: "Halfschaduw / Lichte plek",
    bodemsoort: "Humusrijk / Universeel",
    waterbehoefte: "Gemiddeld (regelmatig)",
    bladbehoud: "Groenblijvend (bladhoudend)",
    bloeitijd: "Zelden in de huiskamer",
    vermeerderen: "Stengelstek met luchtwortel",
    grootte: "1,5 tot 3 meter",
    foto: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
    beschrijving: "Bekend om zijn grote, ingesneden bladeren en luchtwortels."
  }
];

let plantenDatabase = [];
let bewerkId = null;

try {
  const opgeslagen = localStorage.getItem('mijnPlantenApp_data');
  plantenDatabase = opgeslagen ? JSON.parse(opgeslagen) : standaardPlanten;
} catch (err) {
  plantenDatabase = standaardPlanten;
}

// FLASHCARD VARIABELEN
let fcLijst = [];
let fcIndex = 0;

// QUIZ VARIABELEN
let huidigeVraagIndex = 0;
let score = 0;
let quizVragen = [];
let gekozenSpelvorm = "foto-naar-naam";
let ingesteldeTimerSec = 0;
let timerInterval = null;
let resterendeTijd = 0;

document.addEventListener("DOMContentLoaded", function() {
  laadBibliotheek();
  laadBeheerLijst();
  installeerPlakLuisteraar();
});

function opslaanInStorage() {
  try {
    localStorage.setItem('mijnPlantenApp_data', JSON.stringify(plantenDatabase));
  } catch (e) {
    alert("⚠️ Waarschuwing: Afbeelding is te groot om op te slaan.");
  }
}

// TAB NAVIGATION MET WACHTWOORDBEVEILIGING FOR BEHEER
function switchTab(tabId, btnElement) {
  if (tabId === 'admin-tab') {
    const ingevoerdWachtwoord = prompt("🔒 Voer het beheerderswachtwoord in:");
    if (ingevoerdWachtwoord !== 'docent123') {
      if (ingevoerdWachtwoord !== null) {
        alert("❌ Onjuist wachtwoord! Toegang geweigerd.");
      }
      return;
    }
  }

  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  
  const gekozenTab = document.getElementById(tabId);
  if (gekozenTab) gekozenTab.classList.add('active');
  if (btnElement) btnElement.classList.add('active');

  if (tabId === 'flashcard-tab') {
    initFlashcards();
  }
}

// FLASHCARDS LOGICA
function initFlashcards() {
  filterFlashcardsOpJaar();
}

function filterFlashcardsOpJaar() {
  const gekozenJaar = document.getElementById("fc-jaar-select").value;
  if (gekozenJaar === "alle") {
    fcLijst = [...plantenDatabase];
  } else {
    fcLijst = plantenDatabase.filter(p => p.leerjaren && p.leerjaren.includes(gekozenJaar));
  }
  fcIndex = 0;
  toonFlashcard();
}

function toonFlashcard() {
  const cardEl = document.getElementById("flashcard");
  if (cardEl) cardEl.classList.remove("flipped");

  if (fcLijst.length === 0) {
    document.getElementById("fc-nl").innerText = "Geen planten gevonden";
    document.getElementById("fc-lat").innerText = "Kies een ander leerjaar";
    document.getElementById("fc-details").innerText = "";
    document.getElementById("fc-counter").innerText = "0 / 0";
    return;
  }

  const plant = fcLijst[fcIndex];

  document.getElementById("fc-img").src = plant.foto || "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80";
  document.getElementById("fc-nl").innerText = plant.nlNaam;
  document.getElementById("fc-lat").innerText = plant.latNaam;

  let hint = [];
  if (plant.familie) hint.push("🏛️ <strong>Familie:</strong> " + plant.familie);
  if (plant.leerjaren && plant.leerjaren.length > 0) hint.push("🎓 <strong>Leerjaar:</strong> " + plant.leerjaren.map(j => j + "e").join(", "));
  if (plant.categorie) hint.push("🏷️ <strong>Type:</strong> " + plant.categorie);
  if (plant.bladvorm) hint.push("🍃 <strong>Bladvorm:</strong> " + plant.bladvorm);
  if (plant.bladrand) hint.push("📐 <strong>Bladrand:</strong> " + plant.bladrand);
  if (plant.vrucht) hint.push("🍒 <strong>Vrucht:</strong> " + plant.vrucht);
  if (plant.standplaats) hint.push("☀️ <strong>Standplaats:</strong> " + plant.standplaats);
  if (plant.bodemsoort) hint.push("🪴 <strong>Bodemsoort:</strong> " + plant.bodemsoort);
  if (plant.beschrijving) hint.push("📝 <strong>Herbariumtip:</strong> " + plant.beschrijving);

  document.getElementById("fc-details").innerHTML = hint.join("<br>");
  document.getElementById("fc-counter").innerText = (fcIndex + 1) + " / " + fcLijst.length;
}

function draaiFlashcardOm() {
  if (fcLijst.length > 0) {
    document.getElementById("flashcard").classList.toggle("flipped");
  }
}

function volgendeFlashcard() {
  if (fcIndex < fcLijst.length - 1) {
    fcIndex++;
    toonFlashcard();
  }
}

function vorigeFlashcard() {
  if (fcIndex > 0) {
    fcIndex--;
    toonFlashcard();
  }
}

function schudFlashcards() {
  fcLijst = fcLijst.sort(() => Math.random() - 0.5);
  fcIndex = 0;
  toonFlashcard();
}

// QUIZ LOGICA
function startQuizMetInstellingen() {
  gekozenSpelvorm = document.getElementById("quiz-mode-select").value;
  ingesteldeTimerSec = parseInt(document.getElementById("timer-select").value, 10);
  const gekozenJaar = document.getElementById("quiz-jaar-select").value;

  let gefilterdePlanten = [...plantenDatabase];
  if (gekozenJaar !== "alle") {
    gefilterdePlanten = plantenDatabase.filter(p => p.leerjaren && p.leerjaren.includes(gekozenJaar));
  }

  if (gefilterdePlanten.length === 0) {
    alert("⚠️ Er zijn nog geen planten ingevoerd voor dit leerjaar.");
    return;
  }

  quizVragen = gefilterdePlanten.sort(() => Math.random() - 0.5);

  document.getElementById("quiz-settings-card").classList.add("hidden");
  document.getElementById("quiz-card").classList.remove("hidden");
  
  herstartQuiz();
}

function stopQuizAndReturn() {
  clearInterval(timerInterval);
  document.getElementById("quiz-card").classList.add("hidden");
  document.getElementById("result-card").classList.add("hidden");
  document.getElementById("quiz-settings-card").classList.remove("hidden");
}

function herstartQuiz() {
  clearInterval(timerInterval);
  huidigeVraagIndex = 0;
  score = 0;
  
  document.getElementById("quiz-card").classList.remove("hidden");
  document.getElementById("result-card").classList.add("hidden");
  
  if (quizVragen.length > 0) {
    toonVraag();
  }
}

function toonVraag() {
  clearInterval(timerInterval);
  const vraag = quizVragen[huidigeVraagIndex];
  if (!vraag) return;
  
  document.getElementById("question-count").innerText = "Vraag " + (huidigeVraagIndex + 1) + " van " + quizVragen.length;
  document.getElementById("score-display").innerText = "Score: " + score;
  document.getElementById("progress-bar").style.width = ((huidigeVraagIndex / quizVragen.length) * 100) + "%";

  const imgContainer = document.getElementById("image-container");
  const questionTitle = document.getElementById("question-title");
  const questionDesc = document.getElementById("question-desc");
  const optiesContainer = document.getElementById("options-container");
  
  optiesContainer.innerHTML = "";
  document.getElementById("feedback-box").className = "feedback-box hidden";
  document.getElementById("next-btn").classList.add("hidden");

  if (gekozenSpelvorm === "foto-naar-naam") {
    imgContainer.classList.remove("hidden");
    questionTitle.classList.add("hidden");
    document.getElementById("plant-img").src = vraag.foto;
    
    let hint = "";
    if (vraag.familie) hint += "🏛️ Familie: " + vraag.familie + " | ";
    if (vraag.bladvorm) hint += "🍃 Bladvorm: " + vraag.bladvorm;
    questionDesc.innerText = hint;

    genereerOpties(vraag).forEach(optie => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerText = optie.nlNaam + " (" + optie.latNaam + ")";
      btn.onclick = function() { controleerAntwoord(optie, vraag, btn); };
      optiesContainer.appendChild(btn);
    });

  } else if (gekozenSpelvorm === "naam-naar-foto") {
    imgContainer.classList.add("hidden");
    questionTitle.classList.remove("hidden");
    questionTitle.innerText = "Welke foto hoort bij: " + vraag.nlNaam + " (" + vraag.latNaam + ")?";
    questionDesc.innerText = "Klik op de juiste foto.";

    genereerOpties(vraag).forEach(optie => {
      const btn = document.createElement("button");
      btn.className = "option-img-btn";
      btn.innerHTML = `<img src="${optie.foto}" alt="Optie">`;
      btn.onclick = function() { controleerAntwoord(optie, vraag, btn); };
      optiesContainer.appendChild(btn);
    });

  } else if (gekozenSpelvorm === "eigenschap-naar-naam") {
    imgContainer.classList.add("hidden");
    questionTitle.classList.remove("hidden");
    questionTitle.innerText = "Welke plant heeft deze herbariumkenmerken?";

    let hint = [];
    if (vraag.familie) hint.push("🏛️ <strong>Familie:</strong> " + vraag.familie);
    if (vraag.bladvorm) hint.push("🍃 <strong>Bladvorm:</strong> " + vraag.bladvorm);
    if (vraag.bladrand) hint.push("📐 <strong>Bladrand:</strong> " + vraag.bladrand);
    if (vraag.bodemsoort) hint.push("🪴 <strong>Bodemsoort:</strong> " + vraag.bodemsoort);
    if (vraag.vrucht) hint.push("🍒 <strong>Vrucht:</strong> " + vraag.vrucht);
    if (vraag.beschrijving) hint.push("📝 <strong>Tip:</strong> " + vraag.beschrijving);

    questionDesc.innerHTML = hint.length > 0 ? hint.join("<br>") : "Geen specifieke kenmerken.";

    genereerOpties(vraag).forEach(optie => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerText = optie.nlNaam + " (" + optie.latNaam + ")";
      btn.onclick = function() { controleerAntwoord(optie, vraag, btn); };
      optiesContainer.appendChild(btn);
    });
  }

  startTimer();
}

function startTimer() {
  const timerBadge = document.getElementById("timer-display");
  const timerBarContainer = document.getElementById("timer-bar-container");
  const timerBar = document.getElementById("timer-bar");

  if (ingesteldeTimerSec <= 0) {
    timerBadge.classList.add("hidden");
    timerBarContainer.classList.add("hidden");
    return;
  }

  timerBadge.classList.remove("hidden");
  timerBarContainer.classList.remove("hidden");

  resterendeTijd = ingesteldeTimerSec;
  document.getElementById("time-left").innerText = resterendeTijd;
  timerBar.style.width = "100%";
  timerBar.style.backgroundColor = "#ff9800";

  timerInterval = setInterval(() => {
    resterendeTijd--;
    document.getElementById("time-left").innerText = resterendeTijd;
    
    let percentage = (resterendeTijd / ingesteldeTimerSec) * 100;
    timerBar.style.width = percentage + "%";

    if (resterendeTijd <= 5) {
      timerBar.style.backgroundColor = "#c62828";
    }

    if (resterendeTijd <= 0) {
      clearInterval(timerInterval);
      tijdOm();
    }
  }, 1000);
}

function tijdOm() {
  const feedbackBox = document.getElementById("feedback-box");
  feedbackBox.innerText = "⏰ Tijd is om! Het juiste antwoord was: " + quizVragen[huidigeVraagIndex].nlNaam;
  feedbackBox.className = "feedback-box wrong";

  disableAlleKnoppen();
  document.getElementById("next-btn").classList.remove("hidden");
}

function genereerOpties(correctePlant) {
  let fouteOpties = plantenDatabase.filter(p => p.id !== correctePlant.id);
  fouteOpties = fouteOpties.sort(() => Math.random() - 0.5).slice(0, Math.min(3, fouteOpties.length));
  return [correctePlant, ...fouteOpties].sort(() => Math.random() - 0.5);
}

function controleerAntwoord(gekozenOptie, correctePlant, gekozenKnop) {
  clearInterval(timerInterval);
  disableAlleKnoppen();

  const feedbackBox = document.getElementById("feedback-box");

  if (gekozenOptie.id === correctePlant.id) {
    score++;
    gekozenKnop.classList.add("correct");
    feedbackBox.innerText = "✅ Helemaal goed!";
    feedbackBox.className = "feedback-box correct";
  } else {
    gekozenKnop.classList.add("wrong");
    feedbackBox.innerText = "❌ Helaas! Het juiste antwoord was: " + correctePlant.nlNaam;
    feedbackBox.className = "feedback-box wrong";
  }

  document.getElementById("score-display").innerText = "Score: " + score;
  document.getElementById("next-btn").classList.remove("hidden");
}

function disableAlleKnoppen() {
  document.querySelectorAll(".option-btn, .option-img-btn").forEach(btn => btn.disabled = true);
}

function volgendeVraag() {
  huidigeVraagIndex++;
  if (huidigeVraagIndex < quizVragen.length) {
    toonVraag();
  } else {
    toonResultaten();
  }
}

function toonResultaten() {
  clearInterval(timerInterval);
  document.getElementById("quiz-card").classList.add("hidden");
  document.getElementById("result-card").classList.remove("hidden");
  document.getElementById("final-score").innerText = score;
  document.getElementById("total-questions").innerText = quizVragen.length;
}

// BIBLIOTHEEK & FILTERS
function laadBibliotheek() {
  const grid = document.getElementById("plant-grid");
  if (!grid) return;
  
  plantenDatabase.sort((a, b) => a.nlNaam.localeCompare(b.nlNaam));
  grid.innerHTML = "";

  plantenDatabase.forEach(plant => {
    const card = document.createElement("div");
    card.className = "plant-card";
    
    card.setAttribute("data-nl", (plant.nlNaam || "").toLowerCase());
    card.setAttribute("data-lat", (plant.latNaam || "").toLowerCase());
    card.setAttribute("data-cat", plant.categorie || "");
    card.setAttribute("data-standplaats", plant.standplaats || "");
    card.setAttribute("data-bodem", plant.bodemsoort || "");
    card.setAttribute("data-blad", plant.bladbehoud || "");
    card.setAttribute("data-jaren", JSON.stringify(plant.leerjaren || []));

    const zoekData = [
      plant.nlNaam, plant.latNaam, plant.familie, plant.bladvorm, plant.bladrand, plant.vrucht,
      plant.categorie, plant.standplaats, plant.bodemsoort, plant.waterbehoefte, plant.bladbehoud, 
      plant.bloeitijd, plant.vermeerderen, plant.grootte, plant.beschrijving
    ].filter(Boolean).join(" ").toLowerCase();

    card.setAttribute("data-search", zoekData);

    const leerjarenTekst = plant.leerjaren && plant.leerjaren.length > 0 
      ? plant.leerjaren.map(j => j + "e").join(", ") 
      : "Alle";

    card.innerHTML = `
      <img src="${plant.foto || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80'}" alt="${plant.nlNaam}">
      <div class="plant-card-content">
        <h3>${plant.nlNaam}</h3>
        <p><em>${plant.latNaam}</em></p>
        
        <div class="plant-details">
          ${plant.familie ? `<span>🏛️ <strong>Familie:</strong> ${plant.familie}</span>` : ''}
          <span>🎓 <strong>Leerjaar:</strong> ${leerjarenTekst}</span>
          ${plant.categorie ? `<span>🏷️ <strong>Type:</strong> ${plant.categorie}</span>` : ''}
          ${plant.bladvorm ? `<span>🍃 <strong>Bladvorm:</strong> ${plant.bladvorm}</span>` : ''}
          ${plant.bladrand ? `<span>📐 <strong>Bladrand:</strong> ${plant.bladrand}</span>` : ''}
          ${plant.vrucht ? `<span>🍒 <strong>Vrucht:</strong> ${plant.vrucht}</span>` : ''}
          ${plant.standplaats ? `<span>☀️ <strong>Standplaats:</strong> ${plant.standplaats}</span>` : ''}
          ${plant.bodemsoort ? `<span>🪴 <strong>Bodemsoort:</strong> ${plant.bodemsoort}</span>` : ''}
          ${plant.waterbehoefte ? `<span>💧 <strong>Water:</strong> ${plant.waterbehoefte}</span>` : ''}
          ${plant.bladbehoud ? `<span>🍃 <strong>Blad:</strong> ${plant.bladbehoud}</span>` : ''}
          ${plant.bloeitijd ? `<span>🌸 <strong>Bloei:</strong> ${plant.bloeitijd}</span>` : ''}
          ${plant.vermeerderen ? `<span>✂️ <strong>Vermeerderen:</strong> ${plant.vermeerderen}</span>` : ''}
          ${plant.grootte ? `<span>📏 <strong>Grootte:</strong> ${plant.grootte}</span>` : ''}
          ${plant.beschrijving ? `<span>📝 <strong>Opmerking:</strong> ${plant.beschrijving}</span>` : ''}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  maakAlfabetBalk();
}

function pasFiltersToe() {
  const gekozenJaar = document.getElementById("filter-jaar").value;
  const standplaats = document.getElementById("filter-standplaats").value;
  const bodem = document.getElementById("filter-bodem").value;
  const blad = document.getElementById("filter-blad").value;
  const categorie = document.getElementById("filter-categorie").value;

  const kaarten = document.querySelectorAll(".plant-card");

  kaarten.forEach(kaart => {
    const kStand = kaart.getAttribute("data-standplaats");
    const kBodem = kaart.getAttribute("data-bodem");
    const kBlad = kaart.getAttribute("data-blad");
    const kCat = kaart.getAttribute("data-cat");
    const kJaren = JSON.parse(kaart.getAttribute("data-jaren") || "[]");

    let toon = true;

    if (gekozenJaar && !kJaren.includes(gekozenJaar)) toon = false;
    if (standplaats && kStand !== standplaats) toon = false;
    if (bodem && kBodem !== bodem) toon = false;
    if (blad && kBlad !== blad) toon = false;
    if (categorie && kCat !== categorie) toon = false;

    kaart.style.display = toon ? "block" : "none";
  });
}

function maakAlfabetBalk() {
  const container = document.getElementById("alphabet-filter");
  if (!container) return;
  container.innerHTML = "";

  const alfabet = ["ALLES", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

  alfabet.forEach(letter => {
    const btn = document.createElement("button");
    btn.className = "letter-btn";
    btn.innerText = letter;
    btn.onclick = function() { filterOpLetter(letter, btn); };
    container.appendChild(btn);
  });
}

function zoekPlanten() {
  const zoekopdracht = document.getElementById("search-input").value.toLowerCase().trim();
  const kaarten = document.querySelectorAll(".plant-card");

  kaarten.forEach(kaart => {
    const searchData = kaart.getAttribute("data-search");
    kaart.style.display = searchData.includes(zoekopdracht) ? "block" : "none";
  });
}

function filterOpLetter(letter, gekozenKnop) {
  document.getElementById("search-input").value = "";
  document.querySelectorAll(".letter-btn").forEach(b => b.classList.remove("active"));
  if (gekozenKnop) gekozenKnop.classList.add("active");

  const kaarten = document.querySelectorAll(".plant-card");

  kaarten.forEach(kaart => {
    const nl = kaart.getAttribute("data-nl");
    const lat = kaart.getAttribute("data-lat");

    if (letter === "ALLES") {
      kaart.style.display = "block";
    } else {
      const start = letter.toLowerCase();
      kaart.style.display = (nl.startsWith(start) || lat.startsWith(start)) ? "block" : "none";
    }
  });
}

// UPLOAD EN BEHEER LOGICA
function installeerPlakLuisteraar() {
  const pasteZone = document.getElementById("paste-area");
  if (!pasteZone) return;

  pasteZone.addEventListener("paste", function(e) {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let item of items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        leesFotoBestand(item.getAsFile());
        break;
      }
    }
  });
}

function verwerkBestandUpload(input) {
  if (input.files && input.files[0]) {
    leesFotoBestand(input.files[0]);
  }
}

function leesFotoBestand(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById("new-foto-data").value = e.target.result;
    document.getElementById("img-preview").src = e.target.result;
    document.getElementById("img-preview-container").classList.remove("hidden");
  };
  reader.readAsDataURL(file);
}

function voegPlantToe(e) {
  e.preventDefault();

  const geplakteOfUploadFoto = document.getElementById("new-foto-data").value;
  const urlFoto = document.getElementById("new-foto").value.trim();
  const standaardFoto = "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80";

  let gekozenFoto = geplakteOfUploadFoto || urlFoto || standaardFoto;

  // LEERJAREN OPHALEN
  const gekozenLeerjaren = [];
  if (document.getElementById("jaar-3").checked) gekozenLeerjaren.push("3");
  if (document.getElementById("jaar-4").checked) gekozenLeerjaren.push("4");
  if (document.getElementById("jaar-5").checked) gekozenLeerjaren.push("5");
  if (document.getElementById("jaar-6").checked) gekozenLeerjaren.push("6");

  if (bewerkId !== null) {
    const index = plantenDatabase.findIndex(p => p.id === bewerkId);
    if (index !== -1) {
      if (!geplakteOfUploadFoto && !urlFoto) {
        gekozenFoto = plantenDatabase[index].foto;
      }

      plantenDatabase[index] = {
        id: bewerkId,
        nlNaam: document.getElementById("new-nl").value.trim(),
        latNaam: document.getElementById("new-lat").value.trim(),
        familie: document.getElementById("new-familie").value.trim(),
        leerjaren: gekozenLeerjaren,
        bladvorm: document.getElementById("new-bladvorm").value.trim(),
        bladrand: document.getElementById("new-bladrand").value.trim(),
        vrucht: document.getElementById("new-vrucht").value.trim(),
        categorie: document.getElementById("new-categorie").value,
        standplaats: document.getElementById("new-standplaats").value,
        bodemsoort: document.getElementById("new-bodem").value,
        waterbehoefte: document.getElementById("new-water").value,
        bladbehoud: document.getElementById("new-blad").value,
        bloeitijd: document.getElementById("new-bloei").value.trim(),
        vermeerderen: document.getElementById("new-vermeerderen").value.trim(),
        grootte: document.getElementById("new-grootte").value.trim(),
        foto: gekozenFoto,
        beschrijving: document.getElementById("new-desc").value.trim()
      };
      alert("✅ Herbarium-item succesvol bijgewerkt!");
    }
    bewerkId = null;
  } else {
    plantenDatabase.push({
      id: Date.now(),
      nlNaam: document.getElementById("new-nl").value.trim(),
      latNaam: document.getElementById("new-lat").value.trim(),
      familie: document.getElementById("new-familie").value.trim(),
      leerjaren: gekozenLeerjaren,
      bladvorm: document.getElementById("new-bladvorm").value.trim(),
      bladrand: document.getElementById("new-bladrand").value.trim(),
      vrucht: document.getElementById("new-vrucht").value.trim(),
      categorie: document.getElementById("new-categorie").value,
      standplaats: document.getElementById("new-standplaats").value,
      bodemsoort: document.getElementById("new-bodem").value,
      waterbehoefte: document.getElementById("new-water").value,
      bladbehoud: document.getElementById("new-blad").value,
      bloeitijd: document.getElementById("new-bloei").value.trim(),
      vermeerderen: document.getElementById("new-vermeerderen").value.trim(),
      grootte: document.getElementById("new-grootte").value.trim(),
      foto: gekozenFoto,
      beschrijving: document.getElementById("new-desc").value.trim()
    });
    alert("✅ Nieuwe plant succesvol toegevoegd aan het Herbarium!");
  }

  opslaanInStorage();
  resetFormulier();
  laadBibliotheek();
  laadBeheerLijst();
}

function startBewerken(id) {
  const plant = plantenDatabase.find(p => p.id === id);
  if (!plant) return;

  bewerkId = plant.id;
  document.getElementById("new-nl").value = plant.nlNaam || "";
  document.getElementById("new-lat").value = plant.latNaam || "";
  document.getElementById("new-familie").value = plant.familie || "";
  
  // LEERJAREN VINKJES ZETTEN
  const j = plant.leerjaren || [];
  document.getElementById("jaar-3").checked = j.includes("3");
  document.getElementById("jaar-4").checked = j.includes("4");
  document.getElementById("jaar-5").checked = j.includes("5");
  document.getElementById("jaar-6").checked = j.includes("6");

  document.getElementById("new-bladvorm").value = plant.bladvorm || "";
  document.getElementById("new-bladrand").value = plant.bladrand || "";
  document.getElementById("new-vrucht").value = plant.vrucht || "";
  document.getElementById("new-categorie").value = plant.categorie || "Onkruid / Wilde plant";
  document.getElementById("new-standplaats").value = plant.standplaats || "Geen voorkeur (Zon tot Schaduw)";
  document.getElementById("new-bodem").value = plant.bodemsoort || "Geen voorkeur / Elke bodemsoort";
  document.getElementById("new-water").value = plant.waterbehoefte || "";
  document.getElementById("new-blad").value = plant.bladbehoud || "";
  document.getElementById("new-bloei").value = plant.bloeitijd || "";
  document.getElementById("new-vermeerderen").value = plant.vermeerderen || "";
  document.getElementById("new-grootte").value = plant.grootte || "";
  document.getElementById("new-desc").value = plant.beschrijving || "";
  document.getElementById("new-foto").value = plant.foto && plant.foto.startsWith("http") ? plant.foto : "";

  if (plant.foto) {
    document.getElementById("img-preview").src = plant.foto;
    document.getElementById("img-preview-container").classList.remove("hidden");
  }

  const submitBtn = document.querySelector("#add-plant-form button[type='submit']");
  if (submitBtn) submitBtn.innerText = "💾 Wijzigingen Opslaan";
  document.getElementById("add-plant-form").scrollIntoView({ behavior: 'smooth' });
}

function resetFormulier() {
  document.getElementById("add-plant-form").reset();
  document.getElementById("jaar-3").checked = true;
  document.getElementById("jaar-4").checked = false;
  document.getElementById("jaar-5").checked = false;
  document.getElementById("jaar-6").checked = false;

  document.getElementById("new-foto-data").value = "";
  document.getElementById("img-preview-container").classList.add("hidden");
  bewerkId = null;

  const submitBtn = document.querySelector("#add-plant-form button[type='submit']");
  if (submitBtn) submitBtn.innerText = "➕ Plant Toevoegen aan Herbarium";
}

function verwijderPlant(id) {
  if (confirm("Weet je zeker dat je deze plant uit het herbarium wilt verwijderen?")) {
    plantenDatabase = plantenDatabase.filter(p => p.id !== id);
    opslaanInStorage();
    laadBibliotheek();
    laadBeheerLijst();
  }
}

function laadBeheerLijst() {
  const lijst = document.getElementById("admin-plant-list");
  if (!lijst) return;
  lijst.innerHTML = "";

  plantenDatabase.forEach(plant => {
    const item = document.createElement("div");
    item.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f0f0f0; border-radius: 6px; margin-bottom: 5px;";
    
    const leerjarenLabel = plant.leerjaren && plant.leerjaren.length > 0 ? " [Jaar: " + plant.leerjaren.join(",") + "]" : "";

    item.innerHTML = `
      <span><strong>${plant.nlNaam}</strong> (<em>${plant.latNaam}</em>)<small style="color: #666;">${leerjarenLabel}</small></span>
      <div>
        <button onclick="startBewerken(${plant.id})" style="background: #1565c0; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px;">✏️ Bewerken</button>
        <button onclick="verwijderPlant(${plant.id})" style="background: #c62828; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">🗑️ Wissen</button>
      </div>
    `;
    lijst.appendChild(item);
  });
}

function verstuurNaarGoogleForms() {
  const statusEl = document.getElementById("submit-status");
  statusEl.innerText = "ℹ️ Bewaar een screenshot van dit scherm om te laten zien aan je docent.";
  statusEl.style.color = "#1565c0";
}

// SCROLL TO TOP LOGICA
window.addEventListener("scroll", function() {
  const backToTopBtn = document.getElementById("back-to-top-btn");
  if (backToTopBtn) {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
