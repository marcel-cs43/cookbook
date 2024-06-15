const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
let driver;
describe('Scenario to test Update Recipe functionality:', function() {
    this.timeout(10000);

    before(async function() {
        this.timeout(10000);
        driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();
    });

it('Test ID: 5 - Should interact with form and update recipe field name', async function() {
    await driver.get('http://localhost:1234/uu-cookbook-maing01/0/recipes'); 

    const tile = await driver.wait(until.elementLocated(By.css('[data-name="Uu5TilesElements.TileRenderer"]')), 5000);
    await tile.click();

    let updateButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Update")]')), 5000);
    await driver.executeScript("arguments[0].scrollIntoView(true);", updateButton);
    await driver.sleep(1000);
    await updateButton.click();
    
    const nameInput = await driver.wait(until.elementLocated(By.name('name')), 5000);
    await nameInput.sendKeys('Cheesy Toast');

    const submitButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Submit")]')), 5000);
    await submitButton.click();

    const alert = await driver.wait(until.elementLocated(By.xpath('//div[contains(text(), "Recipe updated")]')), 5000);
});

it('Test ID: 6 - Should interact with form and update recipe field text', async function() {
    await driver.get('http://localhost:1234/uu-cookbook-maing01/0/recipes'); 

    const tile = await driver.wait(until.elementLocated(By.css('[data-name="Uu5TilesElements.TileRenderer"]')), 5000);
    await tile.click();

    let updateButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Update")]')), 5000);
    await driver.executeScript("arguments[0].scrollIntoView(true);", updateButton);
    await driver.sleep(1000);
    await updateButton.click();

    const descInput = await driver.wait(until.elementLocated(By.name('text')), 5000);
    await driver.wait(until.elementIsVisible(descInput), 5000);
    await descInput.sendKeys('Just simple Toast with Cheese');

    const submitButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Submit")]')), 5000);
    await submitButton.click();

    const alert = await driver.wait(until.elementLocated(By.xpath('//div[contains(text(), "Recipe updated")]')), 5000);
});

it('Test ID: 8 - Should interact with form and update recipe field text', async function() {
    await driver.get('http://localhost:1234/uu-cookbook-maing01/0/recipes'); 

    const tile = await driver.wait(until.elementLocated(By.css('[data-name="Uu5TilesElements.TileRenderer"]')), 5000);
    await tile.click();

    let updateButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Update")]')), 5000);
    await driver.executeScript("arguments[0].scrollIntoView(true);", updateButton);
    await driver.sleep(1000);
    await updateButton.click();

    const nameInput = await driver.wait(until.elementLocated(By.name('name')), 5000);
    await nameInput.sendKeys('Cheesy Toast');

    const descInput = await driver.wait(until.elementLocated(By.name('text')), 5000);
    await driver.wait(until.elementIsVisible(descInput), 5000);
    await descInput.sendKeys('Just simple Toast with Cheese');

    const imageInput = await driver.wait(until.elementIsVisible(driver.findElement(By.name('image'))), 5000);
    await imageInput.sendKeys('/Users/marcelcsoglei/Documents/GitHub/cookbook/uu_cookbook_maing01-hi/src/assets/logo.png');

    const submitButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Submit")]')), 5000);
    await submitButton.click();

    const alert = await driver.wait(until.elementLocated(By.xpath('//div[contains(text(), "Recipe updated")]')), 5000);
});

it('Test ID: 9 - Should interact with form and update recipe clear field text and image', async function() {
    await driver.get('http://localhost:1234/uu-cookbook-maing01/0/recipes'); 

    const tile = await driver.wait(until.elementLocated(By.css('[data-name="Uu5TilesElements.TileRenderer"]')), 5000);
    await tile.click();

    let updateButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Update")]')), 5000);
    await driver.executeScript("arguments[0].scrollIntoView(true);", updateButton);
    await driver.sleep(1000);
    await updateButton.click();

    const nameInput = await driver.wait(until.elementLocated(By.name('name')), 5000);
    await nameInput.sendKeys('Cheesy Toast');

    const descInput = await driver.wait(until.elementLocated(By.name('text')), 5000);
    await driver.wait(until.elementIsVisible(descInput), 5000);
    for(let i=0; i<100; i++) {
        await descInput.sendKeys(Key.BACK_SPACE);
    }

    const imageInput = await driver.wait(until.elementIsVisible(driver.findElement(By.name('image'))), 5000);
    await driver.executeScript("arguments[0].value = '';", imageInput);

    const submitButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Submit")]')), 5000);
    await submitButton.click();

    const alert = await driver.wait(until.elementLocated(By.xpath('//div[contains(text(), "Please provide either text or image.")]')), 5000);
});

});
after(async function() {
    await driver.quit();
});