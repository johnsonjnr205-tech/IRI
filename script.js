/* ── SCROLL REVEAL ── */
const obs = new IntersectionObserver(e => {
  e.forEach(x => { if(x.isIntersecting){ x.target.classList.add('in'); obs.unobserve(x.target); } });
}, {threshold: 0.09});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ── HIDE FLOATING BUTTONS WHILE HERO IS IN VIEW (prevents overlap with hero CTAs/stats) ── */
const heroEl = document.getElementById('hero');
if (heroEl) {
  const heroObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      document.body.classList.toggle('floats-hidden', entry.isIntersecting);
    });
  }, {threshold: 0.35});
  heroObs.observe(heroEl);
}

/* ── PAYMENT TABS ── */
function showPay(id, btn) {
  document.querySelectorAll('.ppanel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  document.getElementById('ptab-' + id).classList.add('active');
  btn.classList.add('active');
}

/* ── COPY TEXT ── */
function copyTxt(text, btn) {
  const orig = btn.textContent;
  navigator.clipboard.writeText(text).catch(() => {
    const t = document.createElement('textarea'); t.value = text;
    document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
  });
  btn.textContent = '✓ Copied!'; btn.classList.add('ok');
  setTimeout(() => { btn.textContent = orig; btn.classList.remove('ok'); }, 2200);
}

/* ── FAQ ACCORDION ── */
function toggleFaq(btn) {
  const ans = btn.nextElementSibling;
  const isOpen = ans.classList.contains('open');
  document.querySelectorAll('.faq-a.open').forEach(a => { a.classList.remove('open'); a.previousElementSibling.classList.remove('open'); });
  if (!isOpen) { ans.classList.add('open'); btn.classList.add('open'); }
}

/* ── WHATSAPP FORM ── */
function sendWA() {
  const n = document.getElementById('fn').value||'N/A';
  const p = document.getElementById('fp').value||'N/A';
  const e = document.getElementById('fe').value||'N/A';
  const s = document.getElementById('fs').value||'Not specified';
  const m = document.getElementById('fm').value||'N/A';
  const txt = `Hello Iconic Research Institute 👋\n\n*Name:* ${n}\n*Phone:* ${p}\n*Email:* ${e}\n*Service:* ${s}\n*Message:* ${m}`;
  window.open('https://wa.link/nk85lv?text=' + encodeURIComponent(txt), '_blank');
}

/* ── AI CHAT BOT ── */
const BOT_NAME = 'IRI Assist Bot';
let botUser = {name:'', phone:'', email:''};
let botOpen = false;
let chatStarted = false;

function toggleBot() {
  botOpen = !botOpen;
  document.getElementById('botWindow').classList.toggle('open', botOpen);
  document.getElementById('botOverlay').classList.toggle('open', botOpen);
  if (botOpen && chatStarted) scrollMsgs();
}

function startChat() {
  const n = document.getElementById('bc-name').value.trim();
  const p = document.getElementById('bc-phone').value.trim();
  const e = document.getElementById('bc-email').value.trim();
  if (!n || !p || !e) { alert('Please fill in all fields to start the chat.'); return; }
  botUser = {name: n, phone: p, email: e};
  document.getElementById('botPrechat').style.display = 'none';
  document.getElementById('botChat').style.display = 'flex';
  chatStarted = true;
  addBotMsg(`👋 Hello <strong>${n}</strong>! Welcome to <strong>Iconic Research Institute</strong>. I'm your IRI Assist Bot. How can I help you today?`);
  showChips(['Our Services', 'Thesis Help', 'Data Analysis', 'Pricing', 'How to Order', 'Contact Us', 'Payment Options', 'About IRI']);
}

function addBotMsg(html) {
  const d = document.createElement('div');
  d.className = 'bot-msg bot'; d.innerHTML = html;
  document.getElementById('botMsgs').appendChild(d);
  scrollMsgs();
}

function addUserMsg(text) {
  const d = document.createElement('div');
  d.className = 'bot-msg user'; d.textContent = text;
  document.getElementById('botMsgs').appendChild(d);
  scrollMsgs();
}

function scrollMsgs() {
  const m = document.getElementById('botMsgs');
  m.scrollTop = m.scrollHeight;
}

function showChips(arr) {
  const c = document.getElementById('botChips');
  c.innerHTML = '';
  arr.forEach(t => {
    const b = document.createElement('button');
    b.className = 'bot-chip'; b.textContent = t;
    b.onclick = () => handleChip(t);
    c.appendChild(b);
  });
}

function clearChips() { document.getElementById('botChips').innerHTML = ''; }

function handleChip(txt) {
  addUserMsg(txt);
  clearChips();
  setTimeout(() => respond(txt), 500);
}

function sendBotMsg() {
  const input = document.getElementById('botInput');
  const val = input.value.trim();
  if (!val) return;
  input.value = '';
  addUserMsg(val);
  clearChips();
  setTimeout(() => respond(val), 600);
}

async function respond(query) {
  const thinking = document.createElement('div');
  thinking.className = 'bot-msg thinking'; thinking.textContent = '● ● ●';
  document.getElementById('botMsgs').appendChild(thinking); scrollMsgs();

  const q = query.toLowerCase();
  let reply = '';
  let chips = ['Our Services', 'Pricing', 'How to Order', 'Contact Us'];

  if (q.includes('service') || q.includes('offer') || q.includes('do you')) {
    reply = 'We offer: 📚 <strong>Academic Writing</strong> (theses, dissertations, proposals), 📊 <strong>Data Analysis</strong> (SPSS, R, Python), 🏢 <strong>Professional Writing</strong> (CVs, business plans), 🎓 <strong>Training</strong>, ✏️ <strong>Editing &amp; Design</strong>, and 🌍 <strong>Policy Research</strong>.';
    chips = ['Thesis Help', 'Data Analysis', 'Business Plan', 'Editing', 'Pricing'];
  } else if (q.includes('thesis') || q.includes('dissertation') || q.includes('project')) {
    reply = 'We provide end-to-end thesis and dissertation support including: literature review, research methodology, data collection guidance, SPSS analysis, chapter writing, and final formatting in APA 7, MLA or your university style. What level is your project?';
    chips = ['Undergraduate', 'Postgraduate', 'Pricing', 'How to Order'];
  } else if (q.includes('data') || q.includes('spss') || q.includes('analysis') || q.includes('statistic')) {
    reply = 'Our Data Analysis unit handles SPSS, R, and Python analysis. We cover descriptive stats, regression, ANOVA, correlation, chi-square, and more — with full academic write-up of results. Contact us with your dataset to get a quote!';
    chips = ['Get a Quote', 'Pricing', 'How to Order', 'Contact Us'];
  } else if (q.includes('price') || q.includes('cost') || q.includes('how much') || q.includes('fee') || q.includes('pricing')) {
    reply = 'Our pricing depends on the type of service, length, complexity, and deadline. We offer <strong>competitive and flexible rates</strong>. Please contact us on WhatsApp with your specific requirements for an instant quote: <strong>+234-706-306-8958</strong>.';
    chips = ['WhatsApp Us', 'Payment Options', 'How to Order'];
  } else if (q.includes('order') || q.includes('start') || q.includes('begin') || q.includes('how do')) {
    reply = '📝 To place an order:\n1. Fill the <strong>contact form</strong> on this page\n2. Or message us on WhatsApp: <strong>+234-706-306-8958</strong>\n3. Describe your project, deadline &amp; requirements\n4. We respond with a quote within 24 hrs\n5. Make payment and project begins!';
    chips = ['Payment Options', 'Contact Us', 'WhatsApp Us'];
  } else if (q.includes('pay') || q.includes('payment') || q.includes('transfer') || q.includes('bank')) {
    reply = '💳 We accept: Bank Transfer (Access Bank – 1231253261), USSD (*901#), Cards via Paystack/Flutterwave, OPay/PalmPay/Kuda, Crypto (BTC, ETH, USDT), PayPal, Apple/Google Pay, and Afterpay/Klarna. See the <a href="#payment" style="color:var(--gold)">Payment section</a> for details.';
    chips = ['Bank Account', 'Crypto', 'How to Order'];
  } else if (q.includes('bank account') || q.includes('account number') || q.includes('access bank')) {
    reply = '🏦 <strong>Bank Transfer Details:</strong><br>Bank: Access Bank<br>Account Name: Iconic Research Institute<br>Account No: <strong>1231253261</strong><br><br>After transfer, send proof to WhatsApp: +234-706-306-8958';
    chips = ['USSD Code', 'How to Order', 'Contact Us'];
  } else if (q.includes('ussd')) {
    reply = '📟 <strong>USSD Code:</strong><br>Dial <strong>*901#</strong> → Transfer → Account: <strong>1231253261</strong><br>Bank: Access Bank | Name: Iconic Research Institute<br><br>No internet required!';
    chips = ['Bank Transfer', 'Contact Us'];
  } else if (q.includes('contact') || q.includes('reach') || q.includes('email') || q.includes('phone')) {
    reply = `📞 <strong>WhatsApp:</strong> +234-706-306-8958<br>✉️ <strong>Email:</strong> iconicprofessionalwritingsrvs@gmail.com<br>🌐 <strong>Website:</strong> www.iconicresearchinstitute.org<br>📍 <strong>Location:</strong> Port Harcourt, Rivers State, Nigeria`;
    chips = ['WhatsApp Us', 'Our Services', 'Payment Options'];
  } else if (q.includes('whatsapp') || q.includes('wa')) {
    reply = 'Click below to chat with us directly on WhatsApp! 👇<br><br><a href="https://wa.link/nk85lv" target="_blank" style="background:var(--gold);color:var(--navy);padding:.4rem 1rem;border-radius:4px;font-weight:600;font-size:.85rem">Open WhatsApp →</a>';
    chips = ['Our Services', 'Pricing'];
  } else if (q.includes('plagiarism') || q.includes('original') || q.includes('copy')) {
    reply = 'All work at IRI is <strong>100% original</strong> and written from scratch. We properly cite all sources in your preferred referencing style and run plagiarism checks before delivery. Zero recycled or resold content — ever.';
    chips = ['Referencing Styles', 'Pricing', 'How to Order'];
  } else if (q.includes('referenc') || q.includes('apa') || q.includes('mla') || q.includes('citation')) {
    reply = 'We are proficient in: <strong>APA 7th edition</strong> (most common), APA 6th, MLA, Chicago/Turabian, Harvard, and Vancouver. Just specify your required style when placing your order.';
    chips = ['How to Order', 'Thesis Help', 'Pricing'];
  } else if (q.includes('confidential') || q.includes('privacy') || q.includes('secret')) {
    reply = '🔐 <strong>100% Confidential.</strong> We never share, publish, or disclose any client information or submitted work. Your identity and project are fully protected at all times — this is a core value at IRI.';
    chips = ['Our Services', 'How to Order'];
  } else if (q.includes('about') || q.includes('iri') || q.includes('iconic') || q.includes('institute')) {
    reply = 'IRI (Iconic Research Institute) is a premium knowledge-driven research consultancy based in Port Harcourt, Nigeria. We are <strong>not just a writing service</strong> — we are a knowledge partner dedicated to academic excellence, research integrity, and impactful outcomes. Visit us at www.iconicresearchinstitute.org';
    chips = ['Our Services', 'Why Choose IRI', 'Contact Us'];
  } else if (q.includes('undergrad') || q.includes('100 level') || q.includes('200 level') || q.includes('final year')) {
    reply = 'We handle final year projects across all departments — Education, Sciences, Social Sciences, Business, Health, and more. We deliver in your university format with proper referencing, methodology, and data analysis where needed.';
    chips = ['Pricing', 'How to Order', 'Contact Us'];
  } else if (q.includes('postgrad') || q.includes('masters') || q.includes('phd') || q.includes('msc')) {
    reply = 'We support Masters and PhD research including full dissertation writing, systematic literature reviews, advanced statistical analysis (SPSS/R/Python), journal article writing, and thesis editing to publication-ready standard.';
    chips = ['Data Analysis', 'Pricing', 'Contact Us'];
  } else if (q.includes('deadline') || q.includes('urgent') || q.includes('rush') || q.includes('fast')) {
    reply = '⚡ We handle urgent orders! Rush delivery is available at a premium. For very tight deadlines, please contact us directly on WhatsApp and describe your timeline. We will confirm availability and quote immediately.';
    chips = ['WhatsApp Us', 'Pricing', 'How to Order'];
  } else if (q.includes('revision') || q.includes('correction') || q.includes('edit')) {
    reply = '✅ We offer <strong>free revisions</strong> to ensure you are fully satisfied. If the delivered work does not meet the agreed specifications, we revise it at no extra cost. Your satisfaction is our top priority.';
    chips = ['How to Order', 'Pricing', 'Contact Us'];
  } else if (q.includes('blog') || q.includes('article') || q.includes('read')) {
    reply = '📖 Visit our blog for research tips, academic writing guides, and IRI updates:<br><a href="https://iconicresearchinstitute.blogspot.com/?m=1" target="_blank" style="color:var(--gold)">iconicresearchinstitute.blogspot.com</a>';
    chips = ['Our Services', 'Contact Us'];
  } else if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('good')) {
    reply = `Hello again, <strong>${botUser.name || 'there'}</strong>! 😊 How can I help you today? Feel free to ask about our services, pricing, payment, or anything about IRI.`;
    chips = ['Our Services', 'Pricing', 'How to Order', 'Contact Us'];
  } else {
    reply = `Thanks for your message! For this specific enquiry, please reach us directly:<br><br>📞 WhatsApp: <strong>+234-706-306-8958</strong><br>✉️ Email: <strong>iconicprofessionalwritingsrvs@gmail.com</strong><br><br>We respond within 24 hours and are always happy to help!`;
    chips = ['WhatsApp Us', 'Our Services', 'Pricing'];
  }

  await new Promise(r => setTimeout(r, 900));
  thinking.remove();
  addBotMsg(reply);
  showChips(chips);
}

