// Onboarding Slides
export function renderOnboarding() {
  return `
    <div class="onboarding" id="onboarding">
      <div class="onboarding__slides" id="onboarding-slides">
        <div class="onboarding__slide onboarding__slide--active" data-slide="0">
          <div class="onboarding__emoji">🌾</div>
          <h2 class="onboarding__title">Farm-Fresh<br>Directly to You</h2>
          <p class="onboarding__desc">Get fresh produce sourced directly from local farmers. No middlemen, no markups.</p>
        </div>
        <div class="onboarding__slide onboarding__slide--next" data-slide="1">
          <div class="onboarding__emoji">🏪</div>
          <h2 class="onboarding__title">Local Hubs,<br>Fast Delivery</h2>
          <p class="onboarding__desc">Our network of community hubs ensures your food reaches you fresh and fast.</p>
        </div>
        <div class="onboarding__slide onboarding__slide--next" data-slide="2">
          <div class="onboarding__emoji">👨‍👩‍👧‍👦</div>
          <h2 class="onboarding__title">Fair Price.<br>Happy Families.</h2>
          <p class="onboarding__desc">Transparent pricing means farmers earn more, and families pay less. Everyone wins.</p>
        </div>
      </div>

      <div class="onboarding__footer">
        <div class="onboarding__dots" id="onboarding-dots">
          <div class="onboarding__dot onboarding__dot--active" data-dot="0"></div>
          <div class="onboarding__dot" data-dot="1"></div>
          <div class="onboarding__dot" data-dot="2"></div>
        </div>
        <button class="btn btn-primary btn-full btn-lg btn-ripple" id="onboarding-next">
          <span id="onboarding-next-text">Next</span>
        </button>
        <button class="btn btn-ghost btn-full" id="onboarding-skip" style="margin-top:var(--space-2);color:var(--text-muted);font-size:var(--fs-sm);">Skip</button>
      </div>
    </div>
  `;
}

export function initOnboarding(onComplete) {
  let currentSlide = 0;
  const totalSlides = 3;
  const slides = document.querySelectorAll('.onboarding__slide');
  const dots = document.querySelectorAll('.onboarding__dot');
  const nextBtn = document.getElementById('onboarding-next');
  const nextText = document.getElementById('onboarding-next-text');
  const skipBtn = document.getElementById('onboarding-skip');

  function goToSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('onboarding__slide--active', 'onboarding__slide--prev', 'onboarding__slide--next');
      if (i === index) slide.classList.add('onboarding__slide--active');
      else if (i < index) slide.classList.add('onboarding__slide--prev');
      else slide.classList.add('onboarding__slide--next');
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('onboarding__dot--active', i === index);
    });
    currentSlide = index;
    if (currentSlide === totalSlides - 1) {
      nextText.textContent = 'Get Started';
      skipBtn.style.display = 'none';
    } else {
      nextText.textContent = 'Next';
      skipBtn.style.display = '';
    }
  }

  // Swipe support
  let startX = 0;
  const slidesContainer = document.getElementById('onboarding-slides');
  slidesContainer.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
  slidesContainer.addEventListener('touchend', (e) => {
    const diffX = startX - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
      else if (diffX < 0 && currentSlide > 0) goToSlide(currentSlide - 1);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    } else {
      // Animate exit
      const onboarding = document.getElementById('onboarding');
      onboarding.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      onboarding.style.opacity = '0';
      onboarding.style.transform = 'scale(0.95)';
      setTimeout(() => onComplete(), 400);
    }
  });

  skipBtn.addEventListener('click', () => {
    const onboarding = document.getElementById('onboarding');
    onboarding.style.transition = 'opacity 0.3s ease';
    onboarding.style.opacity = '0';
    setTimeout(() => onComplete(), 300);
  });
}
