// =============================================================
// PLANTENACADEMIE - SCRIPT.JS
// =============================================================

// DATABASE
const plagenDatabase = [
  {
    id: "p1",
    naam: "Spintmijt",
    type: "Mijt",
    herkenning: "Fijne spinnenwebjes onder het blad en hele fijne gele spikkeling op de bovenzijde van het blad.",
    bestrijding: "Luchtvochtigheid verhogen, plant afspoelen onder de douche, of roofmijten inzetten.",
    foto: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p2",
    naam: "Trips",
    type: "Schadelijk insect",
    herkenning: "Zilverachtige of grijze vlekken op het blad met kleine zwarte stipjes (uitwerpselen).",
    bestrijding: "Aangedane bladeren wegsnijden, afspoelen met zeepwater of biologische aaltjes inzetten.",
    foto: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p3",
    naam: "Wolluis",
    type: "Schadelijk insect",
    herkenning: "Witte, pluizige/wollige bultjes in de bladoksels en onder de bladeren.",
    bestrijding: "Aanstippen met alcohol op een wattenstaafje of bespuiten met neemolie.",
    foto: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=600&q=80"
  }
];

// NAVIGATIE FUNCTIE (Schakelt tussen pagina's)
function toonPagina(paginaId) {
  // 1. Verberg alle pagina's
  const paginas = document.querySelectorAll('.pagina');
  paginas.forEach(p => p.style.display = 'none');

  // 2. Toon de geselecteerde pagina
  const actievePagina = document.getElementById(paginaId);
  if (actievePagina) {
    actievePagina.style.display = 'block';
  }

  // 3. Update de actieve status van de navigatieknoppen
  const knoppen = document.querySelectorAll('.nav-btn');
  knoppen.forEach(knop => knop.classList.remove('actief'));
  
  const actieveKnop = document.querySelector(`[data-target="${paginaId}"]`);
  if (actieveKnop) {
    actieveKnop.classList.add('actief');
  }
}

// Zorg dat de eerste pagina opent zodra de site laadt
document.addEventListener("DOMContentLoaded", () => {
  toonPagina('herbarium');
});
