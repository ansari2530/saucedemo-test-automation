import { Locator, Page } from '@playwright/test';
import HOMEPAGE_TEST_DATA from '../test-data/homepage/homepage-test-data.json';
import { logger } from '../utils/reporter-utility';

export class HomePage {

    constructor(public page: Page,
        readonly dropdown_filter: Locator = page.locator('[data-test="product-sort-container"]'),
        readonly dropdown_active_value: Locator = page.locator('span.active_option'),
        readonly btn_cartNavigation: Locator = page.locator("#shopping_cart_container"),
        readonly btn_addToCart: Locator = page.locator("button.btn_inventory"),
        readonly productName: Locator = page.locator('div.inventory_item_name'),
        readonly productPrice: Locator = page.locator('div.inventory_item_price'),
        readonly btn_remove: Locator = page.getByRole('button', { name: 'Remove' }),
        readonly txt_cartCount: Locator = page.locator('span.shopping_cart_badge'),
        readonly btn_backToProducts: Locator = page.getByRole('button', { name: 'Back to products' }),
        readonly txt_productTitleFromPdp: Locator = page.locator('div.inventory_details_name'),
        readonly btn_menu: Locator = page.getByRole('button', { name: 'Open Menu' }),
        readonly btn_logout: Locator = page.locator('#logout_sidebar_link')
    ) { }


    /**
 * Validates that the sorting functionality on the product list works correctly
 * based on the selected filter value.
 *
 * @param {string} filterValue - The filter option selected (e.g., Name (Z to A), Price (high to low)).
 * @param {string} productTitleBeforeSort - The title of the first product before sorting.
 * @returns {Promise<void>} - This function performs assertions and logs the result.
 */
    async productSortAssert(filterValue: string, productTitleBeforeSort: string): Promise<void> {
        try {
            if (filterValue == HOMEPAGE_TEST_DATA.sortValues.sortOne) {
                const productTitleAfterSort = await this.productName.nth(0).innerText();
                if (productTitleAfterSort != productTitleBeforeSort) {
                    logger.info('Results are Sorted from Z to A');
                } else if (productTitleAfterSort == productTitleBeforeSort) {
                    logger.error('Error occured while sorting the items from Z to A');
                }

            } else {

                const priceExtract = await this.productPrice.allTextContents();
                let prices: number[] = [];

                for (const text of priceExtract) {
                    const cleanedText = text.replace(/[^0-9.]/g, '');
                    const price = parseFloat(cleanedText);
                    prices.push(price);
                }
                const expectedSortedPrice = prices.sort((a, b) => b - a);
                if (expectedSortedPrice == prices) {
                    logger.info('Results are Sorted from High to Low');
                } else {
                    logger.error('issue occured while Sorting results from High to Low');
                }
            }

        } catch (error) {
            logger.error('issue occured while using Sort filter');
        }


    }

    /**
 * Validates that the add to cart functionality on the product list works correctly
 *
 * @param {string} flag - A flag is expected to decide whether cart navigation is required or not 
 * based on the test case end goal.
 * @returns {Promise<void>} - This function performs assertions and logs the result.
 */

    async addProductToCart(flag: 'yes' | 'no'): Promise<void> {

        try {
            let counts: number = await this.btn_addToCart.count();
            for (let i = 0; i < counts; i++) {
                await this.btn_addToCart.nth(i).click();
            }

            if (flag == 'yes') {
                await this.btn_cartNavigation.click();
            }

        } catch (error) {
            logger.error(`Error Occured while adding the products to cart : ${error}`);
            throw error;
        }
    }

    /**
 * Validates that the logout functionality of the app works fine
 * @returns {Promise<void>} - This function resolves when logout operation is successfully completed
 */
    async performLogout(): Promise<void> {

        try {
            await this.btn_menu.click();
            await this.btn_logout.click();
            logger.info('User Logged Out Successfully');

        } catch (error) {
            logger.error(`Error Occured while logging out : ${error}`);
            throw error;
        }
    }
}
