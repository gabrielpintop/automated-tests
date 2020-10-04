const wdio = require("webdriverio");
const path = require('path');
const assert = require("assert").strict;
const { execSync } = require('child_process');
const packageName = 'org.quantumbadger.redreader';
const opts = {
    port: 4723,
    path: "/wd/hub",
    capabilities: {
        platformName: 'Android',
        platformVersion: '9',
        deviceName: process.argv.slice(2)[0] || 'Pixel_2_API_28',
        app: '',
        automationName: 'UiAutomator2'
    },
};

let client;
let picture = 0;
let currentName = '';
const tests = { limpia: { start: null, end: null, results: [], success: 0, total: 0 }, modificada: { start: null, end: null, results: [], success: 0, total: 0 } };
let maxSubreddits = 0;

const main = async (name) => {
    try {
        tests[name].start = new Date().getTime();
        currentName = name;
        picture = 0;
        uninstallApp();
        opts.capabilities.app = path.join(__dirname, '..', `/apks/RedReader-${name}.apk`);
        client = await wdio.remote(opts);
        await takeScreenshot();
        const button = await client.$('android.widget.Button');
        await button.click();
        await client.pause(300);
        await takeScreenshot();
        await testSubreddits();
        await testMainOptions();
        tests[name].end = new Date().getTime();
        await client.deleteSession();
        if (name === 'limpia') {
            await setTimeout(() => { main('modificada'); }, 2000);
        } else {
            printTestsResults('limpia');
            printTestsResults('modificada');
        }
    } catch (error) {
        console.log(error);
        tests[name].end = new Date().getTime();
        printTestsResults('limpia');
        printTestsResults('modificada');
    }
}

const uninstallApp = () => {
    try {
        execSync(`adb uninstall ${packageName}`);
    } catch (error) {
        console.log(error);
    }
};

const printTestsResults = (key) => {
    console.log('-------------------------------------------------------------------------');
    console.log(key + ' tests results:');
    console.log('Total time: ', tests[key].end - tests[key].start);
    console.log(`Success rate: ${tests[key].success} of ${tests[key].total} `);
    tests[key].results.forEach(test => {
        console.log(test);
    });
};

const makeTest = (testInfo, name) => {
    tests[currentName].total++;
    try {
        assert(testInfo);
        tests[currentName].success++;
        tests[currentName].results.push(`Success: ${name}`);
    } catch (error) {
        console.log(name);
        console.log(error);
        tests[currentName].results.push(`Error: ${name}`);
    }
};

const takeScreenshot = async () => {
    await client.saveScreenshot(path.join(__dirname, `/screenshots/${currentName}/${picture}.png`));
    picture++;
};

const testSubreddits = async () => {
    const ignore = ['RedReader', 'Custom Location', 'Subscribed Subreddits',];
    const subredditsContainer = await client.$('android=new UiSelector().resourceId("org.quantumbadger.redreader:id/scrollbar_recyclerview_recyclerview")');
    const subreddits = await subredditsContainer.$$('android.widget.FrameLayout');
    let textView, title, subredditTitle, back, subredditText;
    if (maxSubreddits === 0) {
        maxSubreddits = subreddits.length;
    }
    for (let index = 0; index < subreddits.length && index < maxSubreddits; index++) {
        textView = await subreddits[index].$('android.widget.TextView');
        title = await textView.getText();
        if (!ignore.includes(title)) {
            await subreddits[index].click();
            await client.pause(100);
            subredditTitle = await client.$('android=new UiSelector().resourceId("org.quantumbadger.redreader:id/actionbar_title_text")');
            subredditText = await subredditTitle.getText();
            makeTest(subredditText.toLowerCase().includes(title.toLowerCase()), `Comparing subreddits ${title} with ${subredditText}`);
            await takeScreenshot();
            back = await client.$('android=new UiSelector().resourceId("org.quantumbadger.redreader:id/actionbar_title_outer")');
            await back.click();
        }
    }
};

const testMainOptions = async () => {
    const moreOptions = await client.$('~More options');
    await moreOptions.click();
    await client.pause(200);
    const options = await client.$$('android=new UiSelector().resourceId("org.quantumbadger.redreader:id/content")');
    await takeScreenshot();
    await testOpenModal(options, 0, 'Reddit Accounts');
    await moreOptions.click();
    await testOpenModal(options, 1, 'Theme');
    await moreOptions.click();
    await options[2].click();
    await testSettings();
};

const testOpenModal = async (options, index, title) => {
    await options[index].click();
    try {
        const alertTitle = await client.$('android=new UiSelector().resourceId("android:id/alertTitle")');
        const alertText = await alertTitle.getText();
        makeTest(alertText === title, `Comparing modal titles: ${title} with ${alertText}`)
        await takeScreenshot();
        await client.back();
    } catch (error) {
        await takeScreenshot();
        tests[currentName].results.push(`Error opening modal for: ${title}`)
        console.log(error);
    }
};

const testSettings = async () => {
    const settingsOptionsContainer = await client.$('android=new UiSelector().resourceId("android:id/list")');
    const settingOptions = await settingsOptionsContainer.$$('android.widget.LinearLayout');
    const titlesElement = await settingsOptionsContainer.$$('android=new UiSelector().resourceId("android:id/title")');
    const titles = [];
    for (let index = 0; index < titlesElement.length; index++) {
        titles.push(await titlesElement[index].getText());
    }
    await takeScreenshot();
    let bar, selectedSettingTitle, selectedTitle;
    for (let index = 0; index < settingOptions.length; index++) {
        const setting = settingOptions[index];
        await setting.click();
        await client.pause(300);
        bar = await client.$('android=new UiSelector().resourceId("org.quantumbadger.redreader:id/action_bar_container")');
        selectedSettingTitle = await bar.$('android.widget.TextView');
        selectedTitle = await selectedSettingTitle.getText();
        assert(selectedTitle === titles[index]);
        await takeScreenshot();
        await client.back();
    }
    await settingOptions[settingOptions.length - 1].click();
    await takeScreenshot();
    await testAbout();
}

const testAbout = async () => {
    const aboutContainer = await client.$('android=new UiSelector().resourceId("android:id/list")');
    const aboutOptions = await aboutContainer.$$('android.widget.LinearLayout');
    await aboutOptions[1].click();
    await clickBackButton('android.widget.ImageButton', 'About: license');
    await client.pause(200);
    await aboutOptions[2].click();
    await client.pause(200);
    await clickBackButton('android=new UiSelector().resourceId("org.quantumbadger.redreader:id/actionbar_title_outer")', 'About: Whats new');
    await client.pause(200);
    await clickBackButton('android.widget.ImageButton', 'About');
};

const clickBackButton = async (query = 'android.widget.ImageButton', location = '') => {
    try {
        const backButton = await client.$(query);
        await backButton.click();
    } catch (error) {
        await client.back();
        tests[currentName].results.push(`Error on trying to get back by using the button: ${query} in ${location}`,)
    }
};

main('limpia');

// {
//   "platformName": "Android",
//   "platformVersion": "9",
//   "deviceName": "Pixel_2_API_28",
//   "app": "/Users/gabrielpintop/Documents/automated-tests/mobile/apks/RedReader-limpia.apk"
// }