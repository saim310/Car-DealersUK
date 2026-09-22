const allMakeOptions = ["Audi", "Dongfeng", "BMW"];

const allModelOptionsByMake = {
  Audi: ["A4", "A6", "Q5", "Q7"],
  Dongfeng: ["Almera", "Carnival", "H30", "AX7"],
  BMW: ["3 Series", "5 Series", "X3", "X5"],
};

// Admin settings: change these values to control how many makes and models show in the filter.
export const MAX_MAKE_OPTIONS = 3;
export const MAX_MODEL_OPTIONS_BY_MAKE = {
  Audi: 4,
  Dongfeng: 4,
  BMW: 4,
};

export const makeOptions = [
  "Any Make",
  ...allMakeOptions.slice(0, MAX_MAKE_OPTIONS),
];

export const modelOptionsByMake = Object.fromEntries(
  Object.entries(allModelOptionsByMake).map(([make, models]) => [
    make,
    [
      "Any Model",
      ...models.slice(0, MAX_MODEL_OPTIONS_BY_MAKE[make] ?? models.length),
    ],
  ]),
);

// Admin can update MAX_MAKE_OPTIONS and MAX_MODEL_OPTIONS_BY_MAKE
// to decide how many makes appear and how many models each make delivers.
