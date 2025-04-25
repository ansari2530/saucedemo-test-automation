import { Locator, Page } from '@playwright/test';
import { logger } from '../utils/reporter-utility';


export class LoginPage {

    constructor(public page: Page,
        readonly txt_username: Locator = page.getByPlaceholder('Username'),
        readonly txt_password: Locator = page.getByPlaceholder('Password'),
        readonly btn_login: Locator = page.getByText('Login'),
        readonly error_message: Locator = page.locator('[data-test="error"]')
    ) {
    }

    /**
         * Navigates to the application's base URL.
         * Logs the action's success or failure for visibility during test execution.
         * @returns {Promise<void>}
         */
    async navigateToPage(): Promise<void> {
        try {
            await this.page.goto('/');
            logger.info('Application Launched Successfully');
        } catch (error) {
            logger.error(`Unable to Launch the Application: ${error}`);
        }
    }

    /**
     * Performs login action using provided username and password.
     * Fills in credentials and clicks the login button.
     *
     * @param {string} username - Username to log in with.
     * @param {string} password - Password associated with the username.
     * @returns {Promise<void>}
     */
    async validLogin(username: string, password: string): Promise<void> {

        try {
            await this.txt_username.fill(username);
            await this.txt_password.fill(password);
            await this.btn_login.click();
            logger.info('User Logged-In Successfully');

        } catch (error) {
            logger.error(`Error Occured while logging in : ${error}`);
        }

    }
}
