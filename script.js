// =============================================================
// 1. OORSPRONKELIJKE DATABASE (HERBARIUM & FLASHCARDS)
// =============================================================
const plagenDatabase = [
  {
    id: "p1",
    naam: "Spintmijt",
    type: "Mijt",
    symptomen: ["spinnenweb", "geel"],
    onderdeel: "blad",
    herkenning: "Fijne spinnenwebjes onder het blad en een hele fijne gele spikkeling op de bovenzijde van het blad.",
    oorzaak: "Warme, droge lucht en een lage luchtvochtigheid.",
    bestrijding: "Luchtvochtigheid verhogen, plant afspoelen onder de douche, of roofmijten inzetten.",
    foto: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p2",
    naam: "Trips",
    type: "Schadelijk insect",
    symptomen: ["vlekken", "geel"],
    onderdeel: "blad",
    herkenning: "Zilverachtige of grijze vlekken op het blad met kleine zwarte stipjes (uitwerpselen).",
    oorzaak: "Lage luchtvochtigheid en tocht.",
    bestrijding: "Aangedane bladeren wegsnijden, afspoelen met zeepwater of biologische aaltjes inzetten.",
    foto: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p3",
    naam: "Wolluis",
    type: "Schadelijk insect",
    symptomen: ["pluis", "plakkerig"],
    onderdeel: "stengel",
    herkenning: "Witte, pluizige/wollige bultjes in de bladoksels en onder de bladeren.",
    oorzaak: "Tocht, droge lucht of verminderde weerstand van de plant.",
    bestrijding: "Aanstippen met alcohol op een wattenstaafje of bespuiten met neemolie.",
    foto: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=600&q=80"
  }
];

let huidigeFlashcardIndex = 0;
let isFlashcardOmgedraaid = false;

// =============================================================
// 2. NAVIGATIE TUSSEN TABBLADEN
// =============================================================
function navigeer(tabNaam) {
  const doel = tabNaam.toLowerCase().trim();

  // Alle secties verbergen
  const secties = document.querySelectorAll("main section, .tab-content, .page, .tab-sectie, section");
  secties.forEach(s => s.style.display = "none");

  // De gewenste sectie zoeken en tonen
  let actiefElement = null;
  secties.forEach(s => {
    const id = (s.id || "").toLowerCase();
    const cls = (s.className || "").toLowerCase();
    if (id.includes(doel) || cls.includes(doel)) {
      actiefElement = s;
    }
  });

  if (actiefElement) {
    actiefElement.style.display = "block";
  }

  // Knopkleur bijwerken (witte achtergrond voor het actieve tabblad)
  const navKnoppen = document.querySelectorAll("nav button, header button, .nav-btn");
  navKnoppen.forEach(knop => {
    const t = knop.innerText.toLowerCase().trim();
    if (t.includes(doel)) {
      knop.style.backgroundColor = "#ffffff";
      knop.style.color = "#15803d";
      knop.style.borderRadius = "20px";
      knop.style.fontWeight = "bold";
    } else {
      knop.style.backgroundColor = "transparent";
      knop.style.color = "#ffffff";
    }
  });

  // Specifieke acties bij openen tabblad
  if (doel.includes("flashcard")) {
    startFlashcards();
  } else if (doel.includes("herbarium")) {
    toonHerbarium();
  } else if (doel.includes("beheer")) {
    laadBeheerTabel();
  }
}

// =============================================================
// 3. HERBARIUM WEERGEVEN
// =============================================================
function toonHerbarium() {
  const container = document.getElementById("plagenGrid") || document.querySelector(".grid-container") || document.getElementById("resultaten");
  if (!container) return;

  container.innerHTML = "";

  plagenDatabase.forEach(item => {
    const kaart = document.createElement("div");
    kaart.className = "plaag-kaart";
    kaart.style.cssText = "border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; background:#fff; margin-bottom:15px; box-shadow:0 2px 4px rgba(0,0,0,0.05);";
    
    kaart.innerHTML = `
      <img src="${item.foto}" alt="${item.naam}" style="width:100%; height:180px; object-fit:cover;">
      <div style="padding: 15px;">
        <span style="background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:12px; font-size:12px; font-weight:bold;">${item.type}</span>
        <h3 style="margin:8px 0 2px 0;">${item.naam}</h3>
        <p style="font-size:14px; margin-bottom:8px;"><strong>Herkenning:</strong> ${item.herkenning}</p>
        <p style="font-size:13px; color:#555;"><strong>Bestrijding:</strong> ${item.bestrijding}</p>
      </div>
    `;
    container.appendChild(kaart);
  });
}

