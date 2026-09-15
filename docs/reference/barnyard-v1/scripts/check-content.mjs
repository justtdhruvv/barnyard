// Guards the two rules the demo lives by: facts are verified, and every image that exists is credited.
import fs from "node:fs";

const cafe = JSON.parse(fs.readFileSync("content/cafe.json", "utf8"));
const media = JSON.parse(fs.readFileSync("content/media.json", "utf8"));
let fail = 0;

const press = Object.fromEntries(cafe.press.map((p) => [p.publication, p]));
const expect = {
  "Condé Nast Traveller India": { date: "2024-09-12", link: "https://www.cntraveller.in/story/cafes-in-ahmedabad/" },
  "ELLE Decor India": {
    date: "2025-06-10",
    link: "https://elledecor.in/12-design-oriented-restaurants-delhi-bengaluru-amritsar-hyderabad/",
  },
};
for (const [pub, e] of Object.entries(expect)) {
  const p = press[pub];
  if (!p) {
    console.error(`missing press: ${pub}`);
    fail++;
    continue;
  }
  if (p.date !== e.date) {
    console.error(`${pub}: date ${p.date} != ${e.date}`);
    fail++;
  }
  if (p.link !== e.link) {
    console.error(`${pub}: link ${p.link}`);
    fail++;
  }
}

for (const s of media.slots) {
  const file = ["jpg", "webp"].map((x) => `public/media/${s.id}.${x}`).find((f) => fs.existsSync(f));
  if (file && !s.credit) {
    console.error(`${s.id}: has a file but no credit`);
    fail++;
  }
  if (/UNKNOWN|CONFIRM/.test(`${s.subject} ${s.alt}`)) {
    console.error(`${s.id}: flagged text in subject or alt`);
    fail++;
  }
}

if (fail) process.exit(1);
console.log("content ok");
