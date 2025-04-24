import { test } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { CartPage } from '../../pages/CartPage';
import { CommonUtility } from '../../utils/common-utility';
import { pageObjectManager } from '../../pages/page-object-manager'
import CART_TEST_DATA from '../../test-data/cartpage/cart-test-data.json';
import LOGIN_TEST_DATA from '../../test-data/loginpage/loginpage-test-data.json';
import { LoginUtility } from '../../utils/login-utility';



let poManager: pageObjectManager;
let loginPage: LoginPage;
let assert: CommonUtility;
let homePage: HomePage;
let cartPage: CartPage;
let loginUtility: LoginUtility;
let creds: any;


test.beforeEach('Perform Login into the application', async ({ page }) => {

    poManager = new pageObjectManager(page)
    loginPage = await poManager.getLoginPage(); //getting the login page instance
    assert = await poManager.getAssertionUtility(); //getting the assert class instance
    homePage = await poManager.getHomePage();  //getting the home page instance
    cartPage = await poManager.getCartPage();  //getting the cart page instance
    loginUtility = await poManager.loginCredentials(); //getting the login utility instance
    creds = await loginUtility.getUserCredentials(LOGIN_TEST_DATA.loginCredentials); //loading the login credentials

    await loginPage.navigateToPage(); //navigating to the application url
    await loginPage.validLogin(creds.username, creds.password); //performing the login action
});


test('Verify user is able to checkout with multiple items successfully', { tag: ['@regression', '@smoke', '@cartpage'] }, async ({ page }) => {
    const productsBeforeCart = await cartPage.cartProductsVerification(); //getting the product titles before adding them to the cart
    await homePage.addProductToCart('yes'); //Adding the products to cart & tapping on cart icon
    const productsInCart = await cartPage.cartProductsVerification(); //getting the product titles from the cart
    await assert.assertProductTitle(productsBeforeCart, productsInCart); //validating whether the products before & after adding to the cart
    await cartPage.btn_checkout.click(); //navigating to the user details enter page
    await cartPage.performCheckout('yes', CART_TEST_DATA.assertionData.firstName, CART_TEST_DATA.assertionData.lastName, CART_TEST_DATA.assertionData.postalCode); //entering the user details & checking out successfully

    await assert.assertMessage(cartPage.txt_complete, CART_TEST_DATA.successConfirmMessage.complete); //asserting the compete message on success screen
    await assert.assertMessage(cartPage.txt_thankyou, CART_TEST_DATA.successConfirmMessage.thankYou); //asserting the thank you message on success screen
    await cartPage.navigateHomeFromCheckout(); //Navigating back to homepage from confirmation screen
});


test('Verify user is unable to checkout with invalid user details', { tag: ['@regression', '@cartpage'] }, async () => {

    await homePage.addProductToCart('yes'); //Adding the products to cart & tapping on cart icon
    await cartPage.btn_checkout.click(); //navigating to the user details enter page

    //using for loop to iterate to verify the invalid user entry details
    for (const data of Object.keys(CART_TEST_DATA.assertionData)) {
        const updatedInvalidData = await assert.updateObject(CART_TEST_DATA.assertionData, { [data]: undefined }, []); //updating the existing valid user details with invalid ones
        await cartPage.performCheckout('no', updatedInvalidData.firstName, updatedInvalidData.lastName, updatedInvalidData.postalCode) //using the updated Invalid details 
        const expectedErrorMessage = CART_TEST_DATA.errorMessages[data] //storing the expected error messages
        await assert.assertMessage(cartPage.error_message, expectedErrorMessage); //asserting the actual error messages
    }

});

test('Verify user is able to remove the products & navigate back to hompage from cart page', { tag: ['@regression', '@cartpage'] }, async () => {
    await homePage.addProductToCart('yes'); //Adding the products to cart & tapping on cart icon
    const removeCtaCounts = cartPage.btn_remove;

    while (await removeCtaCounts.count() > 0) {
        await removeCtaCounts.first().click();  //removing the added products from the cartpage
    }
    const totalCartCount = cartPage.txt_cartCount;
    await assert.hiddenAssertion(totalCartCount); //asserting that cart count is not visible
    await cartPage.btn_continueShopping.click(); //navigating back to hompage from cartpage
    await assert.visibleAssertion(cartPage.txt_productsHeading); //verifying that "products" heading is visible

});

test('Verify that cart products are retained when user logs out from the checkout page & logs back in again', { tag: ['@regression', '@cartpage'] }, async () => {
    await homePage.addProductToCart('yes');  //Adding the products & navigation to the cart
    const productsInCartSessionOne = await cartPage.cartProductsVerification(); //getting product titles before logging out
    await cartPage.btn_checkout.click();  //navigating to the user details entry page
    await cartPage.performCheckout('no', CART_TEST_DATA.assertionData.firstName, CART_TEST_DATA.assertionData.lastName, CART_TEST_DATA.assertionData.postalCode) //Entering the user details & not proceeding with the final screen
    await homePage.performLogout(); //performing the logout from user details page
    await loginPage.validLogin(creds.username, creds.password); //performing the login functionality
    await homePage.btn_cartNavigation.click(); //navigating to the cart page
    const productsInCartSessionTwo = await cartPage.cartProductsVerification(); //getting product titles after logging back in
    await assert.assertProductTitle(productsInCartSessionOne, productsInCartSessionTwo); //comparing & asserting the products before & after logging out.

});


test('Verify cancelling the checkout journey from overview page & performs the checkout again', { tag: ['@regression', '@cartpage'] }, async () => {
    await homePage.addProductToCart('yes'); //Adding the products to cart & tapping on cart icon
    await cartPage.btn_checkout.click(); //navigating to the user details enter page
    await cartPage.performCheckout('no', CART_TEST_DATA.assertionData.firstName, CART_TEST_DATA.assertionData.lastName, CART_TEST_DATA.assertionData.postalCode)  //Entering the user details & not proceeding with the final screen
    await cartPage.btn_cancelOverview.click(); //cancelling the checkout from user details screen
    await homePage.btn_cartNavigation.click(); //navigating back again to the cart
    await cartPage.btn_checkout.click(); //navigating to the user details entry page
    await cartPage.performCheckout('yes', CART_TEST_DATA.assertionData.firstName, CART_TEST_DATA.assertionData.lastName, CART_TEST_DATA.assertionData.postalCode) //proceeding with the successfull checkout
    await assert.assertMessage(cartPage.txt_complete, CART_TEST_DATA.successConfirmMessage.complete);  //asserting the complete message on success screen
    await assert.assertMessage(cartPage.txt_thankyou, CART_TEST_DATA.successConfirmMessage.thankYou);  //asserting the Thank You message on success screen

});