require('dotenv').config();

const telegramBot = require('node-telegram-bot-api');
const bot = new telegramBot(process.env.TELEGRAM_BOT_API_KEY, { polling: true });

async function getLocation() {
	const request = await fetch(`https://ipinfo.io/json?token=${process.env.LOCATION_API_KEY}`);
	return await request.json();
}

async function getWeather() {
	const location = await getLocation();
	const data = {
		country: (location.country).toLowerCase()
	}

	const request = await fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location.loc}&lang=${data.country}`);
	return await request.json();
}

bot.onText(/\/start/, (msg) => {
	bot.sendMessage(msg.chat.id, `Приветствую вас! - ${msg.chat.first_name}`);
});

// bot.onText(/\/location/, async (msg) => {
// 	const location = await getLocation();
// 	bot.sendMessage(msg.chat.id, `IP: ${location.ip}\nХост: ${location.hostname}\nКоординаты: ${location.loc}`);
// });

bot.onText(/\/weather/, async (msg) => {
	const weather = await getWeather();
	const location = await getLocation();

	const weather_data = {
		last_updated: weather.current.last_updated,
		temp: Math.round(weather.current.temp_c),
		condition: {
			text: weather.current.condition.text,
			icon: weather.current.condition.icon
		},
	}

	// bot.sendMessage(msg.chat.id, `Город: ${location.city}\nПоследнее обновление: ${weather_data.last_updated}\nТемпература: ${weather_data.temp}°C\n${weather_data.condition.text}\n${weather_data.condition.icon}`);
	bot.sendMessage(msg.chat.id, `Город: ${location.city}\nПоследнее обновление: ${weather_data.last_updated}\nТемпература: ${weather_data.temp}°C\nСтатус: ${weather_data.condition.text}`);
});

bot.onText(/\/location_info/, async (msg) => {
	const location = await getLocation();
	const locData = {
		country: (location.country).toLowerCase()
	}

	bot.sendMessage(msg.chat.id, `Location data:\nCity - ${location.city}\nIP - ${location.ip}\nCountry - ${locData.country}`);
});