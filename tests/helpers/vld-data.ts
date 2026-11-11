export const VLD_BASE_URL =
  'https://vld-journey-new-e1a10c28e699.herokuapp.com';

export const VLD_PATHS = {
  aboutYourVan: '/compare-van-insurance/about-your-van',
  recallLogin: '/user-area/login',
} as const;

/** Registration journey — quote 1 (SK14 returns a single match; PF54KXU needs edition pick — see vld-quote-pf54kxu.spec.ts) */
export const QUOTE_1_REGISTRATION = 'SK14 YOo';

/** Make / model journey — quote 2 */
export const QUOTE_2_MAKE = 'Ford';
export const QUOTE_2_MODEL_SEARCH = 'Tra';
export const QUOTE_2_MODEL_OPTION = /Transit/i;

export type JourneyProfile = {
  firstName: string;
  surname: string;
  email: string;
  dob: { day: string; month: string; year: string };
};

export const QUOTE_1_PROFILE: JourneyProfile = {
  firstName: 'TestQA',
  surname: 'TestSurname',
  email: 'testqa-reg@example.com',
  dob: { day: '15', month: 'January', year: '1995' },
};

export const QUOTE_2_PROFILE: JourneyProfile = {
  firstName: 'TestMM',
  surname: 'TestMakeModel',
  email: 'testqa-make@example.com',
  dob: { day: '20', month: 'March', year: '1990' },
};

export const RECALL_1 = {
  surname: QUOTE_1_PROFILE.surname,
  postcode: 'GU14DA',
  email: QUOTE_1_PROFILE.email,
  dob: QUOTE_1_PROFILE.dob,
};

export const RECALL_2 = {
  surname: QUOTE_2_PROFILE.surname,
  postcode: 'GU14DA',
  email: QUOTE_2_PROFILE.email,
  dob: QUOTE_2_PROFILE.dob,
};

export const VAN_DETAILS = {
  purchaseYear: '2026',
  purchaseMonth: 'January',
  value: '1000',
  seats: '3',
  overnightPostcode: 'GU14DA',
};

export const COVER_DETAILS = {
  coverType: 'Fully Comprehensive',
  mileage: '1,000 miles',
  classOfUse: 'Carrying Own Goods for Work',
  excess: 'No Excess',
  /** Must be within next 30 days and not in the past (site validates start date). */
  policyStartDay: '28',
  contactPostcode: 'GU14DA',
  addressOption: 'St. Josephs Church Office',
  homeType: 'House or bungalow that you own',
  homeInsurance: 'No home insurance held',
  phone: '7878787878',
};
