'use strict';

var _seleniumWebdriver = require('selenium-webdriver');

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var url1 = 'https://www.linkedin.com/?trk=guest_homepage-basic_nav-header-logo';
// const url2 = (i) => `https://www.linkedin.com/search/results/people/?facetGeoUrn=%5B%22106535873%22%5D&facetIndustry=%5B%2296%22%5D&keywords=Talent%20Acquisition&origin=FACETED_SEARCH&page=${i}
// const url2 = (i) => `https://www.linkedin.com/search/results/people/?facetGeoUrn=%5B%22103564821%22%2C%22102199904%22%2C%22106535873%22%5D&facetIndustry=%5B%2296%22%5D&keywords=it%20recruiter&origin=RELATED_SEARCH_FROM_SRP&page=${i}`
var url2 = function url2(i) {
  return 'https://www.linkedin.com/search/results/people/?facetGeoUrn=%5B%22102199904%22%2C%22103564821%22%2C%22106535873%22%5D&keywords=information%20technology%20recruiter&origin=FACETED_SEARCH&page=' + i;
};
var token = process.env.TOKEN;

var wait = function wait(time) {
  return new Promise(function (res) {
    setTimeout(function () {
      res();
    }, time);
  });
};

// const login = async (driver, credentials) => {
//   await driver.findElement(By.id('username')).sendKeys(credentials.username);
//   await driver.findElement(By.id('password')).sendKeys(credentials.password);
//   await driver.findElement(By.className("btn__primary--large from__button--floating mercado-button--primary")).click();
//   await wait(120000)

// }


var connectToUser = async function connectToUser(driver) {
  console.log('connect');
  await driver.findElements(_seleniumWebdriver.By.className('mb3 ember-text-field ember-view')).then(async function (e) {
    console.log(e.length, 'eee');
    if (e.length > 0) {
      await driver.findElement(_seleniumWebdriver.By.id('email')).sendKeys('sahilsingh6894@gmail.com');
      await driver.executeScript('arguments[0].click()', driver.findElement(_seleniumWebdriver.By.className('ml1 artdeco-button artdeco-button--3 artdeco-button--primary ember-view')));
    } else {
      await driver.executeScript('arguments[0].click()', driver.findElement(_seleniumWebdriver.By.className('ml1 artdeco-button artdeco-button--3 artdeco-button--primary ember-view')));
    }
  });
};

var findAndClickConnectButton = async function findAndClickConnectButton(driver, index) {
  await driver.findElement(_seleniumWebdriver.By.xpath('//*[@class="search-results__list list-style-none "]/li[' + index + ']/div/div/div[3]/div/button')).then(async function (button) {
    if ((await button.getText()) === 'Connect') {
      await driver.executeScript('arguments[0].click()', driver.findElement(_seleniumWebdriver.By.xpath('//*[@class="search-results__list list-style-none "]/li[' + index + ']/div/div/div[3]/div/button')));
    }
  });
};

var findConnectItemFromList = async function findConnectItemFromList(driver) {
  await driver.executeScript('document.getElementsByClassName(\'pv-s-profile-actions__overflow-dropdown display-flex artdeco-dropdown__content artdeco-dropdown--is-dropdown-element artdeco-dropdown__content--justification-left artdeco-dropdown__content--placement-bottom ember-view\')[0].className = \'pv-s-profile-actions__overflow-dropdown display-flex artdeco-dropdown__content artdeco-dropdown__content--is-open artdeco-dropdown--is-dropdown-element artdeco-dropdown__content--justification-left artdeco-dropdown__content--placement-bottom ember-view\'');
  await wait(100);
  await driver.findElement(_seleniumWebdriver.By.className('pv-s-profile-actions__overflow-dropdown display-flex artdeco-dropdown__content artdeco-dropdown__content--is-open artdeco-dropdown--is-dropdown-element artdeco-dropdown__content--justification-left artdeco-dropdown__content--placement-bottom ember-view')).then(async function (xo) {
    var connected = String((await xo.getText())).includes('Remove Connection');
    var requestPending = String((await xo.getText())).includes('Pending');
    if (!connected) {
      if (!requestPending) {
        await driver.executeScript('arguments[0].click()', driver.findElement(_seleniumWebdriver.By.className('pv-s-profile-actions pv-s-profile-actions--connect pv-s-profile-actions__overflow-button full-width text-align-left artdeco-dropdown__item artdeco-dropdown__item--is-dropdown ember-view')));
        await wait(2000);
        await connectToUser(driver);
      }
    }
  });
};

(async function () {
  var capabilities = {
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

  var driver = new _seleniumWebdriver.Builder().withCapabilities(capabilities).build();
  console.log(process.env, 'process.env');
  try {
    await driver.manage().window().maximize();
    await wait(1000);
    await driver.get(url1);
    await driver.manage().addCookie({ name: 'li_at', value: token });

    var x = 1;
    while (x <= 10) {
      console.log(x);
      await driver.get(url2(x));
      await driver.findElements(_seleniumWebdriver.By.xpath('//*[@class="search-results__list list-style-none "]/li')).then(async function (elements) {
        for (var i = 1; i <= elements.length; i++) {
          await driver.findElement(_seleniumWebdriver.By.xpath('//*[@class="search-results__list list-style-none "]/li[' + i + ']'));
          await driver.executeScript("arguments[0].scrollIntoView();", driver.findElement(_seleniumWebdriver.By.xpath('//*[@class="search-results__list list-style-none "]/li[' + i + ']')));
          await wait(500);
          var type = false;

          try {
            await driver.findElement(_seleniumWebdriver.By.xpath('//*[@class="search-results__list list-style-none "]/li[' + i + ']/div/div/div[3]')).then(async function (e) {
              type = await e.getText();
            });
          } catch (error) {
            type = false;
          }

          switch (type) {
            case 'Connect':
              console.log('hell');
              await findAndClickConnectButton(driver, i);
              await wait(500);
              await connectToUser(driver);
              break;
            case 'Message':
              //click on href to enter profile
              await driver.executeScript('arguments[0].click()', driver.findElement(_seleniumWebdriver.By.xpath('//*[@class="search-results__list list-style-none "]/li[' + i + ']/div/div/div[2]/a/h3/span/span/span')));
              await driver.wait(driver.executeScript("return document.readyState"));
              await wait(2000);
              await findConnectItemFromList(driver);
              await wait(500);
              await driver.navigate().back();
              await driver.wait(driver.executeScript("return document.readyState"));
              await wait(2000);
              break;

            default:
              break;
          }
        }
      });
      x++;
    }
  } catch (e) {
    console.log('Error => ' + e);
  } finally {
    // setTimeout(async () => { await driver.quit(); }, 10000)

  }
})();