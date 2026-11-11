
import { test, expect } from '@playwright/test';

test('VLD - complete journey and get quotes', async ({ page }) => {
  test.setTimeout(180000);

  // 1. Open VLD
  await page.goto(
    'https://vld-journey-new-e1a10c28e699.herokuapp.com/'
  );

  // 2. Find and select the van
  await page.getByRole('textbox', { name: 'PY12 AVL' }).fill('SK14 YOo');
  await page.getByRole('button', { name: 'Find My Van' }).click();

  await page.getByText('This Is My Vehicle').waitFor({
    state: 'visible',
    timeout: 60000
  });

  await page.getByText('This Is My Vehicle').click();
  await page.getByRole('button', { name: 'Next Step' }).click();

  // 3. Van Details
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

  // 4. About You - personal details
 // await page.locator('button[name="formly_91_select-input_maritalStatus_0"]').click();
 // await page.getByRole('option', { name: 'Single or co-habiting' }).click();

 /* Commenting About you Form
 
  // 4. About You - personal details-code diagnostics
  await expect(
    page.getByRole('heading', { name: 'About You' })
  ).toBeVisible({ timeout: 300000 });

  await page.getByRole('button', { name: 'Next Step' }).waitFor({
    state: 'visible',
    timeout: 100000
  });

  console.log('Current URL:', page.url());
  console.log('Marital status buttons:',
    await page.locator('button').evaluateAll(buttons =>
      buttons.map(button => ({
        text: button.innerText,
        name: button.getAttribute('name')
      }))
    )
  );

  await page.locator('button[name="formly_91_select-input_title_1"]').click();
  await page.getByRole('option', { name: 'Mr', exact: true }).click();

  await page.getByRole('textbox', { name: 'First Name' }).fill('TestQA');
  await page.getByRole('textbox', { name: 'Surname' }).fill('TestSurname');

  await page.getByRole('button', { name: 'Day' }).click();
  await page.getByRole('option', { name: '15', exact: true }).click();

  await page.getByRole('button', { name: 'Month' }).click();
  await page.getByRole('option', { name: 'January' }).click();

  await page.getByRole('button', { name: 'Year' }).click();
  await page.getByRole('option', { name: '1995' }).click();

  await page.getByText('Yes').first().click();

  // Employment
  await page.locator('button[name="formly_106_select-input_fulltimeJobStatus_0"]').click();
  await page.getByRole('option', { name: 'Employed', exact: true }).click();

  await page.locator('input[name="formly_110_api-search-select_fulltimeOccupation_0"]').fill('adv');
  await page.getByRole('option', { name: 'Advertising Agent' }).click();

  await page.locator('input[name="formly_110_api-search-select_fulltimeEmployersBusiness_1"]').fill('adv');
  await page.getByRole('option', { name: 'Advertising' }).click();

  // Other questions - recorded answers
  await page.getByText('No', { exact: true }).nth(1).click();
  await page.getByText('No', { exact: true }).nth(2).click();

  // Previous claim details
  await page.getByText('Yes').nth(3).click();

  await page.getByRole('button', { name: 'Day' }).click();
  await page.getByRole('option', { name: '15', exact: true }).click();

  await page.getByRole('button', { name: 'Month' }).click();
  await page.getByRole('option', { name: 'January' }).click();

  await page.getByRole('button', { name: 'Year' }).click();
  await page.getByRole('option', { name: '2026' }).click();

  await page.locator('button[name="formly_154_select-input_claimType_1"]').click();
  await page.getByRole('option', { name: 'Accident' }).click();

  await page.locator('button[name="formly_154_select-input_description_2"]').click();
  await page.getByRole('option', {
    name: 'Multiple Vehicle - Driver hit Third Party',
    exact: true
  }).click();

  await page.locator('button[name="formly_154_select-input_costIncurred_3"]').click();
  await page.getByRole('option', { name: 'Known', exact: true }).click();

  await page.getByRole('textbox', { name: 'Cost amount' }).fill('100');

  await page.locator('button[name="formly_154_select-input_faultClaim_5"]').click();
  await page.getByRole('option', { name: 'Yes' }).click();

  await page.locator('button[name="formly_154_select-input_personalInjury_8"]').click();
  await page.getByRole('option', { name: 'Yes' }).click();

  await page.locator('button[name="formly_154_select-input_occuredUnder_9"]').click();
  await page.getByRole('option', { name: 'Yes' }).click();

  await page.getByRole('button', { name: 'Add Claim' }).click();

  // Motoring convictions
  await page.getByText('No', { exact: true }).nth(3).click();
  await page.getByText('Yes').nth(4).click();

  await page.getByRole('textbox', { name: 'Start typing to search...' }).click();
  await page.getByRole('option', { name: 'AC10 - Failure To Stop And' }).click();

  await page.getByRole('button', { name: 'Day' }).click();
  await page.getByRole('option', { name: '15', exact: true }).click();

  await page.getByRole('button', { name: 'Month' }).click();
  await page.getByRole('option', { name: 'January' }).click();

  await page.getByRole('button', { name: 'Year' }).click();
  await page.getByRole('option', { name: '2026' }).click();

  await page.locator('button[name="formly_243_select-input_points_3"]').click();
  await page.getByRole('option', { name: '0 points', exact: true }).click();

  await page.getByRole('textbox', { name: 'Enter amount' }).fill('100');

  await page.locator('button[name="formly_243_select-input_banLength_5"]').click();
  await page.getByRole('option', { name: 'No ban' }).click();

  await page.getByRole('button', { name: 'Add Conviction' }).click();

  // Licence and driving details
  await page.getByText('No', { exact: true }).nth(4).click();

  await page.locator('button[name="formly_127_select-input_licenceType_0"]').click();
  await page.getByRole('option', { name: 'Full UK', exact: true }).click();

  await page.locator('button[name="formly_129_select-input_yearsLicenceHeld_0"]').click();
  await page.getByRole('option', { name: '10' }).click();

  await page.locator('button[name="formly_132_select-input_noClaimsBonus_0"]').click();
  await page.getByRole('option', { name: 'None' }).click();

  await page.locator('button[name="formly_136_select-input_accessToOtherVehicles_0"]').click();
  await page.getByRole('option', { name: 'None' }).click();

  //await page.getByRole('button', { name: 'Please Select' }).click();
  await page.getByRole('option', { name: '- Only this van' }).click();

  await page.locator(
    '#addAnotherDriver-scroll > designway-radio-input > .options-group > div:nth-child(2) > .radio-label'
  ).click();

  await page.getByRole('button', { name: 'Next Step' }).click();
  */

  // Wait for the About You page -With EDIT otion
await expect(
  page.getByText('Would you like to insure anyone else to drive the van?')
).toBeVisible({ timeout: 150000 });

// Continue using the saved details
//await page.getByRole('button', { name: 'NO', exact: true }).click();
console.log('NO buttons found:',
  await page.getByRole('button', { name: 'NO', exact: true }).count()
);

// Move to Your Cover
await page.getByRole('button', { name: 'Next Step' }).click();

  // 5. Your Cover
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

  // 6. Request quotes
  await page.getByRole('button', { name: 'Get Quotes' }).click();

  // Confirm that the quote results page appears.
  await expect(page.getByText('Best Price')).toBeVisible({
    timeout: 60000
  });
});