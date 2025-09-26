// Put your real Google Form URL here:
const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScUrj36R-uXIE1YGdUobYLI1Bu9By7amBocNwTEeXdhGKxW0g/viewform?usp=dialog";

const RECOMMENDATION_HTML = `
  <p><b>Here are some Book recommendations to know and learn about Spirituality.</b></p>
  <ul>
    <li>Bhagavad-gītā As It Is</li>
    <li>Kṛṣṇa Book</li>
    <li>The Science of Self Realization</li>
    <li>Srimad Bhagwatam</li>
    <li>Join the “Journey of Self Discovery” course</li>
  </ul>

  <div class="actions" style="margin-top:8px">
    <button class="primary" onclick="window.open('${FORM_URL}', '_blank')">
      Join the Course →
    </button>
  </div>

  <p class="mini">Also, visit the temple and associate with spiritual practitioners to learn more.</p>
`;

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function stripLetterPrefix(s) {
  return s.replace(/^[a-d]\)\s*/i, "");
}
function shuffledOpts(opts) {
  const cleaned = opts.map(([label, val]) => [stripLetterPrefix(label), val]);
  return shuffleInPlace(cleaned);
}

// --- Questions (values: a=0, b=1, c=2, d=3) ---
const baseQuestions = [
  {
    id: 1,
    type: "mc",
    q: "What do you think is the main purpose of life?",
    opts: [
      ["a) Enjoy as much as possible", 0],
      ["b) Earn money and comfort", 1],
      ["c) Live peacefully with others", 2],
      ["d) Realize my true self (soul)", 3],
    ],
  },
  {
    id: 2,
    type: "mc",
    q: "When facing a big problem, what is most helpful?",
    opts: [
      ["a) Running away", 0],
      ["b) Fighting with anger", 1],
      ["c) Seeking wisdom/calmness", 2],
      ["d) Asking divine guidance", 3],
    ],
  },
  {
    id: 3,
    type: "mc",
    q: "In the Bhagavad Gita, Arjuna was confused. What do you do when confused?",
    opts: [
      ["a) Ignore and hope it passes", 0],
      ["b) Ask friends/family only", 1],
      ["c) Read/reflect quietly", 2],
      ["d) Seek higher knowledge/spiritual answers", 3],
    ],
  },
  {
    id: 4,
    type: "mc",
    q: "What does yoga mean to you?",
    opts: [
      ["a) Physical exercise/stretching", 0],
      ["b) Discipline of body and mind", 1],
      ["c) Connection with inner self", 2],
      ["d) Union with God", 3],
    ],
  },
  {
    id: 5,
    type: "mc",
    q: "Which quality do you value most?",
    opts: [
      ["a) Power", 0],
      ["b) Wealth", 1],
      ["c) Compassion", 2],
      ["d) Truth", 3],
    ],
  },
  {
    id: 6,
    type: "mc",
    q: "How do you feel when you see nature (sunrise, river, trees)?",
    opts: [
      ["a) Just ordinary", 0],
      ["b) Nice view", 1],
      ["c) Feels peaceful", 2],
      ["d) Feels divine connection", 3],
    ],
  },
  {
    id: 7,
    type: "mc",
    q: "Why do you think people read spiritual books?",
    opts: [
      ["a) Just tradition", 0],
      ["b) Time pass", 1],
      ["c) To find peace", 2],
      ["d) To know truth of life", 3],
    ],
  },
  {
    id: 8,
    type: "mc",
    q: "If you could ask God one thing, what would it be?",
    opts: [
      ["a) Money & success", 0],
      ["b) Health & long life", 1],
      ["c) Peace & love", 2],
      ["d) Knowledge & liberation", 3],
    ],
  },
];

// --- State & elements ---
const state = { name: "", step: 0, answers: {}, qs: [] };
const $ = (id) => document.getElementById(id);
const screens = {
  start: $("screen-start"),
  q: $("screen-q"),
  result: $("screen-result"),
};
const bar = $("bar");
const stepNow = $("stepNow");
const stepTotal = $("stepTotal");

// --- Flow ---
function prepareQuestions() {
  // deep copy so we can reshuffle on restart without mutating base
  state.qs = JSON.parse(JSON.stringify(baseQuestions));
  shuffleInPlace(state.qs);
  state.qs.forEach((q) => {
    if (q.type === "mc") q._opts = shuffledOpts(q.opts);
  });
  stepTotal.textContent = state.qs.length + 1; // +1 for start screen in pill
}

function showStart() {
  screens.start.classList.remove("hidden");
  screens.q.classList.add("hidden");
  screens.result.classList.add("hidden");
  state.step = 0;
  updateProgress();
}

function startQuiz() {
  state.name = $("name").value.trim();
  state.answers = {};
  prepareQuestions();
  state.step = 1;
  renderQuestion();
}

