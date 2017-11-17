const {Builder, Capabilities, By, until, promise} = require('selenium-webdriver');
const fs = require('fs');

require('chromedriver');

class Jimo {
    constructor() {
        const chromeCapabilities = Capabilities.chrome();
        chromeCapabilities.set('chromeOptions', {args: ['--headless']});
        promise.USE_PROMISE_MANAGER = false;
        this.driver = new Builder()
            .forBrowser('chrome')
            .withCapabilities(chromeCapabilities)
            .build();
    }

    async run() {
        await new Promise(async (resolve, reject) => {
            try {
                for(const page of [...new Array(39).keys()]) {
                    const pageCounter = page + 1;
                    console.log("entering page " + pageCounter);
                    await this.driver.get('http://www.segabg.com/author.php?m=c&aid=2&p='+ pageCounter);
                    const hrefs = [];
                    const articleLinks = await this.driver.findElements(By.css('a[class="readArticle"]'));
                    for (const articleLink of articleLinks) {
                        const href = await articleLink.getAttribute('href');
                        hrefs.push(href);
                    }
                    await this.processLinks(hrefs);
                }
                resolve();
            } catch (error) {
                reject(error);
            } finally {
                await this.driver.quit();
            }
        });
    }

    async processLinks(hrefs) {
        await new Promise(async (resolve, reject) => {
            try {
                for (const href of hrefs) {
                    await this.driver.get(href);
                    console.log("Entering href " + href);
                    const issueNumber = await this.driver.findElement(By.css('div[id="issue_number"]')).getText();
                    const articleTitle = await this.driver.findElement(By.css('div[class="article"]')).findElement(By.css('div[class="a_title"]')).getText();
                    const articleText = await this.driver.findElement(By.css('div[class="article"]')).findElement(By.css('div[class="a_content"]')).getText();
                    const articleTitleNormalized = articleTitle.toLocaleLowerCase()
                        .replace(/ /g, '_')
                        .replace(/\*/g, '(asterisk)')
                        .replace(/\?/g, '(question)')
                        .replace(/"/g, '(quote)');
                    const issueNumberNormalized = issueNumber.toLocaleLowerCase()
                        .replace(/брой /, '')
                        .replace(/ /g, '_');
                    let fileName = issueNumberNormalized + "_" + articleTitleNormalized + '.txt';
                    await fs.writeFile(fileName, articleText, function (err) {
                        if (err) return console.log(err);
                        console.log(fileName + ' saved to disk');
                    });
                    await this.driver.sleep(1000 * 4);
                }
                resolve();
            } catch (error) {
                throw new Error(error);
            }
        });


    }
}


const jimoInstance = new Jimo();
console.log(jimoInstance.run());
