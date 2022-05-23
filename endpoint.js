const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000;
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "<gmail devacc>",
    pass: "<gmail dev password>",
  },
});

app.get("/getData", (req, resp) => {
  resp.send("Hello world");
});

app.post("/test", async (req, res) => {
  //console.log("req body" + test);
  //getIngredientsList(req.body);
  let array = [];
  req.body.forEach((element) => {
    array.push(element);
  });

  console.log(array + "this is array");
  let ingridentsListArray = [];
  console.log(ingridentsListArray + "this is ingrediensts should be 0");
  let htmlStringBuild = await forEachTest(array).then((returnedStuff) => {
    return returnedStuff;
  });
  console.log(htmlStringBuild + "this is the htmlString");
  mailIngredients(htmlStringBuild);

  res.status(200).send();
});

app.post("/data", async (req, res) => {
  const { recipeLink } = req.body;

  console.log(recipeLink);
  const recepieAwnser = await scrapeStuff(recipeLink);
  mailIngredients(recepieAwnser, recipeLink);
  res.send();
});

app.listen(port, () => console.log(`hello world app listinng on port ${port}`));

async function scrapeStuff(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });
  let data;
  data = await page.evaluate(() => {
    let ingredients = document.querySelector(
      'div[class="ingredients-list-group row-noGutter-column"]'
    ).outerHTML;
    return ingredients;
  });
  console.log(data);
  return data;
}

function mailIngredients(ingredents) {
  const test = `${ingredents}`;

  const mailOptions = {
    from: "<Avsändare>",
    to: "<Motaggare>",
    subject: "Ingredients",
    text: "ingredents",
    html: `${test}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("email sent: " + info.response);
    }
  });
}
async function getIngredientsList(array) {
  let stringBuild = "";
  let concatedString = "";

  let result = await array.forEach(async (element) => {
    const recepieAwnser = await scrapeStuff(element).then((message) => {
      return message;
    });
    //console.log(recepieAwnser + "this is the scraped values");

    stringBuild = concatedString.concat(
      `<link>${element}</link>${recepieAwnser}`
    );
    console.log(stringBuild + "this is stringbuilder");
    return stringBuild;
  });
  console.log((await result) + "this is crazy test");
  return result;
}

async function getIngredientsListMap(array) {
  let stringBuild = "";
  let concatedString = "";

  let resultString = await array.map(async (items) => {
    const recepieAwnser = await scrapeStuff(items).then((message) => {
      return message;
    });

    stringBuild = concatedString.concat(
      `<link>${items}</link>${recepieAwnser}`
    );
    console.log(stringBuild + "this is stringbuilder");

    return String;
  });
  resultString.t;
  console.log(resultString + "this is result string");
  return resultString;
}

async function forEachTest(array) {
  let emptyStringOne = "";
  let emptyStringTwo = "";

  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    emptyStringOne = await scrapeStuff(element).then((message) => {
      console.log("this is message:" + message);
      return `<link>${element}</link>${message}`;
    });
    emptyStringTwo += emptyStringOne;
    console.log("stringone in classic for loop" + emptyStringOne);
    console.log("this is empty string 2:" + emptyStringTwo);
  }

  return emptyStringTwo;
}
