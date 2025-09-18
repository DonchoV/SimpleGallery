document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  let cards = Array.from(gallery.querySelectorAll(".card"));
  const lightbox = document.getElementById("lightbox");
  const lbImage = document.getElementById("lbImage");
  const lbTitle = document.getElementById("lbTitle");
  const lbCaption = document.getElementById("lbCaption");
  const closeBtn = document.getElementById("closeBtn");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const lbState = document.getElementById("lb-state");
  const filterBtns = Array.from(document.querySelectorAll(".filter-btn"));

  let currentIndex = -1;
  let visibleCards = [...cards];

  function openIndex(i) {
    const card = visibleCards[i];
    if (!card) return;
    lbImage.src = card.dataset.full;
    lbImage.alt = card.dataset.title;
    lbTitle.textContent = card.dataset.title;
    lbCaption.textContent = card.dataset.caption;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    lbState.textContent = `Lightbox open on ${card.dataset.title}`;
    currentIndex = i;
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lbState.textContent = "Lightbox closed";
    currentIndex = -1;
  }

  function showNext(delta) {
    if (currentIndex === -1) return;
    let newIndex = (currentIndex + delta + visibleCards.length) % visibleCards.length;
    openIndex(newIndex);
  }

  function updateCaptions() {
    visibleCards.forEach((card, i) => {
      const meta = card.querySelector(".meta");
      if (meta) meta.textContent = `${i + 1}/${visibleCards.length}`;
    });
  }

  function initCards() {
    visibleCards.forEach((card, i) => {
      card.onclick = () => openIndex(i);
      card.onkeypress = e => { if(e.key==="Enter") openIndex(i); };
    });
  }

  function filterGallery(category) {
    visibleCards = [];
    cards.forEach(card => {
      if(category==="all" || card.dataset.category===category){
        card.classList.remove("hidden");
        visibleCards.push(card);
      } else {
        card.classList.add("hidden");
      }
    });
    updateCaptions();
    initCards();
  }

  // Initial setup
  filterGallery("all");

  // Buttons
  closeBtn.onclick = closeLightbox;
  nextBtn.onclick = () => showNext(1);
  prevBtn.onclick = () => showNext(-1);

  document.addEventListener("keydown", e => {
    if(!lightbox.classList.contains("open")) return;
    if(e.key==="Escape") closeLightbox();
    else if(e.key==="ArrowRight") showNext(1);
    else if(e.key==="ArrowLeft") showNext(-1);
  });

  shuffleBtn.onclick = () => {
    cards = [...cards].sort(()=>Math.random()-0.5);
    gallery.innerHTML="";
    cards.forEach(c=>gallery.appendChild(c));
    const activeFilter = document.querySelector(".filter-btn.active")?.dataset.category || "all";
    filterGallery(activeFilter);
  }

  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      filterGallery(btn.dataset.category);
    }
  });

  document.querySelector('.filter-btn[data-category="all"]').classList.add('active');
});
