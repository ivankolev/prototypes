const {Builder, By, until, promise} = require('selenium-webdriver');
const fs = require('fs');

require('chromedriver');

class Jimo {
    constructor() {
        promise.USE_PROMISE_MANAGER = false;
        this.driver = new Builder()
            .forBrowser('chrome')
            .build();
    }

    async run() {
        await new Promise(async(resolve, reject) => {
            try {
                for(const page of [...Array(39).keys()]) {
                    await this.driver.get('http://www.segabg.com/author.php?m=c&aid=2&p='+(page+1));
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
        await new Promise(async(resolve, reject) => {
            try {
                for (const href of hrefs) {
                    await this.driver.get(href);
                    const articleTitle = await this.driver.findElement(By.css('div[class="article"]')).findElement(By.css('div[class="a_title"]')).getText();
                    const articleText = await this.driver.findElement(By.css('div[class="article"]')).findElement(By.css('div[class="a_content"]')).getText();
                    const articleTitleNormalized = articleTitle.toLocaleLowerCase().replace(/ /g, '_');
                    console.log(articleTitleNormalized);
                    console.log(articleText);
                    await fs.writeFile(articleTitleNormalized + '.txt', articleText, function (err) {
                        if (err) return console.log(err);
                        console.log(articleTitleNormalized + ' saved to disk');
                    });
                    await this.driver.sleep(1000 * 60 * 5);
                }
                resolve();
            } catch (error) {
                reject(error);
            }
        });


    }
}


const jimoInstance = new Jimo();
console.log(jimoInstance.run());