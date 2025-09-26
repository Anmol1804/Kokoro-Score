const questions = [
  {
    id: 1,
    type: "mc",
    q: "Q1. What do you think is the main purpose of life?",
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
    q: "Q2. When facing a big problem, what is most helpful?",
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
    q: "Q3. In the Bhagavad Gita, Arjuna was confused. What do you do when confused?",
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
    q: "Q5. What does yoga mean to you?",
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
    q: "Q6. Which quality do you value most?",
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
    q: "Q8. How do you feel when you see nature (sunrise, river, trees)?",
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
    q: "Q9. Why do you think people read spiritual books?",
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
    q: "Q10. If you could ask God one thing, what would it be?",
    opts: [
      ["a) Money & success", 0],
      ["b) Health & long life", 1],
      ["c) Peace & love", 2],
      ["d) Knowledge & liberation", 3],
    ],
  },
];
// const KEYWORDS = [
//   "peace",
//   "truth",
//   "god",
//   "soul",
//   "liberation",
//   "love",
//   "harmony",
// ];
const state = { name: "", step: 0, answers: {} };
const $ = (id) => document.getElementById(id);
const screens = {
  start: document.getElementById("screen-start"),
  q: document.getElementById("screen-q"),
  result: document.getElementById("screen-result"),
};
const bar = document.getElementById("bar");
const stepNow = document.getElementById("stepNow");
const stepTotal = document.getElementById("stepTotal");
stepTotal.textContent = questions.length + 1;
function showStart() {
  screens.start.classList.remove("hidden");
  screens.q.classList.add("hidden");
  screens.result.classList.add("hidden");
  state.step = 0;
  updateProgress();
}
function startQuiz() {
  state.name = document.getElementById("name").value.trim();
  state.step = 1;
  renderQuestion();
}
function renderQuestion() {
  screens.start.classList.add("hidden");
  screens.result.classList.add("hidden");
  screens.q.classList.remove("hidden");
  updateProgress();
  const qIndex = state.step - 1;
  const q = questions[qIndex];
  const wrap = document.getElementById("qWrap");
  wrap.innerHTML = "";
  const h = document.createElement("div");
  h.className = "q";
  h.textContent = q.q;
  wrap.appendChild(h);
  if (q.type === "mc") {
    q.opts.forEach(([label, val], i) => {
      const id = `q${q.id}_opt${i}`;
      const lab = document.createElement("label");
      lab.className = "opt";
      lab.setAttribute("for", id);
      lab.innerHTML = `<input type="radio" name="q${q.id}" id="${id}" value="${val}" /> <span>${label}</span>`;
      if (
        state.answers[q.id] !== undefined &&
        Number(state.answers[q.id]) === val
      ) {
        setTimeout(() => {
          lab.querySelector("input").checked = true;
        }, 0);
      }
      wrap.appendChild(lab);
    });
  } else {
    const ta = document.createElement("textarea");
    ta.id = `q${q.id}_text`;
    ta.rows = 3;
    ta.placeholder = "Type your answer here…";
    ta.style.width = "100%";
    ta.style.padding = "12px 14px";
    ta.style.borderRadius = "12px";
    ta.style.border = "1px solid rgba(255,255,255,.15)";
    ta.style.background = "rgba(255,255,255,.06)";
    ta.style.color = "var(--text)";
    if (state.answers[q.id]) ta.value = state.answers[q.id];
    wrap.appendChild(ta);
  }
  document.getElementById("prevBtn").disabled = state.step === 1;
  document.getElementById("nextBtn").textContent =
    state.step === questions.length ? "Finish →" : "Next →";
}
function updateProgress() {
  const totalSteps = questions.length + 1;
  stepNow.textContent = Math.min(state.step + 1, totalSteps);
  const pct = Math.round((state.step / questions.length) * 100);
  bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
}
function next() {
  const qIndex = state.step - 1;
  const q = questions[qIndex];
  if (q) {
    if (q.type === "mc") {
      const checked = document.querySelector(`input[name="q${q.id}"]:checked`);
      if (!checked) {
        alert("Please select an option to continue.");
        return;
      }
      state.answers[q.id] = Number(checked.value);
    } else {
      const text = (
        document.getElementById(`q${q.id}_text`).value || ""
      ).trim();
      if (!text) {
        alert("Please enter a short answer to continue.");
        return;
      }
      state.answers[q.id] = text;
    }
  }
  if (state.step < questions.length) {
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
  const mcSum = Array.from(
    { length: 10 },
    (_, i) => state.answers[i + 1] || 0
  ).reduce((a, b) => a + Number(b), 0);

  //   let keywordPts = 0;
  //   const texts = [String(state.answers[11] || ''), String(state.answers[12] || '')]
  //     .join(' ')
  //     .toLowerCase();
  //   KEYWORDS.forEach(k => { if (texts.includes(k)) keywordPts += 2; });
  //   keywordPts = Math.min(keywordPts, 6);

  //   const total = mcSum + keywordPts;
  //   const out10 = (total / 36 * 10);
  //   const out100 = Math.round(total / 36 * 100);

  const total = mcSum;
  const out10 = (total / 24) * 10;
  const out100 = Math.round((total / 24) * 100);

  let tier = "Material",
    tagClass = "material";
  if (out100 >= 80) {
    tier = "Spiritual Awareness";
    tagClass = "spiritual";
  } else if (out100 >= 50) {
    tier = "Peace-seeking";
    tagClass = "peace";
  } else if (out100 >= 25) {
    tier = "Practical";
    tagClass = "practical";
  }

  let recHTML = "";
  if (out100 <= 25) {
    recHTML = `<p><b>Start with relatable foundations:</b></p>
      <ul>
        <li><i>Bhagavad-gītā As It Is</i> — Intro + Starting Chapters 1–6</li>
        <li><i>Join the "Journey of Self Discovery Course"</li>
      </ul>
      <p class="mini">Focus on daily values, habits, and a gentle intro to the Gītā. Try to come to temple once a month atleast</p>`;
  } else if (out100 <= 50) {
    recHTML = `<p><b>Build understanding & practice:</b></p>
      <ul>
        <li><i>Bhagavad-gītā As It Is</i> — Especially Chapters 2 & 12</li>
        <li><i>Join the "Journey of Self Discovery" Course</li>
        <li><i>Also read Krsna book under some guidance/teacher<i/>
      </ul>
      <p class="mini">Add short reflection or japa (2–5 minutes/day).</p>`;
  } else if (out100 <= 80) {
    recHTML = `<p><b>Deepen philosophy & bhakti:</b></p>
      <ul>
        <li><i>Bhagavad-gītā As It Is</i> — full commentary</li>
        <li><i>Read Krsna Book</i> — full commentary</li>
        <li><i>Nectar of Instruction</i> (summary study)</li>
      </ul>
      <p class="mini">Also Consider a weekly satsang or Gītā study circle.</p>`;
  } else {
    recHTML = `<p><b>Advanced reading:</b></p>
      <ul>
        <li><i>Śrīmad-Bhāgavatam</i>- full study</li>
        <li><i>Nectar of Devotion</i></li>
      </ul>
      <p class="mini">Maintain steady sādhana and share wisdom with others.</p>`;
  }

  // Update UI
  //   document.getElementById('totalScore').textContent = `${total}`;
  //   document.getElementById('out10').textContent = out10.toFixed(1);
  document.getElementById("out100").textContent = out100;
  const tag = document.getElementById("tierTag");
  tag.className = `tag ${tagClass}`;
  tag.textContent = tier;
  document.getElementById("reco").innerHTML = recHTML;
  document.getElementById("hello").textContent = state.name
    ? `Hi ${state.name}, here’s your result`
    : "Your Results";

  screens.q.classList.add("hidden");
  screens.result.classList.remove("hidden");
  bar.style.width = "100%";
  document.getElementById("stepPill").classList.add("hidden");
}

// Wire up events after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnStart").addEventListener("click", startQuiz);
  document.getElementById("btnSkipName").addEventListener("click", () => {
    document.getElementById("name").value = "";
    startQuiz();
  });
  document.getElementById("nextBtn").addEventListener("click", next);
  document.getElementById("prevBtn").addEventListener("click", prev);
  document.getElementById("restart").addEventListener("click", () => {
    state.step = 0;
    state.answers = {};
    document.getElementById("name").value = "";
    document.getElementById("stepPill").classList.remove("hidden");
    showStart();
  });
  document
    .getElementById("printBtn")
    ?.addEventListener("click", () => window.print());

  showStart(); // initialize
});
