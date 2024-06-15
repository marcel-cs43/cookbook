const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
let driver;
describe('Scenario to test Create Recipe functionality:', function() {
    this.timeout(10000);

    before(async function() {
        this.timeout(10000);
        driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();
    });


it('Test ID: 1 - Should interact with form and create recipe with name and text', async function() {
    await driver.get('http://localhost:1234/uu-cookbook-maing01/0/recipes'); 

    let createButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Create")]')), 5000);
    await createButton.click();

    const nameInput = await driver.findElement(By.name('name'));
    await nameInput.sendKeys('Cheesy Toast');

    const descInput = await driver.findElement(By.name('text')); 
    await descInput.sendKeys('Just simple Toast with Cheese');

    const submitButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Submit")]')), 5000);
    await submitButton.click();

    createButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Create")]')), 5000);
});
it('Test ID: 3  - Should interact with form and create recipe with name, image and text', async function() {
        await driver.get('http://localhost:1234/uu-cookbook-maing01/0/recipes'); 

        let createButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Create")]')), 5000);
        await createButton.click();
    
        const nameInput = await driver.findElement(By.name('name'));
        await nameInput.sendKeys('Cheesy Toast');
    
        const descInput = await driver.findElement(By.name('text')); 
        await descInput.sendKeys('Just simple Toast with Cheese');
        
        const imageInput = await driver.wait(until.elementIsVisible(driver.findElement(By.name('image'))), 5000);
        await imageInput.sendKeys('/Users/marcelcsoglei/Documents/GitHub/cookbook/uu_cookbook_maing01-hi/src/assets/logo.png');

        const submitButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Submit")]')), 5000);
        await submitButton.click();

        createButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Create")]')), 5000);
});
it('Test ID: 4 - Should interact with form and create recipe with name', async function() {
    try {
        await driver.get('http://localhost:1234/uu-cookbook-maing01/0/recipes'); 

        let createButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Create")]')), 5000);
        await createButton.click();

        const nameInput = await driver.findElement(By.name('name'));
        await nameInput.sendKeys('Cheesy Toast');

        const submitButton = await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Submit")]')), 5000);
        await submitButton.click();

        try {
            await driver.switchTo().alert().accept();
            await driver.quit();
            return;
        } catch (alertError) {
            console.log('No Recipe created');
        }
    } catch (error) {
        console.error(error);
    }
});

});
    after(async function() {
        await driver.quit();
});
