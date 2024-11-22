import { test, expect } from '@playwright/test';
import HomePage from '../Resources/homePage';

test.beforeEach(async ({page, baseURL}) => {
  await page.goto(`${baseURL}`);
});

test('Test Homepage Can Switch Language', async ({ page }) => {
  let element = await page.getByTestId('language-btn');
  await element.waitFor();
  await element.click();
  await page.getByAltText('EN').click();
  await expect(page.getByTestId('menu-btn')).toHaveText('All Products');
  await page.getByTestId('language-btn').click();
  await page.getByAltText('ไทย').click();
  await expect(page.getByTestId('menu-btn')).toHaveText('สินค้าทั้งหมด');
});

test('Click login button then have modal to input mobile number or email', async ({page}) => {
  let element = await page.getByTestId('login-btn');
  await element.waitFor();
  await element.click();
  await expect(page.locator('xpath=//*[@class="modal-content"]')).toBeVisible();
  await expect(page.locator('xpath=//*[@class="login-landing-page"]')).toContainText('ยินดีต้อนรับสู่ NocNoc');
});

test('Navigate to shopping cart', async ({page}) => {
  let element = await page.getByTestId('cart-btn');
  let expectElement = await page.locator('xpath=//*[text()= "รถเข็นสินค้า"]');
  await element.waitFor();
  await element.click();
  await expect(expectElement).toBeVisible();
  await expect(expectElement).toHaveText('รถเข็นสินค้า');
});

test('Navigate to hot catagories(sofas)', async ({page})=> {
  let element = await page.locator('xpath=//*[@class="slick-list"]//*[text()="โซฟา"]');
  let expectElement = await page.locator('xpath=//*[text()="ผลการค้นหา “โซฟา”"]');
  await element.waitFor();
  await element.click();
  await expect(expectElement).toBeVisible();
  await expect(expectElement).toHaveText('ผลการค้นหา “โซฟา”');
});

test('Navigate to product catagories via All Products button', async ({page}) => {
  let element = await page.getByTestId('menu-btn')
  let expectElement = await page.locator('xpath=//main//*[@title="ห้องทำงาน"]');
  let url = await expectElement.getAttribute('href');
  await element.waitFor();
  await element.click();
  await expect(expectElement).toBeVisible();
  await expectElement.click();
  await expect(page).toHaveURL(`${url}`);
});

test('Search Product', async ({page}) => {
  await page.locator('#search-suggestion-input').waitFor();
  await page.locator('#search-suggestion-input').fill('โซฟา');
  expect(await page.locator('#search-suggestion-input').inputValue()).toBe('โซฟา');
  await page.locator('#search-suggestion-input').press('Enter');
  await expect(page.locator('xpath=//*[text()="ผลการค้นหา “โซฟา”"]')).toBeVisible();
  await expect(page.locator('xpath=//*[text()="ผลการค้นหา “โซฟา”"]')).toHaveText('ผลการค้นหา “โซฟา”');
});

test('Navigate to Product Detail Page', async ({page}) => {
  const homepage = new HomePage(page);
  await homepage.goToProductDetailPage();
  await expect(page.locator('xpath=//*[@class="product-desc"]//h1')).toBeVisible();
  await expect(page.locator('#product-overview-section')).toBeVisible();
});

test('Check Product Detail Page elements', async ({page}) => {
  const homepage = new HomePage(page);
  await homepage.goToProductDetailPage();
  await expect(page.locator('xpath=//*[@class="product-desc"]//h1')).toBeVisible();
  await expect(page.locator('#product-overview-section')).toBeVisible();
  await expect(page.locator('xpath=//*[@id="product-overview-section"]//*[@class="bu-group bu-relative"]/img')).toBeVisible();
  await expect(page.locator('#product-tab-section')).toBeVisible();
  await expect(page.locator('xpath=//*[@id="product-tab-section"]/ul[@class="tab-list"]/li[@class="active"]//*[text()="คำบรรยายสินค้า"]')).toBeVisible();
  await expect(page.locator('xpath=//*[@id="product-tab-section"]/*[contains(@class, "tab-content")]/*[contains(@class, "active")]//*[@id="overview"]')).toBeVisible();
  await page.locator('xpath=//*[@id="product-tab-section"]/ul[@class="tab-list"]//*[text()="คุณสมบัติสินค้า"]').click();
  await expect(page.locator('xpath=//*[@id="product-tab-section"]/ul[@class="tab-list"]/li[@class="active"]//*[text()="คุณสมบัติสินค้า"]')).toBeVisible();
  await expect(page.locator('xpath=//*[@id="product-tab-section"]/*[contains(@class, "tab-content")]/*[contains(@class, "active")]//*[@id="specifications"]')).toBeVisible();
  await page.locator('xpath=//*[@id="product-tab-section"]/ul[@class="tab-list"]//*[text()="การรับประกัน การคืนสินค้าและอื่นๆ"]').click();
  await expect(page.locator('xpath=//*[@id="product-tab-section"]/ul[@class="tab-list"]/li[@class="active"]//*[text()="การรับประกัน การคืนสินค้าและอื่นๆ"]')).toBeVisible();
  await expect(page.locator('xpath=//*[@id="product-tab-section"]/*[contains(@class, "tab-content")]/*[contains(@class, "active")]//*[@id="services"]')).toBeVisible();
  await expect(page.getByTestId('final-price-per-unit')).toBeVisible();
});

test('Checkout Product Now', async ({page}) => {
  const homepage = new HomePage(page);
  await homepage.goToProductDetailPage();
  await expect(page.locator('xpath=//*[@class="product-desc"]//h1')).toBeVisible();
  await expect(page.locator('#product-overview-section')).toBeVisible();
  await page.locator('#cartItems-checkout-now').click();
  await expect(page.locator('xpath=//*[@class="modal-content"]')).toBeVisible();
  await expect(page.locator('xpath=//*[@class="login-landing-page"]')).toContainText('ยินดีต้อนรับสู่ NocNoc');
});

test('Add Product to Cart', async ({page}) => {
  const homepage = new HomePage(page);
  await homepage.goToProductDetailPage();
  await expect(page.locator('xpath=//*[@class="product-desc"]//h1')).toBeVisible();
  let prodName = await page.locator('xpath=//*[@class="product-desc"]//h1').textContent();
  await page.locator('#cartItems-add-to-cart').click();
  await page.getByTestId('final-price-confirmation').waitFor();
  await expect(page.getByTestId('final-price-confirmation')).toBeVisible();
  await expect(page.locator('xpath=//*[@id="modal"]//*[text()="เพิ่มสินค้าจำนวน 1 รายการแล้ว"]')).toHaveText('เพิ่มสินค้าจำนวน 1 รายการแล้ว');
  await expect(page.locator('xpath=//*[@id="modal"]//*[@class="bu-typography-label-2"]')).toHaveText(`${prodName}`);
  await page.locator('//*[@id="modal"]//button[text()="ดูสินค้าบนรถเข็น"]').click();
  await expect(page.locator('xpath=//*[text()= "รถเข็นสินค้า"]')).toBeVisible();
  await expect(page.locator('xpath=//*[text()= "รถเข็นสินค้า"]')).toHaveText('รถเข็นสินค้า');
  await expect(page.getByTestId('shop-section')).toContainText(`${prodName}`);
});