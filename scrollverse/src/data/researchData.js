export const ratingOrder = [
  "Needs Major Support",
  "Emerging",
  "Anchoring",
  "Developing",
  "Transforming"
];

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

export const researchData = {
  totalLearners: 56,
  sections: {
    Honest: 25,
    Patience: 31
  },
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
  tTest: {
    preMean: 13.79,
    preSd: 3.65,
    postMean: 32.93,
    postSd: 2.6,
    t: 33.96,
    meanDifference: 19.14,
    p: "< .001",
    ci: "18.01 to 20.27"
  },
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

export function parseLearnerRows(rawRows) {
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

export function learnerIdNumber(label) {
  return Number(String(label).replace(/[^0-9]/g, ""));
}

export function sectionFromLearnerNumber(number) {
  return number <= 25 ? "Honest" : "Patience";
}

export const pretestLearners = parseLearnerRows(pretestRowsRaw);
export const posttestLearners = parseLearnerRows(posttestRowsRaw);

const posttestByNumber = new Map(posttestLearners.map((row) => [learnerIdNumber(row.learner), row]));

export const learnerPairs = pretestLearners
  .map((pre) => {
    const number = learnerIdNumber(pre.learner);
    return {
      number,
      learner: `L${number}`,
      section: sectionFromLearnerNumber(number),
      pre,
      post: posttestByNumber.get(number) || null
    };
  })
  .filter((row) => row.post !== null)
  .sort((a, b) => a.number - b.number);
