const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Regression tests for the biology (digestion) Apply-it marking loopholes.
const root = path.resolve(__dirname, '..');
const context = {svgIcon: () => ''};
context.window = context;
context.DigestionWidgets = new Proxy({}, {get: () => () => {}});
context.Kit = new Proxy({}, {get: () => () => {}});
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'assets/engine.js'), 'utf8'), context);
context.Engine.start = topic => context.topic = topic;
for (const file of ['biology/digestion-data.js', 'biology/digestion-marks.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
}
const questions = {};
context.topic.lessons.forEach(lesson => questions[lesson.id] = lesson.apply);
questions.final = context.topic.final.apply;
// Marked exactly as the page does it: the question stem is passed so copied sentences are ignored.
const score = (lesson, index, answer) => {
  const q = questions[lesson][index];
  const stem = (q.scenario + ' ' + q.question).replace(/<[^>]+>/g, ' ');
  return context.Engine.markAnswer(answer, context.MARKS[lesson][index], stem).map(point => point.ok ? '1' : '0').join('');
};
const full = (lesson, index) => '1'.repeat(questions[lesson][index].points.length);

test('every model answer gets full marks', () => {
  for (const lesson of Object.keys(questions)) {
    questions[lesson].forEach((q, index) => {
      assert.equal(score(lesson, index, q.model.replace(/<[^>]+>/g, '')), full(lesson, index), lesson + ' Q' + index);
    });
  }
});

// Natural correct answers in a Year 8 student's own words
const paraphrases = {
  "l1": [
    [
      "Sam should eat more fibre, like wholemeal bread, fruit and veg. Fibre adds bulk so the muscles can push the food along and he can go to the toilet more easily.",
      "The doctor would say eat more fruit and vegetables. They have lots of fibre which makes the food bulky, so it moves through the gut easily and stops constipation."
    ],
    [
      "Simple carbohydrates are sugars, like in sweets and fruit. They give you quick energy. Complex carbohydrates like starch in bread and pasta have to be broken down first, so they release energy slowly.",
      "Sugar, a simple carbohydrate found in fruit, gives fast energy. Starch, a complex one in pasta, is broken down so its energy is released more slowly."
    ],
    [
      "Lipids are a store of energy. They keep you warm by insulating your body under the skin. They protect your organs like the heart and kidneys.",
      "Fat stores energy. A layer of fat under the skin is insulation and keeps us warm. It also protects organs from damage."
    ],
    [
      "A balanced diet means eating the right nutrients in the correct amounts. Carbohydrates like bread give you energy. Protein like fish and eggs is needed for growth and repair. Fruit and vegetables give vitamins and minerals. Wholemeal bread has fibre. Drink water and only eat a little fat.",
      "Eating the right amount of each nutrient. Bread and pasta are carbohydrates for energy, meat is protein to help you grow and repair, fruit and veg for vitamins, fibre from wholemeal bread, and lots of water."
    ]
  ],
  "l2": [
    [
      "Crush the biscuit with a pestle and mortar and add distilled water. For starch add iodine, if it turns blue-black there is starch. For sugar add Benedict's and heat it in a water bath, if it goes orange-red there is sugar. For protein add copper sulfate then sodium hydroxide, it turns purple if protein is there.",
      "Grind the biscuit in a pestle and mortar with water. Add iodine: blue-black means starch. Add Benedict's solution and warm it in a hot water bath: orange-red shows sugar. Add copper sulfate and sodium hydroxide: purple means protein is present."
    ],
    [
      "Wear goggles to protect her eyes. Keep the ethanol away from any flames because it is flammable.",
      "She should wear safety goggles. She should be careful with the hot water so she does not get scalded."
    ],
    [
      "Crush the cereal with a pestle and mortar. Add a few drops of distilled water. Then mix it well.",
      "Grind it up in a mortar, add some water and stir."
    ],
    [
      "Add a few drops of copper sulfate, then sodium hydroxide. If it turns purple there is protein.",
      "First add copper sulfate solution, then add sodium hydroxide. A purple colour means the crisps contain protein."
    ]
  ],
  "l3": [
    [
      "13 000 - 10 000 = 3000 kJ",
      "She needs 13000 minus 10000 which is 3000kJ extra each day"
    ],
    [
      "16000 - 11000 = 5000 kJ. 5000 divided by 11000 = 0.45. Times 100 = 45%.",
      "Increase is 5000 kJ. Divide by the original 11000 and times by 100 to get about 45%."
    ],
    [
      "Rickets. It is caused by a lack of vitamin D. Vitamin D is needed with calcium to keep bones strong, so the bones go weak and bend.",
      "The child has rickets because they did not get enough vitamin D, so their bones are soft and weak."
    ],
    [
      "I disagree, both are caused by malnourishment. If you are underweight, you eat less energy than you use, so you are tired and have a poor immune system and may lack vitamins. If you are overweight you eat more energy than you use and it is stored as fat, so you have more risk of heart disease, stroke and diabetes.",
      "No, neither is healthy. Underweight people take in less energy than they use. They feel tired, get ill more easily and can have vitamin deficiencies. Overweight people eat more food than they need and the extra is stored as fat. They are more likely to get heart disease, type 2 diabetes and some cancers."
    ]
  ],
  "l4": [
    [
      "Fibre adds bulk to the food. The gut muscles push against the bulk and force the food along. This stops you getting constipated.",
      "Fibre makes food bulky so the muscles in the gut wall can squeeze it along. It helps to prevent constipation."
    ],
    [
      "The small intestine has a thin wall. It has lots of villi which give it a large surface area. The villi have blood capillaries that carry the absorbed food away.",
      "Its walls are thin. Villi increase the surface area. Nutrients are absorbed into the blood and carried away."
    ],
    [
      "Muscles in the gut wall squeeze the food along like toothpaste in a tube. They push against the bulk from fibre to force it along.",
      "The muscles of the intestine contract and push food along. Fibre gives them bulk to push against."
    ],
    [
      "Teeth chew the sandwich into small pieces and it mixes with saliva in the mouth. It goes down the gullet into the stomach. In the stomach it mixes with acid and digestive juices. In the small intestine it is digested and the small molecules are absorbed into the blood. In the large intestine water is absorbed. Faeces are stored in the rectum and leave through the anus.",
      "First I chew the food with my teeth. I swallow it and it travels down the gullet to the stomach. The stomach churns it with acid. Then in the small intestine the nutrients pass into the blood. Water is absorbed back in the large intestine. The waste is stored in the rectum and goes out of the anus."
    ]
  ],
  "l5": [
    [
      "Live yoghurt contains good bacteria. These bacteria make vitamins like vitamin K and help to break down food.",
      "It is a probiotic, it has useful gut bacteria in it. They produce vitamins and keep your gut healthy."
    ],
    [
      "Bread has starch in it. Saliva contains carbohydrase, which breaks the starch down into sugar.",
      "The carbohydrase enzyme in saliva digests the starch into sugars in your mouth."
    ],
    [
      "Enzymes break large molecules into small molecules. They are catalysts because they speed up digestion and are not used up.",
      "Enzymes chop big molecules into smaller ones so they can be absorbed. A catalyst speeds up a reaction without being used up."
    ],
    [
      "Enzymes break big molecules down into small ones. Carbohydrase, protease and lipase each break down a different nutrient. Bacteria live in the large intestine and feed on fibre. They make vitamins like vitamin K.",
      "Enzymes such as protease break large molecules into small molecules. Gut bacteria are found in the large intestine and they produce vitamin K."
    ]
  ],
  "final": [
    [
      "Carbohydrase breaks starch into sugars. This happens in the mouth with saliva, and in the stomach and small intestine. Protease breaks protein into amino acids in the stomach and small intestine.",
      "Starch in bread is digested by carbohydrase into sugar, starting in the mouth. Protein in cheese is broken down by protease into amino acids in the stomach."
    ],
    [
      "Lipids are digested in the small intestine. Bile from the liver breaks them into small droplets. Lipase breaks the lipids down into fatty acids and glycerol."
    ],
    [
      "The stomach mixes the food with digestive juices and acid. Protease digests protein there.",
      "Food is churned with acid and juices. The acid kills harmful bacteria."
    ],
    [
      "Iodine went blue-black, so it contains starch. Benedict's turned orange-red so there is sugar. Purple means it has protein. Carbohydrase digests starch into sugar and protease digests protein into amino acids.",
      "The bar has starch, sugar and protein in it. Starch is broken down by carbohydrase into sugar. Protein is broken down by protease into amino acids."
    ]
  ]
};

test('correct paraphrases get full marks', () => {
  for (const [lesson, list] of Object.entries(paraphrases)) {
    list.forEach((answers, index) => answers.forEach(answer => {
      assert.equal(score(lesson, index, answer), full(lesson, index), lesson + ' Q' + index + ': ' + answer);
    }));
  }
});

// [lesson, question, answer, expected points] - wrong, reversed, contradictory or keyword-only answers
const loopholes = [
  ["l1",0,"Sam should eat more sugar because fruit removes bulk and food gets pushed out","001"],
  ["l1",0,"fibre bulk moving","001"],
  ["l1",0,"fruit vegetables bulk push","001"],
  ["l1",0,"Sam should eat less fibre. Fibre does not add bulk and food stops moving.","000"],
  ["l1",1,"sugar sweet quick starch slow","100"],
  ["l1",1,"Sugar gives slow energy. Starch gives quick energy.","100"],
  ["l1",1,"Simple carbohydrates are sugars and release energy slowly. Complex carbohydrates are starch, released quickly.","100"],
  ["l1",2,"Lipids store energy, make you cold, and damage organs","100"],
  ["l1",3,"Protein gives energy and carbohydrate for growth; vitamins from fruit; fibre; water","000111"],
  ["l1",3,"right amount, bread energy, fish repair, vitamin fruit, fibre, lipid","100111"],
  ["l2",0,"Pestle and mortar water. Iodine turns blue-black so sugar is present. Benedict boil orange-red so protein is present. Copper sulfate purple so starch.","100000"],
  ["l2",0,"Iodine blue-black means no starch. Benedict heated orange-red means no sugar. Copper sulfate and sodium hydroxide purple means no protein.","001010"],
  ["l2",0,"pestle water iodine blue black Benedict heat orange red copper purple","101000"],
  ["l2",1,"Wear goggles. Be careful.","10"],
  ["l2",1,"Wear goggles. Taste the food.","10"],
  ["l2",1,"Eat the crisps and wear glasses","10"],
  ["l2",1,"goggles hot","10"],
  ["l2",1,"Wear goggles. Keep long hair tied back.","11"],
  ["l2",2,"Do not use a pestle and mortar","000"],
  ["l2",3,"Add copper sulfate and sodium hydroxide. Purple means starch is present.","110"],
  ["l2",3,"Add copper sulfate, then sodium hydroxide. If it turns purple, the sugar is present.","110"],
  ["l2",3,"Copper sulfate then sodium hydroxide, if it stays blue then protein is present, purple is not.","110"],
  ["l2",3,"Add copper sulfate and sodium hydroxide. It does not turn purple, protein is present.","110"],
  ["l2",3,"Add copper sulfate and sodium hydroxide. Purple means protein. Purple means no protein.","110"],
  ["l3",0,"13 000 − 10 000 = 3000 J","10"],
  ["l3",0,"13000 minus 10000 = 3000","10"],
  ["l3",0,"13000 - 10000 = 3000 kg","10"],
  ["l3",0,"13000 - 10000 = 3000 litres","10"],
  ["l3",0,"13 000 - 10 000 = 3000 kJ = 3000 J","10"],
  ["l3",2,"Vitamin D deficiency causes rickets: strong bones.","110"],
  ["l3",3,"Both malnourishment. Underweight people eat too much and gain fat and get heart disease and stroke, tired immune vitamin deficiency; overweight people eat not enough food, fat? tired","100100"],
  ["l3",3,"Underweight people get heart disease, stroke, diabetes and cancer. Overweight people have a poor immune system, are tired and lack vitamins. Both are malnourishment. They eat less energy and too much fat.","100000"],
  ["l3",3,"I agree it is healthier to be underweight. Malnourishment is good. Less energy, tired, immune, vitamin, more fat, heart","000000"],
  ["l3",3,"Underweight: energy in is more than energy used; overweight: energy in is less than used. Disagree, malnourishment.","100000"],
  ["l4",0,"Fibre removes bulk. Muscles stop food moving. Constipation.","000"],
  ["l4",0,"Fibre causes constipation because it adds bulk and muscles push food along","110"],
  ["l4",0,"fibre bulk muscle push constipation","010"],
  ["l4",1,"Thin wall. Villi have a big surface area. They contain blood capillaries which carry oxygen.","110"],
  ["l4",1,"Thin wall. Villi big surface area. Blood capillaries store faeces.","110"],
  ["l4",1,"Thin wall; villi have a big surface area; the villi contain capillaries that bring food to the intestine","110"],
  ["l4",1,"The wall is thin. Villi make the surface area large. Blood flow.","110"],
  ["l4",1,"The small intestine has a thick wall but thin villi with large surface area and capillaries.","011"],
  ["l4",2,"Gravity moves food. The heart pumps muscles squeeze? bulk","00"],
  ["l4",2,"Villi push food; muscle squeeze? bulk","00"],
  ["l4",2,"Muscles in the arm push the toothpaste behind.","00"],
  ["l4",3,"Food goes anus, rectum, large intestine, small intestine, stomach, gullet, mouth: teeth gullet stomach acid small intestine absorbed blood large intestine water rectum anus","000000"],
  ["l4",3,"In the stomach there is acid. Large intestine has water. The small intestine blood. Teeth. Gullet. Rectum.","001000"],
  ["l5",0,"Bacteria are harmful germs; vitamin; digest","000"],
  ["l5",0,"Live yoghurt contains bacteria, vitamins (are in yoghurt), gut","100"],
  ["l5",0,"bacteria vitamin gut","100"],
  ["l5",2,"Enzymes build small molecules into large ones. They speed up digestion without being used up.","011"],
  ["l5",2,"Enzymes join small molecules into large molecules, speed up, not used up","011"],
  ["l5",2,"Enzymes break large molecules into small molecules. They speed up digestion and are not used up. They are also used up.","110"],
  ["l5",3,"Enzymes join small molecules into large molecules. Carbohydrase, protease, lipase. Bacteria live in the large intestine and make vitamins.","0111"],
  ["l5",3,"Enzymes are living bacteria that chop food small, like carbohydrase. Bacteria live in the stomach on fibre and make vitamin K","0101"],
  ["l5",3,"enzyme small carbohydrase bacteria large intestine vitamin","0100"],
  ["final",0,"Carbohydrase breaks sugar into starch in the mouth. Protease turns amino acids into protein in the stomach.","0101"],
  ["final",0,"Carbohydrase is in the stomach only, protease is in the mouth","0000"],
  ["final",2,"Food is mixed with acid in the stomach, and acid helps bacteria grow.","10"],
  ["final",2,"Stomach absorbs water and mixes food with juice; kills bacteria? protease turns lipids into glycerol","10"],
  ["final",2,"mix juice protease","10"],
  ["final",3,"Starch is present because the iodine turned orange-red. Sugar is present because Benedict turned purple. Protein is present as it turned blue-black.","00000"],
  ["final",3,"Iodine blue-black = protein. Benedict orange-red = starch. Copper sulfate purple = sugar.","00000"]
];

test('wrong, reversed and contradictory answers lose the right points', () => {
  for (const [lesson, index, answer, expected] of loopholes) {
    assert.equal(score(lesson, index, answer), expected, lesson + ' Q' + index + ': ' + answer);
  }
});

test('extra energy answer must give the unit kJ', () => {
  assert.equal(score('l3', 0, '13 000 − 10 000 = 3000 kJ'), '11');
  assert.equal(score('l3', 0, '13000 - 10000 = 3000 kilojoules'), '11');
  for (const answer of ['13 000 − 10 000 = 3000 J', '13 000 − 10 000 = 3000', '13 000 − 10 000 = 3000 kg']) {
    assert.equal(score('l3', 0, answer)[1], '0', answer);
  }
});
