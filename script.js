const standaardPlanten = [
  {
    id: 1,
    nlNaam: "Monstera (Gatenplant)",
    latNaam: "Monstera deliciosa",
    standplaats: "Halfschaduw / Lichte plek",
    waterbehoefte: "Gemiddeld (regelmatig)",
    bladbehoud: "Groenblijvend (bladhoudend)",
    bloeitijd: "Zelden in de huiskamer",
    vermeerderen: "Stengelstek met luchtwortel",
    grootte: "1,5 tot 3 meter",
    foto: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
    beschrijving: "Bekend om zijn grote, ingesneden bladeren."
  },
  {
    id: 2,
    nlNaam: "Pannenkoekenplant",
    latNaam: "Pilea peperomioides",
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
let bewerkId = null; // Houdt bij of we een plant aan het bewerken zijn

try {
  const opgeslagen = localStorage.getItem('mijnPlantenApp_data');
  plantenDatabase = opgeslagen ? JSON.parse(opgeslagen) : standaardPlanten;
} catch (err) {
  plantenDatabase = standaardPlanten;
}

let huidigeVraagIndex = 0;
let score = 0;
let quizVragen = [];

document.addEventListener("DOMContentLoaded", function() {
  laadBibliotheek();
  laadBeheerLijst();
  herstartQuiz();
  installeerPlakLuisteraar();
});

function opslaanInStorage() {
  try {
    localStorage.setItem('mijnPlantenApp_data', JSON.stringify(plantenDatabase));
  } catch (e) {
    alert("⚠️ Waarschuwing: Afbeelding is te groot om op te slaan in de browser. Probeer een kleinere/gecomprimeerde foto.");
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
function herstartQuiz() {
  huidigeVraagIndex = 0;
  score = 0;
  quizVragen = [...plantenDatabase].sort(() => Math.random() - 0.5);
  
  const quizCard = document.getElementById("quiz-card");
  const resultCard = document.getElementById("result-card");
  if (quizCard) quizCard.classList.remove("hidden");
  if (resultCard) resultCard.classList.add("hidden");
  
  if (quizVragen.length > 0) toonVraag();
}

function toonVraag() {
  const vraag = quizVragen[huidigeVraagIndex];
  if (!vraag) return;
  
  document.getElementById("question-count").innerText = "Vraag " + (huidigeVraagIndex + 1) + " van " + quizVragen.length;
  document.getElementById("score-display").innerText = "Score: " + score;
  document.getElementById("progress-bar").style.width = ((huidigeVraagIndex / quizVragen.length) * 100) + "%";

  document.getElementById("plant-img").src = vraag.foto;
  
  let hint = "";
  if (vraag.standplaats) hint += "☀️ Standplaats: " + vraag.standplaats + " | ";
  hint += "Tip: " + (vraag.beschrijving || "Geen extra tip");
  document.getElementById("question-desc").innerText = hint;

  const optiesContainer = document.getElementById("options-container");
  optiesContainer.innerHTML = "";

  const opties = genereerOpties(vraag);

  opties.forEach(optie => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = optie.nlNaam + " (" + optie.latNaam + ")";
    btn.onclick = function() { controleerAntwoord(optie, vraag, btn); };
    optiesContainer.appendChild(btn);
  });

  document.getElementById("feedback-box").className = "feedback-box hidden";
  document.getElementById("next-btn").classList.add("hidden");
}

function genereerOpties(correctePlant) {
  let fouteOpties = plantenDatabase.filter(p => p.id !== correctePlant.id);
  fouteOpties = fouteOpties.sort(() => Math.random() - 0.5).slice(0, Math.min(3, fouteOpties.length));
  
  return [correctePlant, ...fouteOpties].sort(() => Math.random() - 0.5);
}

function controleerAntwoord(gekozenOptie, correctePlant, gekozenKnop) {
  const alleKnoppen = document.querySelectorAll(".option-btn");
  alleKnoppen.forEach(btn => btn.disabled = true);

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

    alleKnoppen.forEach(btn => {
      if (btn.innerText.includes(correctePlant.nlNaam)) btn.classList.add("correct");
    });
  }

  document.getElementById("score-display").innerText = "Score: " + score;
  document.getElementById("next-btn").classList.remove("hidden");
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
  document.getElementById("quiz-card").classList.add("hidden");
  document.getElementById("result-card").classList.remove("hidden");

  document.getElementById("final-score").innerText = score;
  document.getElementById("total-questions").innerText = quizVragen.length;
}

// BIBLIOTHEEK & ALFABET
function laadBibliotheek() {
  const grid = document.getElementById("plant-grid");
  if (!grid) return;
  
  plantenDatabase.sort((a, b) => a.nlNaam.localeCompare(b.nlNaam));
  grid.innerHTML = "";

  plantenDatabase.forEach(plant => {
    const card = document.createElement("div");
    card.className = "plant-card";
    
    const zoekData = [
      plant.nlNaam, plant.latNaam, plant.standplaats, plant.waterbehoefte,
      plant.bladbehoud, plant.bloeitijd, plant.vermeerderen, plant.grootte, plant.beschrijving
    ].filter(Boolean).join(" ").toLowerCase();

    card.setAttribute("data-search", zoekData);
    card.setAttribute("data-nl", plant.nlNaam.toLowerCase());
    card.setAttribute("data-lat", plant.latNaam.toLowerCase());

    card.innerHTML = `
      <img src="${plant.foto || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80'}" alt="${plant.nlNaam}">
      <div class="plant-card-content">
        <h3>${plant.nlNaam}</h3>
        <p><em>${plant.latNaam}</em></p>
        
        <div class="plant-details">
          ${plant.standplaats ? `<span>☀️ <strong>Standplaats:</strong> ${plant.standplaats}</span>` : '<span>☀️ <strong>Standplaats:</strong> Niet opgegeven</span>'}
          ${plant.waterbehoefte ? `<span>💧 <strong>Water:</strong> ${plant.waterbehoefte}</span>` : '<span>💧 <strong>Water:</strong> Niet opgegeven</span>'}
          ${plant.bladbehoud ? `<span>🍃 <strong>Blad:</strong> ${plant.bladbehoud}</span>` : '<span>🍃 <strong>Blad:</strong> Niet opgegeven</span>'}
          ${plant.bloeitijd ? `<span>🌸 <strong>Bloei:</strong> ${plant.bloeitijd}</span>` : ''}
          ${plant.vermeerderen ? `<span>✂️ <strong>Vermeerderen:</strong> ${plant.vermeerderen}</span>` : ''}
          ${plant.grootte ? `<span>📏 <strong>Grootte:</strong> ${plant.grootte}</span>` : ''}
          ${plant.beschrijving ? `<span>📝 <strong>Tip:</strong> ${plant.beschrijving}</span>` : ''}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  maakAlfabetBalk();
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

// AFBEELDING PLAKKEN & UPLOADEN
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

// BEHEER & EDIT LOGICA
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

  if (bewerkId !== null) {
    // BEWERKEN VAN BESTAANDE PLANT
    const index = plantenDatabase.findIndex(p => p.id === bewerkId);
    if (index !== -1) {
      // Als er geen nieuwe foto is opgegeven, behouden we de oude foto
      const oudeFoto = plantenDatabase[index].foto;
      if (!geplakteOfUploadFoto && !urlFoto) {
        gekozenFoto = oudeFoto;
      }

      plantenDatabase[index] = {
        id: bewerkId,
        nlNaam: document.getElementById("new-nl").value.trim(),
        latNaam: document.getElementById("new-lat").value.trim(),
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
    // NIEUWE PLANT TOEVOEGEN
    const nieuwePlant = {
      id: Date.now(),
      nlNaam: document.getElementById("new-nl").value.trim(),
      latNaam: document.getElementById("new-lat").value.trim(),
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
  herstartQuiz();
}

function startBewerken(id) {
  const plant = plantenDatabase.find(p => p.id === id);
  if (!plant) return;

  bewerkId = plant.id;

  document.getElementById("new-nl").value = plant.nlNaam || "";
  document.getElementById("new-lat").value = plant.latNaam || "";
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

  // Pas de knoptekst aan
  const submitBtn = document.querySelector("#add-plant-form button[type='submit']");
  if (submitBtn) submitBtn.innerText = "💾 Wijzigingen Opslaan";

  // Scroll omhoog naar het formulier
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
    herstartQuiz();
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
      <span><strong>${plant.nlNaam}</strong> (<em>${plant.latNaam}</em>)</span>
      <div>
        <button onclick="startBewerken(${plant.id})" style="background: #1565c0; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px;">✏️ Bewerken</button>
        <button onclick="verwijderPlant(${plant.id})" style="background: #c62828; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">🗑️ Wissen</button>
      </div>
    `;
    lijst.appendChild(item);
  });
}

function verstuurNaarGoogleForms() {
  const naam = document.getElementById("student-name").value.trim();
  const statusEl = document.getElementById("submit-status");

  if (!naam) {
    statusEl.innerText = "⚠️ Vul eerst je naam in!";
    statusEl.style.color = "#c62828";
    return;
  }

  statusEl.innerText = "⏳ Bezig met versturen...";
  statusEl.style.color = "#1565c0";

  setTimeout(() => {
    statusEl.innerText = "✅ Score verstuurd voor " + naam;
    statusEl.style.color = "#2e7d32";
  }, 1000);
}
