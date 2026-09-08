// DATABASE: GEÏNTEGREERDE GEWASBESCHERMING (IPM) & BIOLOGISCHE BESTRIJDING
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
  },
  {
    id: "p7",
    naam: "Taxuskever",
    wetenschappelijkeNaam: "Otiorhynchus sulcatus",
    type: "Schadelijk insect",
    omgeving: "Buiten",
    symptomen: ["vreterij"],
    onderdeel: "blad",
    herkenning: "Ronde 'halve maantjes' uitgevreten aan de bladranden. Larven vreten de wortelhals aan.",
    oorzaak: "Aanwezigheid van waardplanten (Taxus, Rhododendron, Heuchera).",
    ipmPreventie: "Schoon uitgangsmateriaal gebruiken.",
    biologischeBestrijder: "Aaltjes / Nematoden (Heterorhabditis bacteriophora)",
    biologischeWerking: "Aaltjes worden via gietwater over de bodem verspreid om de keverlarven op te sporen.",
    foto: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p8",
    naam: "Dop- / Schildluis",
    wetenschappelijkeNaam: "Coccidae",
    type: "Schadelijk insect",
    omgeving: "Binnen & Kas",
    symptomen: ["plakkerig", "vlekken"],
    onderdeel: "stengel",
    herkenning: "Harde bruine schildjes op takken en bladnerven met veel plakkerige honingdauw.",
    oorzaak: "Warme, beschutte omstandigheden en droge lucht.",
    ipmPreventie: "Vroegtijdig handmatig verwijderen en plantconditie op peil houden.",
    biologischeBestrijder: "Sluipwesp (Metaphycus helvolus) of Lieveheersbeestje",
    biologischeWerking: "Eten de jonge beweeglijke stadia ('crawlers') of parasiteren de schildluis.",
    foto: "https://images.unsplash.com/photo-1615228103105-0219c6368305?auto=format&fit=crop&w=600&q=80"
  }
];

// VARIABELE OM HUIDIGE FILTER-TOESTAND BIJ TE HOUDEN
let actiefFilter = "alles";
let zoekTerm = "";

// KAARTEN RENDERING
function toonPlagen() {
  const container = document.getElementById("plagenGrid") || document.querySelector(".grid-container") || document.getElementById("resultaten");
  if (!container) return;

  container.innerHTML = "";

  // Filteren van de database
  const gefilterdeLijst = plagenDatabase.filter(item => {
    const komtOvereenMetZoek = item.naam.toLowerCase().includes(zoekTerm) || 
                              item.wetenschappelijkeNaam.toLowerCase().includes(zoekTerm) ||
                              item.herkenning.toLowerCase().includes(zoekTerm);

    const komtOvereenMetFilter = (actiefFilter === "alles") || 
                                 (item.type.toLowerCase().includes(actiefFilter.toLowerCase())) ||
                                 (item.omgeving.toLowerCase().includes(actiefFilter.toLowerCase())) ||
                                 (item.onderdeel.toLowerCase().includes(actiefFilter.toLowerCase()));

    return komtOvereenMetZoek && komtOvereenMetFilter;
  });

  if (gefilterdeLijst.length === 0) {
    container.innerHTML = `<p class="geen-resultaat">Geen plagen of ziekten gevonden voor deze selectie.</p>`;
    return;
  }

  // Kaarten opbouwen
  gefilterdeLijst.forEach(item => {
    const kaart = document.createElement("div");
    kaart.className = "plaag-kaart";
    kaart.innerHTML = `
      <img src="${item.foto}" alt="${item.naam}" style="width:100%; height:180px; object-fit:cover; border-radius:8px 8px 0 0;">
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

// EVENEVENT LISTENERS INSTELLEN (TABBLADEN, FILTERS EN ZOEKBALK)
document.addEventListener("DOMContentLoaded", () => {
  // 1. Eerste keer kaarten laden
  toonPlagen();

  // 2. Zoekbalk werkend maken
  const zoekInput = document.getElementById("zoekInput") || document.querySelector("input[type='text']");
  if (zoekInput) {
    zoekInput.addEventListener("input", (e) => {
      zoekTerm = e.target.value.toLowerCase();
      toonPlagen();
    });
  }

  // 3. Tabbladen / Filterknoppen werkend maken
  const filterKnoppen = document.querySelectorAll(".tab-knop, .filter-btn, button[data-filter]");
  filterKnoppen.forEach(knop => {
    knop.addEventListener("click", (e) => {
      // Actieve stijl omzetten
      filterKnoppen.forEach(k => k.classList.remove("active", "actief"));
      e.target.classList.add("active", "actief");

      // Filterwaarde ophalen
      actiefFilter = e.target.getAttribute("data-filter") || e.target.innerText.trim();
      toonPlagen();
    });
  });
});
