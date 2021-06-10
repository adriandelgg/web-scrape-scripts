const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const FileSystem = require('fs');
puppeteer.use(StealthPlugin());

puppeteer.launch().then(async browser => {
	const page = await browser.newPage();

	const businessCameos = [];

	// Page counter
	let counter = 0;
	do {
		await page.goto(
			`https://www.cameo.com/tags/promotional?nextToken=${counter}`,
			{ waitUntil: 'load', timeout: 0 }
		);
		await page.waitFor(1300);

		// Gets all celebs' names
		let celebs = await page.$$eval(
			'.Styled__StarcardGrid-sc-79dgm2-0.iLhTvt .Styled__Wrapper-sc-116g1k2-1.hNSzko .Styled__Name-sc-116g1k2-20.cogzsP',
			names => names.map(name => name.innerHTML)
		);

		// Get all celebs' prices
		let totalPrices = await page.$$eval(
			'.Styled__StarcardGrid-sc-79dgm2-0.iLhTvt .Styled__FooterContainer-sc-116g1k2-16.iuNkrn .Styled__BottomRowContainer-sc-116g1k2-21.jALSOf .Styled__FromPriceContainer-sc-116g1k2-24.ewWkSU .Styled__PriceContainer-sc-116g1k2-13.ftKQdq span',
			prices => prices.map(price => price.innerHTML)
		);

		// Loops through celebs and totalPrices to create objects with pairs and pushes to array.
		for (let j = 0; j < totalPrices.length; j++) {
			businessCameos.push({
				name: celebs[j],
				price: totalPrices[j]
			});
			console.log({ name: celebs[j], price: totalPrices[j] });
		}

		// Counter to go to next page.
		counter += 40;

		// Goes through pages while the next page arrow exists.
	} while (
		await page.$('img._3bNgNHn00MmCb48sAJy5It[src="/rounded-arrow-white.svg"]')
	);

	// Creates JSON file w/ results
	FileSystem.writeFile(
		'CameoBusiness.json',
		JSON.stringify(businessCameos),
		error => {
			if (error) throw error;
		}
	);
	await browser.close();
});
