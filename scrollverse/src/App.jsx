import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { learnerPairs, ratingOrder, researchData } from "./data/researchData";

const chapters = [
  { id: "chapter-hero", label: "Intro" },
  { id: "chapter-method", label: "Method" },
  { id: "chapter-framework", label: "Framework" },
  { id: "chapter-baseline", label: "Baseline" },
  { id: "chapter-intervention", label: "Intervention" },
  { id: "chapter-comparison", label: "Comparison" },
  { id: "chapter-stats", label: "Stats" },
  { id: "chapter-quality", label: "Quality" },
  { id: "chapter-recommendations", label: "Recommendations" },
  { id: "chapter-learner-data", label: "Learners" },
  { id: "chapter-conclusion", label: "Conclusion" }
];

const proponents = [
  "Rizza Myr S. Cereno",
  "Arabella Arciga",
  "Cielo Sentin",
  "Dominic Heinrich Poblete"
];

function ratioWidth(value, max) {
  if (!max) {
    return 0;
  }
  return Math.max(0, Math.min((value / max) * 100, 100));
}

function phaseRecord(pair, phase) {
  return phase === "pre" ? pair.pre : pair.post;
}

function pairsBySection(section) {
  if (section === "all") {
    return learnerPairs;
  }
  return learnerPairs.filter((pair) => pair.section === section);
}

function sectionLabel(section) {
  if (section === "all") {
    return "All Learners";
  }
  return `Grade 3-${section}`;
}

function countsByRating(pairs, phase) {
  const counts = new Map(ratingOrder.map((label) => [label, 0]));
  pairs.forEach((pair) => {
    const rating = phaseRecord(pair, phase).rating;
    counts.set(rating, (counts.get(rating) || 0) + 1);
  });
  return ratingOrder.map((label) => ({
    label,
    count: counts.get(label) || 0
  }));
}

function radarPoint(cx, cy, radius, angleDeg) {
  const radians = (Math.PI / 180) * (angleDeg - 90);
  return {
    x: cx + (radius * Math.cos(radians)),
    y: cy + (radius * Math.sin(radians))
  };
}

function chapterNext(chapterId) {
  const index = chapters.findIndex((chapter) => chapter.id === chapterId);
  if (index < 0 || index === chapters.length - 1) {
    return null;
  }
  return chapters[index + 1];
}

