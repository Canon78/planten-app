// =============================================================
// 1. DATABASE MET PLAGEN, ZIEKTEN EN PLANTEN
// =============================================================
const plagenDatabase = [
  {
    id: "p1",
    naam: "Spintmijt",
    wetenschappelijkeNaam: "Tetranychidae",
    type: "Mijt",
    omgeving: "Binnen & Kas",
    symptomen: ["spinnenweb", "geel"],
    onderdeel: "blad",
    herkenning: "Fijne spinnenwebjes onder het blad en een hele fijne gele spikkeling op de bovenzijde van het blad.",
    oorzaak: "Warme, droge lucht en een lage luchtvochtigheid.",
    ipmPreventie: "Luchtvochtigheid verhogen, planten niet te dicht op elkaar zetten, tocht vermijden.",
    biologischeBestrijder: "Roofmijt (Phytoseiulus persimilis of Amblyseius californicus)",
    biologischeWerking: "De roofmijten jagen actief op alle stadia van de spintmijt en zuigen deze leeg.",
    foto: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p2",
    naam: "Trips",
    wetenschappelijkeNaam: "Thripidae",
    type: "Schadelijk insect",
    omgeving: "Binnen & Kas",
    symptomen: ["vlekken", "geel"],
    onderdeel: "blad",
    herkenning: "Zilverachtige of grijze vlekken op het blad met kleine zwarte stipjes (uitwerpselen). Vervellingshuidjes zichtbaar.",
    oorzaak: "Lage luchtvochtigheid, tocht en warmte.",
    ipmPreventie: "Signaleer vroegtijdig met blauwe vangplaten. Hoge luchtvochtigheid aanhouden.",
    biologischeBestrijder: "Roofwants (Orius laevigatus) & Roofmijt (Amblyseius swirskii)",
    biologischeWerking: "Orius eet zowel volwassen tripsen als larven. Amblyseius eet de jongste larven en eitjes.",
    foto: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p3",
    naam: "Wolluis",
    wetenschappelijkeNaam: "Pseudococcidae",
    type: "Schadelijk insect",
    omgeving: "Binnen & Kas",
    symptomen: ["pluis", "plakkerig"],
    onderdeel: "stengel",
    herkenning: "Witte, pluizige/wollige bultjes in de bladoksels, stengels en onder de bladeren.",
    oorzaak: "Droge lucht en verminderde weerstand van de plant.",
    ipmPreventie: "Planten regelmatig controleren op beschutte plekken (oksels). Niet overbemesten met stikstof.",
    biologischeBestrijder: "Australisch lieveheersbeestje (Cryptolaemus montrouzieri)",
    biologischeWerking: "Zowel de kevers als de larven van Cryptolaemus eten grote aantallen wolluizen op.",
    foto: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p4",
    naam: "Bladluis",
    wetenschappelijkeNaam: "Aphidoidea",
    type: "Schadelijk insect",
    omgeving: "Buiten & Kas",
    symptomen: ["plakkerig", "geel"],
    onderdeel: "blad",
    herkenning: "Groene, zwarte of witte beestjes op jonge scheuten. Veroorzaken krullend blad en plakkerige honingdauw.",
    oorzaak: "Hoge stikstofgift (zacht weefsel) en warm voorjaarsweer.",
    ipmPreventie: "Balans in bemesting (niet te veel N), biodiversiteit rond de kas/tuin stimuleren.",
    biologischeBestrijder: "Gaasvlieglarven (Chrysoperla carnea) & Sluipwespen (Aphidius colemani)",
    biologischeWerking: "Gaasvlieglarven zijn hongerige rovers die luizen leegzuigen. Sluipwespen parasiteren de luis.",
    foto: "https://images.unsplash.com/photo-1535242208474-9a279b26287e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p5",
    naam: "Witte Vlieg",
    wetenschappelijkeNaam: "Trialeurodes vaporariorum",
    type: "Schadelijk insect",
    omgeving: "Kas",
    symptomen: ["plakkerig", "geel"],
    onderdeel: "blad",
    herkenning: "Kleine witte motvlindertjes aan de onderzijde van het blad die massaal opvliegen bij aanraking.",
    oorzaak: "Hoge temperatuur en stilstaande, warme lucht.",
    ipmPreventie: "Gele vangplaten ophangen voor vroegtijdige signalering.",
    biologischeBestrijder: "Sluipwesp (Encarsia formosa)",
    biologischeWerking: "Legt een eitje in de poppen van de witte vlieg, waardoor deze zwart verkleurt en afsterft.",
    foto: "https://images.unsplash.com/photo-1535242208474-9a279b26287e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p6",
    naam: "Rouwvliegjes",
    wetenschappelijkeNaam: "Sciaridae",
    type: "Schadelijk insect",
    omgeving: "Binnen & Kas",
    symptomen: ["geel"],
    onderdeel: "wortel",
    herkenning: "Kleine zwarte vliegjes op de potgrond. Larven vreten aan jonge wortels en stekken.",
    oorzaak: "Te natte potgrond en rottend organisch materiaal.",
    ipmPreventie: "Bovenlaag van de potgrond laten opdrogen. Goede drainage borgen.",
    biologischeBestrijder: "Insectenetende aaltjes (Steinernema feltiae)",
    biologischeWerking: "Nematoden dringen de larven in de grond binnen en doden deze.",
    foto: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80"
  }
];

