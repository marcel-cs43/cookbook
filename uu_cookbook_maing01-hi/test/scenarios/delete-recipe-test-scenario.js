const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
let driver;
describe('Scenario to test Delete Recipe functionality:', function() {
    this.timeout(10000);

    before(async function() {
        this.timeout(10000);
        driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();
    });

it('Test ID: 10 - Should interact with tile and delete recipe', async function() {
    await driver.get('http://localhost:1234/uu-cookbook-maing01/0/recipes'); 

    const binIcons = await driver.wait(until.elementsLocated(By.css('[data-name="Uu5Elements.Icon"]')), 5000);
    await driver.sleep(1000);
    const deleteButton = binIcons[2];
    await deleteButton.click();

    await driver.sleep(1000);
    const alert = await driver.wait(until.elementLocated(By.xpath('//div[contains(text(), "Recipe")]')), 5000);
});
});
after(async function() {
    await driver.quit();
});