function ChapterActions({ chapterId, onJump }) {
  const next = chapterNext(chapterId);
  return (
    <div className="mt-7 flex flex-wrap gap-3">
      {next ? (
        <button
          type="button"
          onClick={() => onJump(next.id)}
          className="rounded-full border border-aqua/40 bg-aqua/10 px-4 py-2 text-xs font-semibold tracking-wide text-aqua transition hover:-translate-y-0.5 hover:bg-aqua/20"
        >
          Next Chapter: {next.label}
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => onJump("chapter-hero")}
        className="rounded-full border border-ink/20 bg-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-ink transition hover:-translate-y-0.5 hover:bg-white"
      >
        Back To Intro
      </button>
    </div>
  );
}

function RadarPanel({ profile }) {
  const width = 360;
  const height = 320;
  const cx = 180;
  const cy = 165;
  const maxRadius = 108;
  const maxValue = 5;
  const axisCount = profile.labels.length;

  const rings = Array.from({ length: 5 }, (_, ringIndex) => {
    const ringRadius = ((ringIndex + 1) / 5) * maxRadius;
    return profile.labels
      .map((_, idx) => radarPoint(cx, cy, ringRadius, (360 / axisCount) * idx))
      .map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`)
      .join(" ");
  });

  const vertices = profile.values.map((value, idx) => {
    const radius = (Math.max(0, Math.min(value, maxValue)) / maxValue) * maxRadius;
    return radarPoint(cx, cy, radius, (360 / axisCount) * idx);
  });

  const polygon = vertices.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");
  const meanScore = profile.values.reduce((sum, value) => sum + value, 0) / profile.values.length;

  return (
    <article className="glass-panel rounded-2xl p-4">
      <h4 className="text-sm font-semibold text-ink">{profile.title}</h4>
      <p className="mt-2 text-xs text-muted">
        {profile.subtitle} | Mean: {meanScore.toFixed(2)} / 5
      </p>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-3 h-auto w-full" aria-hidden="true">
        {rings.map((points, index) => (
          <polygon
            key={`ring-${index}`}
            points={points}
            fill="none"
            stroke="rgba(31,42,55,0.16)"
            strokeWidth="1"
          />
        ))}

        {profile.labels.map((label, index) => {
          const end = radarPoint(cx, cy, maxRadius, (360 / axisCount) * index);
          const labelPoint = radarPoint(cx, cy, maxRadius + 21, (360 / axisCount) * index);
          const anchor = labelPoint.x < cx - 8 ? "end" : labelPoint.x > cx + 8 ? "start" : "middle";
          return (
            <g key={`axis-${label}`}>
              <line
                x1={cx}
                y1={cy}
                x2={end.x.toFixed(2)}
                y2={end.y.toFixed(2)}
                stroke="rgba(31,42,55,0.22)"
                strokeWidth="1"
              />
              <text
                x={labelPoint.x.toFixed(2)}
                y={labelPoint.y.toFixed(2)}
                textAnchor={anchor}
                className="fill-muted text-[11px]"
              >
                {label}
              </text>
            </g>
          );
        })}

        <polygon points={polygon} fill={profile.color} fillOpacity="0.24" stroke={profile.color} strokeWidth="2" />

        {vertices.map((point, index) => (
          <circle key={`vertex-${index}`} cx={point.x} cy={point.y} r="3" fill={profile.color} />
        ))}
      </svg>
    </article>
  );
}

function Reveal({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const lowEndDevice = useMemo(() => {
    if (typeof navigator === "undefined" || reducedMotion) {
      return false;
    }
    const lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
    const lowCpu = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    return Boolean(lowMemory || lowCpu);
  }, [reducedMotion]);

  const runtimeMode = reducedMotion ? "Reduced" : lowEndDevice ? "Adaptive Lite" : "Dynamic";

  const [activeChapter, setActiveChapter] = useState("chapter-hero");
  const [progress, setProgress] = useState(0);

  const [frameworkSection, setFrameworkSection] = useState("all");
  const [frameworkPhase, setFrameworkPhase] = useState("post");
  const [frameworkRole, setFrameworkRole] = useState("teachers");
  const [frameworkMode, setFrameworkMode] = useState("focus");

  const [comparisonSource, setComparisonSource] = useState("pre-post4");
  const [comparisonMetric, setComparisonMetric] = useState("count");

  const [learnerSearch, setLearnerSearch] = useState("");
  const [learnerRating, setLearnerRating] = useState("all");

  const fieldClass = "mt-2 w-full rounded-xl border border-ink/20 bg-white px-3 py-2 text-sm text-ink outline-none ring-aqua/35 focus:ring";

  const jumpToChapter = (chapterId) => {
    const element = document.getElementById(chapterId);
    if (!element) {
      return;
    }
    element.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start"
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY || document.documentElement.scrollTop;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = total > 0 ? Math.min((top / total) * 100, 100) : 0;
      setProgress(nextProgress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const observedIds = chapters.map((chapter) => chapter.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveChapter(visible.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0.05, 0.25, 0.5]
      }
    );

    observedIds.forEach((id) => {
      const node = document.getElementById(id);
      if (node) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, []);

  const frameworkPairs = useMemo(() => pairsBySection(frameworkSection), [frameworkSection]);

  const frameworkKpis = useMemo(() => {
    const total = frameworkPairs.length;
    if (!total) {
      return {
        learners: 0,
        meanScore: 0,
        weightedPercent: 0,
        topLabel: "No data",
        topCount: 0,
        topPercent: 0
      };
    }

    const meanScore = frameworkPairs.reduce((sum, pair) => sum + phaseRecord(pair, frameworkPhase).score, 0) / total;
    const weightedPercent = frameworkPairs.reduce((sum, pair) => sum + phaseRecord(pair, frameworkPhase).percent, 0) / total;

    const counts = countsByRating(frameworkPairs, frameworkPhase);
    const top = counts.reduce((prev, current) => (current.count > prev.count ? current : prev), counts[0]);

    return {
      learners: total,
      meanScore,
      weightedPercent,
      topLabel: top.label,
      topCount: top.count,
      topPercent: ratioWidth(top.count, total)
    };
  }, [frameworkPairs, frameworkPhase]);

  const slopeGraph = useMemo(() => {
    const width = 860;
    const height = 360;
    const margin = { top: 24, right: 92, bottom: 44, left: 92 };
    const xPre = margin.left;
    const xPost = width - margin.right;
    const yTop = margin.top;
    const yBottom = height - margin.bottom;

    const toY = (score) => yBottom - ((score / 40) * (yBottom - yTop));

    const lines = frameworkPairs.map((pair) => {
      const preY = toY(pair.pre.score);
      const postY = toY(pair.post.score);
      const delta = pair.post.score - pair.pre.score;
      return {
        learner: pair.learner,
        preY,
        postY,
        stroke: delta < 0 ? "rgba(255, 125, 101, 0.6)" : "rgba(35, 215, 186, 0.58)"
      };
    });

    return {
      width,
      height,
      xPre,
      xPost,
      yTop,
      yBottom,
      ticks: [0, 10, 20, 30, 40],
      toY,
      lines
    };
  }, [frameworkPairs]);

  const histogram = useMemo(() => {
    const compareOn = frameworkMode === "compare";
    const sectionKeys = compareOn && frameworkSection === "all"
      ? ["Honest", "Patience"]
      : [frameworkSection];

    const currentSeries = sectionKeys.map((key) => ({
      key,
      counts: countsByRating(pairsBySection(key), frameworkPhase)
    }));

    const opposite = frameworkPhase === "pre" ? "post" : "pre";
    const overlaySeries = sectionKeys.map((key) => ({
      key,
      counts: countsByRating(pairsBySection(key), opposite)
    }));

    const maxCount = Math.max(
      1,
      ...currentSeries.flatMap((entry) => entry.counts.map((item) => item.count)),
      ...(compareOn ? overlaySeries.flatMap((entry) => entry.counts.map((item) => item.count)) : [])
    );

    const width = 860;
    const height = 360;
    const margin = { top: 26, right: 24, bottom: 74, left: 58 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const groupWidth = plotWidth / ratingOrder.length;
    const barWidth = sectionKeys.length === 2 ? groupWidth * 0.26 : groupWidth * 0.42;

    const toY = (count) => margin.top + plotHeight - ((count / maxCount) * plotHeight);

    const bars = [];

    ratingOrder.forEach((label, levelIndex) => {
      const baseX = margin.left + (levelIndex * groupWidth);
      sectionKeys.forEach((key, sectionIndex) => {
        const currentCount = currentSeries.find((entry) => entry.key === key).counts[levelIndex].count;
        const overlayCount = overlaySeries.find((entry) => entry.key === key).counts[levelIndex].count;

        const spacing = sectionKeys.length === 2 ? groupWidth * 0.13 : groupWidth * 0.29;
        const x = baseX + spacing + (sectionIndex * (barWidth + groupWidth * 0.08));

        const color = key === "Honest"
          ? "rgba(35, 215, 186, 0.78)"
          : key === "Patience"
            ? "rgba(126, 198, 255, 0.76)"
            : "rgba(255, 186, 82, 0.78)";

        bars.push({
          key: `${label}-${key}`,
          x,
          label,
          color,
          currentCount,
          overlayCount,
          yCurrent: toY(currentCount),
          hCurrent: margin.top + plotHeight - toY(currentCount),
          yOverlay: toY(overlayCount),
          hOverlay: margin.top + plotHeight - toY(overlayCount)
        });
      });
    });

    return {
      width,
      height,
      margin,
      plotHeight,
      compareOn,
      opposite,
      maxCount,
      groupWidth,
      barWidth,
      sectionKeys,
      bars
    };
  }, [frameworkMode, frameworkSection, frameworkPhase]);

  const histogramNote = useMemo(() => {
    const opposite = frameworkPhase === "pre" ? "post" : "pre";

    if (frameworkMode === "compare" && frameworkSection === "all") {
      const honestMean = pairsBySection("Honest").reduce((sum, pair) => sum + phaseRecord(pair, frameworkPhase).score, 0) / 25;
      const patienceMean = pairsBySection("Patience").reduce((sum, pair) => sum + phaseRecord(pair, frameworkPhase).score, 0) / 31;
      return `${frameworkPhase === "pre" ? "Pre-test" : "Post-test"} section means: Honest ${honestMean.toFixed(2)} vs Patience ${patienceMean.toFixed(2)} (out of 40).`;
    }

    const pairs = pairsBySection(frameworkSection);
    const meanCurrent = pairs.reduce((sum, pair) => sum + phaseRecord(pair, frameworkPhase).score, 0) / pairs.length;

    if (frameworkMode === "compare") {
      const meanOther = pairs.reduce((sum, pair) => sum + phaseRecord(pair, opposite).score, 0) / pairs.length;
      const delta = meanCurrent - meanOther;
      return `${sectionLabel(frameworkSection)}: ${frameworkPhase} mean ${meanCurrent.toFixed(2)} vs ${opposite} mean ${meanOther.toFixed(2)} (delta ${delta >= 0 ? "+" : ""}${delta.toFixed(2)}).`;
    }

    return `${sectionLabel(frameworkSection)}: ${frameworkPhase} mean ${meanCurrent.toFixed(2)} (out of 40).`;
  }, [frameworkMode, frameworkSection, frameworkPhase]);

  const evaluatorProfiles = useMemo(() => {
    const teachers = {
      key: "teachers",
      title: "Teachers + Master Teacher (LRMDS)",
      subtitle: "n=11; normalized to 5-point scale from Tables 4-6",
      labels: ["Content", "Instructional", "Technical"],
      values: researchData.qualityScores.slice(0, 3).map((row) => (row.score / row.max) * 5),
      color: "#23d7ba"
    };

    const it = {
      key: "it",
      title: "IT Expert (ISO 9621-1)",
      subtitle: "n=1; normalized to 5-point scale from Table 8",
      labels: researchData.itExpertScores.map((row) => row.label),
      values: researchData.itExpertScores.map((row) => (row.score / row.max) * 5),
      color: "#ffba52"
    };

    if (frameworkRole === "teachers") {
      return [teachers];
    }
    if (frameworkRole === "it") {
      return [it];
    }
    return frameworkMode === "compare" ? [teachers, it] : [teachers];
  }, [frameworkRole, frameworkMode]);

  const comparisonSeries = useMemo(() => {
    if (comparisonSource === "pre-post5") {
      return {
        nameA: "Pre",
        nameB: "Post Ch5",
        seriesA: researchData.pretest,
        seriesB: researchData.posttestChapter5Summary
      };
    }
    if (comparisonSource === "post4-post5") {
      return {
        nameA: "Post Ch4",
        nameB: "Post Ch5",
        seriesA: researchData.posttestChapter4,
        seriesB: researchData.posttestChapter5Summary
      };
    }
    return {
      nameA: "Pre",
      nameB: "Post Ch4",
      seriesA: researchData.pretest,
      seriesB: researchData.posttestChapter4
    };
  }, [comparisonSource]);

  const comparisonRows = useMemo(() => {
    const mapA = new Map(comparisonSeries.seriesA.map((row) => [row.label, row]));
    const mapB = new Map(comparisonSeries.seriesB.map((row) => [row.label, row]));

    return ratingOrder.map((label) => {
      const rowA = mapA.get(label) || { count: 0, percent: 0 };
      const rowB = mapB.get(label) || { count: 0, percent: 0 };

      const widthA = comparisonMetric === "percent"
        ? rowA.percent
        : ratioWidth(rowA.count, researchData.totalLearners);

      const widthB = comparisonMetric === "percent"
        ? rowB.percent
        : ratioWidth(rowB.count, researchData.totalLearners);

      const valueA = comparisonMetric === "percent"
        ? `${rowA.percent.toFixed(2)}% (${rowA.count})`
        : `${rowA.count} (${rowA.percent.toFixed(2)}%)`;

      const valueB = comparisonMetric === "percent"
        ? `${rowB.percent.toFixed(2)}% (${rowB.count})`
        : `${rowB.count} (${rowB.percent.toFixed(2)}%)`;

      const delta = comparisonMetric === "percent"
        ? rowB.percent - rowA.percent
        : rowB.count - rowA.count;

      return {
        label,
        widthA,
        widthB,
        valueA,
        valueB,
        delta
      };
    });
  }, [comparisonSeries, comparisonMetric]);

  const comparisonInsight = useMemo(() => {
    const maxUp = comparisonRows.reduce((prev, current) => (current.delta > prev.delta ? current : prev), comparisonRows[0]);
    const maxDown = comparisonRows.reduce((prev, current) => (current.delta < prev.delta ? current : prev), comparisonRows[0]);

    const unit = comparisonMetric === "percent" ? "pp" : "learners";
    const formatValue = (value) => (comparisonMetric === "percent" ? value.toFixed(2) : `${Math.round(value)}`);

    return `${comparisonSeries.nameA} to ${comparisonSeries.nameB}: largest increase is ${maxUp.label} (${maxUp.delta >= 0 ? "+" : ""}${formatValue(maxUp.delta)} ${unit}); largest decrease is ${maxDown.label} (${maxDown.delta >= 0 ? "+" : ""}${formatValue(maxDown.delta)} ${unit}).`;
  }, [comparisonRows, comparisonMetric, comparisonSeries]);

  const filteredLearners = useMemo(() => {
    const query = learnerSearch.trim().toUpperCase();
    const numeric = query.replace(/[^0-9]/g, "");

    return learnerPairs.filter((pair) => {
      const learnerUpper = pair.learner.toUpperCase();
      const queryMatch = !query || learnerUpper.includes(query) || (numeric && String(pair.number).includes(numeric));
      const ratingMatch = learnerRating === "all" || pair.post.rating === learnerRating;
      return queryMatch && ratingMatch;
    });
  }, [learnerSearch, learnerRating]);

  const learnerInsights = useMemo(() => {
    if (!filteredLearners.length) {
      return {
        avgPre: 0,
        avgPost: 0,
        meanGain: 0
      };
    }

    const avgPre = filteredLearners.reduce((sum, row) => sum + row.pre.percent, 0) / filteredLearners.length;
    const avgPost = filteredLearners.reduce((sum, row) => sum + row.post.percent, 0) / filteredLearners.length;
    const meanGain = filteredLearners.reduce((sum, row) => sum + (row.post.score - row.pre.score), 0) / filteredLearners.length;

    return { avgPre, avgPost, meanGain };
  }, [filteredLearners]);

  return (
    <div className="relative min-h-screen">
      <div className="app-grain" aria-hidden="true" />

      <header id="chapter-hero" className="relative z-10 flex min-h-[92vh] items-center px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-aqua">Undergraduate Thesis Visual Story</p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">
              Enhancing Numeracy Skills Of Grade 3 Learners Through PowerMathSaya
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              College of Education, Daet Camarines Norte. Scroll down for a continuous narrative from
              research context to charts, statistical results, and evaluator findings.
            </p>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Research Proponents</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {proponents.map((name) => (
                <span key={name} className="landing-pill rounded-full px-3 py-1.5 text-xs font-semibold text-ink">
                  {name}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => jumpToChapter("chapter-method")}
                className="rounded-full border border-aqua/40 bg-aqua/10 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-aqua transition hover:-translate-y-0.5 hover:bg-aqua/20"
              >
                Start Scroll Story
              </button>
              <button
                type="button"
                onClick={() => jumpToChapter("chapter-framework")}
                className="rounded-full border border-ink/20 bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-ink transition hover:-translate-y-0.5 hover:bg-white"
              >
                Jump To Charts
              </button>
            </div>

            <motion.p
              className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted"
              animate={reducedMotion ? undefined : { y: [0, 5, 0] }}
              transition={reducedMotion ? undefined : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Scroll To Explore Data
            </motion.p>
          </div>

          <aside className="glass-panel rounded-3xl p-5 sm:p-6">
            <h2 className="text-base font-semibold text-ink">Research Snapshot</h2>
            <p className="mt-2 text-sm text-muted">Simple essentials before diving into chapter-by-chapter analytics.</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["Learners", "56"],
                ["Evaluators", "12"],
                ["Paired t-test", "t(55) = 33.96"],
                ["Runtime", runtimeMode],
                ["Chapters", "3, 4, and 5"],
                ["Progress", `${Math.round(progress)}%`]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-ink/10 bg-white/75 p-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-muted">{label}</p>
                  <p className="mt-1.5 text-sm font-semibold text-ink">{value}</p>
                </div>
              ))}
            </div>
          </aside>
        </motion.div>
      </header>

      <div className="narrative-divider" aria-hidden="true" />

      <div className="sticky top-0 z-30 border-y border-ink/10 bg-[#f8fbffd9]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {chapters.map((chapter) => {
            const active = activeChapter === chapter.id;
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => jumpToChapter(chapter.id)}
                className={`whitespace-nowrap rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition ${
                  active
                    ? "border-aqua/60 bg-aqua/15 text-aqua"
                    : "border-ink/20 bg-white/80 text-muted hover:bg-white hover:text-ink"
                }`}
              >
                {chapter.label}
              </button>
            );
          })}
        </div>
        <div className="h-1 w-full bg-ink/10">
          <motion.div
            className="h-full bg-gradient-to-r from-aqua via-sky to-coral"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </div>
      </div>

      <main className="relative z-10 pb-20">
        <section id="chapter-method" className="chapter-shell">
          <Reveal>
            <h2 className="section-title">Chapter 3: Methodology Snapshot</h2>
            <p className="section-copy">
              Quantitative-Descriptive-Developmental-Evaluative design using ALNAT pretest-posttest,
              paired sample t-test, and evaluator-based quality assessment.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Participants", "56 Grade 3 learners from two sections."],
                ["Intervention Window", "4-week implementation from February to March 2025."],
                ["Core Instruments", "ALNAT pretest/posttest plus LRMDS and ISO 9621-1 evaluations."],
                ["Analysis", "Frequency, percentage, weighted mean, and paired t-test."]
              ].map(([title, copy]) => (
                <article key={title} className="glass-panel rounded-2xl p-4">
                  <h3 className="text-sm font-semibold text-ink">{title}</h3>
                  <p className="mt-2 text-sm text-muted">{copy}</p>
                </article>
              ))}
            </div>

            <ChapterActions chapterId="chapter-method" onJump={jumpToChapter} />
          </Reveal>
        </section>

        <section id="chapter-framework" className="chapter-shell">
          <Reveal>
            <h2 className="section-title">Computational Visualization and Performance Analytics Framework</h2>
            <p className="section-copy">
              Interactive analysis of ALNAT pre-post performance and evaluator results using section,
              phase, and role filters based on documented thesis values.
            </p>

            <div className="mt-8 grid gap-4 lg:grid-cols-4">
              <label className="glass-panel rounded-2xl p-4 text-sm">
                <span className="text-xs uppercase tracking-[0.1em] text-muted">Section Filter</span>
                <select
                  className={fieldClass}
                  value={frameworkSection}
                  onChange={(event) => setFrameworkSection(event.target.value)}
                >
                  <option value="all">All Learners (Aggregate 56)</option>
                  <option value="Honest">Grade 3-Honest (25)</option>
                  <option value="Patience">Grade 3-Patience (31)</option>
                </select>
              </label>

              <div className="glass-panel rounded-2xl p-4 text-sm">
                <span className="text-xs uppercase tracking-[0.1em] text-muted">Pre/Post Toggle</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["pre", "post"].map((phase) => (
                    <button
                      key={phase}
                      type="button"
                      onClick={() => setFrameworkPhase(phase)}
                      className={`pill-btn ${frameworkPhase === phase ? "pill-btn-active" : ""}`}
                    >
                      {phase === "pre" ? "Pre-test" : "Post-test"}
                    </button>
                  ))}
                </div>
              </div>

              <label className="glass-panel rounded-2xl p-4 text-sm">
                <span className="text-xs uppercase tracking-[0.1em] text-muted">Evaluator Role Filter</span>
                <select
                  className={fieldClass}
                  value={frameworkRole}
                  onChange={(event) => setFrameworkRole(event.target.value)}
                >
                  <option value="teachers">Teachers + Master Teacher</option>
                  <option value="it">IT Expert</option>
                  <option value="all">Teachers + IT Expert (Compare)</option>
                </select>
              </label>

              <div className="glass-panel rounded-2xl p-4 text-sm">
                <span className="text-xs uppercase tracking-[0.1em] text-muted">View Mode</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["focus", "compare"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        setFrameworkMode(mode);
                        if (mode === "focus" && frameworkRole === "all") {
                          setFrameworkRole("teachers");
                        }
                      }}
                      className={`pill-btn ${frameworkMode === mode ? "pill-btn-active" : ""}`}
                    >
                      {mode === "focus" ? "Focus" : "Compare"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <article className="glass-panel rounded-2xl p-4">
                <p className="text-[11px] uppercase tracking-[0.1em] text-muted">Matched Learners</p>
                <p className="mt-2 text-xl font-semibold">{frameworkKpis.learners}</p>
              </article>
              <article className="glass-panel rounded-2xl p-4">
                <p className="text-[11px] uppercase tracking-[0.1em] text-muted">Mean Score</p>
                <p className="mt-2 text-xl font-semibold">{frameworkKpis.meanScore.toFixed(2)} / 40</p>
              </article>
              <article className="glass-panel rounded-2xl p-4">
                <p className="text-[11px] uppercase tracking-[0.1em] text-muted">Weighted Mean (%)</p>
                <p className="mt-2 text-xl font-semibold">{frameworkKpis.weightedPercent.toFixed(2)}%</p>
              </article>
              <article className="glass-panel rounded-2xl p-4">
                <p className="text-[11px] uppercase tracking-[0.1em] text-muted">Top Frequency</p>
                <p className="mt-2 text-sm font-semibold">
                  {frameworkKpis.topLabel}: {frameworkKpis.topCount} ({frameworkKpis.topPercent.toFixed(2)}%)
                </p>
              </article>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <article className="glass-panel rounded-2xl p-4">
                <h3 className="text-base font-semibold">Paired Slopegraph: Pre-test To Post-test</h3>
                <p className="mt-2 text-sm text-muted">
                  Each line is one learner trajectory for paired sample interpretation.
                </p>

                <div className="mt-4 overflow-hidden rounded-xl border border-ink/15 bg-white/85">
                  <svg viewBox={`0 0 ${slopeGraph.width} ${slopeGraph.height}`} className="h-auto w-full" aria-hidden="true">
                    {slopeGraph.ticks.map((tick) => {
                      const y = slopeGraph.toY(tick);
                      return (
                        <g key={`tick-${tick}`}>
                          <line
                            x1={slopeGraph.xPre - 14}
                            y1={y}
                            x2={slopeGraph.xPost + 14}
                            y2={y}
                            stroke="rgba(31,42,55,0.14)"
                            strokeWidth="1"
                          />
                          <text x={slopeGraph.xPre - 20} y={y + 4} textAnchor="end" className="fill-muted text-[12px]">
                            {tick}
                          </text>
                        </g>
                      );
                    })}

                    <line
                      x1={slopeGraph.xPre}
                      y1={slopeGraph.yTop - 6}
                      x2={slopeGraph.xPre}
                      y2={slopeGraph.yBottom + 6}
                      stroke="rgba(31,42,55,0.26)"
                    />
                    <line
                      x1={slopeGraph.xPost}
                      y1={slopeGraph.yTop - 6}
                      x2={slopeGraph.xPost}
                      y2={slopeGraph.yBottom + 6}
                      stroke="rgba(31,42,55,0.26)"
                    />

                    <text x={slopeGraph.xPre} y={slopeGraph.yBottom + 24} textAnchor="middle" className="fill-ink text-[12px] font-semibold">
                      Pre-test
                    </text>
                    <text x={slopeGraph.xPost} y={slopeGraph.yBottom + 24} textAnchor="middle" className="fill-ink text-[12px] font-semibold">
                      Post-test
                    </text>

                    {slopeGraph.lines.map((line) => (
                      <g key={line.learner}>
                        <line
                          x1={slopeGraph.xPre}
                          y1={line.preY}
                          x2={slopeGraph.xPost}
                          y2={line.postY}
                          stroke={line.stroke}
                          strokeWidth="2"
                        />
                        <circle
                          cx={slopeGraph.xPre}
                          cy={line.preY}
                          r={frameworkPhase === "pre" ? 3.4 : 2.5}
                          fill={frameworkPhase === "pre" ? "#ffba52" : "#9fb3c0"}
                        />
                        <circle
                          cx={slopeGraph.xPost}
                          cy={line.postY}
                          r={frameworkPhase === "post" ? 3.4 : 2.5}
                          fill={frameworkPhase === "post" ? "#ffba52" : "#9fb3c0"}
                        />
                      </g>
                    ))}

                    <text x={slopeGraph.width / 2} y={slopeGraph.height - 10} textAnchor="middle" className="fill-muted text-[12px]">
                      {sectionLabel(frameworkSection)} | {frameworkPairs.length} learner trajectories
                    </text>
                  </svg>
                </div>

                <p className="mt-3 text-xs text-muted">
                  Paired sample test reference: t(55) = 33.96, mean difference = 19.14, 95% CI = 18.01 to 20.27.
                </p>
              </article>

              <article className="glass-panel rounded-2xl p-4">
                <h3 className="text-base font-semibold">Distribution Histogram With Overlay</h3>
                <p className="mt-2 text-sm text-muted">
                  Section-level ALNAT classification counts with optional opposite-phase outlines.
                </p>

                <div className="mt-4 overflow-hidden rounded-xl border border-ink/15 bg-white/85">
                  <svg viewBox={`0 0 ${histogram.width} ${histogram.height}`} className="h-auto w-full" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, idx) => {
                      const value = Math.round((histogram.maxCount / 4) * idx);
                      const y = histogram.margin.top + histogram.plotHeight - ((value / histogram.maxCount) * histogram.plotHeight);
                      return (
                        <g key={`hist-tick-${idx}`}>
                          <line
                            x1={histogram.margin.left}
                            y1={y}
                            x2={histogram.width - histogram.margin.right}
                            y2={y}
                            stroke="rgba(31,42,55,0.14)"
                          />
                          <text x={histogram.margin.left - 8} y={y + 4} textAnchor="end" className="fill-muted text-[12px]">
                            {value}
                          </text>
                        </g>
                      );
                    })}

                    <line
                      x1={histogram.margin.left}
                      y1={histogram.margin.top + histogram.plotHeight}
                      x2={histogram.width - histogram.margin.right}
                      y2={histogram.margin.top + histogram.plotHeight}
                      stroke="rgba(31,42,55,0.26)"
                    />

                    {histogram.bars.map((bar) => (
                      <g key={bar.key}>
                        <rect
                          x={bar.x}
                          y={bar.yCurrent}
                          width={histogram.barWidth}
                          height={bar.hCurrent}
                          fill={bar.color}
                        />
                        {histogram.compareOn ? (
                          <rect
                            x={bar.x + 1}
                            y={bar.yOverlay}
                            width={Math.max(histogram.barWidth - 2, 2)}
                            height={bar.hOverlay}
                            fill="none"
                            stroke="rgba(255,186,82,0.95)"
                            strokeWidth="1.5"
                            strokeDasharray="4 3"
                          />
                        ) : null}
                        <text
                          x={bar.x + (histogram.barWidth / 2)}
                          y={bar.yCurrent - 6}
                          textAnchor="middle"
                          className="fill-muted text-[12px]"
                        >
                          {bar.currentCount}
                        </text>
                      </g>
                    ))}

                    {ratingOrder.map((label, idx) => {
                      const x = histogram.margin.left + (idx * histogram.groupWidth) + (histogram.groupWidth / 2);
                      return (
                        <text key={`x-${label}`} x={x} y={histogram.height - 28} textAnchor="middle" className="fill-muted text-[11px]">
                          {label}
                        </text>
                      );
                    })}
                  </svg>
                </div>

                <p className="mt-3 text-xs text-muted">{histogramNote}</p>
              </article>
            </div>

            <article className="mt-4 glass-panel rounded-2xl p-4">
              <h3 className="text-base font-semibold">LRMDS and ISO Radar Comparison</h3>
              <p className="mt-2 text-sm text-muted">
                Teachers/Master Teacher scores use LRMDS totals; IT Expert uses ISO 9621-1 factor scores.
              </p>

              <div className={`mt-4 grid gap-4 ${evaluatorProfiles.length > 1 ? "xl:grid-cols-2" : "xl:grid-cols-1"}`}>
                {evaluatorProfiles.map((profile) => (
                  <RadarPanel key={profile.key} profile={profile} />
                ))}
              </div>
            </article>

            <ChapterActions chapterId="chapter-framework" onJump={jumpToChapter} />
          </Reveal>
        </section>

        <section id="chapter-baseline" className="chapter-shell">
          <Reveal>
            <h2 className="section-title">Chapter 4 Baseline: ALNAT Pretest</h2>
            <p className="section-copy">
              Before PowerMathSaya, all 56 learners were classified under Needs Major Support,
              establishing the intervention baseline.
            </p>

            <div className="mt-6 glass-panel rounded-2xl p-5">
              <div className="grid gap-3 sm:grid-cols-[220px_1fr_auto] sm:items-center">
                <p className="text-sm font-semibold">Needs Major Support</p>
                <div className="h-3 overflow-hidden rounded-full bg-ink/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-[#5f7d96] to-[#89a4b8]"
                  />
                </div>
                <p className="text-sm font-semibold">56 (100.00%)</p>
              </div>
            </div>

            <ChapterActions chapterId="chapter-baseline" onJump={jumpToChapter} />
          </Reveal>
        </section>

        <section id="chapter-intervention" className="chapter-shell">
          <Reveal>
            <h2 className="section-title">Intervention Design: PowerMathSaya 01-04</h2>
            <p className="section-copy">
              Four game-based files target least mastered competencies through tutorials,
              immediate feedback, rewards, and progressive challenge levels.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["PowerMathSaya01", "Foundation module for addition, subtraction, and multiplication with guided retry loops."],
                ["PowerMathSaya02", "Multiplication adventure with mandatory tutorial reinforcement before advancement."],
                ["PowerMathSaya03", "Treasure hunt progression using mixed operations and escalating word problems."],
                ["PowerMathSaya04", "Game-show style team challenge for geometry, patterns, and algebra."]
              ].map(([title, copy], index) => (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="glass-panel rounded-2xl bg-gradient-to-b from-amber/10 to-white p-4"
                >
                  <h3 className="text-base font-semibold text-ink">{title}</h3>
                  <p className="mt-2 text-sm text-muted">{copy}</p>
                </motion.article>
              ))}
            </div>

            <ChapterActions chapterId="chapter-intervention" onJump={jumpToChapter} />
          </Reveal>
        </section>

        <section id="chapter-comparison" className="chapter-shell">
          <Reveal>
            <h2 className="section-title">Comparison: Pretest Vs Posttest</h2>
            <p className="section-copy">
              The chart compares pretest values with Chapter 4 posttest details and Chapter 5 summary values
              to show movement and reporting differences.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {[
                  ["pre-post4", "Pre vs Ch4"],
                  ["pre-post5", "Pre vs Ch5"],
                  ["post4-post5", "Ch4 vs Ch5"]
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setComparisonSource(value)}
                    className={`pill-btn ${comparisonSource === value ? "pill-btn-active" : ""}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  ["count", "Count"],
                  ["percent", "Percent"]
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setComparisonMetric(value)}
                    className={`pill-btn ${comparisonMetric === value ? "pill-btn-active" : ""}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-ink/15 bg-sky/10 px-4 py-3 text-sm text-muted">
              <strong className="text-ink">Insight:</strong> {comparisonInsight}
            </div>

            <div className="mt-4 glass-panel rounded-2xl p-5">
              <div className="space-y-4">
                {comparisonRows.map((row) => (
                  <div key={row.label} className="grid gap-3 border-b border-ink/10 pb-4 last:border-b-0 last:pb-0 md:grid-cols-[190px_1fr]">
                    <p className="text-sm font-semibold text-ink">{row.label}</p>
                    <div className="space-y-2">
                      <div className="grid gap-3 sm:grid-cols-[120px_1fr_auto] sm:items-center">
                        <span className="text-[11px] uppercase tracking-[0.1em] text-muted">{comparisonSeries.nameA}</span>
                        <div className="h-2.5 overflow-hidden rounded-full bg-ink/10">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${row.widthA}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="h-full rounded-full bg-gradient-to-r from-[#6f89a0] to-[#9ab2c6]"
                          />
                        </div>
                        <span className="text-sm font-semibold text-ink">{row.valueA}</span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-[120px_1fr_auto] sm:items-center">
                        <span className="text-[11px] uppercase tracking-[0.1em] text-muted">{comparisonSeries.nameB}</span>
                        <div className="h-2.5 overflow-hidden rounded-full bg-ink/10">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${row.widthB}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.06 }}
                            className="h-full rounded-full bg-gradient-to-r from-aqua to-coral"
                          />
                        </div>
                        <span className="text-sm font-semibold text-ink">{row.valueB}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <article className="glass-panel rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-ink">Chapter 4 Detailed Posttest</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {researchData.posttestChapter4.map((row) => (
                    <li key={row.label} className="flex items-center justify-between border-b border-ink/10 pb-2 last:border-b-0 last:pb-0">
                      <span>{row.label}</span>
                      <strong className="text-ink">{row.count} ({row.percent.toFixed(2)}%)</strong>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="glass-panel rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-ink">Chapter 5 Summary Values</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {researchData.posttestChapter5Summary.map((row) => (
                    <li key={row.label} className="flex items-center justify-between border-b border-ink/10 pb-2 last:border-b-0 last:pb-0">
                      <span>{row.label}</span>
                      <strong className="text-ink">{row.count} ({row.percent.toFixed(2)}%)</strong>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="glass-panel rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-ink">Discrepancy Note</h3>
                <p className="mt-3 text-sm text-muted">
                  Chapter 4 reports 5 learners in Needs Major Support and 14 in Developing, while Chapter 5 summary
                  reports 4 and 19 respectively.
                </p>
                <p className="mt-3 text-sm text-muted">
                  This view intentionally keeps both values visible for transparent interpretation.
                </p>
              </article>
            </div>

            <ChapterActions chapterId="chapter-comparison" onJump={jumpToChapter} />
          </Reveal>
        </section>

        <section id="chapter-stats" className="chapter-shell">
          <Reveal>
            <h2 className="section-title">Statistical Evidence Of Improvement</h2>
            <p className="section-copy">
              Paired sample analysis indicates a strong, statistically significant increase in learner performance.
            </p>

            <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {[
                ["Pretest Mean (SD)", `${researchData.tTest.preMean.toFixed(2)} (${researchData.tTest.preSd.toFixed(2)})`],
                ["Posttest Mean (SD)", `${researchData.tTest.postMean.toFixed(2)} (${researchData.tTest.postSd.toFixed(2)})`],
                ["Mean Difference", researchData.tTest.meanDifference.toFixed(2)],
                ["Paired t-test", `t(55) = ${researchData.tTest.t.toFixed(2)}`],
                ["p-value", researchData.tTest.p],
                ["95% CI", researchData.tTest.ci]
              ].map(([label, value]) => (
                <article key={label} className="glass-panel rounded-2xl p-4">
                  <p className="text-[11px] uppercase tracking-[0.1em] text-muted">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
                </article>
              ))}
            </div>

            <ChapterActions chapterId="chapter-stats" onJump={jumpToChapter} />
          </Reveal>
        </section>

        <section id="chapter-quality" className="chapter-shell">
          <Reveal>
            <h2 className="section-title">Evaluation Results And Quality Scores</h2>
            <p className="section-copy">
              Teachers, master teacher, and an IT expert rated the material across content,
              instruction, technical quality, and software quality indicators.
            </p>

            <div className="mt-7 grid gap-4 xl:grid-cols-2">
              <article className="glass-panel rounded-2xl p-4">
                <h3 className="text-base font-semibold text-ink">LRMDS Evaluation Totals</h3>
                <div className="mt-4 space-y-3">
                  {researchData.qualityScores.map((row) => {
                    const width = ratioWidth(row.score, row.max);
                    return (
                      <div key={row.label} className="grid gap-2 sm:grid-cols-[180px_1fr_auto] sm:items-center">
                        <span className="text-sm text-muted">{row.label}</span>
                        <div className="h-2.5 overflow-hidden rounded-full bg-ink/10">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${width}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.75, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-aqua to-amber"
                          />
                        </div>
                        <strong className="text-sm text-ink">{row.score}/{row.max}</strong>
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="glass-panel rounded-2xl p-4">
                <h3 className="text-base font-semibold text-ink">IT Expert Scores</h3>
                <div className="mt-4 space-y-3">
                  {researchData.itExpertScores.map((row) => {
                    const width = ratioWidth(row.score, row.max);
                    return (
                      <div key={row.label} className="grid gap-2 sm:grid-cols-[180px_1fr_auto] sm:items-center">
                        <span className="text-sm text-muted">{row.label}</span>
                        <div className="h-2.5 overflow-hidden rounded-full bg-ink/10">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${width}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.75, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-sky to-coral"
                          />
                        </div>
                        <strong className="text-sm text-ink">{row.score}/{row.max}</strong>
                      </div>
                    );
                  })}
                </div>
              </article>
            </div>

            <ChapterActions chapterId="chapter-quality" onJump={jumpToChapter} />
          </Reveal>
        </section>

        <section id="chapter-recommendations" className="chapter-shell">
          <Reveal>
            <h2 className="section-title">Evaluator Recommendations</h2>
            <p className="section-copy">
              Ten recommendations were listed, led by adding real-life scenarios and reflective discussion prompts.
            </p>

            <div className="mt-7 grid gap-3 lg:grid-cols-2">
              {researchData.recommendations.map((item, index) => (
                <motion.article
                  key={`${item.text}-${index}`}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.03, duration: 0.4 }}
                  className="glass-panel rounded-2xl bg-gradient-to-br from-coral/10 to-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-ink">{item.text}</p>
                    <span className="rounded-full bg-white/15 px-2 py-1 text-xs font-semibold text-ink">x{item.frequency}</span>
                  </div>
                </motion.article>
              ))}
            </div>

            <ChapterActions chapterId="chapter-recommendations" onJump={jumpToChapter} />
          </Reveal>
        </section>

        <section id="chapter-learner-data" className="chapter-shell">
          <Reveal>
            <h2 className="section-title">Per-Learner Data Tables</h2>
            <p className="section-copy">
              Expand each table to inspect all 56 learner records from Chapter 4 pretest and posttest results.
            </p>

            <div className="mt-7 glass-panel rounded-2xl p-4">
              <div className="grid gap-3 lg:grid-cols-3">
                <label className="text-sm">
                  <span className="text-xs uppercase tracking-[0.1em] text-muted">Learner Search</span>
                  <input
                    type="search"
                    value={learnerSearch}
                    onChange={(event) => setLearnerSearch(event.target.value)}
                    placeholder="Type L18 or 18"
                    className={fieldClass}
                  />
                </label>

                <label className="text-sm">
                  <span className="text-xs uppercase tracking-[0.1em] text-muted">Posttest Rating</span>
                  <select
                    value={learnerRating}
                    onChange={(event) => setLearnerRating(event.target.value)}
                    className={fieldClass}
                  >
                    <option value="all">All Ratings</option>
                    <option value="Needs Major Support">Needs Major Support</option>
                    <option value="Emerging">Emerging</option>
                    <option value="Anchoring">Anchoring</option>
                    <option value="Developing">Developing</option>
                    <option value="Transforming">Transforming</option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setLearnerSearch("");
                    setLearnerRating("all");
                  }}
                  className="self-end rounded-xl border border-ink/20 bg-white/80 px-4 py-2 text-sm font-medium text-ink transition hover:bg-white"
                >
                  Reset Filters
                </button>
              </div>

              <p className="mt-4 text-sm text-muted">
                Showing {filteredLearners.length} of {learnerPairs.length} learners.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Matched Learners", `${filteredLearners.length}`],
                  ["Avg Pretest %", `${learnerInsights.avgPre.toFixed(2)}%`],
                  ["Avg Posttest %", `${learnerInsights.avgPost.toFixed(2)}%`],
                  ["Mean Score Gain", `${learnerInsights.meanGain >= 0 ? "+" : ""}${learnerInsights.meanGain.toFixed(2)}`]
                ].map(([label, value]) => (
                  <article key={label} className="rounded-xl border border-ink/15 bg-white/75 p-3">
                    <p className="text-[11px] uppercase tracking-[0.1em] text-muted">{label}</p>
                    <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4">
              <details open className="glass-panel rounded-2xl">
                <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-ink">
                  Table 1: ALNAT Pretest (Before PowerMathSaya)
                </summary>
                <div className="table-scroll overflow-x-auto border-t border-ink/10">
                  <table className="min-w-[680px] w-full text-left text-sm">
                    <thead className="bg-[#e3ebf4] text-ink">
                      <tr>
                        <th className="px-3 py-2">Learner</th>
                        <th className="px-3 py-2">Score</th>
                        <th className="px-3 py-2">Percent</th>
                        <th className="px-3 py-2">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLearners.length ? (
                        filteredLearners.map((pair, index) => (
                          <tr key={`pre-${pair.learner}`} className={index % 2 === 0 ? "bg-white/[0.02]" : ""}>
                            <td className="px-3 py-2 text-muted">{pair.pre.learner}</td>
                            <td className="px-3 py-2 text-muted">{pair.pre.score}</td>
                            <td className="px-3 py-2 text-muted">{pair.pre.percent.toFixed(2)}%</td>
                            <td className="px-3 py-2 text-muted">{pair.pre.rating}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-3 py-5 text-center text-muted">
                            No learners match the current filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </details>

              <details className="glass-panel rounded-2xl">
                <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-ink">
                  Table 2: Posttest (After PowerMathSaya)
                </summary>
                <div className="table-scroll overflow-x-auto border-t border-ink/10">
                  <table className="min-w-[680px] w-full text-left text-sm">
                    <thead className="bg-[#e3ebf4] text-ink">
                      <tr>
                        <th className="px-3 py-2">Learner</th>
                        <th className="px-3 py-2">Score</th>
                        <th className="px-3 py-2">Percent</th>
                        <th className="px-3 py-2">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLearners.length ? (
                        filteredLearners.map((pair, index) => (
                          <tr key={`post-${pair.learner}`} className={index % 2 === 0 ? "bg-white/[0.02]" : ""}>
                            <td className="px-3 py-2 text-muted">{pair.post.learner}</td>
                            <td className="px-3 py-2 text-muted">{pair.post.score}</td>
                            <td className="px-3 py-2 text-muted">{pair.post.percent.toFixed(2)}%</td>
                            <td className="px-3 py-2 text-muted">{pair.post.rating}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-3 py-5 text-center text-muted">
                            No learners match the current filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>

            <ChapterActions chapterId="chapter-learner-data" onJump={jumpToChapter} />
          </Reveal>
        </section>

        <section id="chapter-conclusion" className="chapter-shell">
          <Reveal>
            <div className="glass-panel rounded-2xl p-8 text-center">
              <h2 className="section-title">Conclusion</h2>
              <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
                Across the three chapters, the evidence points to substantial numeracy gains after
                PowerMathSaya, supported by strong statistical results and high evaluator ratings.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => jumpToChapter("chapter-hero")}
                  className="rounded-full border border-aqua/50 bg-aqua/15 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-aqua transition hover:-translate-y-0.5 hover:bg-aqua/30"
                >
                  Replay Research Story
                </button>
                <button
                  type="button"
                  onClick={() => jumpToChapter("chapter-framework")}
                  className="rounded-full border border-ink/20 bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-ink transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Jump To Analytics Framework
                </button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
