export const LUCKY7_CARD_TYPE = {
  low_high: {
    regex: ["low", "high"],
    type: "low_high",
  },
  series: {
    regex: '".*\\d+.*"',
    type: "series",
  },
  color: {
    regex: "({red}{black}?)",
    type: "color",
  },
  odd_Even: {
    regex: "({odd}{even}?)",
    type: "odd_Even",
  },
};
