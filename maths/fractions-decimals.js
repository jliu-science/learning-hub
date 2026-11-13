/* ===== Maths topic: Fractions & decimals. Widgets in fd-widgets.js / dec-widgets.js, questions in fd-practice.js ===== */
(function(){
  const fr=(n,d)=>`<span class="fr"><i>${n}</i><i>${d}</i></span>`;
  const L=(id,code,short,title,icon,hook,formula,remember,w,q)=>({id,code,short,title,icon,hook,formula,remember,see:AV[w].see,explore:AV[w].explore,practice:AVQ[q]});
  MathsEngine.start({ id:'fractions-decimals', subject:'Maths', title:'Fractions & decimals', hintLabel:'Show a hint', sheetTitle:'Rules sheet',
    sheetHook:'Every rule from this topic on one page. Tap a card to open its lesson.',
    mixedHook:'Ten questions from every lesson, mixed up. Decide which method each one needs.', groups:[
    {name:'Fractions', lessons:[
      L('equivalent','F1','Equivalent','Equivalent fractions','equiv','Different-looking fractions can be exactly the same amount.',`${fr(3,4)} = ${fr(6,8)} = ${fr(9,12)}`,'Multiply or divide the top and bottom by the same number.','equiv','equiv'),
      L('mixed-numbers','F2','Mixed numbers','Mixed numbers and improper fractions','mixfr','More than one whole: two ways to write the same amount.',`${fr(11,4)} = 2${fr(3,4)}`,'Top ÷ bottom: the answer is the wholes, the remainder goes on top.','mixfr','mixfr'),
      L('add-subtract','F3','Add & subtract','Adding and subtracting fractions','addfr','You can only count pieces that are the same size.',`${fr(1,2)} + ${fr(1,3)} = ${fr(3,6)} + ${fr(2,6)} = ${fr(5,6)}`,'Same denominator first, then add or subtract the tops.','addfr','addfr'),
      L('multiply','F4','Multiply','Multiplying fractions','mulfr','"Of" means times: half of three quarters is three eighths.',`${fr('a','b')} × ${fr('c','d')} = ${fr('a × c','b × d')}`,'Multiply the tops, multiply the bottoms.','mulfr','mulfr'),
      L('divide','F5','Divide','Dividing fractions','divfr','How many quarters fit into 3? Dividing asks "how many fit?"',`${fr('a','b')} ÷ ${fr('c','d')} = ${fr('a','b')} × ${fr('d','c')}`,'Keep, change, flip.','divfr','divfr')
    ]},
    {name:'Decimals', lessons:[
      L('fractions-to-decimals','D1','To decimals','Fractions and decimals','f2d','A fraction is a division waiting to happen.',`${fr(3,8)} = 3 ÷ 8 = 0.375`,'Recurring: 0.<span class="rec">3</span> means 0.333… for ever.','f2d','f2d'),
      L('times-ten','D2','× ÷ 10, 100, 1000','Multiplying and dividing by 10, 100 and 1000','p10','The point stays still. The digits slide.','3.47 × 100 = 347','× moves digits left, ÷ moves them right; zeros hold empty places.','p10','p10'),
      L('rounding','D3','Rounding','Rounding decimals','rounding','Which end is nearer? The next digit decides.','3.4782 ≈ 3.5 (1 d.p.)','5 or more rounds up. Round only at the very end.','rounding','rounding')
    ]}
  ]});
})();
