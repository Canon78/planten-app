// DATABASE: PLAGEN, ZIEKTEN & BIOLOGISCHE BESTRIJDING
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
    biologischeWerking: "Gaasvlieglarven zijn hongerige rovers die luizen leegzuigen. Sluipwespen parasiteren de luis (mummie).",
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
    naam: "Rouwvliegjes (Varenrouwmug)",
    wetenschappelijkeNaam: "Sciaridae",
    type: "Schadelijk insect",
    omgeving: "Binnen & Kas",
    symptomen: ["geel"],
    onderdeel: "wortel",
    herkenning: "Kleine zwarte vliegjes op de potgrond. Larven vreten aan jonge wortels en stekken.",
    oorzaak: "Te natte potgrond en rottend organisch materiaal.",
    ipmPreventie: "Bovenlaag van de potgrond laten opdrogen. Goede drainage borgen.",
    biologischeBestrijder: "Insectenetende aaltjes (Steinernema feltiae)",
    biologischeWerking: "Nematoden dringen de larven in de grond binnen en scheiden bacteriën uit die de larve doden.",
    foto: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80"
  }
];

// GLOBALE TOESTAND
let actiefFilter = "alles";
let zoekTerm = "";
let huidigeFlashcardIndex = 0;
let isFlashcardOmgedraaid = false;

// -------------------------------------------------------------
// 1. NAVIGATIE TUSSEN HOOFDTABBLADEN (Dokter, Flashcards, Beheer)
// -------------------------------------------------------------
function navigeerNaar(tabId) {
  // Verberg alle secties
  const alleSecties = document.querySelectorAll(".tab-sectie, section, .page-content");
  alleSecties.forEach(s => s.style.display = "none");

  // Zoek de doelsectie op ID of Class
  const doelSectie = document.getElementById(tabId) || document.querySelector(`.${tabId}`) || document.querySelector(`[data-tab-content="${tabId}"]`);
  
  if (doelSectie) {
    doelSectie.style.display = "block";
  }

  // Werk actieve knop-stijl bij
  const navKnoppen = document.querySelectorAll("nav button, .nav-btn, .tab-btn");
  navKnoppen.forEach(btn => {
    btn.classList.remove("actief", "active");
    if (btn.getAttribute("onclick")?.includes(tabId) || btn.getAttribute("data-tab") === tabId) {
      btn.classList.add("actief", "active");
    }
  });

  // Acties bij openen specifiek tabblad
  if (tabId === "flashcards" || tabId.includes("flash")) {
    startFlashcards();
  } else if (tabId === "beheer" || tabId.includes("beheer")) {
    laadBeheerTabel();
  }
}

// -------------------------------------------------------------
// 2. PLANTENDOKTER (OVERZICHT & FILTEREN)
// -------------------------------------------------------------
function toonPlagen() {
  const container = document.getElementById("plagenGrid") || document.querySelector(".grid-container") || document.getElementById("resultaten");
  if (!container) return;

  container.innerHTML = "";

  const gefilterdeLijst = plagenDatabase.filter(item => {
    const komtOvereenMetZoek = item.naam.toLowerCase().includes(zoekTerm) || 
                              item.wetenschappelijkeNaam.toLowerCase().includes(zoekTerm) ||
                              item.herkenning.toLowerCase().includes(zoekTerm);

    const komtOvereenMetFilter = (actiefFilter === "alles") || 
                                 (item.type.toLowerCase().includes(actiefFilter.toLowerCase())) ||
                                 (item.omgeving?.toLowerCase().includes(actiefFilter.toLowerCase())) ||
                                 (item.onderdeel?.toLowerCase().includes(actiefFilter.toLowerCase()));

    return komtOvereenMetZoek && komtOvereenMetFilter;
  });

  if (gefilterdeLijst.length === 0) {
    container.innerHTML = `<p style="padding:20px; text-align:center;">Geen plagen of ziekten gevonden.</p>`;
    return;
  }

  gefilterdeLijst.forEach(item => {
    const kaart = document.createElement("div");
    kaart.className = "plaag-kaart";
    kaart.style.cssText = "border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; background:#fff; margin-bottom:15px; box-shadow:0 2px 4px rgba(0,0,0,0.05);";
    
    kaart.innerHTML = `
      <img src="${item.foto}" alt="${item.naam}" style="width:100%; height:180px; object-fit:cover;">
      <div style="padding: 15px;">
        <span style="background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:12px; font-size:12px; font-weight:bold;">${item.type}</span>
        <h3 style="margin:8px 0 2px 0;">${item.naam}</h3>
        <p style="font-style:italic; color:#666; font-size:13px; margin-bottom:10px;">${item.wetenschappelijkeNaam}</p>
        
        <p style="font-size:14px; margin-bottom:12px;"><strong>Herkenning:</strong> ${item.herkenning}</p>
        
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:10px; border-radius:6px; margin-bottom:8px;">
          <h4 style="margin:0 0 4px 0; color:#166534; font-size:14px;">🌱 Biologische Bestrijder:</h4>
          <p style="margin:0; font-weight:bold; font-size:13px; color:#15803d;">${item.biologischeBestrijder}</p>
          <p style="margin:4px 0 0 0; font-size:12px; color:#374151;">${item.biologischeWerking}</p>
        </div>

        <div style="background:#fffbe0; border:1px solid #fef08a; padding:10px; border-radius:6px;">
          <h4 style="margin:0 0 4px 0; color:#854d0e; font-size:14px;">🛡️ IPM Preventie:</h4>
          <p style="margin:0; font-size:12px; color:#374151;">${item.ipmPreventie}</p>
        </div>
      </div>
    `;
    container.appendChild(kaart);
  });
}

