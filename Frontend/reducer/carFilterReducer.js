export const initialState = {
  price: [0, 30000],
  km: [0, 500000],
  year: [2000, 2030],
  engineSize: [0, 5000],
  body: "Any Body",
  bodies: [],
  make: "Any Make",
  makes: [],
  model: "Any Model",
  models: [],
  fuel: "Any Fuel",
  fuels: [],
  transmission: "Any Transmission",
  transmissions: [],
  location: "Any Location",
  locations: [],
  door: "Any Door",
  cylinder: "Any Cylinder",
  units: "Any Units",
  units_list: [],
  color: "Any Color",
  exterior_color: "Any Color",
  exterior_colors: [],
  condition: "Any Condition",
  conditions: [],
  search: "",
  vin_number: "",
  features: [],
  filtered: [],
  sortingOption: "Sort by (Default)",
  sorted: [],
  currentPage: 1,
  itemPerPage: 6,
};

export function reducer(state, action) {
  switch (action.type) {
    case "SET_INITIAL_CARS":
      return {
        ...state,
        filtered: action.payload,
        sorted: action.payload,
      };

    case "SET_PRICE":
      return { ...state, price: action.payload };
    case "SET_YEAR":
      return { ...state, year: action.payload };
    case "SET_ENGINE_SIZE":
      return { ...state, engineSize: action.payload };
    case "SET_KM":
      return { ...state, km: action.payload };
    case "SET_MODEL":
      return { ...state, model: action.payload };
    case "SET_MODELS":
      return { ...state, models: action.payload };
    case "SET_BODY":
      return { ...state, body: action.payload };
    case "SET_BODIES":
      return { ...state, bodies: action.payload };
    case "SET_MAKE":
      return { ...state, make: action.payload };
    case "SET_MAKES":
      return { ...state, makes: action.payload };
    case "SET_FUEL":
      return { ...state, fuel: action.payload };
    case "SET_FUELS":
      return { ...state, fuels: action.payload };
    case "SET_TRANSMISSION":
      return { ...state, transmission: action.payload };
    case "SET_TRANSMISSIONS":
      return { ...state, transmissions: action.payload };
    case "SET_LOCATION":
      return { ...state, location: action.payload };
    case "SET_LOCATIONS":
      return { ...state, locations: action.payload };
    case "SET_DOOR":
      return { ...state, door: action.payload };
    case "SET_CYLINDER":
      return { ...state, cylinder: action.payload };
    case "SET_UNITS":
      return { ...state, units: action.payload };
    case "SET_UNITS_LIST":
      return { ...state, units_list: action.payload };
    case "SET_EXTERIOR_COLOR":
      return { ...state, exterior_color: action.payload };
    case "SET_EXTERIOR_COLORS":
      return { ...state, exterior_colors: action.payload };
    case "SET_CONDITION":
      return { ...state, condition: action.payload };
    case "SET_CONDITIONS":
      return { ...state, conditions: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_VIN_NUMBER":
      return { ...state, vin_number: action.payload };
    case "SET_FEATURES":
      return { ...state, features: action.payload };
    case "SET_FILTERED":
      return { ...state, filtered: [...action.payload] };
    case "SET_SORTING_OPTION":
      return { ...state, sortingOption: action.payload };
    case "SET_SORTED":
      return { ...state, sorted: [...action.payload] };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_ITEM_PER_PAGE":
      return { ...state, itemPerPage: action.payload };
    case "CLEAR_FILTER":
      return {
        ...state,
        price: [0, 30000],
        km: [0, 500000],
        year: [2000, 2030],
        engineSize: [0, 5000],
        body: "Any Body",
        bodies: [],
        make: "Any Make",
        makes: [],
        model: "Any Model",
        models: [],
        fuel: "Any Fuel",
        fuels: [],
        transmission: "Any Transmission",
        transmissions: [],
        location: "Any Location",
        locations: [],
        door: "Any Door",
        cylinder: "Any Cylinder",
        units: "Any Units",
        units_list: [],
        color: "Any Color",
        exterior_color: "Any Color",
        exterior_colors: [],
        condition: "Any Condition",
        conditions: [],
        search: "",
        vin_number: "",
        features: [],
      };
    default:
      return state;
  }
}

