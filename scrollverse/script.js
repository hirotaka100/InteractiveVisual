gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const lowEndDevice = !reducedMotion && (
  (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
);
const progressBar = document.getElementById("progressBar");
const scrollPercent = document.getElementById("scrollPercent");
const motionMode = document.getElementById("motionMode");
const backToTop = document.getElementById("backToTop");
const learnerSearch = document.getElementById("learnerSearch");
const ratingFilter = document.getElementById("ratingFilter");
const clearFilters = document.getElementById("clearFilters");
const filterStatus = document.getElementById("filterStatus");
const sourceModeRoot = document.getElementById("sourceMode");
const metricModeRoot = document.getElementById("metricMode");
const comparisonInsight = document.getElementById("comparisonInsight");

const pretestRowsRaw = [
  "L1|12|30.00|Needs Major Support",
  "L2|9|22.50|Needs Major Support",
  "L3|12|30.00|Needs Major Support",
  "L4|7|17.00|Needs Major Support",
  "L5|19|47.00|Needs Major Support",
  "L6|13|32.50|Needs Major Support",
  "L7|19|47.50|Needs Major Support",
  "L8|18|45.00|Needs Major Support",
  "L9|16|40.00|Needs Major Support",
  "L10|11|27.50|Needs Major Support",
  "L11|16|40.00|Needs Major Support",
  "L12|15|37.00|Needs Major Support",
  "L13|13|32.50|Needs Major Support",
  "L14|9|22.50|Needs Major Support",
  "L15|13|32.50|Needs Major Support",
  "L16|14|35.50|Needs Major Support",
  "L17|18|45.00|Needs Major Support",
  "L18|16|40.00|Needs Major Support",
  "L19|14|35.00|Needs Major Support",
  "L20|13|32.50|Needs Major Support",
  "L21|14|35.00|Needs Major Support",
  "L22|4|10.00|Needs Major Support",
  "L23|13|32.50|Needs Major Support",
  "L24|13|32.50|Needs Major Support",
  "L25|19|47.50|Needs Major Support",
  "L26|12|30.00|Needs Major Support",
  "L27|7|17.50|Needs Major Support",
  "L28|12|30.00|Needs Major Support",
  "L29|14|35.00|Needs Major Support",
  "L30|8|20.00|Needs Major Support",
  "L31|14|35.00|Needs Major Support",
  "L32|11|27.50|Needs Major Support",
  "L33|15|37.50|Needs Major Support",
  "L34|17|42.50|Needs Major Support",
  "L35|16|40.00|Needs Major Support",
  "L36|13|32.50|Needs Major Support",
  "L37|12|30.00|Needs Major Support",
  "L38|8|20.00|Needs Major Support",
  "L39|18|45.00|Needs Major Support",
  "L40|15|37.50|Needs Major Support",
  "L41|13|45.00|Needs Major Support",
  "L42|18|45.00|Needs Major Support",
  "L43|16|40.00|Needs Major Support",
  "L44|13|32.50|Needs Major Support",
  "L45|18|45.00|Needs Major Support",
  "L46|8|20.00|Needs Major Support",
  "L47|12|30.00|Needs Major Support",
  "L48|12|30.00|Needs Major Support",
  "L49|13|32.50|Needs Major Support",
  "L50|24|60.00|Needs Major Support",
  "L51|15|37.50|Needs Major Support",
  "L52|13|32.50|Needs Major Support",
  "L53|14|35.00|Needs Major Support",
  "L54|18|45.00|Needs Major Support",
  "L55|15|37.50|Needs Major Support",
  "L56|18|45.00|Needs Major Support"
];

const posttestRowsRaw = [
  "L1|28|70.00|Needs Major Support",
  "L2|32|80.00|Emerging",
  "L3|28|70.00|Needs Major Support",
  "L4|32|80.00|Emerging",
  "L5|32|80.00|Emerging",
  "L6|35|87.50|Developing",
  "L7|28|70.00|Needs Major Support",
  "L8|30|75.00|Emerging",
  "L9|32|80.00|Emerging",
  "L10|31|77.50|Anchoring",
  "L11|28|70.00|Needs Major Support",
  "L12|30|75.00|Anchoring",
  "L13|33|82.50|Emerging",
  "L14|30|75.00|Anchoring",
  "L15|30|75.00|Anchoring",
  "L16|28|70.00|Needs Major Support",
  "L17|31|77.50|Anchoring",
  "L18|35|87.50|Developing",
  "L19|31|77.50|Anchoring",
  "L20|30|75.00|Anchoring",
  "L21|36|90.00|Transforming",
  "L22|32|80.00|Emerging",
  "L23|30|75.00|Anchoring",
  "L24|31|77.50|Anchoring",
  "L25|33|82.50|Emerging",
  "L26|34|85.00|Developing",
  "L27|34|85.00|Developing",
  "L28|33|82.50|Emerging",
  "L29|35|87.50|Developing",
  "L30|35|87.50|Developing",
  "L31|31|77.50|Anchoring",
  "L32|34|85.00|Developing",
  "L33|36|90.00|Transforming",
  "L34|33|82.50|Emerging",
  "L35|32|80.00|Emerging",
  "L36|35|87.50|Developing",
  "L37|33|82.50|Emerging",
  "L38|35|87.50|Developing",
  "L39|33|82.50|Emerging",
  "L40|37|92.50|Transforming",
  "L41|34|85.00|Developing",
  "L42|35|87.50|Developing",
  "L43|36|90.00|Transforming",
  "L44|35|87.50|Developing",
  "L45|38|95.00|Transforming",
  "L46|35|87.50|Developing",
  "L47|33|82.50|Emerging",
  "L48|34|85.00|Developing",
  "L49|34|85.00|Developing",
  "L50|37|92.50|Transforming",
  "L51|31|77.50|Anchoring",
  "L52|35|87.50|Developing",
  "L53|33|82.50|Emerging",
  "L54|37|92.50|Transforming",
  "L55|34|85.00|Developing",
  "L56|37|92.50|Transforming"
];

function parseLearnerRows(rawRows) {
  return rawRows.map((row) => {
    const [learner, score, percent, rating] = row.split("|");
    return {
      learner,
      score: Number(score),
      percent: Number(percent),
      rating
    };
  });
}

function learnerIdNumber(label) {
  return Number(String(label).replace(/[^0-9]/g, ""));
}

const researchData = {
  totalLearners: 56,
  pretestLearners: parseLearnerRows(pretestRowsRaw),
  posttestLearners: parseLearnerRows(posttestRowsRaw),
  pretest: [{ label: "Needs Major Support", count: 56, percent: 100 }],
  posttestChapter4: [
    { label: "Needs Major Support", count: 5, percent: 8.93 },
    { label: "Emerging", count: 13, percent: 23.21 },
    { label: "Anchoring", count: 15, percent: 26.79 },
    { label: "Developing", count: 14, percent: 25.0 },
    { label: "Transforming", count: 9, percent: 16.07 }
  ],
  posttestChapter5Summary: [
    { label: "Needs Major Support", count: 4, percent: 7.14 },
    { label: "Emerging", count: 13, percent: 23.21 },
    { label: "Anchoring", count: 15, percent: 26.79 },
    { label: "Developing", count: 19, percent: 33.93 },
    { label: "Transforming", count: 9, percent: 16.07 }
  ],
  stats: [
    { label: "Pretest Mean (SD)", value: "13.79 (3.65)" },
    { label: "Posttest Mean (SD)", value: "32.93 (2.60)" },
    { label: "Mean Difference", value: "19.14" },
    { label: "Paired t-test", value: "t(55) = 33.96" },
    { label: "p-value", value: "< .001" },
    { label: "95% CI", value: "18.01 to 20.27" }
  ],
  qualityScores: [
    { label: "Content Quality", score: 49.7, max: 50 },
    { label: "Instructional Quality", score: 49.8, max: 50 },
    { label: "Technical Quality", score: 64.6, max: 65 },
    { label: "Other Findings", score: 16, max: 16 }
  ],
  itExpertScores: [
    { label: "Functionality", score: 20, max: 20 },
    { label: "Reliability", score: 15, max: 15 },
    { label: "Usability", score: 20, max: 20 },
    { label: "Efficiency", score: 10, max: 10 },
    { label: "Maintainability", score: 20, max: 20 },
    { label: "Portability", score: 20, max: 20 },
    { label: "Compliance", score: 5, max: 5 }
  ],
  recommendations: [
    { text: "Add real-life scenarios and reflective discussions", frequency: 2 },
    { text: "Add more examples or interactive elements", frequency: 1 },
    { text: "State learning objectives more clearly", frequency: 1 },
    { text: "Increase voice-over volume", frequency: 1 },
    { text: "Break down complex concepts into smaller steps", frequency: 1 },
    { text: "Double-check hyperlinks for reliability", frequency: 1 },
    { text: "Keep visual formatting consistent", frequency: 1 },
    { text: "Add classroom timer support", frequency: 1 },
    { text: "Use devices with larger storage to reduce lag", frequency: 1 },
    { text: "Provide build tutorial for teacher reuse", frequency: 1 }
  ]
};

if (motionMode) {
  if (reducedMotion) {
    motionMode.textContent = "Reduced";
  } else if (lowEndDevice) {
    motionMode.textContent = "Adaptive Lite";
  } else {
    motionMode.textContent = "Dynamic";
  }
}

if (lowEndDevice) {
  document.body.classList.add("perf-lite");
}

const posttestByNumber = new Map(
  researchData.posttestLearners.map((row) => [learnerIdNumber(row.learner), row])
);

const learnerPairs = researchData.pretestLearners
  .map((pre) => {
    const number = learnerIdNumber(pre.learner);
    return {
      number,
      learner: `L${number}`,
      pre,
      post: posttestByNumber.get(number) || null
    };
  })
  .filter((row) => row.post !== null)
  .sort((a, b) => a.number - b.number);

const comparisonState = {
  sourceMode: "pre-post4",
  metricMode: "count"
};

function ratioWidth(count, total) {
  if (!total) {
    return 0;
  }
  return Math.max(0, Math.min((count / total) * 100, 100));
}

function createShiftBar(tag, modifierClass, count, percentText) {
  return `
    <div class="shift-bar">
      <span class="shift-tag">${tag}</span>
      <div class="shift-track">
        <span class="shift-fill ${modifierClass}" data-width="${count}"></span>
      </div>
      <span class="shift-value">${count} (${percentText})</span>
    </div>
  `;
}

function createComparisonBar(tag, modifierClass, width, valueText) {
  return `
    <div class="shift-bar">
      <span class="shift-tag">${tag}</span>
      <div class="shift-track">
        <span class="shift-fill ${modifierClass}" data-width="${Math.max(0, Math.min(width, 100)).toFixed(2)}"></span>
      </div>
      <span class="shift-value">${valueText}</span>
    </div>
  `;
}

function getComparisonSeries() {
  if (comparisonState.sourceMode === "pre-post5") {
    return {
      seriesAName: "Pre",
      seriesA: researchData.pretest,
      seriesBName: "Post Ch5",
      seriesB: researchData.posttestChapter5Summary
    };
  }

  if (comparisonState.sourceMode === "post4-post5") {
    return {
      seriesAName: "Post Ch4",
      seriesA: researchData.posttestChapter4,
      seriesBName: "Post Ch5",
      seriesB: researchData.posttestChapter5Summary
    };
  }

  return {
    seriesAName: "Pre",
    seriesA: researchData.pretest,
    seriesBName: "Post Ch4",
    seriesB: researchData.posttestChapter4
  };
}

function formatValue(row) {
  if (comparisonState.metricMode === "percent") {
    return `${row.percent.toFixed(2)}% (${row.count})`;
  }
  return `${row.count} (${row.percent.toFixed(2)}%)`;
}

function getWidthValue(row) {
  if (comparisonState.metricMode === "percent") {
    return row.percent;
  }
  return ratioWidth(row.count, researchData.totalLearners);
}

function renderComparisonInsight(categoryOrder, aMap, bMap, seriesAName, seriesBName) {
  if (!comparisonInsight) {
    return;
  }

  const deltas = categoryOrder.map((label) => {
    const rowA = aMap.get(label) || { count: 0, percent: 0 };
    const rowB = bMap.get(label) || { count: 0, percent: 0 };
    const delta = comparisonState.metricMode === "percent"
      ? rowB.percent - rowA.percent
      : rowB.count - rowA.count;
    return { label, delta };
  });

  const maxUp = deltas.reduce((prev, curr) => (curr.delta > prev.delta ? curr : prev), deltas[0]);
  const maxDown = deltas.reduce((prev, curr) => (curr.delta < prev.delta ? curr : prev), deltas[0]);
  const unit = comparisonState.metricMode === "percent" ? "pp" : "learners";
  const formatDelta = (value) => (
    comparisonState.metricMode === "percent"
      ? value.toFixed(2)
      : String(Math.round(value))
  );

  const upText = `${maxUp.delta >= 0 ? "+" : ""}${formatDelta(maxUp.delta)}`;
  const downText = `${maxDown.delta >= 0 ? "+" : ""}${formatDelta(maxDown.delta)}`;

  comparisonInsight.innerHTML = `
    <strong>${seriesAName}</strong> to <strong>${seriesBName}</strong>: largest increase is
    <strong>${maxUp.label}</strong> (${upText} ${unit}); largest decrease is
    <strong>${maxDown.label}</strong> (${downText} ${unit}).
  `;
}

function paintComparisonBars() {
  const bars = document.querySelectorAll("#shiftChart .shift-fill");
  if (!bars.length) {
    return;
  }

  if (reducedMotion || lowEndDevice) {
    bars.forEach((bar) => {
      bar.style.width = `${bar.dataset.width || 0}%`;
    });
    return;
  }

  gsap.fromTo(
    bars,
    { width: "0%" },
    {
      width: (index, target) => `${target.dataset.width || 0}%`,
      duration: 0.58,
      ease: "power2.out",
      stagger: 0.02
    }
  );
}

function updatePillSelection(root, dataAttr, value) {
  if (!root) {
    return;
  }

  root.querySelectorAll(".pill-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.getAttribute(dataAttr) === value);
  });
}

