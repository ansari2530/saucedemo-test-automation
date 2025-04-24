import { test } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { CommonUtility } from '../../utils/common-utility';
import { pageObjectManager } from '../../pages/page-object-manager'
import HOMEPAGE_TEST_DATA from '../../test-data/homepage/homepage-test-data.json';
import LOGIN_TEST_DATA from '../../test-data/loginpage/loginpage-test-data.json';
import { CartPage } from '../../pages/CartPage';
import { logger } from '../../utils/reporter-utility';
import { LoginUtility } from '../../utils/login-utility';



let poManager: pageObjectManager;
let loginPage: LoginPage;
let assert: CommonUtility;
let homePage: HomePage;
let cartPage: CartPage;
let loginUtility: LoginUtility;
let creds: any;


test.beforeEach('Perform Login into the application', async ({ page }) => {

    poManager = new pageObjectManager(page) // creating the instance of PO Manager
    loginPage = await poManager.getLoginPage(); //getting the login page instance
    assert = await poManager.getAssertionUtility(); //getting the assert class instance
    homePage = await poManager.getHomePage();  //getting the home page instance
    cartPage = await poManager.getCartPage();  //getting the cart page instance
    loginUtility = await poManager.loginCredentials(); //getting the login utility instance
    creds = await loginUtility.getUserCredentials(LOGIN_TEST_DATA.loginCredentials); //loading the login credentials

    await loginPage.navigateToPage();  //navigating to the application url
    await loginPage.validLogin(creds.username, creds.password); //performing the login action
});

test('Verify that selected dropdown values are visible', { tag: ['@regression', '@smoke', '@homepage'] }, async () => {

    const firstProductTitle = await homePage.productName.nth(0).innerText();  //getting the selected dropdown value

    //using for loop to iterate over the selection of the dropdown values & verify the same accordingly
    for (const data of Object.values(HOMEPAGE_TEST_DATA.sortValues)) {
        await homePage.dropdown_filter.selectOption({ label: `${data}` }); //selecting the dropdown value
        await homePage.productSortAssert(data, firstProductTitle);  //verifying that products are sorted accordingly
        await assert.textAssertion(homePage.dropdown_active_value, data); //asserting that selected value is active
    }

});

test('Verify that user is able to remove the added product from cart from homepage', { tag: ['@regression', '@smoke', '@homepage'] }, async () => {

    await homePage.addProductToCart('no'); //adding products to cart
    const removeCtaCounts = homePage.btn_remove;
    while (await removeCtaCounts.count() > 0) {
        await removeCtaCounts.first().click();  //removing the cart products from homescreen 
    }
    const totalCartCount = homePage.txt_cartCount;
    await assert.hiddenAssertion(totalCartCount); //verifying the cart count is not visible
});


test('Verify that user is able to navigate to the PDP from homepage', { tag: ['@regression', '@smoke', '@homepage'] }, async () => {

    const counts = await cartPage.txt_productTitle.count(); //getting the product counts

    //iterating over the products using for loop to verify the product title on PDP
    for (let i = 0; i < counts; i++) {
        const productTitleFromHomepage = cartPage.txt_productTitle;
        const productTitleHomepage = await productTitleFromHomepage.nth(i).innerText()  //getting product title from homepage
        await productTitleFromHomepage.nth(i).click()
        const productTitleFromPDP = await homePage.txt_productTitleFromPdp.innerText(); //getting the product title from PDP

        //checcking both the values are same
        if (productTitleHomepage == productTitleFromPDP) {
            logger.info('Product Title Matched');
        } else {
            logger.error('Product Title not Matched');
        }
        await homePage.btn_backToProducts.click(); //navigating back to homepage after each assertion
        

    }
});