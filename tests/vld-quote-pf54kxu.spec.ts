import { test, expect } from '@playwright/test';

/**
 * PF54KXU-only run (same van/cover/contact choices as vld-quote.spec.ts).
 * Run: npx playwright test vld-quote-pf54kxu
 * Browser stays open 10 minutes at the end for manual checks (Ctrl+C to exit early).
 */
test.use({ headless: false });

/** How long to leave the browser open after quotes load (ms). */
const MANUAL_CHECK_WAIT_MS = 10 * 60 * 1000;

test('VLD - complete journey for registration PF54KXU', async ({ page }) => {
  test.setTimeout(600000);

  const registration = 'PF54KXU';

  await page.goto(
    'https://vld-journey-new-e1a10c28e699.herokuapp.com/'
  );

  await page.getByRole('textbox', { name: 'PY12 AVL' }).fill(registration);
  await page.getByRole('button', { name: 'Find My Van' }).click();

  await page.getByText('This Is My Vehicle').waitFor({
    state: 'visible',
    timeout: 60000
  });

  await page.getByText('This Is My Vehicle').click();
  await page.getByRole('button', { name: 'Next Step' }).click();

  await expect(
    page.getByRole('heading', { name: 'Van Details' })
  ).toBeVisible();

  await page.getByText('Yes').first().click();

  await page.getByRole('button', { name: 'Year' }).click();
  await page.getByRole('option', { name: '2026' }).click();

  await page.getByRole('button', { name: 'Month' }).click();
  await page.getByRole('option', { name: 'January' }).click();

  await page.getByRole('textbox', { name: 'Current van value' }).fill('1000');

  await page.locator('designway-date-select')
    .filter({ hasText: 'Please Select 2 3 4 5 6' })
    .getByRole('button')
    .click();

  await page.getByRole('option', { name: '3' }).click();
  await page.getByText('No').nth(5).click();

  await page.getByRole('button', { name: 'Please Select' }).click();
  await page.getByRole('option', { name: 'Factory Fitted (all vans' }).click();

  await page.getByRole('textbox', { name: 'Postcode' }).fill('GU14DA');
  await page.getByText('No', { exact: true }).nth(3).click();

  await page.locator('div')
    .filter({ hasText: /^In a locked garage$/ })
    .nth(2)
    .click();

  await page.getByText('Yes').nth(4).click();
  await page.getByRole('button', { name: 'Next Step' }).click();

  await expect(
    page.getByText('Would you like to insure anyone else to drive the van?')
  ).toBeVisible({ timeout: 150000 });

  await page.getByRole('button', { name: 'Next Step' }).click();

  await page.locator('button[name="formly_425_select-input_coverType_0"]').click();
  await page.getByRole('option', { name: 'Fully Comprehensive' }).click();

  await page.locator('button[name="formly_425_select-input_annualMileage_1"]').click();
  await page.getByRole('option', { name: '1,000 miles' }).click();

  await page.locator('button[name="formly_429_select-input_classOfUse_0"]').click();
  await page.getByRole('option', { name: 'Carrying Own Goods for Work' }).click();

  await page.locator('button[name="formly_429_select-input_voluntaryExcess_2"]').click();
  await page.getByRole('option', { name: 'No Excess' }).click();

  await page.getByLabel('Yes', { exact: true }).check();

  await page.getByRole('button', { name: 'Day' }).click();
  await page.getByRole('option', { name: '15', exact: true }).click();

  await page.getByLabel('Annually').check();

  await page.getByRole('textbox', { name: 'Postcode' }).fill('GU14DA');
  await page.getByRole('button', { name: 'Find' }).click();

  await page.locator('button[name="formly_451_select-input_selectAddress_1"]').click();
  await page.getByRole('option', { name: 'St. Josephs Church Office' }).click();

  await page.getByRole('button', { name: 'Please Select' }).click();
  await page.getByRole('option', {
    name: 'House or bungalow that you own'
  }).click();

  await page.getByRole('button', { name: 'Please Select' }).click();
  await page.getByRole('option', { name: 'No home insurance held' }).click();

  await page.getByRole('textbox', { name: 'Main Phone number' }).fill('7878787878');
  await page.getByRole('textbox', { name: 'your@email.com' }).fill('testqa@example.com');

  await page.locator('#connected-scroll').getByText('Email').click();
  await page.getByText('Yes, please').click();

  await page.locator('#formly_462_checkbox-terms_privacyPolicy_0').check();

  await page.getByRole('button', { name: 'Get Quotes' }).click();

  await expect(page.getByText('Best Price')).toBeVisible({
    timeout: 60000
  });

  console.log(
    `Registration ${registration}: quotes loaded. Browser will stay open for ${MANUAL_CHECK_WAIT_MS / 60000} minutes — inspect manually (Ctrl+C in terminal to stop early).`
  );
  await page.waitForTimeout(MANUAL_CHECK_WAIT_MS);
});
