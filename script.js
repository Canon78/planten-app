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
    symptomen: ["plakkerig", "geel"],
    onderdeel: "blad",
    herkenning: "Kleine witte motvlindertjes aan de onderzijde van het blad die massaal opvliegen bij aanraking.",
    oorzaak: "Hoge temperatuur en stilstaande, warme lucht.",
    ipmPreventie: "Gele vangplaten ophangen voor vroegtijdige signalering.",
    biologischeBestrijder: "Sluipwesp (Encarsia formosa)",
    biologischeWerking: "Legt een eitje in de pupen van de witte vlieg, waardoor deze zwart verkleurt en afsterft.",
    foto: "https://images.unsplash.com/photo-1535242208474-9a279b26287e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p6",
    naam: "Rouwvliegjes (Varenrouwmug)",
    wetenschappelijkeNaam: "Sciaridae",
    type: "Schadelijk insect",
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
    naam: "Taxuskever (Gegroefde lapsnuitkever)",
    wetenschappelijkeNaam: "Otiorhynchus sulcatus",
    type: "Schadelijk insect",
    symptomen: ["vreterij"],
    onderdeel: "blad",
    herkenning: "Ronde 'halve maantjes' uitgevreten aan de bladranden (volwassen kever). Larven vreten de wortels aan.",
    oorzaak: "Aanwezigheid van waardplanten (Taxus, Rhododendron, Heuchera).",
    bestrijding: "Avond controle en handmatig vangen van kevers.",
    ipmPreventie: "Schoon uitgangsmateriaal gebruiken.",
    biologischeBestrijder: "Aaltjes / Nematoden (Heterorhabditis bacteriophora)",
    biologischeWerking: "Aaltjes worden in het voor- en najaar via gietwater over de bodem verspreid om larven op te sporen.",
    foto: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p8",
    naam: "Dop- / Schildluis",
    wetenschappelijkeNaam: "Coccidae",
    type: "Schadelijk insect",
    symptomen: ["plakkerig", "vlekken"],
    onderdeel: "stengel",
    herkenning: "Harde bruine schildjes op takken en bladnerven met veel plakkerige honingdauw.",
    oorzaak: "Warme, beschutte omstandigheden en droge lucht.",
    ipmPreventie: "Vroegtijdig handmatig verwijderen en plantconditie op peil houden.",
    biologischeBestrijder: "Sluipwesp (Metaphycus helvolus) of Lieveheersbeestje (Chilocorus nigritus)",
    biologischeWerking: "Eten de jonge beweeglijke stadia ('crawlers') of parasiteren de schildluis onder het schild.",
    foto: "https://images.unsplash.com/photo-1615228103105-0219c6368305?auto=format&fit=crop&w=600&q=80"
  }
];

// FUNCTIE OM KAARTEN TE GENEREREN MET GEFOCUSTE BIOLOGISCHE INFO
function toonPlagen(lijst) {
  const container = document.getElementById("plagenGrid");
  if (!container) return;
  
  container.innerHTML = "";

  lijst.forEach(item => {
    const kaart = document.createElement("div");
    kaart.className = "plaag-kaart";
    kaart.innerHTML = `
      <img src="${item.foto}" alt="${item.naam}">
      <div class="plaag-inhoud">
        <span class="badge ${item.type.toLowerCase().includes('insect') ? 'badge-insect' : 'badge-overig'}">${item.type}</span>
        <h3>${item.naam}</h3>
        <p class="wetenschappelijk"><em>${item.wetenschappelijkeNaam}</em></p>
        
        <p><strong>Symptomen:</strong> ${item.herkenning}</p>
        
        <div class="ipm-box">
          <h4>🌱 Biologische Bestrijder:</h4>
          <p class="bio-naam"><strong>${item.biologischeBestrijder}</strong></p>
          <p class="bio-werking">${item.biologischeWerking}</p>
        </div>

        <div class="preventie-box">
          <h4>🛡️ IPM Preventie:</h4>
          <p>${item.ipmPreventie}</p>
        </div>
      </div>
    `;
    container.appendChild(kaart);
  });
}

// INITIALISATIE
document.addEventListener("DOMContentLoaded", () => {
  toonPlagen(plagenDatabase);
});