// =============================================================
// 4. FLASHCARDS
// =============================================================
function startFlashcards() {
  huidigeFlashcardIndex = 0;
  toonFlashcard();
}

function toonFlashcard() {
  const container = document.getElementById("flashcard") || document.querySelector(".flashcard") || document.querySelector(".flashcard-container");
  if (!container) return;

  const item = plagenDatabase[huidigeFlashcardIndex];
  if (!item) return;

  isFlashcardOmgedraaid = false;
  container.innerHTML = `
    <div style="max-width:450px; margin:0 auto; border:2px solid #22c55e; border-radius:12px; padding:20px; text-align:center; background:#fff; cursor:pointer;" onclick="draaiFlashcardOm()">
      <img src="${item.foto}" style="max-height:160px; width:100%; object-fit:cover; border-radius:8px; margin-bottom:10px;">
      <h3 style="margin:5px 0;">Wat is deze plaag/ziekte?</h3>
      <p style="color:#666; font-size:12px; margin:0;">(Klik om het antwoord te zien)</p>
    </div>
    <div style="max-width:450px; margin:15px auto; display:flex; justify-content:space-between; align-items:center;">
      <button onclick="vorigeFlashcard()" style="padding:8px 16px; background:#e5e7eb; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">⬅ Vorige</button>
      <span style="font-size:14px; font-weight:bold;">${huidigeFlashcardIndex + 1} / ${plagenDatabase.length}</span>
      <button onclick="volgendeFlashcard()" style="padding:8px 16px; background:#22c55e; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Volgende ➡</button>
    </div>
  `;
}

function draaiFlashcardOm() {
  const container = document.getElementById("flashcard") || document.querySelector(".flashcard") || document.querySelector(".flashcard-container");
  if (!container) return;

  const item = plagenDatabase[huidigeFlashcardIndex];

  if (!isFlashcardOmgedraaid) {
    const cardContent = container.querySelector('div');
    if (cardContent) {
      cardContent.innerHTML = `
        <span style="background:#bbf7d0; color:#166534; padding:3px 8px; border-radius:12px; font-size:12px; font-weight:bold;">${item.type}</span>
        <h2 style="color:#15803d; margin:10px 0 2px 0;">${item.naam}</h2>
        <p style="font-size:13px; text-align:left; background:#f9fafb; padding:10px; border-radius:6px; margin-top:10px;"><strong>Herkenning:</strong> ${item.herkenning}</p>
        <p style="font-size:13px; text-align:left; background:#f0fdf4; padding:10px; border-radius:6px; margin-top:5px;"><strong>Bestrijding:</strong> ${item.bestrijding}</p>
        <p style="color:#666; font-size:12px; margin-top:10px;">(Klik om terug te draaien)</p>
      `;
    }
    isFlashcardOmgedraaid = true;
  } else {
    toonFlashcard();
  }
}

function volgendeFlashcard() {
  huidigeFlashcardIndex = (huidigeFlashcardIndex + 1) % plagenDatabase.length;
  toonFlashcard();
}

function vorigeFlashcard() {
  huidigeFlashcardIndex = (huidigeFlashcardIndex - 1 + plagenDatabase.length) % plagenDatabase.length;
  toonFlashcard();
}

// =============================================================
// 5. BEHEER PAGINA
// =============================================================
function laadBeheerTabel() {
  const tabelBody = document.querySelector("#beheer table tbody") || document.getElementById("beheerTabelBody");
  if (!tabelBody) return;

  tabelBody.innerHTML = "";
  plagenDatabase.forEach((item, index) => {
    const rij = document.createElement("tr");
    rij.innerHTML = `
      <td style="padding:8px; border-bottom:1px solid #ddd;">${item.naam}</td>
      <td style="padding:8px; border-bottom:1px solid #ddd;">${item.type}</td>
      <td style="padding:8px; border-bottom:1px solid #ddd;">
        <button onclick="verwijderPlaag(${index})" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Verwijder</button>
      </td>
    `;
    tabelBody.appendChild(rij);
  });
}

function verwijderPlaag(index) {
  plagenDatabase.splice(index, 1);
  laadBeheerTabel();
  toonHerbarium();
}

// =============================================================
// 6. INITIALISATIE
// =============================================================
document.addEventListener("DOMContentLoaded", () => {
  // Koppel de navigatieknoppen
  const navKnoppen = document.querySelectorAll("nav button, header button, .nav-btn");
  navKnoppen.forEach(knop => {
    knop.addEventListener("click", () => {
      const knopTekst = knop.innerText.trim();
      navigeer(knopTekst);
    });
  });

  // Start standaard op Herbarium
  toonHerbarium();
});
