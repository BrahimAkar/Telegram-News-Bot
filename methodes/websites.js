const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var randomUseragent = require("random-useragent");
randomUseragent.getRandom(); // gets a random user agent string
const Telegraf = require("telegraf");
const dotenv = require("dotenv");
dotenv.config({ path: `./config.env` });
const api_key = process.env.API_KEY;
const bot = new Telegraf(api_key);
const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
async function getLastNewsHespress(ctx) {
  ctx.reply(`Ok ${ctx.from.first_name}, give me a moment`);
  axios
    .get("https://www.hespress.com", {
      headers: {
        "User-Agent": randomUseragent.getRandom(),
      },
    })
    .then(function (response) {
      const dom = new JSDOM(response.data);
      console.log(
        "We got a response!!",
        dom.window.document.querySelector(
          "#content_features > div.content_features_left > h3 > a"
        ).textContent
      );
      let allElements = dom.window.document.querySelectorAll(
        ".headline_article_holder a"
      );
      let allTitles = [];
      allElements.forEach((el) => {
        if (el.textContent !== "(التفاصيل...)" && el.textContent !== "") {
          allTitles.push({
            title: el.textContent,
            link: "hespress.com" + el.getAttribute("href"),
          });
        }
      });
      allTitles.forEach((el) => {
        ctx.reply(el.title + "\n" + el.link + "\n\n");
      });
    })
    .catch(function (error) {
      ctx.reply(error.message);
    });
}

module.exports = getLastNewsHespress;
