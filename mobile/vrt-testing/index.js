const compareImages = require("resemblejs/compareImages");
const fs = require("mz/fs");

const differencesReport = {};

const getDiff = async (imageId) => {
    const options = {
        output: {
            errorColor: {
                red: 0,
                green: 0,
                blue: 255
            },
            errorType: "movement",
            transparency: 0.3,
            largeImageThreshold: 1200,
            useCrossOrigin: false,
            outputDiff: true,
            ignoredBox: {
                left: 0,
                top: 0,
                bottom: 46
            }
        },
        scaleToSameSize: true,
        ignore: "antialiasing"
    };

    const data = await compareImages(
        await fs.readFile(`../appium-testing/screenshots/limpia/${imageId}.png`),
        await fs.readFile(`../appium-testing/screenshots/modificada/${imageId}.png`),
        options
    );
    differencesReport[imageId] = data;
    console.log(`Image ${imageId} processed with difference of: ${data.misMatchPercentage}`);
    await fs.writeFile(`./results/${imageId}.png`, data.getBuffer());
};

const main = async () => {
    try {
        await fs.rmdir('./results');
    } catch (error) {

    }
    await fs.mkdir('./results');
    const files = await fs.readdir('../appium-testing/screenshots/limpia');
    for (let index = 0; index < files.length; index++) {
        await getDiff(index);
    }
    await fs.writeFile('./results/report.json', JSON.stringify(differencesReport));
};

main();
