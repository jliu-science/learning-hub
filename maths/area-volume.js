/* ===== Maths topic: Area & volume. Lessons point at widgets (area-widgets.js, volume-widgets.js)
   and question generators (area-volume-practice.js). */
(function(){
  const v=(k,t)=>`<i class="v v-${k}">${t}</i>`;
  const L=(id,code,short,title,icon,hook,formula,remember,w,q)=>({id,code,short,title,icon,hook,formula,remember,see:AV[w].see,explore:AV[w].explore,practice:AVQ[q]});
  MathsEngine.start({ id:'area-volume', subject:'Maths', title:'Perimeter, area & volume', groups:[
    {name:'Perimeter', lessons:[
      L('perimeter','P1','Perimeter','Perimeter','perim','Walk all the way round the edge and add up every side.',`P = 2(${v('b','l')} + ${v('w','w')})`,'Perimeter is a length: cm, not cm².','perim','perim'),
      L('circumference','P2','Circumference','Circumference of a circle','circum','Roll a circle one turn: the distance is just over 3 diameters.',`C = π${v('b','d')} = 2π${v('r','r')}`,'Semicircle: half the circumference + the diameter.','circum','circum')
    ]},
    {name:'Area', lessons:[
      L('rectangle','A1','Rectangles','Area of a rectangle','rect','Area means counting squares. Rows of squares lead straight to the formula.',`A = ${v('b','l')} × ${v('w','w')}`,'Area units are squared: cm², m², mm².','rect','rect'),
      L('triangle','A2','Triangles','Area of a triangle','tri','Every triangle is exactly half of a rectangle.',`A = ½ ${v('b','b')}${v('h','h')}`,'Use the perpendicular height, not a sloping side.','tri','tri'),
      L('parallelogram','A3','Parallelograms','Area of a parallelogram','para','Cut a piece off one end, move it to the other, and it becomes a rectangle.',`A = ${v('b','b')} × ${v('h','h')}`,'Perpendicular height, not the sloping side.','para','para'),
      L('trapezium','A4','Trapezia','Area of a trapezium','trap','Two copies of a trapezium make a parallelogram.',`A = ½ (${v('b','a')} + ${v('w','b')}) ${v('h','h')}`,'a and b are the two parallel sides.','trap','trap'),
      L('circle','A5','Circles','Area of a circle','circle','Cut a circle into slices and it rearranges into a rectangle.',`A = π${v('r','r')}²`,'Given the diameter? Halve it first.','circle','circ'),
      L('compound','A6','Compound shapes','Area of compound shapes','comp','Split a shape into simple pieces, or take a piece away.',`A = A₁ + A₂`,'Find any missing lengths first.','comp','comp')
    ]},
    {name:'Volume', lessons:[
      L('cuboid','V1','Cuboids','Volume of a cuboid','cuboid','Volume means counting cubes, one layer at a time.',`V = ${v('b','l')} × ${v('w','w')} × ${v('h','h')}`,'Volume units are cubed: cm³, m³.','cuboid','cub'),
      L('prism','V2','Prisms','Volume of a prism','prism','A prism is the same all the way through, so it is just slices stacked up.',`V = ${v('c','A')} × ${v('b','l')}`,'A is the area of the cross-section.','prism','prism'),
      L('cylinder','V3','Cylinders','Volume of a cylinder','cyl','A cylinder is a stack of circles.',`V = π${v('r','r')}²${v('h','h')}`,'Area of the circle × height.','cyl','cyl')
    ]},
    {name:'Units', lessons:[
      L('units','U1','Units','Converting area and volume units','units','Why 1 cm² is 100 mm², not 10 mm².','1 cm² = 100 mm²','1 m² = 10 000 cm² · 1 cm³ = 1000 mm³ · 1 litre = 1000 cm³','units','units')
    ]}
  ]});
})();
