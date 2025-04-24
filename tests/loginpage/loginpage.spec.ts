import { test } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { CommonUtility } from '../../utils/common-utility';
import { pageObjectManager } from '../../pages/page-object-manager'
import LOGIN_TEST_DATA from '../../test-data/loginpage/loginpage-test-data.json';
import { LoginUtility } from '../../utils/login-utility';


let poManager: pageObjectManager;
let loginPage: LoginPage;
let assert: CommonUtility;
let loginUtility: LoginUtility;
let homePage: HomePage
let creds: any;

test.beforeEach('Perform Login into the application', async ({ page }) => {

    poManager = new pageObjectManager(page) // creating the instance of PO Manager
    loginPage = await poManager.getLoginPage(); //getting the login page instance
    homePage = await poManager.getHomePage();  //getting the home page instance
    assert = await poManager.getAssertionUtility(); //getting the assert class instance
    loginUtility = await poManager.loginCredentials(); //getting the login utility instance
    creds = await loginUtility.getUserCredentials(LOGIN_TEST_DATA.loginCredentials); //loading the login credentials
    await loginPage.navigateToPage();  //navigating to the application url
});

test('Verify that user is able to login with valid credentials', {tag: ['@regression', '@loginpage']}, async  () => {

    await loginPage.validLogin(creds.username, creds.password); //performing the login action
    await homePage.performLogout(); //performing the logout action
    await assert.visibleAssertion(loginPage.btn_login); //asserting login CTA is visible
});

test('Verify that locked-out user should not be able to login', {tag: ['@regression', '@loginpage']}, async () => {

    const invalidLockedUserData = await assert.updateObject(creds, { 'username': process.env.LOCKED_USER }, []); //updating the existing valid login username with locked user
    await loginPage.validLogin(invalidLockedUserData.username, invalidLockedUserData.password); //using the locked user username
    await assert.assertMessage(loginPage.error_message, LOGIN_TEST_DATA.loginErrorMessages.lockedUser); //verifying the error message
});

test('Verify that user should not be able to login when any of the fields are missing', {tag: ['@regression', '@loginpage']}, async () => {

    // Iterating over the username & password fields to make each field blank on each iteration
    for (const data of Object.keys(LOGIN_TEST_DATA.loginCredentials)) {
        const invalidLoginData = await assert.updateObject(creds, { [data]: '' }, []); //updating the existing valid login creds with blank values
        await loginPage.validLogin(invalidLoginData.username, invalidLoginData.password);  //using the updated details
        const expectedErrorMessage = LOGIN_TEST_DATA.invalidLoginCredsErrorMessages[data];  //getting the respective expected error messages
        await assert.assertMessage(loginPage.error_message, expectedErrorMessage); //asserting the error messages accordingly
    }
});
