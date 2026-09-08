// OORSPRONKELIJKE PLAGENDATABASE (INCLUSIEF NIEUWE INSECTEN EN BIOLOGISCHE BESTRIJDING)
const plagenDatabase = [
  {
    id: "p1",
    naam: "Spintmijt",
    type: "Mijt",
    symptomen: ["spinnenweb", "geel"],
    onderdeel: "blad",
    herkenning: "Fijne spinnenwebjes onder het blad en een hele fijne gele spikkeling op de bovenzijde.",
    oorzaak: "Warme, droge lucht (bijv. 's winters bij de verwarming).",
    bestrijding: "Luchtvochtigheid verhogen, plant afspoelen. Biologisch: roofmijten (Phytoseiulus persimilis) inzetten.",
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
    bestrijding: "Aangedane bladeren wegsnijden. Biologisch: roofwantsen (Orius) of roofmijten inzetten.",
    foto: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p3",
    naam: "Wolluis",
    type: "Schadelijk insect",
    symptomen: ["pluis", "plakkerig"],
    onderdeel: "stengel",
    herkenning: "Witte, pluizige/wollige bultjes in de bladoksels en onder de bladeren.",
    oorzaak: "Tocht, droge lucht of verminderde weerstand.",
    bestrijding: "Aanstippen met alcohol. Biologisch: Australisch lieveheersbeestje (Cryptolaemus) inzetten.",
    foto: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p4",
    naam: "Bladluis",
    type: "Schadelijk insect",
    symptomen: ["plakkerig", "geel"],
    onderdeel: "blad",
    herkenning: "Kleine groene, zwarte of witte beestjes op jonge scheuten; krullende bladeren.",
    oorzaak: "Warme lente/zomertemperaturen, te veel stikstof.",
    bestrijding: "Afspoelen met water. Biologisch: lieveheersbeestjes, gaasvliegen of sluipwespen inzetten.",
    foto: "https://images.unsplash.com/photo-1535242208474-9a279b26287e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p5",
    naam: "Witte Vlieg",
    type: "Schadelijk insect",
    symptomen: ["plakkerig", "geel"],
    onderdeel: "blad",
    herkenning: "Kleine witte vliegjes onder het blad die opvliegen bij aanraking.",
    oorzaak: "Warme, stilstaande lucht in kas of binnen.",
    bestrijding: "Gele vangplaten. Biologisch: sluipwespen (Encarsia formosa) inzetten.",
    foto: "https://images.unsplash.com/photo-1535242208474-9a279b26287e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p6",
    naam: "Rouwvliegjes",
    type: "Schadelijk insect",
    symptomen: ["geel"],
    onderdeel: "wortel",
    herkenning: "Kleine zwarte vliegjes rond potgrond; larven vreten aan jonge wortels.",
    oorzaak: "Te natte potgrond.",
    bestrijding: "Grond laten opdrogen. Biologisch: insectenetende aaltjes (Steinernema feltiae) gieten.",
    foto: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80"
  }
];

// DIT ZORGT DAT AL JE OORSPRONKELIJKE SCHERMEN EN TABS WEER WERKEN
console.log("Oorspronkelijke script geladen. Database bevat:", plagenDatabase.length, "items.");