// -------------------------------------------------------------
// 3. FLASHCARDS LOGICA
// -------------------------------------------------------------
function startFlashcards() {
  huidigeFlashcardIndex = 0;
  isFlashcardOmgedraaid = false;
  toonFlashcard();
}

function toonFlashcard() {
  const cardElement = document.getElementById("flashcard") || document.querySelector(".flashcard");
  if (!cardElement) return;

  const item = plagenDatabase[huidigeFlashcardIndex];
  if (!item) return;

  isFlashcardOmgedraaid = false;
  cardElement.innerHTML = `
    <div style="border:2px solid #22c55e; border-radius:12px; padding:20px; text-align:center; background:#fff; min-height:220px; display:flex; flex-direction:column; justify-content:center; align-items:center; cursor:pointer;" onclick="draaiFlashcardOm()">
      <img src="${item.foto}" style="max-height:120px; border-radius:8px; margin-bottom:10px;">
      <h3 style="margin:0;">Wat is deze plaag/ziekte?</h3>
      <p style="color:#666; font-size:12px; margin-top:5px;">(Klik op de kaart om het antwoord te zien)</p>
    </div>
  `;
}

function draaiFlashcardOm() {
  const cardElement = document.getElementById("flashcard") || document.querySelector(".flashcard");
  if (!cardElement) return;

  const item = plagenDatabase[huidigeFlashcardIndex];

  if (!isFlashcardOmgedraaid) {
    cardElement.innerHTML = `
      <div style="border:2px solid #0284c7; border-radius:12px; padding:20px; text-align:center; background:#f0f9ff; min-height:220px; display:flex; flex-direction:column; justify-content:center; align-items:center; cursor:pointer;" onclick="draaiFlashcardOm()">
        <h2 style="color:#0369a1; margin:0 0 5px 0;">${item.naam}</h2>
        <p style="font-style:italic; margin:0 0 10px 0;">${item.wetenschappelijkeNaam}</p>
        <p style="font-size:13px; margin-bottom:8px;"><strong>Biologische Bestrijder:</strong><br>${item.biologischeBestrijder}</p>
        <p style="font-size:12px; color:#555;">${item.biologischeWerking}</p>
      </div>
    `;
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

// -------------------------------------------------------------
// 4. BEHEER SCHERM (ITEM TOEVOEGEN/OVERZICHT)
// -------------------------------------------------------------
function laadBeheerTabel() {
  const tabelBody = document.getElementById("beheerTabelBody") || document.querySelector("#beheer table tbody");
  if (!tabelBody) return;

  tabelBody.innerHTML = "";
  plagenDatabase.forEach((item, index) => {
    const rij = document.createElement("tr");
    rij.innerHTML = `
      <td style="padding:8px; border-bottom:1px solid #ddd;">${item.naam}</td>
      <td style="padding:8px; border-bottom:1px solid #ddd;"><em>${item.wetenschappelijkeNaam}</em></td>
      <td style="padding:8px; border-bottom:1px solid #ddd;">${item.biologischeBestrijder}</td>
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

// -------------------------------------------------------------
// 5. INITIALISATIE & EVENT LISTENERS
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // 1. Eerste weergave van de plagen
  toonPlagen();

  // 2. Koppel alle navigatieknoppen (Hoofdtabs)
  const navKnoppen = document.querySelectorAll("nav button, .nav-btn, .tab-btn, [data-tab]");
  navKnoppen.forEach(knop => {
    knop.addEventListener("click", (e) => {
      const doelTab = knop.getAttribute("data-tab") || 
                      knop.getAttribute("onclick")?.match(/'([^']+)'/)?.[1] || 
                      knop.innerText.toLowerCase().trim();
      
      if (doelTab) {
        navigeerNaar(doelTab);
      }
    });
  });

  // 3. Zoekbalk koppelen
  const zoekInput = document.getElementById("zoekInput") || document.querySelector("input[type='text']");
  if (zoekInput) {
    zoekInput.addEventListener("input", (e) => {
      zoekTerm = e.target.value.toLowerCase();
      toonPlagen();
    });
  }

  // 4. Sub-filters (Plagen filteren)
  const filterKnoppen = document.querySelectorAll(".filter-btn, button[data-filter]");
  filterKnoppen.forEach(knop => {
    knop.addEventListener("click", (e) => {
      filterKnoppen.forEach(k => k.classList.remove("active", "actief"));
      knop.classList.add("active", "actief");
      actiefFilter = knop.getAttribute("data-filter") || knop.innerText.trim();
      toonPlagen();
    });
  });
});
