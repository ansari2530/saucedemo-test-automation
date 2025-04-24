import { Locator, Page } from '@playwright/test';
import { logger } from '../utils/reporter-utility';

export class CartPage {

    constructor(public page: Page,
        readonly btn_checkout: Locator = page.locator("#checkout"),
        readonly txt_firstname: Locator = page.locator('[data-test="firstName"]'),
        readonly txt_lastname: Locator = page.locator('[data-test="lastName"]'),
        readonly txt_postalcode: Locator = page.locator('[data-test="postalCode"]'),
        readonly btn_continue: Locator = page.locator('[data-test="continue"]'),
        readonly btn_finish: Locator = page.locator('[data-test="finish"]'),
        readonly txt_complete: Locator = page.locator("[class='title']"),
        readonly txt_thankyou: Locator = page.locator("[class='complete-header']"),
        readonly btn_backtohomepage: Locator = page.locator("#back-to-products"),
        readonly txt_productTitle: Locator = page.locator('div.inventory_item_name'),
        readonly error_message: Locator = page.locator('[data-test="error"]'),
        readonly btn_remove: Locator = page.locator('[data-test*="remove"]'),
        readonly txt_cartCount: Locator = page.locator('span.shopping_cart_badge'),
        readonly btn_continueShopping: Locator = page.getByRole('button', { name: 'Continue Shopping' }),
        readonly txt_productsHeading: Locator = page.locator("span.title"),
        readonly btn_cancelOverview: Locator = page.locator('#cancel'),
    ) {
    }


    /**
   * Enters the user details & completes the user checkout journey
   * @param {string} flag - decides whether to tap on final finish CTA or not
   * @param {string} firstName - functions expects the users first name
   * @param {string} lastName - functions expects the users last name
   * @param {string} postalCode - functions expects the users postal code
   * @returns {Promise<void>} - A promise that resolves when the checkout or respective cases are completed
   */
    async performCheckout(flag: 'yes' | 'no', firstName?: string, lastName?: string, postalCode?: string): Promise<void> {

        try {
            await this.txt_firstname.fill(firstName ?? '');
            await this.txt_lastname.fill(lastName ?? '');
            await this.txt_postalcode.fill(postalCode ?? '');
            await this.btn_continue.click();

            if (flag == "yes") {
                await this.btn_finish.click();
            }
        } catch (error) {
            logger.error(`Unable to perform the full checkout due to ${error}`);
            throw Error;
        }
    }


    /**
   * @returns {Promise<string[]>} productTitles - Extract & returns the product title for the provided locator
   * using such function one can extract the values to compare & assert from different pages
   * A promise that returns the value when it has the array of strings
   */
    async cartProductsVerification(): Promise<string[]> {
        let productTitles: string[] = [];

        try {
            const counts = await this.txt_productTitle.count();

            for (let i = 0; i < counts; i++) {
                const text = await this.txt_productTitle.nth(i).innerText();
                productTitles.push(text);
            }

        } catch (error) {
            logger.error(`Unable to verify the products title due to ${error}`);
        }

        return productTitles;
    }


    /**
   * Navigate to the Homepage using the CTA from the final checkout page
   * @returns {Promise<void>} - A promise that resolves when the navigation to homepage is completed

   */
    async navigateHomeFromCheckout(): Promise<void> {
        try {
            await this.btn_backtohomepage.click();
        } catch (error) {
            logger.error(`Unable to navigate to the cart due to ${error}`);
        }
    }
}
