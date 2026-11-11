import { test, expect } from '@playwright/test';
import {
  QUOTE_1_PROFILE,
  QUOTE_1_REGISTRATION,
  QUOTE_2_MAKE,
  QUOTE_2_MODEL_OPTION,
  QUOTE_2_MODEL_SEARCH,
  QUOTE_2_PROFILE,
  RECALL_1,
  RECALL_2,
} from './helpers/vld-data';
import {
  completeGetQuoteJourney,
  editDetailsAndRequote,
  expectQuotesResults,
  openPricingFromQuotes,
  proceedToPayment,
  recallQuote,
} from './helpers/vld-journey';

/**
 * Serial suite: later tests depend on quotes created earlier (same recall credentials).
 * Run: npx playwright test vld-flows --workers=1
 */
test.describe.configure({ mode: 'serial' });

test.describe('VLD journey flows', () => {
  test.setTimeout(600000);

  test('1 — get quote with registration number', async ({ page }) => {
    await completeGetQuoteJourney(page, {
      registration: QUOTE_1_REGISTRATION,
      profile: QUOTE_1_PROFILE,
    });
  });

  test('2 — recall quote 1 (registration journey)', async ({ page }) => {
    await recallQuote(page, RECALL_1);
  });

  test('3 — get quote with enter make and model', async ({ page }) => {
    await completeGetQuoteJourney(page, {
      makeModel: {
        makeSearch: 'For',
        makeOption: QUOTE_2_MAKE,
        modelSearch: QUOTE_2_MODEL_SEARCH,
        modelOption: QUOTE_2_MODEL_OPTION,
      },
      profile: QUOTE_2_PROFILE,
    });
  });

  test('4 — recall quote 2 (make / model journey)', async ({ page }) => {
    await recallQuote(page, RECALL_2);
  });

  test('5 — edit details and get quote again', async ({ page }) => {
    await recallQuote(page, RECALL_1);
    await editDetailsAndRequote(page);
  });

  test('6 — recall quote after edit', async ({ page }) => {
    await recallQuote(page, RECALL_1);
    await expectQuotesResults(page);
  });

  test('7 — recall quote and open pricing page', async ({ page }) => {
    await recallQuote(page, RECALL_1);
    await openPricingFromQuotes(page);
  });

  test('8 — recall quote, go to payment', async ({ page }) => {
    await recallQuote(page, RECALL_1);

    const onlinePurchase = page.getByRole('button', {
      name: /buy|proceed|continue|pay|select/i,
    });
    const phoneOnly = page.getByText(/purchase via phone|call our team/i);

    if (await phoneOnly.isVisible().catch(() => false)) {
      test.info().annotations.push({
        type: 'note',
        description:
          'Quote is phone-only (no online checkout). Payment step verified as not available for this quote.',
      });
      await expect(phoneOnly).toBeVisible();
      return;
    }

    expect(await onlinePurchase.count()).toBeGreaterThan(0);
    await proceedToPayment(page);
  });
});
