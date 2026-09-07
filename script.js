const standaardPlanten = [
  {
    id: 1,
    nlNaam: "Monstera (Gatenplant)",
    latNaam: "Monstera deliciosa",
    categorie: "Kamerplant",
    standplaats: "Halfschaduw / Lichte plek",
    waterbehoefte: "Gemiddeld (regelmatig)",
    bladbehoud: "Groenblijvend (bladhoudend)",
    bloeitijd: "Zelden in de huiskamer",
    vermeerderen: "Stengelstek met luchtwortel",
    grootte: "1,5 tot 3 meter",
    foto: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
    beschrijving: "Bekend om zijn grote, ingesneden bladeren met gaten."
  },
  {
    id: 2,
    nlNaam: "Pannenkoekenplant",
    latNaam: "Pilea peperomioides",
    categorie: "Kamerplant",
    standplaats: "Halfschaduw / Lichte plek",
    waterbehoefte: "Gemiddeld (regelmatig)",
    bladbehoud: "Groenblijvend (bladhoudend)",
    bloeitijd: "Lente (kleine onopvallende bloemetjes)",
    vermeerderen: "Kleine babyplantjes (uitlopers) afsnijden",
    grootte: "30 tot 40 cm",
    foto: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=600&q=80",
    beschrijving: "Ronde, pannenkoekachtige bladeren."
  }
];

let plantenDatabase = [];
let bewerkId = null;
let actieveCategorieFilter = "ALLES";

try {
  const opgeslagen = localStorage.getItem('mijnPlantenApp_data');
  plantenDatabase = opgeslagen ? JSON.parse(opgeslagen) : standaardPlanten;
} catch (err) {
  plantenDatabase = standaardPlanten;
}

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

function switchTab(tabId, btnElement) {
  const tabs = document.querySelectorAll('.tab-content');
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
  }

  const btns = document.querySelectorAll('.tab-btn');
  for (let i = 0; i < btns.length; i++) {
    btns[i].classList.remove('active');
  }
  
  const gekozenTab = document.getElementById(tabId);
  if (gekozenTab) gekozenTab.classList.add('active');
  if (btnElement) btnElement.classList.add('active');
}

// QUIZ LOGICA
function startQuizMetInstellingen() {
  gekozenSpelvorm = document.getElementById("quiz-mode-select").value;
  ingesteldeTimerSec = parseInt(document.getElementById("timer-select").value, 10);

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
  quizVragen = [...plantenDatabase].sort(() => Math.random() - 0.5);
  
  document.getElementById("quiz-card").classList.remove("hidden");
  document.getElementById("result-card").classList.add("hidden");
  
  if (quizVragen.length > 0) {
    toonVraag();
  } else {
    alert("Er zijn geen planten beschikbaar voor de quiz!");
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

  // MODE 1: FOTO -> NAAM
  if (gekozenSpelvorm === "foto-naar-naam") {
    imgContainer.classList.remove("hidden");
    questionTitle.classList.add("hidden");
    document.getElementById("plant-img").src = vraag.foto;
    
    let hint = "";
    if (vraag.categorie) hint += "🏷️ Type: " + vraag.categorie + " | ";
    if (vraag.standplaats) hint += "☀️ Standplaats: " + vraag.standplaats;
    questionDesc.innerText = hint;

    const opties = genereerOpties(vraag);
    opties.forEach(optie => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerText = optie.nlNaam + " (" + optie.latNaam + ")";
      btn.onclick = function() { controleerAntwoord(optie, vraag, btn); };
      optiesContainer.appendChild(btn);
    });

  // MODE 2: NAAM -> FOTO
  } else if (gekozenSpelvorm === "naam-naar-foto") {
    imgContainer.classList.add("hidden");
    questionTitle.classList.remove("hidden");
    questionTitle.innerText = "Welke foto hoort bij: " + vraag.nlNaam + " (" + vraag.latNaam + ")?";
    questionDesc.innerText = "Klik op de foto die volgens jou de juiste plant is.";

    const opties = genereerOpties(vraag);
    opties.forEach(optie => {
      const btn = document.createElement("button");
      btn.className = "option-img-btn";
      btn.innerHTML = `<img src="${optie.foto}" alt="Optie">`;
      btn.onclick = function() { controleerAntwoord(optie, vraag, btn); };
      optiesContainer.appendChild(btn);
    });

  // MODE 3: EIGENSCHAP -> NAAM
  } else if (gekozenSpelvorm === "eigenschap-naar-naam") {
    imgContainer.classList.add("hidden");
    questionTitle.classList.remove("hidden");
    questionTitle.innerText = "Welke plant heeft deze kenmerken?";

    let hint = [];
    if (vraag.standplaats) hint.push("☀️ Standplaats: " + vraag.standplaats);
    if (vraag.waterbehoefte) hint.push("💧 Water: " + vraag.waterbehoefte);
    if (vraag.bladbehoud) hint.push("🍃 Blad: " + vraag.bladbehoud);
    if (vraag.beschrijving) hint.push("📝 Tip: " + vraag.beschrijving);

    questionDesc.innerHTML = hint.length > 0 ? hint.join("<br>") : "Geen specifieke kenmerken opgegeven.";

    const opties = genereerOpties(vraag);
    opties.forEach(optie => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerText = optie.nlNaam + " (" + optie.latNaam + ")";
      btn.onclick = function() { controleerAntwoord(optie, vraag, btn); };
      optiesContainer.appendChild(btn);
    });
  }

  // TIMER STARTEN (INDIEN INGESTELD)
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
      timerBar.style.backgroundColor = "#c62828"; // Rood bij laatste 5 sec
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
  const alleKnoppen = document.querySelectorAll(".option-btn, .option-img-btn");
  alleKnoppen.forEach(btn => btn.disabled = true);
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

