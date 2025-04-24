import { Page } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage';
import { CommonUtility } from '../utils/common-utility';
import { HomePage } from '../pages/HomePage';
import { CartPage } from './CartPage';
import { LoginUtility } from '../utils/login-utility';



export class pageObjectManager {
    page: Page;
    loginPage: LoginPage;
    assert: CommonUtility;
    homePage: HomePage;
    cartPage: CartPage;
    loginUtility: LoginUtility;


    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.assert = new CommonUtility();
        this.homePage = new HomePage(this.page);
        this.cartPage = new CartPage(this.page);
        this.loginUtility = new LoginUtility();
    }

    /**
        * Returns the instance of the LoginPage class.
        *
        * @returns {Promise<LoginPage>} The LoginPage instance.
        */
    async getLoginPage(): Promise<LoginPage> {

        return this.loginPage;
    }

    /**
 * Returns the instance of the CommonUtility class.
 *
 * @returns {Promise<CommonUtility>} The CommonUtility instance for assertions and helpers.
 */
    async getAssertionUtility(): Promise<CommonUtility> {

        return this.assert;
    }

    /**
 * Returns the instance of the HomePage class.
 *
 * @returns {Promise<HomePage>} The HomePage instance.
 */
    async getHomePage(): Promise<HomePage> {

        return this.homePage;
    }

    /**
 * Returns the instance of the CartPage class.
 *
 * @returns {Promise<CartPage>} The CartPage instance.
 */
    async getCartPage(): Promise<CartPage> {

        return this.cartPage;
    }

    /**
 * Returns the instance of the LoginUtility class.
 *
 * @returns {Promise<LoginUtility>} The LoginUtility instance used for credential handling.
 */
    async loginCredentials(): Promise<LoginUtility> {
        return this.loginUtility;
    }

}