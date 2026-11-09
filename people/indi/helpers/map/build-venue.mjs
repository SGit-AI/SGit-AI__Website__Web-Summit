// Builds venue.geojson from Angelo's OpenStreetMap outlines (people/angelo/app/venue-map.js) plus our own named points.
// Run from the repository root: node people/indi/helpers/map/build-venue.mjs
// Map data © OpenStreetMap contributors (ODbL). Positions of Web Summit places are only those Web Summit publishes in words.
import fs from 'node:fs';
import vm from 'node:vm';

const src = fs.readFileSync('people/angelo/app/venue-map.js', 'utf8');
const ctx = { self: {} };
vm.runInNewContext(src, ctx);
const map = ctx.self.AngeloVenueMap;
const { s, n, w, e, width, height } = map.frame;
const round = v => Math.round(v * 1e6) / 1e6;
// venue-map.js draws an equirectangular frame: x runs west to east, y runs north to south.
const toLonLat = (x, y) => [round(w + (x / width) * (e - w)), round(n - (y / height) * (n - s))];

function rings(d) {
  const out = [];
  for (const part of d.split('M').filter(Boolean)) {
    const nums = part.replace(/[LZ]/g, ' ').trim().split(/\s+/).map(Number);
    const ring = [];
    for (let i = 0; i + 1 < nums.length; i += 2) ring.push(toLonLat(nums[i], nums[i + 1]));
    const [a, b] = [ring[0], ring[ring.length - 1]];
    if (a[0] !== b[0] || a[1] !== b[1]) ring.push(a);
    // GeoJSON (RFC 7946): outer rings run anticlockwise.
    let area = 0;
    for (let i = 0; i + 1 < ring.length; i++) area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
    if (area < 0) ring.reverse();
    out.push(ring);
  }
  return out;
}

const CREDIT = '© OpenStreetMap contributors (ODbL)';
const features = [];
for (const a of map.areas) {
  features.push({
    type: 'Feature',
    id: a.id,
    geometry: { type: 'Polygon', coordinates: rings(a.d) },
    properties: { id: a.id, name: a.label === 'FIL' ? 'FIL (the four pavilions)' : a.label, kind: a.kind, osm: a.osm, credit: CREDIT },
  });
}
const centre = id => toLonLat(...map.areas.find(a => a.id === id).c);

const REG_SRC = 'https://websummit.com/essentials/registration-essentials/';
const points = [
  { id: 'registration-airport', name: 'Registration: Airport, Terminal 1', kind: 'registration',
    at: [-9.1281, 38.7700], approximate: true,
    detail: 'Humberto Delgado Airport, Terminal 1. Collect your lanyard and wristband. Bring your ticket QR code (in Web Summit\'s app) and photo ID.',
    hours: 'Sat 7 Nov 09:30 to 22:00; Sun 8 and Mon 9 Nov 07:30 to 22:00; Tue 10 Nov 07:30 to 15:00. Times may change.',
    source: REG_SRC },
  { id: 'registration-pavilhao', name: 'Registration: Pavilhão de Portugal', kind: 'registration',
    at: centre('osm-r3266709'), approximate: false,
    detail: 'Pavilhão de Portugal, Alameda dos Oceanos. Collect your lanyard and wristband. Bring your ticket QR code (in Web Summit\'s app) and photo ID.',
    hours: 'Sat 7 and Sun 8 Nov 12:00 to 18:00; Mon 9 Nov 12:00 to 22:00; Tue 10 and Wed 11 Nov 07:30 to 17:00; Thu 12 Nov 07:30 to 16:45. Times may change.',
    source: REG_SRC },
  { id: 'entrance-north', name: 'North Entrance', kind: 'entrance',
    at: toLonLat(690, 72), approximate: true,
    detail: 'Near Moscavide metro. After 17:00 this is the way in to Night Summit. Placed at the north end of FIL: Web Summit gives no exact spot.',
    source: 'https://websummit.com/essentials/schedule-essentials/' },
  { id: 'stage-centre', name: 'Centre Stage', kind: 'stage',
    at: centre('osm-821784762'), approximate: false,
    detail: 'Centre Stage is in MEO Arena.', source: 'https://websummit.com/schedule/' },
  { id: 'startup-lounge', name: 'Startup Lounge', kind: 'area',
    at: toLonLat(675, 233), approximate: true,
    detail: 'Between Pavilion 2 and Pavilion 3. For startup ticket holders and the investors and speakers they meet.',
    source: 'Web Summit Startup Success team, email of 5 November 2026' },
  { id: 'our-stand', name: 'Our stand: RiskMandate, booth A1-30', kind: 'stand',
    at: centre('osm-821643074'), approximate: true,
    detail: 'Thursday 12 November only. ALPHA 1, Pavilion 1, booth A1-30. The exact spot is shown at the venue.',
    source: 'Web Summit Startup Success team, email of 5 November 2026' },
];
for (const p of points) {
  const { at, ...props } = p;
  features.push({ type: 'Feature', id: p.id, geometry: { type: 'Point', coordinates: at }, properties: props });
}

const fc = { type: 'FeatureCollection', features };
fs.writeFileSync('people/indi/helpers/map/venue.geojson', JSON.stringify(fc, null, 1) + '\n');
console.log(`venue.geojson: ${map.areas.length} areas, ${points.length} points`);
