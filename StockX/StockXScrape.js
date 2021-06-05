const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const FileSystem = require('fs');
puppeteer.use(StealthPlugin());

const categories = [
	'streetwear',
	'sneakers',
	'trading-cards',
	'collectibles',
	'handbags',
	'watches',
	'electronics'
];

puppeteer.launch({ headless: false }).then(async browser => {
	const page = await browser.newPage();

	const totalResults = {};

	// Get all StockX's items
	for (let category = 0; category < categories.length; category++) {
		totalResults[categories[category]] = [];

		for (let pageNum = 1; pageNum <= 25; pageNum++) {
			await page.goto(
				`https://stockx.com/${categories[category]}?page=${pageNum}`
			);
			await page.waitFor(2000);

			let result = await page.$$eval(
				'.tile.browse-tile picture img',
				items => items.map(item => ({ title: item.alt, img: item.src }))
			);
			totalResults[categories[category]] = [
				...totalResults[categories[category]],
				...result
			];
		}
	}

	FileSystem.writeFile('stockX.json', JSON.stringify(totalResults), error => {
		if (error) throw error;
	});

	await browser.close();
});
