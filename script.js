const projects = [
  { type: 'design', kind: 'image', src: './Assets/dobby.png' },
  { type: 'design', kind: 'image', src: './Assets/sundari.jpg' },
  { type: 'design', kind: 'image', src: './Assets/Mumbai.png' },
  { type: 'design', kind: 'image', src: './Assets/salena gomez.jpg' },
  { type: 'design', kind: 'image', src: './Assets/work out.jpg' },
  { type: 'design', kind: 'image', src: './Assets/Tech3.png' },
  { type: 'design', kind: 'image', src: './Assets/Tech1.png' },
  { type: 'design', kind: 'image', src: './Assets/Gym.jpg' },
  { type: 'design', kind: 'image', src: './Assets/BURGER POST (1).png' },
  { type: 'design', kind: 'image', src: './Assets/WhatsApp Image 2025-05-22 at 00.32.49_79ddb107 (1).jpg' },
  { type: 'design', kind: 'image', src: './Assets/WhatsApp Image 2025-05-22 at 00.32.48_e0ce6e14 (1).jpg' },
  { type: 'design', kind: 'image', src: './Assets/_MAKEUP HAIRSTYLEInstagram Post.png' },
  { type: 'design', kind: 'image', src: './Assets/Bridal Makeup Instagram Post.png' },
  { type: 'motion', kind: 'video', src: './Assets/Logo motion.mp4' },
  { type: 'motion', kind: 'video', src: './Assets/Bridal Makeup Photo Collage Instagram Story.mp4' },
  { type: 'motion', kind: 'video', src: './Assets/Bridal Makeup.mp4' },
  { type: '3d', kind: 'image', src: './Assets/MANDIR 3D.jpg' },
  { type: '3d', kind: 'image', src: './Assets/INTRIOR DESGIN.jpg' },
  { type: '3d', kind: 'image', src: './Assets/final id.jpg' },
  { type: '3d', kind: 'image', src: './Assets/makeup studio (1).jpg' },
  { type: '3d', kind: 'image', src: './Assets/2 picture (1).jpg' },
  { type: '3d', kind: 'image', src: './Assets/circle house (1).jpg' }
];

const grid = document.getElementById('grid');
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const closeBtn = document.getElementById('close');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const viewMoreBtn = document.getElementById('viewMoreBtn');
const viewMoreWrap = document.getElementById('viewMoreWrap');

let current = [];
let displayedProjects = [];
let idx = 0;
let visibleCount = 6;

// LENIS
const lenis = new Lenis({
  duration: 1.2,
  smoothWheel: true,
  touchMultiplier: 1.5
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// RENDER
function render(type = 'all') {
  grid.innerHTML = '';

  current = projects.filter(project => {
    return type === 'all' || project.type === type;
  });

  if (type === 'all') {
    displayedProjects = current.slice(0, visibleCount);

    if (current.length > visibleCount) {
      viewMoreWrap.style.display = 'flex';
    } else {
      viewMoreWrap.style.display = 'none';
    }
  } else {
    displayedProjects = current;
    viewMoreWrap.style.display = 'none';
  }

  displayedProjects.forEach((project, index) => {
    const item = document.createElement('div');
    item.className = 'item reveal';

    if (project.kind === 'image') {
      item.innerHTML = `
        <img src="${project.src}" alt="Project Preview">
      `;
    } else {
      item.innerHTML = `
        <video autoplay muted loop playsinline>
          <source src="${project.src}" type="video/mp4">
        </video>
      `;
    }

    item.addEventListener('click', () => {
      openLightbox(index);
    });

    grid.appendChild(item);
    observe(item);
  });
}

// FILTERS
const filterButtons = document.querySelectorAll('.filter');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.filter.active')?.classList.remove('active');
    button.classList.add('active');

    visibleCount = 6;

    gsap.to(grid, {
      opacity: 0,
      y: 20,
      duration: 0.25,
      ease: 'power2.out',
      onComplete: () => {
        render(button.dataset.type);

        gsap.fromTo(
          grid,
          {
            opacity: 0,
            y: 20
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power3.out'
          }
        );
      }
    });
  });
});

// VIEW MORE
viewMoreBtn.addEventListener('click', () => {
  visibleCount += 6;

  gsap.to(grid, {
    opacity: 0,
    y: 20,
    duration: 0.2,
    onComplete: () => {
      render('all');

      gsap.fromTo(
        grid,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power3.out'
        }
      );
    }
  });
});

// LIGHTBOX
function openLightbox(index) {
  idx = index;
  showCurrentProject();
  lightbox.classList.add('active');
}

function showCurrentProject() {
  const project = displayedProjects[idx];

  if (!project) return;

  if (project.kind === 'image') {
    lightboxContent.innerHTML = `
      <img src="${project.src}" alt="Preview">
    `;
  } else {
    lightboxContent.innerHTML = `
      <video src="${project.src}" controls autoplay></video>
    `;
  }
}

closeBtn.addEventListener('click', () => {
  lightbox.classList.remove('active');
});

prevBtn.addEventListener('click', () => {
  idx = (idx - 1 + displayedProjects.length) % displayedProjects.length;
  showCurrentProject();
});

nextBtn.addEventListener('click', () => {
  idx = (idx + 1) % displayedProjects.length;
  showCurrentProject();
});

// KEYBOARD
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    lightbox.classList.remove('active');
  }

  if (lightbox.classList.contains('active')) {
    if (event.key === 'ArrowRight') nextBtn.click();
    if (event.key === 'ArrowLeft') prevBtn.click();
  }
});

// MOBILE MENU
menuBtn.addEventListener('click', () => {
  menu.classList.toggle('show');
});

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      lenis.scrollTo(target, {
        offset: -100,
        duration: 1.2
      });
    }

    menu.classList.remove('show');
  });
});

// REVEAL
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.to(entry.target, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        });
      }
    });
  },
  {
    threshold: 0.1
  }
);

function observe(element) {
  observer.observe(element);
}

document.querySelectorAll('.reveal').forEach(element => {
  observe(element);
});

// PROGRESS
window.addEventListener('scroll', () => {
  const doc = document.documentElement;

  const scrollPercent =
    (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;

  document.querySelector('.progress').style.width = `${scrollPercent}%`;
});

// PRELOADER
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').style.display = 'none';
  }, 900);
});

// INIT
render('all');