function renderQuestion() {
  screens.start.classList.add("hidden");
  screens.result.classList.add("hidden");
  screens.q.classList.remove("hidden");
  updateProgress();

  const qIndex = state.step - 1; // 0-based
  const q = state.qs[qIndex];
  const wrap = $("qWrap");
  wrap.innerHTML = "";

  const h = document.createElement("div");
  h.className = "q";
  h.textContent = q.q;
  wrap.appendChild(h);

  if (q.type === "mc") {
    const opts = q._opts || q.opts;
    opts.forEach(([label, val], i) => {
      const id = `q${q.id}_opt${i}`;
      const letter = String.fromCharCode(97 + i); // a,b,c,d
      const lab = document.createElement("label");
      lab.className = "opt";
      lab.setAttribute("for", id);
      lab.innerHTML = `
        <input type="radio" name="q${q.id}" id="${id}" value="${val}" />
        <span>${letter}) ${label}</span>
      `;
      if (state.answers[q.id] !== undefined && Number(state.answers[q.id]) === val) {
        setTimeout(() => { lab.querySelector("input").checked = true; }, 0);
      }
      wrap.appendChild(lab);
    });
  }

  $("prevBtn").disabled = state.step === 1;
  $("nextBtn").textContent = state.step === state.qs.length ? "Finish →" : "Next →";
}

function updateProgress() {
  const totalSteps = state.qs.length + 1;
  stepNow.textContent = Math.min(state.step + 1, totalSteps);
  const pct = Math.round((state.step / state.qs.length) * 100);
  bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
}

function next() {
  const qIndex = state.step - 1;
  const q = state.qs[qIndex];

  if (q) {
    if (q.type === "mc") {
      const checked = document.querySelector(`input[name="q${q.id}"]:checked`);
      if (!checked) { alert("Please select an option to continue."); return; }
      state.answers[q.id] = Number(checked.value);
    }
  }

  if (state.step < state.qs.length) {
    state.step++;
    renderQuestion();
  } else {
    computeAndShowResult();
  }
}

function prev() {
  if (state.step > 1) {
    state.step--;
    renderQuestion();
  }
}

function computeAndShowResult() {
  // sum MC answers; each question max = 3
  const mcIds = state.qs.filter(q => q.type === "mc").map(q => q.id);
  const total = mcIds.reduce((sum, id) => sum + Number(state.answers[id] || 0), 0);
  const maxPoints = mcIds.length * 3;
  const out100 = Math.round((total / maxPoints) * 100);

  // tiers by /100
  let tier = "Material", tagClass = "material";
  if (out100 >= 80) { tier = "Spiritual Awareness"; tagClass = "spiritual"; }
  else if (out100 >= 50) { tier = "Peace-seeking"; tagClass = "peace"; }
  else if (out100 >= 25) { tier = "Practical"; tagClass = "practical"; }

  // Add a non-judgmental disclaimer under the heading every time
const disclaimerText = "🌿 This is a non-judgmental self-check quiz meant for reflection, introspection & enhancing spirituality in your life for profound happiness.";
document.getElementById("disclaimer")?.remove(); // avoid duplicates on restart
document.getElementById("hello").insertAdjacentHTML(
  "afterend",
  `<p class="note mini" id="disclaimer">${disclaimerText}</p>`
);


// ...you can keep your out100 + tier calculation if you still want the tier tag
let recHTML = RECOMMENDATION_HTML;  // <-- static recommendation

  // Update UI (only /100 shown)
  $("out100").textContent = out100;
  const tag = $("tierTag");
  tag.className = `tag ${tagClass}`;
  tag.textContent = tier;
  $("reco").innerHTML = recHTML;
  $("hello").textContent = state.name ? `Hi ${state.name}, here’s your result` : "Your Results";

  screens.q.classList.add("hidden");
  screens.result.classList.remove("hidden");
  bar.style.width = "100%";
  $("stepPill").classList.add("hidden");
}

// Keyboard navigation (not active inside inputs)
document.addEventListener("keydown", (e) => {
  const tag = (e.target.tagName || "").toLowerCase();
  const inText = tag === "input" || tag === "textarea";
  if (e.key === "ArrowRight" && !inText && !screens.q.classList.contains("hidden")) next();
  if (e.key === "ArrowLeft" && !inText && !screens.q.classList.contains("hidden")) prev();
});

// Wire up events after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  $("btnStart").addEventListener("click", startQuiz);
  $("btnSkipName").addEventListener("click", () => { $("name").value = ""; startQuiz(); });
  $("nextBtn").addEventListener("click", next);
  $("prevBtn").addEventListener("click", prev);
  $("restart").addEventListener("click", () => {
    $("name").value = "";
    $("stepPill").classList.remove("hidden");
    showStart();
  });
  $("printBtn")?.addEventListener("click", () => window.print());

  // initial UI
  prepareQuestions(); // so pill shows correct total before starting
  showStart();
});