/* ── CONTACT FORM → Formspree ── */
// Replace YOUR_FORM_ID below with the ID Formspree gives you (see setup guide).
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

async function submitContactForm(event) {
  event.preventDefault();
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const btn = form.querySelector('.submit-btn');
  const data = new FormData(form);

  btn.disabled = true;
  btn.textContent = 'Sending…';
  status.textContent = '';

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      status.style.color = '#8fd19e';
      status.textContent = "✅ Message sent! We'll respond within 24 hours.";
      form.reset();
    } else {
      throw new Error('Submission failed');
    }
  } catch (err) {
    status.style.color = '#e08a8a';
    status.textContent = "⚠️ Couldn't send right now — please use the WhatsApp button below instead.";
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Message →';
  }
  return false;
}

/* ── HAMBURGER MENU ── */
function toggleMenu() {
  const menuOpen = document.getElementById('navDrawer').classList.toggle('open');
  document.getElementById('navOverlay').classList.toggle('open', menuOpen);
  document.getElementById('hamburgerBtn').classList.toggle('open', menuOpen);
  document.getElementById('hamburgerBtn').setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
  document.body.style.overflow = menuOpen ? 'hidden' : '';
}

function closeMenu() {
  document.getElementById('navDrawer').classList.remove('open');
  document.getElementById('navOverlay').classList.remove('open');
  document.getElementById('hamburgerBtn').classList.remove('open');
  document.getElementById('hamburgerBtn').setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeMenu(); closeComingSoon(); }
});

/* ── COMING SOON MODAL ── */
function showComingSoon(feature) {
  const text = document.getElementById('soonText');
  if (text) {
    text.textContent = (feature ? feature + ' is ' : 'This feature is ') +
      "currently under development. We're working on it and will have it live in an upcoming update — stay tuned!";
  }
  document.getElementById('soonOverlay').classList.add('open');
  document.getElementById('soonModal').classList.add('open');
}

function closeComingSoon() {
  document.getElementById('soonOverlay').classList.remove('open');
  document.getElementById('soonModal').classList.remove('open');
}
