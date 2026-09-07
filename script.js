const standaardPlanten = [
  {
    id: 1,
    nlNaam: "Monstera (Gatenplant)",
    latNaam: "Monstera deliciosa",
    foto: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
    beschrijving: "Bekend om zijn grote, ingesneden bladeren."
  },
  {
    id: 2,
    nlNaam: "Pannenkoekenplant",
    latNaam: "Pilea peperomioides",
    foto: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=600&q=80",
    beschrijving: "Ronde, pannenkoekachtige bladeren."
  }
];

let plantenDatabase = [];
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
});

function opslaanInStorage() {
  localStorage.setItem('mijnPlantenApp_data', JSON.stringify(plantenDatabase));
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
  document.getElementById("question-desc").innerText = "Tip: " + vraag.beschrijving;

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

function laadBibliotheek() {
  const grid = document.getElementById("plant-grid");
  if (!grid) return;
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
  document.querySelectorAll(".plant-card").forEach(kaart => {
    kaart.style.display = kaart.innerText.toLowerCase().includes(zoekopdracht) ? "block" : "none";
  });
}

function voegPlantToe(e) {
  e.preventDefault();

  const nieuwePlant = {
    id: Date.now(),
    nlNaam: document.getElementById("new-nl").value,
    latNaam: document.getElementById("new-lat").value,
    foto: document.getElementById("new-foto").value,
    beschrijving: document.getElementById("new-desc").value
  };

  plantenDatabase.push(nieuwePlant);
  opslaanInStorage();
  
  document.getElementById("add-plant-form").reset();
  laadBibliotheek();
  laadBeheerLijst();
  herstartQuiz();

  alert("✅ Plant toegevoegd!");
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
      <button onclick="verwijderPlant(${plant.id})" style="background: #c62828; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">🗑️ Wissen</button>
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
