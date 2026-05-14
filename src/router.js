// Annsetu SPA Router
export class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    window.addEventListener('hashchange', () => this.resolve());
    // Resolve immediately on construction
    this.resolve();
  }

  resolve() {
    const hash = window.location.hash.slice(1) || '/';
    const path = hash.split('?')[0];
    
    let matchedRoute = null;
    let params = {};

    for (const route of this.routes) {
      const match = this.matchRoute(route.path, path);
      if (match) {
        matchedRoute = route;
        params = match;
        break;
      }
    }

    if (!matchedRoute) {
      matchedRoute = this.routes.find(r => r.path === '/') || this.routes[0];
    }

    this.currentRoute = matchedRoute;
    const app = document.getElementById('app');
    
    app.innerHTML = matchedRoute.render(params);
    
    if (matchedRoute.afterRender) {
      matchedRoute.afterRender(params);
    }

    window.scrollTo(0, 0);
    this.initRevealAnimations();
    this.updateActiveNav();
  }

  matchRoute(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  }

  navigate(path) {
    window.location.hash = path;
  }

  initRevealAnimations() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    // Mark elements as ready for animation
    elements.forEach((el, i) => {
      el.style.transitionDelay = `${i * 60}ms`;
      el.classList.add('reveal-ready');
    });

    // Observe for scroll-triggered reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '20px' });

    elements.forEach(el => observer.observe(el));
  }

  updateActiveNav() {
    const hash = window.location.hash.slice(1) || '/';
    document.querySelectorAll('.navbar__link').forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '') || '';
      link.classList.toggle('navbar__link--active', href === hash);
    });
  }
}
