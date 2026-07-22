/* ============================================================
   AURA · Portfolio interactions
   ============================================================ */
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 0. Live date/time (thời gian thực) ---------- */
  const liveDate = document.getElementById('liveDate');
  if (liveDate) {
    const thu = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const p2 = (n) => String(n).padStart(2, '0');
    const tick = () => {
      const d = new Date();
      liveDate.textContent = `${thu[d.getDay()]}, ${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()} · ${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`;
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- 1. Scroll-reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach((el) => io.observe(el));

  /* ---------- 2. Scroll progress + nav state ---------- */
  const bar = document.getElementById('progressBar');
  const nav = document.getElementById('nav');
  const onScroll = () => {
    const h = document.documentElement;
    const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
    bar.style.width = (p * 100) + '%';
    nav.classList.toggle('scrolled', h.scrollTop > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Active nav link on scroll (scroll-spy) ---------- */
  const sections = ['skills', 'work', 'contact'].map((id) => document.getElementById(id));
  const navLinks = document.querySelectorAll('[data-nav]');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach((s) => s && spy.observe(s));

  /* ---------- 4. Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const cIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      let cur = 0;
      const step = Math.max(1, Math.round(target / 45));
      const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = target + '+'; }
        else { el.textContent = cur; requestAnimationFrame(tick); }
      };
      tick();
      cIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => cIO.observe(c));

  /* ---------- 5. Skill bars fill ---------- */
  const bars = document.querySelectorAll('.bar');
  const bIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const fill = e.target.querySelector('i');
      fill.style.width = e.target.dataset.skill + '%';
      bIO.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  bars.forEach((b) => bIO.observe(b));

  /* ---------- 6. Role text rotator ---------- */
  const rotator = document.getElementById('rotator');
  if (rotator && !reduce) {
    const words = ['Graphic Designer', 'Video Editor', 'Motion Artist', 'Creative Director'];
    let wi = 0, ci = 0, deleting = false;
    const type = () => {
      const w = words[wi];
      rotator.textContent = deleting ? w.slice(0, ci--) : w.slice(0, ci++);
      let delay = deleting ? 45 : 90;
      if (!deleting && ci === w.length + 1) { deleting = true; delay = 1600; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 350; }
      setTimeout(type, delay);
    };
    setTimeout(type, 900);
  }

  /* ---------- 7. Custom cursor ---------- */
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  if (cursor && window.matchMedia('(hover:hover)').matches) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`;
    });
    const render = () => {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(render);
    };
    render();
    document.querySelectorAll('a,button,[data-magnetic],[data-tilt]').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });
  }

  /* ---------- 8. Magnetic buttons ---------- */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px,${y * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- 9. 3D tilt (avatar + project cards) ---------- */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * 12}deg) rotateX(${-py * 12}deg)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = 'perspective(900px) rotateY(0) rotateX(0)'; });
    });
  }

  /* ---------- 10. Parallax on hero avatar ---------- */
  if (!reduce) {
    const avatar = document.querySelector('.avatar');
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (avatar && y < window.innerHeight) avatar.style.translate = `0 ${y * 0.12}px`;
    }, { passive: true });
  }

  /* ---------- 11b. Copy brand color on click ---------- */
  document.querySelectorAll('[data-copy]').forEach((el) => {
    el.addEventListener('click', async () => {
      const val = el.dataset.copy;
      try { await navigator.clipboard.writeText(val); } catch (_) {}
      const old = el.querySelector('i') ? el.childNodes[el.childNodes.length - 1].textContent : '';
      el.classList.add('copied');
      const label = el.childNodes[el.childNodes.length - 1];
      const prev = label.textContent;
      label.textContent = ' Đã copy!';
      setTimeout(() => { label.textContent = prev; el.classList.remove('copied'); }, 1200);
    });
  });

  /* ---------- 11c. Lightbox (click ảnh để phóng to) ---------- */
  const lb = document.getElementById('lightbox');
  if (lb) {
    const lbImg = document.getElementById('lightboxImg');
    const lbCap = document.getElementById('lightboxCap');
    const shots = Array.from(document.querySelectorAll('.company__gallery .shot img'));
    let idx = 0;

    const show = (i) => {
      idx = (i + shots.length) % shots.length;
      const img = shots[idx];
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      const cap = img.closest('.shot').querySelector('figcaption');
      lbCap.innerHTML = cap ? cap.innerHTML : '';
    };
    const open = (i) => { show(i); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
    const close = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };

    shots.forEach((img, i) => {
      img.addEventListener('click', (e) => { e.stopPropagation(); open(i); });
    });
    document.getElementById('lightboxClose').addEventListener('click', close);
    document.getElementById('lightboxPrev').addEventListener('click', (e) => { e.stopPropagation(); show(idx - 1); });
    document.getElementById('lightboxNext').addEventListener('click', (e) => { e.stopPropagation(); show(idx + 1); });
    lbImg.addEventListener('click', (e) => { e.stopPropagation(); close(); });
    lb.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------- 11. Mobile burger menu ---------- */
  const burger = document.getElementById('burger');
  const links = document.querySelector('.nav__links');
  if (burger) {
    burger.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => links.classList.remove('open')));
  }
})();
