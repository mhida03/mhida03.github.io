// Génère le HTML statique des projets et des coulisses (pour le SEO). Usage : node prerender.js fr|en base
const fs = require('fs'), vm = require('vm'), path = require('path');
const [lang, base] = [process.argv[2] || 'fr', process.argv[3] || ''];
const ctx = { LANG: lang, BASE: base, out: null };
vm.createContext(ctx);
const prelude = `
var img = p => BASE + 'assets/' + p;
var UI = { photos: { fr: n => n + ' visuel' + (n > 1 ? 's' : ''), en: n => n + ' image' + (n > 1 ? 's' : '') } };
var u = k => UI[k][LANG];
`;
const data = fs.readFileSync(path.join(__dirname, 'js/data.js'), 'utf8');
vm.runInContext(prelude + data + `
out = { projects: PROJECTS.map(projectCardHTML).join('\\n'), moments: MOMENTS.map(m => momentHTML(m)).join('\\n'),
  images: PROJECTS.flatMap(p => (p.images || []).map(i => ({ loc: 'assets/' + i[0], title: L(p.title), caption: L(i.slice(1)) })))
    .concat(MOMENTS.map(m => ({ loc: 'assets/' + m[0], title: L(m.slice(1)), caption: L(m.slice(1)) }))) };`, ctx);
process.stdout.write(JSON.stringify(ctx.out));
