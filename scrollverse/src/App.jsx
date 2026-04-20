import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { learnerPairs, ratingOrder, researchData } from "./data/researchData";

const TOTAL_SCORE = 40;

const chapters = [
  { id: "chapter-hero", label: "Intro" },
  { id: "chapter-framework", label: "Framework" },
  { id: "chapter-comparison", label: "Comparison" },
  { id: "chapter-learners", label: "Learners" },
  { id: "chapter-conclusion", label: "Conclusion" }
];

const proponents = [
  "Rizza Myr S. Cereno",
  "Arabella Arciga",
  "Cielo Sentin",
  "Dominic Heinrich Poblete"
];

const sectionOptions = [
  { value: "all", label: "All Learners", count: researchData.totalLearners },
  { value: "Honest", label: "Grade 3-Honest", count: researchData.sections.Honest },
  { value: "Patience", label: "Grade 3-Patience", count: researchData.sections.Patience }
];

const chartOptions = [
  { value: "slope", label: "Paired Slopegraph" },
  { value: "histogram", label: "Distribution Histogram" },
  { value: "radar", label: "Radar Profiles" }
];

const ratingTone = {
  "Needs Major Support": { background: "#fde8e7", border: "#f6c5c1", color: "#9c3e37" },
  Emerging: { background: "#fff1d9", border: "#f3d8a3", color: "#8e5e14" },
  Anchoring: { background: "#e9f2ff", border: "#c9defc", color: "#305f9f" },
  Developing: { background: "#e3f8f3", border: "#b6e8da", color: "#1c6f5e" },
  Transforming: { background: "#ece8ff", border: "#d5c7ff", color: "#4f3a9a" }
};

const histogramPalette = {
  "Needs Major Support": {
    fill: "#e25f50",
    chip: "#fde8e7"
  },
  Emerging: {
    fill: "#d69b34",
    chip: "#fff1d9"
  },
  Anchoring: {
    fill: "#4e83d0",
    chip: "#e9f2ff"
  },
  Developing: {
    fill: "#2b968e",
    chip: "#e3f8f3"
  },
  Transforming: {
    fill: "#7351cc",
    chip: "#ece8ff"
  }
};

const histogramLabelLines = {
  "Needs Major Support": ["Needs Major", "Support"],
  Emerging: ["Emerging"],
  Anchoring: ["Anchoring"],
  Developing: ["Developing"],
  Transforming: ["Transforming"]
};

const easeOut = [0.16, 1, 0.3, 1];

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

function Reveal({ children, reducedMotion, className = "" }) {
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.52, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

function ChapterActions({ chapterId, onJump }) {
  const next = chapterNext(chapterId);
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {next ? (
        <button
          type="button"
          onClick={() => onJump(next.id)}
          className="rounded-full border border-aqua/45 bg-aqua/10 px-4 py-2 text-xs font-semibold tracking-wide text-aqua transition hover:-translate-y-0.5 hover:bg-aqua/20"
        >
          Next: {next.label}
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => onJump("chapter-hero")}
        className="rounded-full border border-ink/20 bg-white px-4 py-2 text-xs font-semibold tracking-wide text-ink transition hover:-translate-y-0.5 hover:bg-white/90"
      >
        Back To Intro
      </button>
    </div>
  );
}

function StatCard({ title, value, subcopy }) {
  return (
    <article className="panel-glass rounded-2xl p-4">
      <p className="text-[11px] uppercase tracking-[0.12em] text-muted">{title}</p>
      <p className="mono-numeric mt-2 text-2xl font-semibold text-ink">{value}</p>
      {subcopy ? <p className="mt-1 text-xs text-muted">{subcopy}</p> : null}
    </article>
  );
}

function RatingPill({ label }) {
  const style = ratingTone[label] || { background: "#edf2f8", border: "#d1dae6", color: "#2a3340" };

  return (
    <span
      className="inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold"
      style={{
        backgroundColor: style.background,
        borderColor: style.border,
        color: style.color
      }}
    >
      {label}
    </span>
  );
}

function RadarPanel({ profile }) {
  const width = 360;
  const height = 320;
  const cx = 180;
  const cy = 160;
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
    <article className="rounded-2xl border border-ink/12 bg-white/85 p-4">
      <h4 className="text-sm font-semibold text-ink">{profile.title}</h4>
      <p className="mt-1 text-xs text-muted">{profile.subtitle}</p>
      <p className="mt-1 text-xs font-semibold text-ink">Mean: {meanScore.toFixed(2)} / 5</p>

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
          const labelPoint = radarPoint(cx, cy, maxRadius + 18, (360 / axisCount) * index);
          const anchor = labelPoint.x < cx - 8 ? "end" : labelPoint.x > cx + 8 ? "start" : "middle";
          return (
            <g key={`axis-${label}`}>
              <line
                x1={cx}
                y1={cy}
                x2={end.x.toFixed(2)}
                y2={end.y.toFixed(2)}
                stroke="rgba(31,42,55,0.2)"
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

        <motion.polygon
          points={polygon}
          fill={profile.color}
          fillOpacity="0.24"
          stroke={profile.color}
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0.22 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: easeOut }}
        />

        {vertices.map((point, index) => (
          <circle key={`vertex-${index}`} cx={point.x} cy={point.y} r="3" fill={profile.color} />
        ))}
      </svg>
    </article>
  );
}

