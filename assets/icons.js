/* Hand-drawn line icons, one per concept group (24×24, stroke = currentColor). */
window.ICONS = {
  carb:    '<path d="M5 10.5C5 7 8 5 12 5s7 2 7 5.5c0 1.1-.8 1.9-1.8 2V19H6.8v-6.5C5.8 12.4 5 11.6 5 10.5z"/><path d="M9 15h.01M12 13.5h.01M14.5 16h.01"/>',
  lipid:   '<path d="M10 3h4v2.6l2.2 3.2V20a1 1 0 0 1-1 1H8.8a1 1 0 0 1-1-1V8.8L10 5.6z"/><path d="M7.8 13.5c1.4-.8 3-.8 4.2 0s2.8.8 4.2 0"/>',
  protein: '<path d="M15.5 3.5a5 5 0 0 1 5 5c0 3.2-2.6 5.6-5.8 5.6h-1.2l-3.6 3.6a2 2 0 1 1-2.6 2.6 2 2 0 1 1-1.4-3.4 2 2 0 0 1 2.4.6l3.6-3.6v-1.4c0-4.8 1.2-9 3.6-9z"/>',
  vitamin: '<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="6"/><path d="M12 6v12M6 12h12M7.8 7.8l8.4 8.4M16.2 7.8l-8.4 8.4"/>',
  mineral: '<path d="M8 3.5h8l4 5.5-8 11.5L4 9z"/><path d="M4 9h16M8 3.5 10 9l2 11.5L14 9l2-5.5"/>',
  water:   '<path d="M12 3.2s6 6.6 6 10.8a6 6 0 0 1-12 0c0-4.2 6-10.8 6-10.8z"/><path d="M9.2 14.6a2.9 2.9 0 0 0 2.6 2.8"/>',
  fibre:   '<path d="M12 21V6"/><path d="M12 9c-2.2-.6-3.4-2.4-3.4-5 2.2.4 3.4 2.2 3.4 5zm0 0c2.2-.6 3.4-2.4 3.4-5-2.2.4-3.4 2.2-3.4 5zm0 5c-2.2-.6-3.4-2.4-3.4-5 2.2.4 3.4 2.2 3.4 5zm0 0c2.2-.6 3.4-2.4 3.4-5-2.2.4-3.4 2.2-3.4 5zm0 5c-2.2-.6-3.4-2.4-3.4-5 2.2.4 3.4 2.2 3.4 5zm0 0c2.2-.6 3.4-2.4 3.4-5-2.2.4-3.4 2.2-3.4 5z"/>',
  enzyme:  '<circle cx="6" cy="6.5" r="2.6"/><circle cx="6" cy="17.5" r="2.6"/><path d="M8.2 8 20 17M8.2 16 20 7"/>',
  bacteria:'<rect x="5" y="8" width="14" height="8" rx="4"/><path d="M19 12c1.6 0 1.8 1.8 3 1.8M5 12c-1.6 0-1.8-1.8-3-1.8M9 11h.01M12.5 13h.01M15 10.8h.01"/>',
  test:    '<path d="M8.5 3h7M10 3v13.5a2 2 0 0 0 4 0V3"/><path d="M10 11.5h4"/>',
  health:  '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z"/><path d="M6.5 12.5h3l1.2-2.2 2 4.2 1.2-2h3.6"/>',
  energy:  '<path d="M12.6 3c.8 3.8 5.4 5.4 5.4 10.4a6 6 0 0 1-12 0c0-3 2-4.2 2.4-6.4 1 1 1.2 2.2 2.2 2.6.2-2.2-.4-4.4 2-6.6z"/>',
  organ:   '<path d="M9 3v3.6c0 2-4 3.2-4 8a5.2 5.2 0 0 0 9.4 3c1-1.2 2.6-1.4 4-.6.9-4-1.2-8.2-5.2-8.2-1.3 0-2.2-1-2.2-2.6V3"/>',
  diet:    '<circle cx="13.5" cy="12" r="7"/><circle cx="13.5" cy="12" r="3.6"/><path d="M3.5 4v5.5c0 1 .7 1.6 1.5 1.6V20M5 4v5.2M6.5 4v5.5c0 1-.7 1.6-1.5 1.6"/>',
  other:   '<path d="M6 3h11.5a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6z"/><path d="M9 3v18M12 8h4M12 11h4"/>',
  trophy:  '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4v3h-4z"/>',
  book:    '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5V5.5M8 7h8"/>'
};
window.svgIcon = (k, size=22) => `<svg class="svgi" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(window.ICONS[k]||window.ICONS.other)}</svg>`;
window.ICONS.music='<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>';
/* Chemistry and physics concept icons (same hand-drawn line style) */
Object.assign(window.ICONS, {
  exo:      '<path d="M12 7.5c.5 1.9 2.8 2.8 2.8 5.6a2.8 2.8 0 0 1-5.6 0c0-1.5.9-2.1 1.2-3.2.6.5.8 1.1 1.2 1.3.1-1.2-.3-2.4.4-3.7z"/><path d="M3 12h2.6M18.4 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8"/>',
  endo:     '<path d="M8 4.2a2 2 0 0 1 4 0v9.3a4 4 0 1 1-4 0z"/><path d="M10 16.2v-4.4"/><path d="M18 4.5v9m-2.3-2.3L18 13.5l2.3-2.3"/>',
  level:    '<path d="M4 3v17h17"/><path d="M7 7.5h5M13.5 15.5H19"/><path d="M12.8 8.6v5.6m-1.7-1.7 1.7 1.7 1.7-1.7"/>',
  bond:     '<circle cx="6.8" cy="12" r="3.6"/><circle cx="17.2" cy="12" r="3.6"/><path d="M10.4 11h3.2M10.4 13h3.2"/>',
  catalyst: '<rect x="6" y="7" width="12" height="10" rx="2"/><path d="M2 12h4M18 12h4M9.5 10v4M12 10v4M14.5 10v4"/>',
  reaction: '<path d="M9.5 3h5M10.5 3v5.5L5.2 18a2 2 0 0 0 1.8 3h10a2 2 0 0 0 1.8-3l-5.3-9.5V3"/><path d="M7.4 15h9.2"/>',
  fuel:     '<path d="M5 21V5.5A1.5 1.5 0 0 1 6.5 4h6A1.5 1.5 0 0 1 14 5.5V21M3.5 21h12M7.5 7.5h4v3.5h-4z"/><path d="M14 9h2a1 1 0 0 1 1 1v5.5a1.5 1.5 0 0 0 3 0V8.5l-2-2"/>',
  friction: '<rect x="7" y="7.5" width="9" height="7"/><path d="M2.5 18.5l2-1.5 2 1.5 2-1.5 2 1.5 2-1.5 2 1.5 2-1.5 2 1.5 2-1.5"/><path d="M16 11h5m-1.8-1.8L21 11l-1.8 1.8M7 11H3m1.8-1.8L3 11l1.8 1.8"/>',
  drag:     '<path d="M9 12c0-2.6 2.4-4.6 5.6-4.6 2.2 0 4.2 2 6.4 4.6-2.2 2.6-4.2 4.6-6.4 4.6C11.4 16.6 9 14.6 9 12z"/><path d="M2.5 8.5h4.5M2.5 12h4.5M2.5 15.5h4.5"/>',
  balance:  '<path d="M2.5 12h7.5m-2.5-2.5L10 12l-2.5 2.5M21.5 12H14m2.5-2.5L14 12l2.5 2.5"/><path d="M12 5.5v13"/>',
  spring:   '<path d="M12 2v2.6L7 6l10 3-10 3 10 3-10 3 5 1.4V22"/>',
  squash:   '<path d="M4 14.5h16v5H4z"/><path d="M12 3v8m-2.6-2.6L12 11l2.6-2.6"/>',
  moment:   '<path d="M3 11.5l18-3.2"/><path d="M12 10 9 17h6z"/><path d="M4.5 17h15"/><path d="M5.5 8.6v-3M18.5 6.2V3.4"/>',
  gravity:  '<circle cx="12" cy="8.5" r="5"/><path d="M12 3.5v10M7 8.5h10"/><path d="M12 15.5v5.5m-2.4-2.4L12 21l2.4-2.4"/>',
  magnet:   '<path d="M6 4v8a6 6 0 0 0 12 0V4h-4v8a2 2 0 0 1-4 0V4z"/><path d="M6 8h4M14 8h4"/>',
  field:    '<rect x="8.5" y="10.2" width="7" height="3.6"/><path d="M8.5 12C3.5 12 3.6 5.2 12 5.2s8.5 6.8 3.5 6.8M8.5 12c-5 0-4.9 6.8 3.5 6.8s8.5-6.8 3.5-6.8"/>',
  compass:  '<circle cx="12" cy="12" r="8.5"/><path d="M12 6.2l2.1 5.8-2.1 5.8-2.1-5.8z"/><path d="M10 12h4"/>',
  electro:  '<rect x="3" y="10" width="16" height="4"/><path d="M6 7.5v9M9 7.5v9M12 7.5v9M15 7.5v9"/><path d="M6 16.5 4.2 20M15 16.5l1.8 3.5"/>',
  bell:     '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.6 2H4.4z"/><path d="M10 20.4a2 2 0 0 0 4 0"/>',
  breaker:  '<rect x="6" y="3" width="12" height="18" rx="1"/><path d="M12 6.5v5.5"/><circle cx="12" cy="15.6" r="1.8"/>',
  speaker:  '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>',
  earth:    '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17"/>',
  circuit:  '<path d="M3 12h6M15 12h6M9 7v10M12 9.5v5"/>',
  material: '<path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5z"/><path d="M4 8.5 12 13l8-4.5M12 13v7"/>'
});
/* Food icons for "Sort the foods" (8.4.1). */
Object.assign(window.ICONS, {
  broccoli: '<path d="M6.8 12.5a3 3 0 0 1 0-6 4 4 0 0 1 7.6-1.4 3.2 3.2 0 0 1 3.1 5.5 2.6 2.6 0 0 1-1.8 1.9z"/><path d="M10 12.5l.8 7.5h2.4l.8-7.5M12 16l-1.6-2M12 16l1.6-2"/>',
  spinach:  '<path d="M5 19C5 11 9.5 5 19.5 4.5 19.5 13 14 19 5 19z"/><path d="M5 19 16 8M9.5 14.5h4M12.5 11.5V8"/>',
  carrot:   '<path d="M15 9c-1.7-1.7-4.3-1.5-6 .5L4 20l10.5-5c2-1.7 2.2-4.3.5-6z"/><path d="M15 9l1.5-5M15 9l5-1.5M15 9l3.5-3.5M8.3 13.2l1.4 1M6.6 16.6l1.4 1"/>',
  pasta:    '<path d="M3.5 12h17a8.5 8.5 0 0 1-17 0z"/><path d="M6 12c1-2 2-2 3 0s2 2 3 0 2-2 3 0 2 2 3 0"/><path d="M13.5 9.5 16.5 3M15.8 10l3.4-5.5"/>',
  butter:   '<path d="M5 11h10v6H5zM5 11l3-3h10l-3 3M15 17l3-3V8"/><path d="M3 19.5h18"/>',
  meat:     '<path d="M6 7c3-3 9-3 12 0 2.5 2.5 2 7-1 9.5-3 2.5-8 4-11 1.5S3 10 6 7z"/><circle cx="14" cy="10.5" r="2"/><path d="M7 11c1.5 2 3.5 3 6 3"/>',
  fish:     '<path d="M3 12c3-4.5 9-5.5 13-2l4-3v10l-4-3c-4 3.5-10 2.5-13-2z"/><circle cx="7" cy="11.2" r=".7"/><path d="M11 9.3c.8 1.6.8 3.8 0 5.4"/>',
  sugar:    '<path d="M4 13l4-2 4 2v5l-4 2-4-2zM4 13l4 2 4-2M8 15v5"/><path d="M12 13l4-2 4 2v5l-4 2-4-2M12 13l4 2 4-2M16 15v5"/><path d="M8 11V6l4-2 4 2v5M8 6l4 2 4-2M12 8v5"/>',
  rice:     '<path d="M3.5 12h17a8.5 8.5 0 0 1-17 0z"/><path d="M5.5 12a6.5 5 0 0 1 13 0"/><path d="M9 9.6l1 .3M12 8.2l.9.4M14.6 9.6l1-.2M11 10.8l.9.1"/>',
  bread:    '<path d="M4 12c-1-3.5 1.5-7 8-7s9 3.5 8 7v7H4z"/><path d="M8.5 7.5 10 10.5M12.5 6.8v3.4M16.3 7.6l-1.3 2.9"/>',
  oliveoil: '<path d="M10 3h4v3l2 3v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9l2-3z"/><path d="M10 6h4"/><ellipse cx="12" cy="14.5" rx="1.7" ry="2.3"/>'
});