function renderBaseline() {
  const baselineRoot = document.getElementById("baselineBars");
  if (!baselineRoot) {
    return;
  }

  const baseline = researchData.pretest[0];
  baselineRoot.innerHTML = `
    <div class="shift-row">
      <span class="shift-label">${baseline.label}</span>
      <div class="shift-bars">
        ${createShiftBar("Pretest", "shift-fill--pre", baseline.count, `${baseline.percent.toFixed(2)}%`)}
      </div>
    </div>
  `;

  const baselineFill = baselineRoot.querySelector(".shift-fill");
  if (baselineFill) {
    baselineFill.dataset.width = ratioWidth(baseline.count, researchData.totalLearners).toFixed(2);
  }
}

function renderDistributionComparison() {
  const shiftChart = document.getElementById("shiftChart");
  const chapter4List = document.getElementById("chapter4List");
  const chapter5List = document.getElementById("chapter5List");

  if (!shiftChart || !chapter4List || !chapter5List) {
    return;
  }

  const categoryOrder = [
    "Needs Major Support",
    "Emerging",
    "Anchoring",
    "Developing",
    "Transforming"
  ];

  const { seriesAName, seriesA, seriesBName, seriesB } = getComparisonSeries();

  const seriesAMap = new Map(seriesA.map((row) => [row.label, row]));
  const seriesBMap = new Map(seriesB.map((row) => [row.label, row]));

  shiftChart.innerHTML = categoryOrder
    .map((label) => {
      const rowA = seriesAMap.get(label) || { count: 0, percent: 0 };
      const rowB = seriesBMap.get(label) || { count: 0, percent: 0 };
      const widthA = getWidthValue(rowA);
      const widthB = getWidthValue(rowB);

      return `
        <div class="shift-row">
          <span class="shift-label">${label}</span>
          <div class="shift-bars">
            ${createComparisonBar(seriesAName, "shift-fill--a", widthA, formatValue(rowA))}
            ${createComparisonBar(seriesBName, "shift-fill--b", widthB, formatValue(rowB))}
          </div>
        </div>
      `;
    })
    .join("");

  chapter4List.innerHTML = researchData.posttestChapter4
    .map((row) => `<li><span>${row.label}</span><strong>${row.count} (${row.percent.toFixed(2)}%)</strong></li>`)
    .join("");

  chapter5List.innerHTML = researchData.posttestChapter5Summary
    .map((row) => `<li><span>${row.label}</span><strong>${row.count} (${row.percent.toFixed(2)}%)</strong></li>`)
    .join("");

  renderComparisonInsight(categoryOrder, seriesAMap, seriesBMap, seriesAName, seriesBName);
  paintComparisonBars();
}