// GLOBALE VARIABELEN
let huidigeFlashcardIndex = 0;
let isFlashcardOmgedraaid = false;

// =============================================================
// 2. NAVIGATIE SCHERMEN (Herbarium, Flashcards, Quiz, Dokter, Beheer)
// =============================================================
function navigeer(tabNaam) {
  const doel = tabNaam.toLowerCase().trim();

  // Alle mogelijke pagina-secties zoeken en verbergen
  const secties = document.querySelectorAll("main section, .tab-content, .page, .tab-sectie, [id$='-section'], [id$='-tab'], section");
  secties.forEach(s => s.style.display = "none");

  // Zoek de juiste sectie op basis van wat je aanklikt
  let actiefElement = null;
  secties.forEach(s => {
    const id = (s.id || "").toLowerCase();
    const cls = (s.className || "").toLowerCase();
    if (id.includes(doel) || cls.includes(doel)) {
      actiefElement = s;
    }
  });

  // Als er een match is, maak deze zichtbaar
  if (actiefElement) {
    actiefElement.style.display = "block";
  }

  // Knop-stijlen aanpassen (Witte knop voor het actieve tabblad)
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

  // Scherm-specifieke functies starten
  if (doel.includes("flashcard")) {
    startFlashcards();
  } else if (doel.includes("dokter") || doel.includes("herbarium")) {
    toonPlagen();
  } else if (doel.includes("beheer")) {
    laadBeheerTabel();
  }
}

// =============================================================
// 3. PLANTENDOKTER / HERBARIUM OVERZICHT
// =============================================================
function toonPlagen() {
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
        <p style="font-style:italic; color:#666; font-size:13px; margin-bottom:10px;">${item.wetenschappelijkeNaam || ''}</p>
        <p style="font-size:14px; margin-bottom:12px;"><strong>Herkenning:</strong> ${item.herkenning}</p>
        ${item.biologischeBestrijder ? `
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:10px; border-radius:6px;">
            <h4 style="margin:0 0 4px 0; color:#166534; font-size:13px;">🌱 Biologische Bestrijder:</h4>
            <p style="margin:0; font-weight:bold; font-size:12px; color:#15803d;">${item.biologischeBestrijder}</p>
          </div>
        ` : ''}
      </div>
    `;
    container.appendChild(kaart);
  });
}

// =============================================================
// 4. FLASHCARDS LOGICA
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
        <p style="font-style:italic; color:#555; margin-bottom:10px;">${item.wetenschappelijkeNaam || ''}</p>
        <p style="font-size:13px; text-align:left; background:#f9fafb; padding:10px; border-radius:6px;"><strong>Herkenning:</strong> ${item.herkenning}</p>
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
  toonPlagen();
}

// =============================================================
// 6. INITIALISATIE (EVENT LISTENERS)
// =============================================================
document.addEventListener("DOMContentLoaded", () => {
  // Koppel alle navigatieknoppen uit je groene balk
  const navKnoppen = document.querySelectorAll("nav button, header button, .nav-btn");
  navKnoppen.forEach(knop => {
    knop.addEventListener("click", () => {
      const knopTekst = knop.innerText.trim();
      navigeer(knopTekst);
    });
  });

  // Start standaard op het Herbarium
  toonPlagen();
});
