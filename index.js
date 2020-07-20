const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var randomUseragent = require("random-useragent");
randomUseragent.getRandom(); // gets a random user agent string
const Telegraf = require("telegraf");

// ! API KEY
const dotenv = require("dotenv");
dotenv.config({ path: `./config.env` });
const api_key = process.env.API_KEY;
const bot = new Telegraf(api_key);

const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");

const getLastNewsHespress = require("./methodes/websites");
const fs = require("fs");
let domOfHespress;
bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const response_time = new Date() - start;
  console.log(`(Response Time: ${response_time})`);
});

bot.start((ctx) => ctx.reply(`Hi ${ctx.from.first_name}, You need something?`));
bot.hears("Hespress", async (ctx) => {
  await getLastNewsHespress(ctx);
});
bot.hears("News", (ctx) => {
  ctx.reply(
    `Hi ${ctx.from.first_name}, What of news you want?`,
    Extra.HTML().markup(
      Markup.inlineKeyboard([
        Markup.callbackButton("Hespress", "Hespress"),
        Markup.callbackButton("Kooora", "Kooora"),
      ])
    )
  );
});
bot.action("Hespress", async (ctx) => {
  await getLastNewsHespress(ctx);
});
bot.action("Kooora", (ctx) => {
  ctx.editMessageText("Ok, wait", Extra.HTML());
});
bot.launch();