function setupComparisonControls() {
  updatePillSelection(sourceModeRoot, "data-source-mode", comparisonState.sourceMode);
  updatePillSelection(metricModeRoot, "data-metric-mode", comparisonState.metricMode);

  sourceModeRoot?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const nextMode = target.getAttribute("data-source-mode");
    if (!nextMode || nextMode === comparisonState.sourceMode) {
      return;
    }

    comparisonState.sourceMode = nextMode;
    updatePillSelection(sourceModeRoot, "data-source-mode", comparisonState.sourceMode);
    renderDistributionComparison();
  });

  metricModeRoot?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const nextMode = target.getAttribute("data-metric-mode");
    if (!nextMode || nextMode === comparisonState.metricMode) {
      return;
    }

    comparisonState.metricMode = nextMode;
    updatePillSelection(metricModeRoot, "data-metric-mode", comparisonState.metricMode);
    renderDistributionComparison();
  });
}

function renderStats() {
  const statsGrid = document.getElementById("statsGrid");
  if (!statsGrid) {
    return;
  }

  statsGrid.innerHTML = researchData.stats
    .map(
      (item) => `
        <article class="stat-card reveal">
          <h3>${item.label}</h3>
          <p>${item.value}</p>
        </article>
      `
    )
    .join("");
}

