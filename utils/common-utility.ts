import { test, expect, Locator, Page } from '@playwright/test'
import { logger } from './reporter-utility';

export class CommonUtility {

    /**
     * Asserts that the given locator is visible on the page.
     * @param {Locator} locator - The Playwright locator to check visibility for.
     */
    async visibleAssertion(locator: Locator) {
        await expect(locator).toBeVisible();
    }

    /**
     * Asserts that the given locator is hidden on the page.
     * @param {Locator} locator - The Playwright locator to check visibility for.
     */
    async hiddenAssertion(locator: Locator) {
        await expect(locator).toBeHidden();
    }

    /**
     * Asserts that the text content of a locator matches the expected text.
     * @param {Locator} locator - The Playwright locator to check the text of.
     * @param {string} expectedData - The expected text that should be present in the locator.
     */
    async textAssertion(locator: Locator, expectedData: string) {
        await expect(locator).toHaveText(expectedData);
    }

    /**
     * Asserts that the page screenshot matches the expected snapshot.
     * Uses full-page screenshot and allows for minor pixel differences.
     * @param {Page} page - The Playwright page object to take the screenshot of.
     * @param {string} pngName - The name of the screenshot file to match against.
     */
    async screenshotAssert(page: Page, pngName: string) {

        const testName = test.info().title;  // Fetches the current test name
    const testFilePath = test.info().file.replace(process.cwd(), '');

        const expectedScreenshotPath = `./tests/${testFilePath}/snapshots/${testName}.png`;
        await expect(page).toHaveScreenshot(expectedScreenshotPath, { fullPage: true, maxDiffPixelRatio: 0.01 });
    }

    /**
     * Asserts that the products added to the cart match the products listed before adding to the cart.
     * Compares the arrays of product names.
     * @param {string[]} productsBeforeCart - List of product names before adding to the cart.
     * @param {string[]} productsInCart - List of product names in the cart after adding.
     */
    async assertProductTitle(productsBeforeCart: string[], productsInCart: string[]) {
        if (JSON.stringify(productsBeforeCart) == JSON.stringify(productsInCart)) {
            logger.info('Added Products are Verified Successfully');
        } else {
            logger.error('Error is occurred while verifying the Added Products in cart');
        }
    }

    /**
     * Asserts that the message within the locator matches the expected success message.
     * Logs the success or error message based on the comparison.
     * @param {Locator} locator - The Playwright locator where the message is displayed.
     * @param {string} successMsg - The expected success message to match.
     */
    async assertMessage(locator: Locator, successMsg: string) {
        try {
            const text = await locator.textContent();
            expect(text).toBe(successMsg);
            logger.info(`${successMsg} Validation verified successfully`);

        } catch (error) {
            logger.error(`Something Went Wrong while asserting message : ${error}`);
            throw error;
        }
    }

    /**
     * Updates an object by merging it with a provided object (overrideKey) and removing specified keys (deleteKeys).
     * @param {Object} plainObj - The original object to be updated.
     * @param {any} overrideKey - The object containing keys to override or add to the original object.
     * @param {Array<string>} deleteKeys - The keys to be deleted from the updated object.
     * @returns {Object} - The updated object after merging and deleting specified keys.
     */
    async updateObject(plainObj: Object, overrideKey: any, deleteKeys: Array<string>) {
        const updatedObj = {
            ...plainObj,
            ...overrideKey,
        };

        deleteKeys?.forEach(deleteKey => {
            delete updatedObj[deleteKey];
        });

        return updatedObj;
    }

}


