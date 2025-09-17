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

  let currentIndex = -1;

  function openIndex(i) {
    const card = cards[i];
    if (!card) return;
    const full = card.dataset.full;
    const title = card.dataset.title;
    const caption = card.dataset.caption;
    lbImage.src = full;
    lbImage.alt = title;
    lbTitle.textContent = title;
    lbCaption.textContent = caption;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    lbState.textContent = `Lightbox open on ${title}`;
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
    let newIndex = (currentIndex + delta + cards.length) % cards.length;
    openIndex(newIndex);
  }

  // Update caption numbers after shuffle
  function updateCaptions() {
    cards.forEach((card, i) => {
      const meta = card.querySelector(".meta");
      if (meta) meta.textContent = `${i + 1}/${cards.length}`;
    });
  }

  // Event listeners for gallery cards
  function initCards() {
    cards.forEach((card, i) => {
      card.addEventListener("click", () => openIndex(i));
      card.addEventListener("keypress", (e) => {
        if (e.key === "Enter") openIndex(i);
      });
    });
  }

  // Initial setup
  initCards();
  updateCaptions();

  // Lightbox buttons
  closeBtn.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", () => showNext(1));
  prevBtn.addEventListener("click", () => showNext(-1));

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowRight") showNext(1);
    else if (e.key === "ArrowLeft") showNext(-1);
  });

  // Shuffle gallery
  shuffleBtn.addEventListener("click", () => {
    cards = [...cards].sort(() => Math.random() - 0.5);
    gallery.innerHTML = "";
    cards.forEach(card => gallery.appendChild(card));
    updateCaptions();
    initCards();
  });
});