function renderScoreRows(rootId, rows) {
  const root = document.getElementById(rootId);
  if (!root) {
    return;
  }

  root.innerHTML = rows
    .map((row) => {
      const width = Math.max(0, Math.min((row.score / row.max) * 100, 100));
      return `
        <div class="metric-row">
          <span class="metric-name">${row.label}</span>
          <div class="metric-track">
            <span class="metric-fill" data-width="${width.toFixed(2)}"></span>
          </div>
          <span class="metric-score">${row.score}/${row.max}</span>
        </div>
      `;
    })
    .join("");
}

function renderRecommendations() {
  const recommendationGrid = document.getElementById("recommendationGrid");
  if (!recommendationGrid) {
    return;
  }

  recommendationGrid.innerHTML = researchData.recommendations
    .map(
      (item) => `
        <article class="recommendation-card reveal">
          <p>${item.text}</p>
          <span class="frequency">x${item.frequency}</span>
        </article>
      `
    )
    .join("");
}

function renderLearnerTable(tableId, rows) {
  const table = document.getElementById(tableId);
  if (!table) {
    return;
  }

  const body = table.querySelector("tbody");
  if (!body) {
    return;
  }

  if (!rows.length) {
    body.innerHTML = '<tr><td class="table-empty" colspan="4">No learners match the current filter.</td></tr>';
    return;
  }

  body.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td>${row.learner}</td>
          <td>${row.score}</td>
          <td>${row.percent.toFixed(2)}%</td>
          <td><span class="rating-pill" data-rating="${row.rating}">${row.rating}</span></td>
        </tr>
      `
    )
    .join("");
}

function updateLearnerInsights(pairs) {
  const matchCount = document.getElementById("matchCount");
  const avgPre = document.getElementById("avgPre");
  const avgPost = document.getElementById("avgPost");
  const meanGain = document.getElementById("meanGain");

  if (!matchCount || !avgPre || !avgPost || !meanGain) {
    return;
  }

  if (!pairs.length) {
    matchCount.textContent = "0";
    avgPre.textContent = "0.00%";
    avgPost.textContent = "0.00%";
    meanGain.textContent = "+0.00";
    return;
  }

  const prePercentAverage =
    pairs.reduce((sum, row) => sum + row.pre.percent, 0) / pairs.length;
  const postPercentAverage =
    pairs.reduce((sum, row) => sum + row.post.percent, 0) / pairs.length;
  const meanGainValue =
    pairs.reduce((sum, row) => sum + (row.post.score - row.pre.score), 0) / pairs.length;

  matchCount.textContent = String(pairs.length);
  avgPre.textContent = `${prePercentAverage.toFixed(2)}%`;
  avgPost.textContent = `${postPercentAverage.toFixed(2)}%`;
  meanGain.textContent = `+${meanGainValue.toFixed(2)}`;
}

function applyLearnerFilters() {
  const query = (learnerSearch?.value || "").trim().toUpperCase();
  const rating = ratingFilter?.value || "all";
  const numericQuery = query.replace(/[^0-9]/g, "");

  const filtered = learnerPairs.filter((row) => {
    const learnerUpper = row.learner.toUpperCase();
    const matchesQuery =
      !query ||
      learnerUpper.includes(query) ||
      (numericQuery && String(row.number).includes(numericQuery));
    const matchesRating = rating === "all" || row.post.rating === rating;
    return matchesQuery && matchesRating;
  });

  renderLearnerTable(
    "pretestTable",
    filtered.map((row) => row.pre)
  );
  renderLearnerTable(
    "posttestTable",
    filtered.map((row) => row.post)
  );
  updateLearnerInsights(filtered);

  if (filterStatus) {
    const qualifier = [];
    if (query) {
      qualifier.push(`search ${query}`);
    }
    if (rating !== "all") {
      qualifier.push(`rating ${rating}`);
    }

    const suffix = qualifier.length ? ` for ${qualifier.join(" and ")}` : "";
    filterStatus.textContent = `Showing ${filtered.length} of ${learnerPairs.length} learners${suffix}.`;
  }
}

function setupLearnerFilters() {
  applyLearnerFilters();

  if (learnerSearch) {
    learnerSearch.addEventListener("input", applyLearnerFilters);
  }

  if (ratingFilter) {
    ratingFilter.addEventListener("change", applyLearnerFilters);
  }

  if (clearFilters) {
    clearFilters.addEventListener("click", () => {
      if (learnerSearch) {
        learnerSearch.value = "";
      }
      if (ratingFilter) {
        ratingFilter.value = "all";
      }
      applyLearnerFilters();
    });
  }
}

function updateProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total > 0 ? Math.min((scrollTop / total) * 100, 100) : 0;

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }
  if (scrollPercent) {
    scrollPercent.textContent = `${Math.round(progress)}%`;
  }
}

function setupAnimations() {
  if (reducedMotion) {
    document.querySelectorAll(".shift-fill").forEach((el) => {
      el.style.width = `${el.dataset.width || 0}%`;
    });
    document.querySelectorAll(".metric-fill").forEach((el) => {
      el.style.width = `${el.dataset.width || 0}%`;
    });
    return;
  }

  gsap.to(".reveal", {
    opacity: 1,
    y: 0,
    ease: "power2.out",
    duration: lowEndDevice ? 0.55 : 0.82,
    stagger: lowEndDevice ? 0.05 : 0.08,
    scrollTrigger: {
      trigger: "body",
      start: "top top+=60",
      end: "bottom bottom",
      toggleActions: "play none none reverse"
    }
  });

  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: lowEndDevice ? "+=85%" : "+=120%",
      scrub: lowEndDevice ? 0.8 : 1.1,
      pin: !lowEndDevice
    }
  });

  heroTl
    .to(
      ".hero__title",
      { scale: lowEndDevice ? 1.03 : 1.06, letterSpacing: lowEndDevice ? "0" : "0.01em" },
      0
    )
    .to(".hero__subtitle", { y: lowEndDevice ? -10 : -22, opacity: 0.72 }, 0)
    .to(".orb-a", { xPercent: lowEndDevice ? 8 : 16, yPercent: lowEndDevice ? 10 : 18, scale: 1.06 }, 0)
    .to(".orb-b", { xPercent: lowEndDevice ? -10 : -20, yPercent: lowEndDevice ? -8 : -14, scale: 1.1 }, 0)
    .to(".grid-lines", { yPercent: lowEndDevice ? -8 : -13, rotateX: 68 }, 0)
    .to(".scroll-hint", { opacity: 0 }, 0.2);

  const track = document.querySelector(".horizontal-track");
  if (track && !lowEndDevice) {
    const galleryTween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth + 90),
      ease: "none",
      scrollTrigger: {
        trigger: ".chapter--intervention",
        start: "top top",
        end: () => `+=${Math.max(track.scrollWidth, window.innerWidth)}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true
      }
    });
    ScrollTrigger.addEventListener("refreshInit", () => galleryTween.invalidate());
  } else if (track && lowEndDevice) {
    gsap.from(".module-card", {
      opacity: 0,
      y: 26,
      stagger: 0.08,
      duration: 0.65,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".chapter--intervention",
        start: "top 72%",
        toggleActions: "play none none reverse"
      }
    });
  }

  document.querySelectorAll(".shift-fill").forEach((el) => {
    gsap.to(el, {
      width: `${el.dataset.width || 0}%`,
      duration: 1.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el.closest(".chapter") || el,
        start: "top 78%",
        toggleActions: "play none none reverse"
      }
    });
  });

  document.querySelectorAll(".metric-fill").forEach((el) => {
    gsap.to(el, {
      width: `${el.dataset.width || 0}%`,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el.closest(".bar-panel") || el,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  });
}

renderBaseline();
renderDistributionComparison();
setupComparisonControls();
renderStats();
renderScoreRows("qualityBars", researchData.qualityScores);
renderScoreRows("itBars", researchData.itExpertScores);
renderRecommendations();
setupLearnerFilters();
setupAnimations();

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth"
    });
  });
}