function signed(value, digits = 2) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}`;
}

export default function App() {
  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const [activeChapter, setActiveChapter] = useState("chapter-hero");
  const [progress, setProgress] = useState(0);

  const [frameworkSection, setFrameworkSection] = useState("all");
  const [frameworkPhase, setFrameworkPhase] = useState("post");
  const [frameworkMode, setFrameworkMode] = useState("focus");
  const [frameworkRole, setFrameworkRole] = useState("teachers");
  const [frameworkChart, setFrameworkChart] = useState("slope");
  const [frameworkReplay, setFrameworkReplay] = useState(0);
  const [hoveredSlopeLearner, setHoveredSlopeLearner] = useState(null);

  const [comparisonSource, setComparisonSource] = useState("pre-post4");
  const [comparisonMetric, setComparisonMetric] = useState("count");

  const [learnerSearch, setLearnerSearch] = useState("");
  const [learnerSection, setLearnerSection] = useState("all");
  const [preRatingFilter, setPreRatingFilter] = useState("all");
  const [postRatingFilter, setPostRatingFilter] = useState("all");
  const [focusedLearner, setFocusedLearner] = useState("");
  const [tableView, setTableView] = useState("pre");

  const fieldClass = "mt-2 w-full rounded-xl border border-ink/20 bg-white px-3 py-2 text-sm text-ink outline-none ring-aqua/35 focus:ring";
  const pillClass = "rounded-full border border-ink/20 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted transition hover:border-aqua/45 hover:text-ink";

  const jumpToChapter = (chapterId) => {
    const node = document.getElementById(chapterId);
    if (!node) {
      return;
    }
    node.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start"
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY || document.documentElement.scrollTop;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const value = total > 0 ? Math.min((top / total) * 100, 100) : 0;
      setProgress(value);
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
        rootMargin: "-42% 0px -42% 0px",
        threshold: [0.08, 0.35, 0.62]
      }
    );

    chapters.forEach((chapter) => {
      const node = document.getElementById(chapter.id);
      if (node) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }

    const hero = document.getElementById("chapter-hero");
    if (hero) {
      hero.style.setProperty("--hero-mx", "50%");
      hero.style.setProperty("--hero-my", "42%");
    }

    const handlePointerMove = (event) => {
      if (event.pointerType === "touch") {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const button = target.closest("button");
      if (button) {
        const buttonRect = button.getBoundingClientRect();
        button.style.setProperty("--btn-x", `${event.clientX - buttonRect.left}px`);
        button.style.setProperty("--btn-y", `${event.clientY - buttonRect.top}px`);
      }

      if (!hero) {
        return;
      }

      const heroRect = hero.getBoundingClientRect();
      const pointerX = event.clientX - heroRect.left;
      const pointerY = event.clientY - heroRect.top;

      if (pointerX >= 0 && pointerY >= 0 && pointerX <= heroRect.width && pointerY <= heroRect.height) {
        hero.style.setProperty("--hero-mx", `${pointerX}px`);
        hero.style.setProperty("--hero-my", `${pointerY}px`);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [reducedMotion]);

  useEffect(() => {
    setHoveredSlopeLearner(null);
  }, [frameworkChart, frameworkSection, frameworkPhase, frameworkReplay]);

  const frameworkPairs = useMemo(() => pairsBySection(frameworkSection), [frameworkSection]);

  const frameworkKpis = useMemo(() => {
    const total = frameworkPairs.length;
    if (!total) {
      return {
        learners: 0,
        meanScore: 0,
        weightedPercent: 0,
        meanGain: 0,
        topLabel: "No data",
        topCount: 0
      };
    }

    const meanScore = frameworkPairs.reduce((sum, pair) => sum + phaseRecord(pair, frameworkPhase).score, 0) / total;
    const weightedPercent = frameworkPairs.reduce((sum, pair) => sum + phaseRecord(pair, frameworkPhase).percent, 0) / total;
    const meanGain = frameworkPairs.reduce((sum, pair) => sum + (pair.post.score - pair.pre.score), 0) / total;

    const counts = countsByRating(frameworkPairs, frameworkPhase);
    const top = counts.reduce((best, row) => (row.count > best.count ? row : best), counts[0]);

    return {
      learners: total,
      meanScore,
      weightedPercent,
      meanGain,
      topLabel: top.label,
      topCount: top.count
    };
  }, [frameworkPairs, frameworkPhase]);

  const slopeGraph = useMemo(() => {
    const width = 920;
    const height = 360;
    const margin = { top: 24, right: 94, bottom: 44, left: 94 };
    const xPre = margin.left;
    const xPost = width - margin.right;
    const yTop = margin.top;
    const yBottom = height - margin.bottom;

    const toY = (score) => yBottom - ((score / TOTAL_SCORE) * (yBottom - yTop));

    const lines = frameworkPairs.map((pair) => {
      const preY = toY(pair.pre.score);
      const postY = toY(pair.post.score);
      const delta = pair.post.score - pair.pre.score;

      return {
        learner: pair.learner,
        section: pair.section,
        preY,
        postY,
        preScore: pair.pre.score,
        postScore: pair.post.score,
        prePercent: pair.pre.percent,
        postPercent: pair.post.percent,
        preRating: pair.pre.rating,
        postRating: pair.post.rating,
        delta,
        stroke: delta < 0 ? "rgba(213,109,95,0.65)" : "rgba(47,158,154,0.62)"
      };
    });

    return {
      width,
      height,
      margin,
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
    const current = countsByRating(frameworkPairs, frameworkPhase);
    const oppositePhase = frameworkPhase === "pre" ? "post" : "pre";
    const opposite = countsByRating(frameworkPairs, oppositePhase);

    const maxCount = Math.max(
      1,
      ...current.map((row) => row.count),
      ...(frameworkMode === "compare" ? opposite.map((row) => row.count) : [])
    );

    const bins = ratingOrder.map((label, index) => {
      const currentCount = current[index].count;
      const oppositeCount = opposite[index].count;
      const currentPercent = frameworkPairs.length ? (currentCount / frameworkPairs.length) * 100 : 0;
      const oppositePercent = frameworkPairs.length ? (oppositeCount / frameworkPairs.length) * 100 : 0;
      const delta = currentCount - oppositeCount;
      const currentHeight = ratioWidth(currentCount, maxCount);
      const oppositeHeight = ratioWidth(oppositeCount, maxCount);
      const palette = histogramPalette[label] || histogramPalette.Anchoring;

      return {
        label,
        labelLines: histogramLabelLines[label] || [label],
        palette,
        currentCount,
        oppositeCount,
        currentPercent,
        oppositePercent,
        currentHeight: currentCount > 0 ? Math.max(currentHeight, 8) : 0,
        oppositeHeight: oppositeCount > 0 ? Math.max(oppositeHeight, 8) : 0,
        delta
      };
    });

    const topRow = bins.reduce((best, row) => (row.currentCount > best.currentCount ? row : best), bins[0]);
    const ticks = Array.from({ length: 5 }, (_, index) => Math.round((maxCount / 4) * index));

    return {
      maxCount,
      oppositePhase,
      bins,
      ticks,
      topRow
    };
  }, [frameworkPairs, frameworkPhase, frameworkMode]);

  const histogramInsight = useMemo(() => {
    if (!frameworkPairs.length) {
      return "No learner data available in this filter scope.";
    }

    const currentMean = frameworkPairs.reduce((sum, pair) => sum + phaseRecord(pair, frameworkPhase).score, 0) / frameworkPairs.length;

    if (frameworkMode === "compare") {
      const opposite = frameworkPhase === "pre" ? "post" : "pre";
      const otherMean = frameworkPairs.reduce((sum, pair) => sum + phaseRecord(pair, opposite).score, 0) / frameworkPairs.length;
      const delta = currentMean - otherMean;
      return `${sectionLabel(frameworkSection)}: ${frameworkPhase} mean ${currentMean.toFixed(2)} vs ${opposite} mean ${otherMean.toFixed(2)} (delta ${signed(delta, 2)}).`;
    }

    return `${sectionLabel(frameworkSection)} ${frameworkPhase} mean is ${currentMean.toFixed(2)} out of 40.`;
  }, [frameworkPairs, frameworkSection, frameworkPhase, frameworkMode]);

  const evaluatorProfiles = useMemo(() => {
    const teachers = {
      key: "teachers",
      title: "Teachers + Master Teacher (LRMDS)",
      subtitle: "n=11, normalized to 5-point scale",
      labels: ["Content", "Instructional", "Technical"],
      values: researchData.qualityScores.slice(0, 3).map((row) => (row.score / row.max) * 5),
      color: "#2f9e9a"
    };

    const it = {
      key: "it",
      title: "IT Expert (ISO 9621-1)",
      subtitle: "n=1, normalized to 5-point scale",
      labels: researchData.itExpertScores.map((row) => row.label),
      values: researchData.itExpertScores.map((row) => (row.score / row.max) * 5),
      color: "#c8872f"
    };

    if (frameworkRole === "teachers") {
      return [teachers];
    }
    if (frameworkRole === "it") {
      return [it];
    }
    return [teachers, it];
  }, [frameworkRole]);

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

      const delta = comparisonMetric === "percent"
        ? rowB.percent - rowA.percent
        : rowB.count - rowA.count;

      return {
        label,
        rowA,
        rowB,
        widthA,
        widthB,
        delta
      };
    });
  }, [comparisonSeries, comparisonMetric]);

  const comparisonInsight = useMemo(() => {
    if (!comparisonRows.length) {
      return "No comparison data available.";
    }

    const maxUp = comparisonRows.reduce((best, row) => (row.delta > best.delta ? row : best), comparisonRows[0]);
    const maxDown = comparisonRows.reduce((best, row) => (row.delta < best.delta ? row : best), comparisonRows[0]);
    const unit = comparisonMetric === "percent" ? "pp" : "learners";
    const digits = comparisonMetric === "percent" ? 2 : 0;

    return `${comparisonSeries.nameA} to ${comparisonSeries.nameB}: largest increase is ${maxUp.label} (${signed(maxUp.delta, digits)} ${unit}); largest decrease is ${maxDown.label} (${signed(maxDown.delta, digits)} ${unit}).`;
  }, [comparisonRows, comparisonMetric, comparisonSeries]);

  const learnerBase = useMemo(() => {
    const query = learnerSearch.trim().toUpperCase();
    const numeric = query.replace(/[^0-9]/g, "");

    return pairsBySection(learnerSection).filter((pair) => {
      if (!query) {
        return true;
      }

      const learner = pair.learner.toUpperCase();
      return learner.includes(query) || (numeric && String(pair.number).includes(numeric));
    });
  }, [learnerSearch, learnerSection]);

  const preRows = useMemo(() => {
    return learnerBase.filter((pair) => preRatingFilter === "all" || pair.pre.rating === preRatingFilter);
  }, [learnerBase, preRatingFilter]);

  const postRows = useMemo(() => {
    return learnerBase.filter((pair) => postRatingFilter === "all" || pair.post.rating === postRatingFilter);
  }, [learnerBase, postRatingFilter]);

  const learnerInsights = useMemo(() => {
    if (!learnerBase.length) {
      return {
        avgPre: 0,
        avgPost: 0,
        meanGain: 0
      };
    }

    const avgPre = learnerBase.reduce((sum, pair) => sum + pair.pre.percent, 0) / learnerBase.length;
    const avgPost = learnerBase.reduce((sum, pair) => sum + pair.post.percent, 0) / learnerBase.length;
    const meanGain = learnerBase.reduce((sum, pair) => sum + (pair.post.score - pair.pre.score), 0) / learnerBase.length;

    return { avgPre, avgPost, meanGain };
  }, [learnerBase]);

  const learnerDistribution = useMemo(() => {
    return {
      pre: countsByRating(learnerBase, "pre"),
      post: countsByRating(learnerBase, "post")
    };
  }, [learnerBase]);

  const maxGainAbs = useMemo(() => {
    if (!learnerBase.length) {
      return 1;
    }

    return Math.max(...learnerBase.map((pair) => Math.abs(pair.post.score - pair.pre.score)), 1);
  }, [learnerBase]);

  const chapterClass = (id) => (
    activeChapter === id
      ? "story-chapter-active ring-1 ring-aqua/35"
      : "story-chapter-inactive"
  );

  const chartKey = `${frameworkChart}-${frameworkReplay}-${frameworkMode}-${frameworkSection}-${frameworkPhase}-${frameworkRole}`;

  return (
    <div className="relative min-h-screen overflow-x-hidden text-ink">
      <div className="aurora-bg" aria-hidden="true" />

      <header
        id="chapter-hero"
        className={`landing-hero story-chapter relative z-10 px-4 pb-14 pt-16 sm:px-6 lg:px-8 ${chapterClass("chapter-hero")}`}
      >
        <Reveal reducedMotion={reducedMotion}>
          <div className="hero-grid mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aqua">PowerMathSaya Research Story</p>
              <h1 className="mt-4 max-w-5xl font-display text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">
                Interactive Visualization Of Grade 3 Numeracy Gains
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
                Built from documented thesis data using chapter-based storytelling, animated charts, and separated
                pre-test and post-test learner views for clearer interpretation.
              </p>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Research Proponents</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {proponents.map((name) => (
                  <span key={name} className="rounded-full border border-ink/15 bg-white/80 px-3 py-1.5 text-xs font-semibold text-ink">
                    {name}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => jumpToChapter("chapter-framework")}
                  className="rounded-full border border-aqua/45 bg-aqua/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-aqua transition hover:-translate-y-0.5 hover:bg-aqua/20"
                >
                  Explore Framework
                </button>
                <button
                  type="button"
                  onClick={() => jumpToChapter("chapter-learners")}
                  className="rounded-full border border-ink/20 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink transition hover:-translate-y-0.5 hover:bg-white/90"
                >
                  Jump To Learner Tables
                </button>
              </div>
            </div>

            <aside className="hero-snapshot panel-glass rounded-3xl p-5 sm:p-6">
              <h2 className="text-base font-semibold text-ink">Research Snapshot</h2>
              <p className="mt-2 text-sm text-muted">Quick defense-ready values before diving into charts.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["Learners", "56"],
                  ["Evaluators", "12"],
                  ["Mean Difference", `+${researchData.tTest.meanDifference.toFixed(2)}`],
                  ["Paired t-test", `t(55)=${researchData.tTest.t.toFixed(2)}`],
                  ["p-value", researchData.tTest.p],
                  ["Scroll Progress", `${Math.round(progress)}%`]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-ink/10 bg-white/85 p-3">
                    <p className="text-[11px] uppercase tracking-[0.1em] text-muted">{label}</p>
                    <p className="mono-numeric mt-1.5 text-sm font-semibold text-ink">{value}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </Reveal>
      </header>

      <div className="sticky top-0 z-30 border-y border-ink/10 bg-[#f4f9ffd8] backdrop-blur-md">
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
                    ? "border-aqua/60 bg-aqua/12 text-aqua"
                    : "border-ink/20 bg-white/80 text-muted hover:border-aqua/35 hover:text-ink"
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

      <main className="relative z-10 mx-auto max-w-7xl space-y-5 px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <section id="chapter-framework" className={`story-chapter panel-glass rounded-3xl p-5 sm:p-6 ${chapterClass("chapter-framework")}`}>
          <Reveal reducedMotion={reducedMotion}>
            <h2 className="font-display text-3xl leading-tight">Framework Dashboard</h2>
            <p className="mt-2 text-sm text-muted">
              Focus/compare controls, role filters, and animated chart transitions make interpretation presentation-ready.
            </p>

            <div className="mt-6 grid gap-4 lg:grid-cols-4">
              <label className="text-sm">
                <span className="text-xs uppercase tracking-[0.1em] text-muted">Section Filter</span>
                <select
                  className={fieldClass}
                  value={frameworkSection}
                  onChange={(event) => setFrameworkSection(event.target.value)}
                >
                  {sectionOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label} ({option.count})</option>
                  ))}
                </select>
              </label>

              <div className="text-sm">
                <span className="text-xs uppercase tracking-[0.1em] text-muted">Pre/Post Toggle</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["pre", "post"].map((phase) => (
                    <button
                      key={phase}
                      type="button"
                      onClick={() => setFrameworkPhase(phase)}
                      className={`${pillClass} ${frameworkPhase === phase ? "border-aqua/60 bg-aqua/10 text-aqua" : ""}`}
                    >
                      {phase === "pre" ? "Pre-test" : "Post-test"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-sm">
                <span className="text-xs uppercase tracking-[0.1em] text-muted">View Mode</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["focus", "compare"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFrameworkMode(mode)}
                      className={`${pillClass} ${frameworkMode === mode ? "border-aqua/60 bg-aqua/10 text-aqua" : ""}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <label className="text-sm">
                <span className="text-xs uppercase tracking-[0.1em] text-muted">Evaluator Role</span>
                <select
                  className={fieldClass}
                  value={frameworkRole}
                  onChange={(event) => setFrameworkRole(event.target.value)}
                >
                  <option value="teachers">Teachers + Master Teacher</option>
                  <option value="it">IT Expert</option>
                  <option value="all">Compare Teachers + IT</option>
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Chart Studio</span>
              {chartOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFrameworkChart(option.value)}
                  className={`${pillClass} ${frameworkChart === option.value ? "border-aqua/60 bg-aqua/10 text-aqua" : ""}`}
                >
                  {option.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setFrameworkReplay((value) => value + 1)}
                className="ml-auto rounded-full border border-ink/20 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted transition hover:border-aqua/35 hover:text-ink"
              >
                Replay Chart Transition
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard title="Matched Learners" value={`${frameworkKpis.learners}`} subcopy={sectionLabel(frameworkSection)} />
              <StatCard title="Mean Score" value={`${frameworkKpis.meanScore.toFixed(2)} / 40`} subcopy={`${frameworkPhase} phase`} />
              <StatCard title="Weighted Mean" value={`${frameworkKpis.weightedPercent.toFixed(2)}%`} subcopy="Percent score average" />
              <StatCard title="Mean Gain" value={signed(frameworkKpis.meanGain, 2)} subcopy={`${frameworkKpis.topLabel}: ${frameworkKpis.topCount}`} />
            </div>

            <article className="chart-shell mt-5 rounded-2xl border border-ink/12 bg-white/86 p-4">
              <AnimatePresence mode="wait">
                {frameworkChart === "slope" ? (
                  <motion.div
                    key={`slope-${chartKey}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.36, ease: easeOut }}
                  >
                    <h3 className="text-base font-semibold text-ink">Paired Slopegraph: Pre-test To Post-test</h3>
                    <p className="mt-1 text-sm text-muted">
                      Each line is one learner trajectory; green lines indicate gains while coral lines indicate decline. Hover any line or dot to inspect learner details.
                    </p>

                    <div className="relative mt-3 overflow-hidden rounded-xl border border-ink/12 bg-white/92">
                      <AnimatePresence>
                        {hoveredSlopeLearner ? (
                          <motion.div
                            className="pointer-events-none absolute right-3 top-3 z-20 w-[230px] rounded-xl border border-aqua/35 bg-white/95 p-3 shadow-soft backdrop-blur"
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: easeOut }}
                          >
                            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Learner Focus</p>
                            <p className="mono-numeric mt-1 text-sm font-semibold text-ink">
                              {hoveredSlopeLearner.learner} | Grade 3-{hoveredSlopeLearner.section}
                            </p>

                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                              <div className="rounded-lg border border-ink/12 bg-[#f8fbff] p-2">
                                <p className="font-semibold uppercase tracking-[0.06em] text-muted">Pre</p>
                                <p className="mono-numeric mt-1 text-ink">{hoveredSlopeLearner.preScore} / 40</p>
                                <p className="mono-numeric text-muted">{hoveredSlopeLearner.prePercent.toFixed(2)}%</p>
                              </div>
                              <div className="rounded-lg border border-ink/12 bg-[#f8fbff] p-2">
                                <p className="font-semibold uppercase tracking-[0.06em] text-muted">Post</p>
                                <p className="mono-numeric mt-1 text-ink">{hoveredSlopeLearner.postScore} / 40</p>
                                <p className="mono-numeric text-muted">{hoveredSlopeLearner.postPercent.toFixed(2)}%</p>
                              </div>
                            </div>

                            <p className={`mono-numeric mt-2 text-xs font-semibold ${hoveredSlopeLearner.delta >= 0 ? "text-aqua" : "text-coral"}`}>
                              Delta: {signed(hoveredSlopeLearner.delta, 0)} points
                            </p>
                            <p className="mt-1 text-[11px] text-muted">{hoveredSlopeLearner.preRating} to {hoveredSlopeLearner.postRating}</p>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>

                      <svg viewBox={`0 0 ${slopeGraph.width} ${slopeGraph.height}`} className="h-auto w-full" aria-hidden="true">
                        {slopeGraph.ticks.map((tick) => {
                          const y = slopeGraph.toY(tick);
                          return (
                            <g key={`slope-tick-${tick}`}>
                              <line
                                x1={slopeGraph.xPre - 16}
                                y1={y}
                                x2={slopeGraph.xPost + 16}
                                y2={y}
                                stroke="rgba(31,42,55,0.14)"
                              />
                              <text x={slopeGraph.xPre - 22} y={y + 4} textAnchor="end" className="fill-muted text-[11px]">
                                {tick}
                              </text>
                            </g>
                          );
                        })}

                        <line
                          x1={slopeGraph.xPre}
                          y1={slopeGraph.yTop - 4}
                          x2={slopeGraph.xPre}
                          y2={slopeGraph.yBottom + 4}
                          stroke="rgba(31,42,55,0.26)"
                        />
                        <line
                          x1={slopeGraph.xPost}
                          y1={slopeGraph.yTop - 4}
                          x2={slopeGraph.xPost}
                          y2={slopeGraph.yBottom + 4}
                          stroke="rgba(31,42,55,0.26)"
                        />

                        <text x={slopeGraph.xPre} y={slopeGraph.yBottom + 24} textAnchor="middle" className="fill-ink text-[12px] font-semibold">
                          Pre-test
                        </text>
                        <text x={slopeGraph.xPost} y={slopeGraph.yBottom + 24} textAnchor="middle" className="fill-ink text-[12px] font-semibold">
                          Post-test
                        </text>

                        {slopeGraph.lines.map((line, index) => {
                          const active = hoveredSlopeLearner?.learner === line.learner;
                          const muted = hoveredSlopeLearner && !active;
                          const tooltip = `${line.learner} | Grade 3-${line.section}\nPre: ${line.preScore}/40 (${line.prePercent.toFixed(2)}%) ${line.preRating}\nPost: ${line.postScore}/40 (${line.postPercent.toFixed(2)}%) ${line.postRating}\nDelta: ${signed(line.delta, 0)} points`;

                          return (
                            <g
                              key={line.learner}
                              onMouseEnter={() => setHoveredSlopeLearner(line)}
                              onMouseLeave={() => setHoveredSlopeLearner(null)}
                            >
                              <line
                                x1={slopeGraph.xPre}
                                y1={line.preY}
                                x2={slopeGraph.xPost}
                                y2={line.postY}
                                stroke="transparent"
                                strokeWidth="12"
                                strokeLinecap="round"
                              />

                              <motion.line
                                x1={slopeGraph.xPre}
                                y1={line.preY}
                                x2={slopeGraph.xPost}
                                y2={line.postY}
                                stroke={line.stroke}
                                strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0.2 }}
                                animate={{
                                  pathLength: 1,
                                  opacity: muted ? 0.2 : 1,
                                  strokeWidth: active ? 3.4 : 2
                                }}
                                transition={{
                                  pathLength: { duration: 0.52, delay: Math.min(index * 0.008, 0.42), ease: easeOut },
                                  opacity: { duration: 0.18, ease: "easeOut" },
                                  strokeWidth: { duration: 0.16, ease: "easeOut" }
                                }}
                              >
                                <title>{tooltip}</title>
                              </motion.line>

                              <circle
                                cx={slopeGraph.xPre}
                                cy={line.preY}
                                r={active ? 4.5 : frameworkPhase === "pre" ? 3.3 : 2.3}
                                fill={frameworkPhase === "pre" ? "#c8872f" : "#8ea2b6"}
                                opacity={muted ? 0.24 : 1}
                                style={{ transition: "opacity 140ms ease, r 140ms ease" }}
                              >
                                <title>{tooltip}</title>
                              </circle>

                              <circle
                                cx={slopeGraph.xPost}
                                cy={line.postY}
                                r={active ? 4.5 : frameworkPhase === "post" ? 3.3 : 2.3}
                                fill={frameworkPhase === "post" ? "#2f9e9a" : "#8ea2b6"}
                                opacity={muted ? 0.24 : 1}
                                style={{ transition: "opacity 140ms ease, r 140ms ease" }}
                              >
                                <title>{tooltip}</title>
                              </circle>
                            </g>
                          );
                        })}

                        <text x={slopeGraph.width / 2} y={slopeGraph.height - 8} textAnchor="middle" className="fill-muted text-[11px]">
                          {sectionLabel(frameworkSection)} | {frameworkPairs.length} paired records
                        </text>
                      </svg>
                    </div>
                  </motion.div>
                ) : null}

                {frameworkChart === "histogram" ? (
                  <motion.div
                    key={`hist-${chartKey}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.36, ease: easeOut }}
                  >
                    <h3 className="text-base font-semibold text-ink">Distribution Histogram</h3>
                    <p className="mt-1 text-sm text-muted">
                      {frameworkMode === "compare"
                        ? `Current ${frameworkPhase} bars with ${histogram.oppositePhase} dashed overlay.`
                        : `Current ${frameworkPhase} distribution for ${sectionLabel(frameworkSection)}.`}
                    </p>

                    <div className="mt-3 rounded-2xl border border-ink/12 bg-white p-4">
                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-5 rounded-full bg-aqua" />
                          {frameworkPhase === "pre" ? "Pre-test" : "Post-test"}
                        </span>

                        {frameworkMode === "compare" ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="h-2 w-5 rounded-full border border-amber/90 bg-amber/12" />
                            {histogram.oppositePhase === "pre" ? "Pre-test Overlay" : "Post-test Overlay"}
                          </span>
                        ) : null}

                        <span className="ml-auto rounded-full border border-ink/12 bg-[#f8fbff] px-2 py-1 text-[10px] text-ink">
                          Top Band: {histogram.topRow.label} ({histogram.topRow.currentCount})
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 lg:grid-cols-[40px_1fr]">
                        <div className="relative hidden h-[270px] lg:block">
                          {histogram.ticks.map((tick) => (
                            <span
                              key={`hist-y-${tick}`}
                              className="mono-numeric absolute right-0 -translate-y-1/2 text-[10px] font-semibold text-muted"
                              style={{ bottom: `${ratioWidth(tick, histogram.maxCount)}%` }}
                            >
                              {tick}
                            </span>
                          ))}
                        </div>

                        <div className="relative h-[300px] rounded-2xl border border-ink/12 bg-[#f9fcff] px-2 pb-2 pt-3 sm:px-3">
                          {histogram.ticks.map((tick) => (
                            <div
                              key={`hist-grid-${tick}`}
                              className="pointer-events-none absolute left-2 right-2 border-t border-dashed border-ink/14"
                              style={{ bottom: `calc(${ratioWidth(tick, histogram.maxCount)}% + 38px)` }}
                            />
                          ))}

                          <div className="relative z-10 grid h-full grid-cols-5 items-end gap-2 sm:gap-3">
                            {histogram.bins.map((bin, index) => (
                              <div key={`hist-bin-${bin.label}`} className="flex h-full flex-col items-center justify-end">
                                <div className="mono-numeric mb-1 text-[11px] font-semibold text-ink">
                                  {bin.currentCount}
                                </div>

                                <div className="relative flex h-[210px] w-full items-end justify-center">
                                  {frameworkMode === "compare" ? (
                                    <div
                                      className="absolute bottom-0 w-[74%] rounded-t-2xl border-2 border-dashed border-amber/85 bg-amber/12"
                                      style={{ height: `${bin.oppositeHeight}%` }}
                                    />
                                  ) : null}

                                  <motion.div
                                    className="relative z-10 w-[66%] rounded-t-2xl"
                                    style={{
                                      backgroundColor: bin.palette.fill
                                    }}
                                    initial={{ height: 0, opacity: 0.8 }}
                                    animate={{ height: `${bin.currentHeight}%`, opacity: 1 }}
                                    transition={{ duration: 0.58, delay: index * 0.08, ease: easeOut }}
                                  />
                                </div>

                                <div className="mt-2 min-h-[44px] text-center">
                                  {bin.labelLines.map((line) => (
                                    <p key={`${bin.label}-${line}`} className="text-[10px] font-semibold uppercase tracking-[0.04em] text-muted">
                                      {line}
                                    </p>
                                  ))}
                                  <p className="mono-numeric text-[10px] font-semibold text-ink/85">{bin.currentPercent.toFixed(1)}%</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {histogram.bins.map((bin) => (
                          <div
                            key={`hist-detail-${bin.label}`}
                            className="rounded-lg border border-ink/10 bg-white/88 px-2.5 py-2 text-[11px] text-muted"
                            style={{ backgroundColor: frameworkMode === "compare" ? undefined : bin.palette.chip }}
                          >
                            <span className="font-semibold text-ink">{bin.label}:</span> {bin.currentCount} learners ({bin.currentPercent.toFixed(1)}%)
                            {frameworkMode === "compare"
                              ? ` | ${histogram.oppositePhase}: ${bin.oppositeCount} (${bin.oppositePercent.toFixed(1)}%) | Delta ${signed(bin.delta, 0)}`
                              : ""}
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-muted">{histogramInsight}</p>
                  </motion.div>
                ) : null}

                {frameworkChart === "radar" ? (
                  <motion.div
                    key={`radar-${chartKey}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.36, ease: easeOut }}
                  >
                    <h3 className="text-base font-semibold text-ink">Radar Profile Charts</h3>
                    <p className="mt-1 text-sm text-muted">
                      LRMDS and ISO-based evaluator dimensions normalized to a 5-point profile for fast comparison.
                    </p>

                    <div className={`mt-4 grid gap-4 ${evaluatorProfiles.length > 1 ? "xl:grid-cols-2" : "xl:grid-cols-1"}`}>
                      {evaluatorProfiles.map((profile) => (
                        <RadarPanel key={profile.key} profile={profile} />
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </article>

            <ChapterActions chapterId="chapter-framework" onJump={jumpToChapter} />
          </Reveal>
        </section>

        <section id="chapter-comparison" className={`story-chapter panel-glass rounded-3xl p-5 sm:p-6 ${chapterClass("chapter-comparison")}`}>
          <Reveal reducedMotion={reducedMotion}>
            <h2 className="font-display text-3xl leading-tight">Chapter Comparison Layer</h2>
            <p className="mt-2 text-sm text-muted">
              Compare pre-test, Chapter 4 post-test detail, and Chapter 5 summary in one consistent view.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
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
                    className={`${pillClass} ${comparisonSource === value ? "border-aqua/60 bg-aqua/10 text-aqua" : ""}`}
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
                    className={`${pillClass} ${comparisonMetric === value ? "border-aqua/60 bg-aqua/10 text-aqua" : ""}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-aqua/20 bg-aqua/5 px-4 py-3 text-sm text-muted">
              <strong className="text-ink">Insight:</strong> {comparisonInsight}
            </div>

            <div className="mt-4 rounded-2xl border border-ink/12 bg-white/82 p-4">
              <div className="space-y-4">
                {comparisonRows.map((row) => (
                  <div key={`comparison-${row.label}`} className="grid gap-3 border-b border-ink/10 pb-4 last:border-b-0 last:pb-0 md:grid-cols-[200px_1fr]">
                    <p className="text-sm font-semibold text-ink">{row.label}</p>

                    <div className="space-y-2">
                      <div className="grid gap-3 sm:grid-cols-[120px_1fr_auto] sm:items-center">
                        <span className="text-[11px] uppercase tracking-[0.1em] text-muted">{comparisonSeries.nameA}</span>
                        <div className="h-2.5 overflow-hidden rounded-full bg-ink/10">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${row.widthA}%` }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.65, ease: easeOut }}
                            className="h-full rounded-full bg-gradient-to-r from-[#6f879d] to-[#9cb2c6]"
                          />
                        </div>
                        <span className="mono-numeric text-sm font-semibold text-ink">
                          {comparisonMetric === "percent"
                            ? `${row.rowA.percent.toFixed(2)}% (${row.rowA.count})`
                            : `${row.rowA.count} (${row.rowA.percent.toFixed(2)}%)`}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-[120px_1fr_auto] sm:items-center">
                        <span className="text-[11px] uppercase tracking-[0.1em] text-muted">{comparisonSeries.nameB}</span>
                        <div className="h-2.5 overflow-hidden rounded-full bg-ink/10">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${row.widthB}%` }}
                            viewport={{ once: true, amount: 0.6 }}
                            transition={{ duration: 0.65, delay: 0.06, ease: easeOut }}
                            className="h-full rounded-full bg-gradient-to-r from-aqua to-coral"
                          />
                        </div>
                        <span className="mono-numeric text-sm font-semibold text-ink">
                          {comparisonMetric === "percent"
                            ? `${row.rowB.percent.toFixed(2)}% (${row.rowB.count})`
                            : `${row.rowB.count} (${row.rowB.percent.toFixed(2)}%)`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ChapterActions chapterId="chapter-comparison" onJump={jumpToChapter} />
          </Reveal>
        </section>

        <section id="chapter-learners" className={`story-chapter panel-glass rounded-3xl p-5 sm:p-6 ${chapterClass("chapter-learners")}`}>
          <Reveal reducedMotion={reducedMotion}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-3xl leading-tight">Per-Learner Data Tables</h2>
                <p className="mt-2 text-sm text-muted">
                  Designed for instant understanding: before-and-after tables, clear movement cues, and focus snapshots per learner.
                </p>
              </div>

              <span className="rounded-full border border-aqua/20 bg-aqua/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-aqua">
                Before (Pre-test) {"->"} After (Post-test)
              </span>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-5">
              <label className="text-sm lg:col-span-2">
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
                <span className="text-xs uppercase tracking-[0.1em] text-muted">Section</span>
                <select className={fieldClass} value={learnerSection} onChange={(event) => setLearnerSection(event.target.value)}>
                  {sectionOptions.map((option) => (
                    <option key={`learner-${option.value}`} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="text-xs uppercase tracking-[0.1em] text-muted">Pre-test Rating</span>
                <select className={fieldClass} value={preRatingFilter} onChange={(event) => setPreRatingFilter(event.target.value)}>
                  <option value="all">All</option>
                  {ratingOrder.map((label) => (
                    <option key={`pre-filter-${label}`} value={label}>{label}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="text-xs uppercase tracking-[0.1em] text-muted">Post-test Rating</span>
                <select className={fieldClass} value={postRatingFilter} onChange={(event) => setPostRatingFilter(event.target.value)}>
                  <option value="all">All</option>
                  {ratingOrder.map((label) => (
                    <option key={`post-filter-${label}`} value={label}>{label}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setLearnerSearch("");
                  setLearnerSection("all");
                  setPreRatingFilter("all");
                  setPostRatingFilter("all");
                  setFocusedLearner("");
                }}
                className="rounded-full border border-ink/20 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted transition hover:border-aqua/35 hover:text-ink"
              >
                Reset Learner Filters
              </button>

              {focusedLearner ? (
                <button
                  type="button"
                  onClick={() => setFocusedLearner("")}
                  className="rounded-full border border-aqua/40 bg-aqua/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-aqua transition hover:bg-aqua/20"
                >
                  Clear Focus ({focusedLearner})
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => setTableView("pre")}
                className={`${pillClass} ${tableView === "pre" ? "border-aqua/60 bg-aqua/10 text-aqua" : ""}`}
              >
                Show Pre-test Table
              </button>

              <button
                type="button"
                onClick={() => setTableView("post")}
                className={`${pillClass} ${tableView === "post" ? "border-aqua/60 bg-aqua/10 text-aqua" : ""}`}
              >
                Show Post-test Table
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard title="Matched Learners" value={`${learnerBase.length}`} subcopy={sectionLabel(learnerSection)} />
              <StatCard title="Avg Pretest" value={`${learnerInsights.avgPre.toFixed(2)}%`} subcopy="Current filtered base" />
              <StatCard title="Avg Posttest" value={`${learnerInsights.avgPost.toFixed(2)}%`} subcopy="Current filtered base" />
              <StatCard title="Mean Score Gain" value={signed(learnerInsights.meanGain, 2)} subcopy="Post - Pre" />
            </div>

            <div className="mt-4">
              <article className={`learner-table-card pre-table-card rounded-2xl border border-ink/12 bg-white/84 p-4 ${tableView === "pre" ? "" : "hidden"}`}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-ink">Pre-test Table (Separated)</h3>
                  <span className="mono-numeric rounded-full border border-ink/12 bg-white px-2 py-1 text-xs text-muted">{preRows.length} rows</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {learnerDistribution.pre.map((row) => (
                    row.count ? (
                      <span key={`pre-count-${row.label}`} className="table-mini-pill">
                        {row.label}: {row.count}
                      </span>
                    ) : null
                  ))}
                </div>

                <div className="table-scroll mt-3 max-h-[430px] overflow-auto rounded-xl border border-ink/12">
                  <table className="min-w-[680px] w-full text-left text-sm">
                    <thead className="sticky top-0 z-10 bg-[#dbe8f5] text-ink">
                      <tr>
                        <th className="px-3 py-2">#</th>
                        <th className="px-3 py-2">Learner</th>
                        <th className="px-3 py-2">Section</th>
                        <th className="px-3 py-2">Score</th>
                        <th className="px-3 py-2">Percent</th>
                        <th className="px-3 py-2">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preRows.length ? (
                        preRows.map((pair, index) => {
                          const focused = focusedLearner === pair.learner;

                          return (
                            <tr
                              key={`pre-row-${pair.learner}`}
                              onClick={() => setFocusedLearner(pair.learner)}
                              className={`${focused ? "learner-row-focus" : index % 2 === 0 ? "bg-white" : "bg-[#f8fbff]"} cursor-pointer transition-colors hover:bg-[#eef6ff]`}
                            >
                              <td className="mono-numeric px-3 py-2 text-muted">{index + 1}</td>
                              <td className="mono-numeric px-3 py-2 font-semibold text-ink">{pair.pre.learner}</td>
                              <td className="px-3 py-2 text-muted">{pair.section}</td>
                              <td className="mono-numeric px-3 py-2 text-muted">{pair.pre.score}</td>
                              <td className="mono-numeric px-3 py-2 text-muted">{pair.pre.percent.toFixed(2)}%</td>
                              <td className="px-3 py-2"><RatingPill label={pair.pre.rating} /></td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-3 py-5 text-center text-muted">No pre-test rows match the active filters.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className={`learner-table-card post-table-card rounded-2xl border border-ink/12 bg-white/84 p-4 ${tableView === "post" ? "" : "hidden"}`}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-ink">Post-test Table (Separated)</h3>
                  <span className="mono-numeric rounded-full border border-ink/12 bg-white px-2 py-1 text-xs text-muted">{postRows.length} rows</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {learnerDistribution.post.map((row) => (
                    row.count ? (
                      <span key={`post-count-${row.label}`} className="table-mini-pill">
                        {row.label}: {row.count}
                      </span>
                    ) : null
                  ))}
                </div>

                <div className="table-scroll mt-3 max-h-[430px] overflow-auto rounded-xl border border-ink/12">
                  <table className="min-w-[860px] w-full text-left text-sm">
                    <thead className="sticky top-0 z-10 bg-[#dbe8f5] text-ink">
                      <tr>
                        <th className="px-3 py-2">#</th>
                        <th className="px-3 py-2">Learner</th>
                        <th className="px-3 py-2">Section</th>
                        <th className="px-3 py-2">Score</th>
                        <th className="px-3 py-2">Percent</th>
                        <th className="px-3 py-2">Rating</th>
                        <th className="px-3 py-2">Gain</th>
                        <th className="px-3 py-2">Movement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {postRows.length ? (
                        postRows.map((pair, index) => {
                          const focused = focusedLearner === pair.learner;
                          const gain = pair.post.score - pair.pre.score;

                          return (
                            <tr
                              key={`post-row-${pair.learner}`}
                              onClick={() => setFocusedLearner(pair.learner)}
                              className={`${focused ? "learner-row-focus" : index % 2 === 0 ? "bg-white" : "bg-[#f8fbff]"} cursor-pointer transition-colors hover:bg-[#eef6ff]`}
                            >
                              <td className="mono-numeric px-3 py-2 text-muted">{index + 1}</td>
                              <td className="mono-numeric px-3 py-2 font-semibold text-ink">{pair.post.learner}</td>
                              <td className="px-3 py-2 text-muted">{pair.section}</td>
                              <td className="mono-numeric px-3 py-2 text-muted">{pair.post.score}</td>
                              <td className="mono-numeric px-3 py-2 text-muted">{pair.post.percent.toFixed(2)}%</td>
                              <td className="px-3 py-2"><RatingPill label={pair.post.rating} /></td>
                              <td className="px-3 py-2">
                                <div className="space-y-1">
                                  <span className={`mono-numeric text-sm font-semibold ${gain >= 0 ? "text-aqua" : "text-coral"}`}>
                                    {signed(gain, 0)}
                                  </span>
                                  <div className="gain-track">
                                    <div
                                      className={`h-full rounded-full ${gain >= 0 ? "bg-gradient-to-r from-aqua to-sky" : "bg-gradient-to-r from-coral to-amber"}`}
                                      style={{ width: `${ratioWidth(Math.abs(gain), maxGainAbs)}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-2 text-xs text-muted">
                                  <span className="rounded-full border border-ink/10 bg-white px-2 py-1">
                                    {pair.pre.rating} {"->"} {pair.post.rating}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-3 py-5 text-center text-muted">No post-test rows match the active filters.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </article>
            </div>

            <ChapterActions chapterId="chapter-learners" onJump={jumpToChapter} />
          </Reveal>
        </section>

        <section id="chapter-conclusion" className={`story-chapter panel-glass rounded-3xl p-8 text-center ${chapterClass("chapter-conclusion")}`}>
          <Reveal reducedMotion={reducedMotion}>
            <h2 className="font-display text-4xl leading-tight">Conclusion</h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              The complete visualization now follows a chapter-driven research narrative with transition-rich charts,
              comparison controls, and fully separated pre-test/post-test tables to avoid confusion during defense and reporting.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => jumpToChapter("chapter-hero")}
                className="rounded-full border border-aqua/45 bg-aqua/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-aqua transition hover:-translate-y-0.5 hover:bg-aqua/20"
              >
                Replay Story
              </button>
              <button
                type="button"
                onClick={() => jumpToChapter("chapter-framework")}
                className="rounded-full border border-ink/20 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                Back To Framework
              </button>
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}