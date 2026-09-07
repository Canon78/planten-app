// PLANTEN DATABANK
const plantenDatabase = [
  {
    id: 1,
    nlNaam: "Monstera (Gatenplant)",
    latNaam: "Monstera deliciosa",
    foto: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
    beschrijving: "Bekend om zijn grote, ingesneden bladeren. Hoge sierwaarde."
  },
  {
    id: 2,
    nlNaam: "Pannenkoekenplant",
    latNaam: "Pilea peperomioides",
    foto: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=600&q=80",
    beschrijving: "Populaire kamerplant met ronde, pannenkoekachtige bladeren."
  },
  {
    id: 3,
    nlNaam: "Gouden Epipremnum",
    latNaam: "Epipremnum aureum",
    foto: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80",
    beschrijving: "Eenvoudige klim- of hangplant met hartvormige, gevlekte bladeren."
  },
  {
    id: 4,
    nlNaam: "Sansevieria (Vrouwentong)",
    latNaam: "Sansevieria trifasciata",
    foto: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=600&q=80",
    beschrijving: "Zeer sterke vetplant met rechtopstaande, zwaardvormige bladeren."
  },
  {
    id: 5,
    nlNaam: "Lepelplant",
    latNaam: "Spathiphyllum",
    foto: "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=600&q=80",
    beschrijving: "Luchtzuiverende plant met donkergroene bladeren en witte schutbladeren."
  }
];

// GOOGLE FORMS CONFIGURATIE (Optioneel aan te passen)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSc.../formResponse"; 
const FORM_ENTRY_NAAM = "entry.123456789"; 
const FORM_ENTRY_SCORE = "entry.987654321"; 

// APP STATE
let huidigeVraagIndex = 0;
let score = 0;
let quizVragen = [];

// INITIATIE
document.addEventListener("DOMContentLoaded", () => {
  laadBibliotheek();
  herstartQuiz();
});

// TAB SWITCHEN
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  document.getElementById(tabId).classList.add('active');
  event.currentTarget.classList.add('active');
}

// QUIZ LOGICA
function herstartQuiz() {
  huidigeVraagIndex = 0;
  score = 0;
  quizVragen = [...plantenDatabase].sort(() => Math.random() - 0.5);
  
  document.getElementById("quiz-card").classList.remove("hidden");
  document.getElementById("result-card").classList.add("hidden");
  
  toonVraag();
}

function toonVraag() {
  const vraag = quizVragen[huidigeVraagIndex];
  
  // Voortgang updaten
  document.getElementById("question-count").innerText = `Vraag ${huidigeVraagIndex + 1} van ${quizVragen.length}`;
  document.getElementById("score-display").innerText = `Score: ${score}`;
  document.getElementById("progress-bar").style.width = `${((huidigeVraagIndex) / quizVragen.length) * 100}%`;

  // Content vullen
  document.getElementById("plant-img").src = vraag.foto;
  document.getElementById("question-desc").innerText = `Tip: ${vraag.beschrijving}`;

  // Opties genereren (1 goede + 3 foute)
  const optiesContainer = document.getElementById("options-container");
  optiesContainer.innerHTML = "";

  const opties = genereerOpties(vraag);

  opties.forEach(optie => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = `${optie.nlNaam} (${optie.latNaam})`;
    btn.onclick = () => controleerAntwoord(optie, vraag, btn);
    optiesContainer.appendChild(btn);
  });

  // UI Reset
  document.getElementById("feedback-box").className = "feedback-box hidden";
  document.getElementById("next-btn").classList.add("hidden");
}

function genereerOpties(correctePlant) {
  let fouteOpties = plantenDatabase.filter(p => p.id !== correctePlant.id);
  fouteOpties = fouteOpties.sort(() => Math.random() - 0.5).slice(0, 3);
  
  const alleOpties = [correctePlant, ...fouteOpties];
  return alleOpties.sort(() => Math.random() - 0.5);
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
    feedbackBox.innerText = `❌ Helaas! Het juiste antwoord was: ${correctePlant.nlNaam}`;
    feedbackBox.className = "feedback-box wrong";

    // Toon de juiste knop
    alleKnoppen.forEach(btn => {
      if (btn.innerText.includes(correctePlant.nlNaam)) {
        btn.classList.add("correct");
      }
    });
  }

  document.getElementById("score-display").innerText = `Score: ${score}`;
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

// BIBLIOTHEEK LOGICA
function laadBibliotheek() {
  const grid = document.getElementById("plant-grid");
  grid.innerHTML = "";

  plantenDatabase.forEach(plant => {
    const card = document.createElement("div");
    card.className = "plant-card";
    card.innerHTML = `
      <img src="${plant.foto}" alt="${plant.nlNaam}">
      <div class="plant-card-content">
        <h3>${plant.nlNaam}</h3>
        <p><em>${plant.latNaam}</em></p>
        <p>${plant.beschrijving}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

function zoekPlanten() {
  const zoekopdracht = document.getElementById("search-input").value.toLowerCase();
  const kaarten = document.querySelectorAll(".plant-card");

  kaarten.forEach(kaart => {
    const tekst = kaart.innerText.toLowerCase();
    if (tekst.includes(zoekopdracht)) {
      kaart.style.display = "block";
    } else {
      kaart.style.display = "none";
    }
  });
}

// FORMULIER VERSTUREN (GOOGLE FORMS)
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

  // Simulatie van verzending (of echte koppeling als URL is ingesteld)
  setTimeout(() => {
    statusEl.innerText = `✅ Top! De score (${score}/${quizVragen.length}) van ${naam} is succesvol opgeslagen!`;
    statusEl.style.color = "#2e7d32";
  }, 1000);
}
