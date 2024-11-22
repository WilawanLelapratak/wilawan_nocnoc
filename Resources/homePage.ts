import { Page } from '@playwright/test';

export default class HomePage {
    constructor(public page: Page) { }
    async goToProductDetailPage() {
        await this.page.getByTestId('recommend-section').waitFor();
        let element = await this.page.locator('xpath=//*[@data-testid="recommend-section"]//a[1]')
        await element.waitFor();
        await element.click();
        await this.page.locator('xpath=//*[@class="product-desc"]//h1').waitFor();
    }
}