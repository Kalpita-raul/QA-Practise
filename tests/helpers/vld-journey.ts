import { expect, type Page } from '@playwright/test';
import {
  COVER_DETAILS,
  VAN_DETAILS,
  VLD_BASE_URL,
  VLD_PATHS,
  type JourneyProfile,
} from './vld-data';

export async function openAboutYourVan(page: Page) {
  await page.goto(`${VLD_BASE_URL}${VLD_PATHS.aboutYourVan}`);
}

/** Custom-styled checkbox: native input is hidden; label / Angular events must be used. */
export async function acceptTermsAndPrivacyPolicy(page: Page) {
  const checkbox = page.locator('[id*="checkbox-terms_privacyPolicy"]');
  if (await checkbox.isChecked().catch(() => false)) {
    return;
  }

  const termsBlock = page.locator('div').filter({
    hasText: 'Check this box to confirm you agree to our terms',
  });
  await termsBlock.getByText(/Check this box to confirm/i).click();

  if (await checkbox.isChecked().catch(() => false)) {
    return;
  }

  await checkbox.evaluate((el) => {
    const input = el as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

export async function selectVanByRegistration(page: Page, registration: string) {
  if (await page.getByRole('checkbox', { name: 'Enter make and model' }).isChecked().catch(() => false)) {
    await page.getByText('Registration number', { exact: true }).click();
  }

  const regInput = page.getByRole('textbox', { name: 'PY12 AVL' });
  await regInput.fill(registration);

  const findMyVan = page.getByRole('button', { name: 'Find My Van' });
  await findMyVan.click({ timeout: 120000 });

  const editionButton = page.getByRole('button', { name: 'Edition' });
  if (await editionButton.isVisible().catch(() => false)) {
    await editionButton.click();
    await page.getByRole('option').first().click({ timeout: 60000 });
  }

  await page.getByText('This Is My Vehicle').click({ timeout: 60000 });
  await page.getByRole('button', { name: 'Next Step' }).click();
}

export async function selectVanByMakeAndModel(
  page: Page,
  makeSearch: string,
  makeOption: string,
  modelSearch: string,
  modelOption: RegExp
) {
  const makeModelToggle = page.getByRole('checkbox', { name: 'Enter make and model' });
  if (!(await makeModelToggle.isChecked().catch(() => false))) {
    await page.getByText('Enter make and model', { exact: true }).click();
  }
  await page.getByRole('textbox', { name: 'Type first three letters..' }).fill(makeSearch);
  await page.getByRole('option', { name: makeOption, exact: true }).click();
  await page.getByRole('button', { name: 'Please Select' }).first().click();
  await page.getByRole('option', { name: modelOption }).first().click();
  await page.getByRole('button', { name: 'Please Select' }).nth(1).click();
  await page.getByRole('option').first().click();
  await page.getByRole('button', { name: 'Please Select' }).nth(2).click();
  await page.getByRole('option').first().click();
  await page.getByText('This Is My Vehicle').click();
  await page.getByRole('button', { name: 'Next Step' }).click();
}

export async function fillVanDetailsSection(page: Page) {
  await expect(page.getByRole('heading', { name: 'Van Details' })).toBeVisible();

  await page.getByText('Yes').first().click();

  await page.getByRole('button', { name: 'Year' }).click();
  await page.getByRole('option', { name: VAN_DETAILS.purchaseYear }).click();

  await page.getByRole('button', { name: 'Month' }).click();
  await page.getByRole('option', { name: VAN_DETAILS.purchaseMonth }).click();

  await page.getByRole('textbox', { name: 'Current van value' }).fill(VAN_DETAILS.value);

  await page
    .locator('designway-date-select')
    .filter({ hasText: 'Please Select 2 3 4 5 6' })
    .getByRole('button')
    .click();

  await page.getByRole('option', { name: VAN_DETAILS.seats }).click();
  await page.getByText('No').nth(5).click();

  await page.getByRole('button', { name: 'Please Select' }).click();
  await page.getByRole('option', { name: 'Factory Fitted (all vans' }).click();

  await page.getByRole('textbox', { name: 'Postcode' }).fill(VAN_DETAILS.overnightPostcode);
  await page.getByText('No', { exact: true }).nth(3).click();

  await page
    .locator('div')
    .filter({ hasText: /^In a locked garage$/ })
    .nth(2)
    .click();

  await page.getByText('Yes').nth(4).click();
  await page.getByRole('button', { name: 'Next Step' }).click();
  await advanceToAboutYouSection(page);
}

async function advanceToAboutYouSection(page: Page) {
  const aboutYouHeading = page.getByRole('heading', { name: '2. About You' });
  const savedProfilePrompt = page.getByText(
    'Would you like to insure anyone else to drive the van?'
  );

  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (await aboutYouHeading.isVisible().catch(() => false)) return;
    if (await savedProfilePrompt.isVisible().catch(() => false)) return;

    const next = page.getByRole('button', { name: 'Next Step' });
    if (await next.isVisible().catch(() => false)) {
      await next.click();
    }
    await page.waitForTimeout(1500);
  }

  const reachedAboutYou =
    (await aboutYouHeading.isVisible().catch(() => false)) ||
    (await savedProfilePrompt.isVisible().catch(() => false));

  expect(reachedAboutYou).toBeTruthy();
}

export async function fillAboutYou(page: Page, profile: JourneyProfile) {
  const savedProfilePrompt = page.getByText(
    'Would you like to insure anyone else to drive the van?'
  );

  if (await savedProfilePrompt.isVisible().catch(() => false)) {
    await page.getByRole('button', { name: 'Next Step' }).click();
    await page.waitForURL(/\/compare-van-insurance\/your-cover(?:\?|$)/, {
      timeout: 120000,
    }).catch(() => {});
    if (await page.getByRole('heading', { name: /Your Cover/i }).isVisible().catch(() => false)) {
      return;
    }
  }

  await expect(page.getByRole('heading', { name: /About You/i })).toBeVisible({
    timeout: 120000,
  });

  await page.locator('button[name*="maritalStatus"]').click();
  await page.getByRole('option', { name: 'Single or co-habiting' }).click();

  await page.locator('button[name*="select-input_title"]').first().click();
  await page.getByRole('option', { name: 'Mr', exact: true }).click();

  await page.getByRole('textbox', { name: 'First Name' }).fill(profile.firstName);
  await page.getByRole('textbox', { name: 'Surname' }).fill(profile.surname);

  await page.getByRole('button', { name: 'Day' }).first().click();
  await page.getByRole('option', { name: profile.dob.day, exact: true }).click();
  await page.getByRole('button', { name: 'Month' }).first().click();
  await page.getByRole('option', { name: profile.dob.month }).click();
  await page.getByRole('button', { name: 'Year' }).first().click();
  await page.getByRole('option', { name: profile.dob.year }).click();

  await page.getByText('Yes').first().click();

  await page.locator('button[name*="fulltimeJobStatus"]').click();
  await page.getByRole('option', { name: 'Employed', exact: true }).click();

  await page.locator('input[name*="fulltimeOccupation"]').fill('adv');
  await page.getByRole('option', { name: 'Advertising Agent' }).click();

  await page.locator('input[name*="fulltimeEmployersBusiness"]').fill('adv');
  await page.getByRole('option', { name: 'Advertising' }).click();

  await page.getByText('No', { exact: true }).nth(1).click();
  await page.getByText('No', { exact: true }).nth(2).click();
  await page.getByText('No', { exact: true }).nth(3).click();
  await page.getByText('No', { exact: true }).nth(4).click();

  await page.locator('button[name*="licenceType"]').click();
  await page.getByRole('option', { name: 'Full UK', exact: true }).click();

  await page.locator('button[name*="yearsLicenceHeld"]').click();
  await page.getByRole('option', { name: '10' }).click();

  await page.locator('button[name*="noClaimsBonus"]').click();
  await page.getByRole('option', { name: 'None' }).click();

  await page.locator('button[name*="accessToOtherVehicles"]').click();
  await page.getByRole('option', { name: 'None' }).click();

  await page.locator('button[name*="numberOfVehiclesInHousehold"]').click();
  await page.getByRole('option', { name: '- Only this van' }).click();

  await page
    .locator(
      '#addAnotherDriver-scroll > designway-radio-input > .options-group > div:nth-child(2) > .radio-label'
    )
    .click();

  await page.getByRole('button', { name: 'Next Step' }).click();
  await page.waitForURL(/\/compare-van-insurance\/your-cover(?:\?|$)/, {
    timeout: 120000,
  });
}

export async function fillYourCoverAndGetQuotes(
  page: Page,
  email: string
) {
  await expect(page.getByRole('heading', { name: '3. Your Cover' })).toBeVisible({
    timeout: 120000,
  });

  if (!(await page.getByRole('button', { name: COVER_DETAILS.coverType }).isVisible().catch(() => false))) {
    await page.locator('button[name*="coverType"]').first().click();
    await page.getByRole('option', { name: COVER_DETAILS.coverType }).click();
  }

  if (!(await page.getByRole('button', { name: COVER_DETAILS.mileage }).isVisible().catch(() => false))) {
    await page.locator('button[name*="annualMileage"]').first().click();
    await page.getByRole('option', { name: COVER_DETAILS.mileage }).click();
  }

  if (!(await page.getByRole('button', { name: COVER_DETAILS.classOfUse }).isVisible().catch(() => false))) {
    await page.locator('button[name*="classOfUse"]').first().click();
    await page.getByRole('option', { name: COVER_DETAILS.classOfUse }).click();
  }

  if (!(await page.getByRole('button', { name: COVER_DETAILS.excess }).isVisible().catch(() => false))) {
    await page.locator('button[name*="voluntaryExcess"]').first().click();
    await page.getByRole('option', { name: COVER_DETAILS.excess }).click();
  }

  await page
    .locator('div')
    .filter({ hasText: 'Will the van be carrying hazardous substances?' })
    .getByText('No', { exact: true })
    .click();

  const policyStart = page.locator('div').filter({
    hasText: 'When would you like the policy to start?',
  });

  await policyStart.getByRole('button', { name: 'Day' }).click();
  await policyStart
    .getByRole('option', { name: COVER_DETAILS.policyStartDay, exact: true })
    .click();


  await page
    .locator('div')
    .filter({ hasText: 'How do you normally pay?' })
    .getByText('Annually', { exact: true })
    .click();

  await page.getByRole('textbox', { name: 'Postcode' }).fill(COVER_DETAILS.contactPostcode);
  await page.getByRole('button', { name: 'Find' }).click();

  await page.locator('button[name*="selectAddress"]').click();
  await page.getByRole('option', { name: COVER_DETAILS.addressOption }).click();

  await page.getByRole('button', { name: 'Please Select' }).first().click();
  await page.getByRole('option', { name: COVER_DETAILS.homeType }).click();

  await page.getByRole('button', { name: 'Please Select' }).first().click();
  await page.getByRole('option', { name: COVER_DETAILS.homeInsurance }).click();

  await page.getByRole('textbox', { name: 'Main Phone number' }).fill(COVER_DETAILS.phone);
  await page.getByRole('textbox', { name: 'your@email.com' }).fill(email);

  await page.locator('#connected-scroll').getByText('Email').click();
  await page
    .locator('div')
    .filter({ hasText: 'auto-fetch your van insurance quotes' })
    .getByText('Yes, please')
    .click();

  await acceptTermsAndPrivacyPolicy(page);
  await page.getByRole('button', { name: 'Get Quotes' }).click();

  await expectQuotesResults(page);
}

export async function expectQuotesResults(page: Page) {
  await expect(
    page.getByRole('heading', { name: /Your Van Quotes/i })
  ).toBeVisible({ timeout: 120000 });
  await expect(page.getByText('Best Price').first()).toBeVisible({ timeout: 120000 });
}

export async function recallQuote(
  page: Page,
  user: Pick<JourneyProfile, 'surname' | 'email' | 'dob'> & { postcode: string }
) {
  await page.goto(`${VLD_BASE_URL}${VLD_PATHS.recallLogin}`);

  await page.getByRole('textbox', { name: 'Smith' }).fill(user.surname);
  await page.getByRole('textbox', { name: 'GU12AB' }).fill(user.postcode);
  await page.getByRole('textbox', { name: 'your@email.com' }).fill(user.email);

  await page.getByRole('button', { name: 'Day' }).click();
  await page.getByRole('option', { name: user.dob.day, exact: true }).click();
  await page.getByRole('button', { name: 'Month' }).click();
  await page.getByRole('option', { name: user.dob.month }).click();
  await page.getByRole('button', { name: 'Year' }).click();
  await page.getByRole('option', { name: user.dob.year }).click();

  await page.getByRole('button', { name: 'RECALL' }).click();
  await expectQuotesResults(page);
}

export async function editDetailsAndRequote(page: Page) {
  await page.getByRole('link', { name: 'Edit Details' }).click();
  await page.waitForURL(/your-cover/, { timeout: 60000 });

  await page.locator('button[name*="annualMileage"]').first().click();
  await page.getByRole('option', { name: '2,000 miles' }).click();

  await acceptTermsAndPrivacyPolicy(page);
  await page.getByRole('button', { name: 'Get Quotes' }).click();
  await expectQuotesResults(page);
}

export async function openPricingFromQuotes(page: Page) {
  const buyOnline = page.getByRole('button', { name: /buy|continue|select|proceed/i }).first();
  const viewDetails = page.getByRole('link', { name: /view|details|pricing/i }).first();

  if (await buyOnline.isVisible().catch(() => false)) {
    await buyOnline.click();
  } else if (await viewDetails.isVisible().catch(() => false)) {
    await viewDetails.click();
  } else {
    await page.locator('.quote-card, [class*="quote"]').first().click();
  }

  await expect(
    page.getByText(/pricing|payment|premium|total payable|summary/i).first()
  ).toBeVisible({ timeout: 60000 });
}

export async function proceedToPayment(page: Page) {
  const payButton = page.getByRole('button', {
    name: /pay|make payment|proceed to payment|continue to payment|buy now/i,
  }).first();

  await expect(payButton).toBeVisible({ timeout: 60000 });
  await payButton.click();

  await expect(
    page.getByText(/payment|card number|billing|pay now/i).first()
  ).toBeVisible({ timeout: 60000 });
}

export async function completeGetQuoteJourney(
  page: Page,
  opts: {
    registration?: string;
    makeModel?: {
      makeSearch: string;
      makeOption: string;
      modelSearch: string;
      modelOption: RegExp;
    };
    profile: JourneyProfile;
  }
) {
  await openAboutYourVan(page);

  if (opts.registration) {
    await selectVanByRegistration(page, opts.registration);
  } else if (opts.makeModel) {
    await selectVanByMakeAndModel(
      page,
      opts.makeModel.makeSearch,
      opts.makeModel.makeOption,
      opts.makeModel.modelSearch,
      opts.makeModel.modelOption
    );
  } else {
    throw new Error('Provide registration or makeModel');
  }

  await fillVanDetailsSection(page);
  await fillAboutYou(page, opts.profile);
  await fillYourCoverAndGetQuotes(page, opts.profile.email);
}
