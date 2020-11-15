import { Builder, By, Key, until, Actions } from 'selenium-webdriver';
import dotnv from 'dotenv'
dotnv.config()
const url1 = 'https://www.linkedin.com/?trk=guest_homepage-basic_nav-header-logo';
// const url2 = (i) => `https://www.linkedin.com/search/results/people/?facetGeoUrn=%5B%22106535873%22%5D&facetIndustry=%5B%2296%22%5D&keywords=Talent%20Acquisition&origin=FACETED_SEARCH&page=${i}
// const url2 = (i) => `https://www.linkedin.com/search/results/people/?facetGeoUrn=%5B%22103564821%22%2C%22102199904%22%2C%22106535873%22%5D&facetIndustry=%5B%2296%22%5D&keywords=it%20recruiter&origin=RELATED_SEARCH_FROM_SRP&page=${i}`
const url2 = (i) => `https://www.linkedin.com/search/results/people/?facetGeoUrn=%5B%22102199904%22%2C%22103564821%22%2C%22106535873%22%5D&keywords=information%20technology%20recruiter&origin=FACETED_SEARCH&page=${i}`
const token = process.env.TOKEN

const wait = (time) => {
  return new Promise((res) => {
    setTimeout(() => {
      res()
    }, time)
  })
}

// const login = async (driver, credentials) => {
//   await driver.findElement(By.id('username')).sendKeys(credentials.username);
//   await driver.findElement(By.id('password')).sendKeys(credentials.password);
//   await driver.findElement(By.className("btn__primary--large from__button--floating mercado-button--primary")).click();
//   await wait(120000)

// }


const connectToUser = async (driver) => {
  console.log('connect')
  await driver.findElements(By.className('mb3 ember-text-field ember-view')).then(async (e) => {
    console.log(e.length, 'eee')
    if (e.length > 0) {
      await driver.findElement(By.id('email')).sendKeys('sahilsingh6894@gmail.com');
      await driver.executeScript('arguments[0].click()', driver.findElement(By.className('ml1 artdeco-button artdeco-button--3 artdeco-button--primary ember-view')))
    } else {
      await driver.executeScript(
        'arguments[0].click()',
        driver.findElement(
          By.className('ml1 artdeco-button artdeco-button--3 artdeco-button--primary ember-view')
        )
      )
    }
  });
};

const findAndClickConnectButton = async (driver, index) => {
  await driver.findElement(By.xpath(`//*[@class="search-results__list list-style-none "]/li[${index}]/div/div/div[3]/div/button`)).then(async (button) => {
    if (await button.getText() === 'Connect') {
      await driver.executeScript(
        'arguments[0].click()',
        driver.findElement(
          By.xpath(`//*[@class="search-results__list list-style-none "]/li[${index}]/div/div/div[3]/div/button`)
        )
      )
    }
  })

};

const findConnectItemFromList = async (driver) => {
  await driver.executeScript(`document.getElementsByClassName('pv-s-profile-actions__overflow-dropdown display-flex artdeco-dropdown__content artdeco-dropdown--is-dropdown-element artdeco-dropdown__content--justification-left artdeco-dropdown__content--placement-bottom ember-view')[0].className = 'pv-s-profile-actions__overflow-dropdown display-flex artdeco-dropdown__content artdeco-dropdown__content--is-open artdeco-dropdown--is-dropdown-element artdeco-dropdown__content--justification-left artdeco-dropdown__content--placement-bottom ember-view'`)
  await wait(100)
  await driver.findElement(By.className('pv-s-profile-actions__overflow-dropdown display-flex artdeco-dropdown__content artdeco-dropdown__content--is-open artdeco-dropdown--is-dropdown-element artdeco-dropdown__content--justification-left artdeco-dropdown__content--placement-bottom ember-view'))
    .then(async (xo) => {
      let connected = String(await xo.getText()).includes('Remove Connection');
      let requestPending = String(await xo.getText()).includes('Pending');
      if (!connected) {
        if (!requestPending) {
          await driver.executeScript('arguments[0].click()', driver.findElement(By.className('pv-s-profile-actions pv-s-profile-actions--connect pv-s-profile-actions__overflow-button full-width text-align-left artdeco-dropdown__item artdeco-dropdown__item--is-dropdown ember-view')))
          await wait(2000)
          await connectToUser(driver)
        }
      }
    })


};

(async () => {
  const capabilities = {
    platform: 'windows 10',
    browserName: 'chrome',
    version: '67.0',
    resolution: '1920x1080',
    network: true,
    visual: true,
    console: true,
    video: true,
    name: 'Test 1', // name of the test
    build: 'NodeJS build' // name of the build
  };

  const driver = new Builder().withCapabilities(capabilities).build();
  try {
    await driver.manage().window().maximize();
    await wait(1000)
    await driver.get(url1);
    await driver.manage().addCookie({ name: 'li_at', value: token })

    let x = 1
    while (x <= 10) {
      console.log(x)
      await driver.get(url2(x));
      await driver.findElements(By.xpath(`//*[@class="search-results__list list-style-none "]/li`)).then(async (elements) => {
        for (let i = 1; i <= elements.length; i++) {
          await driver.findElement(By.xpath(`//*[@class="search-results__list list-style-none "]/li[${i}]`))
          await driver.executeScript("arguments[0].scrollIntoView();", driver.findElement(By.xpath(`//*[@class="search-results__list list-style-none "]/li[${i}]`)));
          await wait(500)
          let type = false

          try {
            await driver.findElement(By.xpath(`//*[@class="search-results__list list-style-none "]/li[${i}]/div/div/div[3]`)).then(async (e) => {
              type = await e.getText()
            })
          } catch (error) {
            type = false
          }

          switch (type) {
            case 'Connect':
              console.log('hell')
              await findAndClickConnectButton(driver, i)
              await wait(500)
              await connectToUser(driver)
              break;
            case 'Message':
              //click on href to enter profile
              await driver.executeScript(
                'arguments[0].click()',
                driver.findElement(By.xpath(`//*[@class="search-results__list list-style-none "]/li[${i}]/div/div/div[2]/a/h3/span/span/span`)))
              await driver.wait(driver.executeScript("return document.readyState"))
              await wait(2000)
              await findConnectItemFromList(driver)
              await wait(500)
              await driver.navigate().back();
              await driver.wait(driver.executeScript("return document.readyState"))
              await wait(2000)
              break;

            default:
              break;
          }
        }
      });
      x++;
    }

  } catch (e) {
    console.log(`Error => ${e}`)
  } finally {
    // setTimeout(async () => { await driver.quit(); }, 10000)

  }

})();