// BIBLIOTHEEK LOGICA
function laadBibliotheek() {
  const grid = document.getElementById("plant-grid");
  if (!grid) return;
  
  plantenDatabase.sort((a, b) => a.nlNaam.localeCompare(b.nlNaam));
  grid.innerHTML = "";

  plantenDatabase.forEach(plant => {
    const card = document.createElement("div");
    card.className = "plant-card";
    
    const zoekData = [
      plant.nlNaam, plant.latNaam, plant.categorie, plant.standplaats, plant.waterbehoefte,
      plant.bladbehoud, plant.bloeitijd, plant.vermeerderen, plant.grootte, plant.beschrijving
    ].filter(Boolean).join(" ").toLowerCase();

    card.setAttribute("data-search", zoekData);
    card.setAttribute("data-nl", plant.nlNaam.toLowerCase());
    card.setAttribute("data-lat", plant.latNaam.toLowerCase());
    card.setAttribute("data-cat", plant.categorie || "");

    card.innerHTML = `
      <img src="${plant.foto || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80'}" alt="${plant.nlNaam}">
      <div class="plant-card-content">
        <h3>${plant.nlNaam}</h3>
        <p><em>${plant.latNaam}</em></p>
        
        <div class="plant-details">
          ${plant.categorie ? `<span>🏷️ <strong>Type:</strong> ${plant.categorie}</span>` : ''}
          ${plant.standplaats ? `<span>☀️ <strong>Standplaats:</strong> ${plant.standplaats}</span>` : ''}
          ${plant.waterbehoefte ? `<span>💧 <strong>Water:</strong> ${plant.waterbehoefte}</span>` : ''}
          ${plant.bladbehoud ? `<span>🍃 <strong>Blad:</strong> ${plant.bladbehoud}</span>` : ''}
          ${plant.bloeitijd ? `<span>🌸 <strong>Bloei:</strong> ${plant.bloeitijd}</span>` : ''}
          ${plant.vermeerderen ? `<span>✂️ <strong>Vermeerderen:</strong> ${plant.vermeerderen}</span>` : ''}
          ${plant.grootte ? `<span>📏 <strong>Grootte:</strong> ${plant.grootte}</span>` : ''}
          ${plant.beschrijving ? `<span>📝 <strong>Tip:</strong> ${plant.beschrijving}</span>` : ''}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  maakCategorieBalk();
  maakAlfabetBalk();
}

function maakCategorieBalk() {
  const container = document.getElementById("category-filter");
  if (!container) return;
  container.innerHTML = "";

  const cats = ["ALLES", "Boom", "Struik / Plant", "Kruid / Vaste plant", "Kamerplant"];

  cats.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "letter-btn" + (cat === actieveCategorieFilter ? " active" : "");
    btn.innerText = cat;
    btn.onclick = function() { filterOpCategorie(cat, btn); };
    container.appendChild(btn);
  });
}

function filterOpCategorie(cat, gekozenKnop) {
  actieveCategorieFilter = cat;
  if (gekozenKnop) {
    const cBtns = gekozenKnop.parentElement.querySelectorAll(".letter-btn");
    cBtns.forEach(b => b.classList.remove("active"));
    gekozenKnop.classList.add("active");
  }

  const kaarten = document.querySelectorAll(".plant-card");
  kaarten.forEach(kaart => {
    const plantCat = kaart.getAttribute("data-cat");
    if (cat === "ALLES" || plantCat === cat) {
      kaart.style.display = "block";
    } else {
      kaart.style.display = "none";
    }
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

  document.querySelectorAll(".letter-btn").forEach(b => b.classList.remove("active"));

  kaarten.forEach(kaart => {
    const searchData = kaart.getAttribute("data-search");
    if (searchData.includes(zoekopdracht)) {
      kaart.style.display = "block";
    } else {
      kaart.style.display = "none";
    }
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
      const startLetter = letter.toLowerCase();
      if (nl.startsWith(startLetter) || lat.startsWith(startLetter)) {
        kaart.style.display = "block";
      } else {
        kaart.style.display = "none";
      }
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
        const file = item.getAsFile();
        leesFotoBestand(file);
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

  let gekozenFoto = standaardFoto;
  if (geplakteOfUploadFoto !== "") {
    gekozenFoto = geplakteOfUploadFoto;
  } else if (urlFoto !== "") {
    gekozenFoto = urlFoto;
  }

  const catEl = document.getElementById("new-categorie");
  const gekozenCategorie = catEl ? catEl.value : "Kamerplant";

  if (bewerkId !== null) {
    const index = plantenDatabase.findIndex(p => p.id === bewerkId);
    if (index !== -1) {
      const oudeFoto = plantenDatabase[index].foto;
      if (!geplakteOfUploadFoto && !urlFoto) {
        gekozenFoto = oudeFoto;
      }

      plantenDatabase[index] = {
        id: bewerkId,
        nlNaam: document.getElementById("new-nl").value.trim(),
        latNaam: document.getElementById("new-lat").value.trim(),
        categorie: gekozenCategorie,
        standplaats: document.getElementById("new-standplaats").value,
        waterbehoefte: document.getElementById("new-water").value,
        bladbehoud: document.getElementById("new-blad").value,
        bloeitijd: document.getElementById("new-bloei").value.trim(),
        vermeerderen: document.getElementById("new-vermeerderen").value.trim(),
        grootte: document.getElementById("new-grootte").value.trim(),
        foto: gekozenFoto,
        beschrijving: document.getElementById("new-desc").value.trim()
      };
      alert("✅ Plant succesvol bijgewerkt!");
    }
    bewerkId = null;
  } else {
    const nieuwePlant = {
      id: Date.now(),
      nlNaam: document.getElementById("new-nl").value.trim(),
      latNaam: document.getElementById("new-lat").value.trim(),
      categorie: gekozenCategorie,
      standplaats: document.getElementById("new-standplaats").value,
      waterbehoefte: document.getElementById("new-water").value,
      bladbehoud: document.getElementById("new-blad").value,
      bloeitijd: document.getElementById("new-bloei").value.trim(),
      vermeerderen: document.getElementById("new-vermeerderen").value.trim(),
      grootte: document.getElementById("new-grootte").value.trim(),
      foto: gekozenFoto,
      beschrijving: document.getElementById("new-desc").value.trim()
    };
    plantenDatabase.push(nieuwePlant);
    alert("✅ Nieuwe plant succesvol toegevoegd!");
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
  
  const catEl = document.getElementById("new-categorie");
  if (catEl) catEl.value = plant.categorie || "Kamerplant";

  document.getElementById("new-standplaats").value = plant.standplaats || "";
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
  document.getElementById("new-foto-data").value = "";
  document.getElementById("img-preview-container").classList.add("hidden");
  bewerkId = null;

  const submitBtn = document.querySelector("#add-plant-form button[type='submit']");
  if (submitBtn) submitBtn.innerText = "➕ Plant Toevoegen";
}

function verwijderPlant(id) {
  if (confirm("Weet je zeker dat je deze plant wilt verwijderen?")) {
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
    item.innerHTML = `
      <span><strong>${plant.nlNaam}</strong> (<em>${plant.latNaam}</em>) <small style="color: #666;">[${plant.categorie || 'Kamerplant'}]</small></span>
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
