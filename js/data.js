/* Données du portfolio (projets, coulisses) et gabarits HTML */
/* ===================== Données projets ===================== */
const PROJECTS = [
  { id: 'odoo', wide: true, meta: ['Dromiss by SMODU · 2026', 'Dromiss by SMODU · 2026'],
    title: ['Odoo Chantiers & agents IA', 'Odoo Job Sites & AI agents'],
    desc: ['ERP Odoo pour un couvreur : suivi de chantiers en temps réel, facturation automatique, et des agents IA qui publient du contenu et capturent des leads.',
           'Odoo ERP for a roofing company: real-time job site tracking, automated invoicing, and AI agents that publish content and capture leads.'],
    tags: ['Odoo', 'n8n', 'OpenAI', 'restic'],
    details: [[
      '<b>Module Chantiers</b> : suivi en temps réel, facturation automatisée et portail client sécurisé pour ARS Toiture (CRM, Ventes, Projet, Facturation, Comptabilité).',
      '<b>Agent de contenu</b> : génération et publication automatique d’articles SEO, de visuels IA et de posts Instagram/Facebook.',
      '<b>Chatbot de leads</b> relié au CRM Odoo : création automatique d’opportunités et emailing.',
      '<b>Exploitation</b> : gestion des instances, sauvegardes automatisées avec restic et rapports quotidiens par e-mail.',
      '<b>Avant-vente</b> : analyse des besoins d’un client logistique international et démo Odoo dédiée.'], [
      '<b>Job Sites module</b>: real-time tracking, automated invoicing and a secure customer portal for ARS Toiture (CRM, Sales, Project, Invoicing, Accounting).',
      '<b>Content agent</b>: automatic generation and publishing of SEO articles, AI visuals and Instagram/Facebook posts.',
      '<b>Lead chatbot</b> wired to the Odoo CRM: automatic opportunity creation and emailing.',
      '<b>Operations</b>: instance management, automated restic backups and daily email reports.',
      '<b>Pre-sales</b>: needs analysis for an international logistics client and a dedicated Odoo demo.']] },
  { id: 'pharma', meta: ['SILAMIR Grand Ouest · Rennes · 2026', 'SILAMIR Grand Ouest · Rennes · 2026'],
    title: ['Système pharmaceutique critique', 'Critical pharmaceutical system'],
    desc: ['Projet de fin d’études : maintenance, exploitation et modernisation du système CyML, en Java/Spring, avec une couverture de tests portée à 80 %.',
           'Final-year project: maintaining, running and modernising the CyML system in Java/Spring, with test coverage raised to 80%.'],
    tags: ['Java', 'Spring Boot', 'Microservices', 'SonarQube'],
    images: [['projects/silamir-poste.webp', 'Poste de travail chez SILAMIR Group, Bruz', 'My workstation at SILAMIR Group, Bruz'],
             ['projects/silamir-rapport.webp', 'Rapport de PFE : maintenance et exploitation du système CyML', 'Final-year report: maintaining and running the CyML system'],
             ['projects/silamir-soutenance.webp', 'Soutenance du projet de fin d’études', 'Final-year project defence']],
    details: [[
      'Conception, développement et maintenance de <b>4 dépôts en production</b> (OCP/C3ML) pour un distributeur pharmaceutique majeur.',
      'Mise en œuvre d’une stratégie de qualité logicielle et de pistes de migration pour la modernisation technologique.',
      'Spring Boot, JPA/Hibernate, Spring Security, APIs REST et microservices.',
      'Couverture de tests de <b>20 % à 80 %</b> : TDD, tests unitaires et d’intégration, SonarQube.',
      'Docker, Git, CI/CD GitHub Actions, monitoring Prometheus/Grafana. Scrum Master, revues de code et pair programming.'], [
      'Design, development and maintenance of <b>4 production repositories</b> (OCP/C3ML) for a major pharmaceutical distributor.',
      'Rolled out a software quality strategy and migration paths for technology modernisation.',
      'Spring Boot, JPA/Hibernate, Spring Security, REST APIs and microservices.',
      'Test coverage from <b>20% to 80%</b>: TDD, unit and integration tests, SonarQube.',
      'Docker, Git, GitHub Actions CI/CD, Prometheus/Grafana monitoring. Scrum Master, code reviews and pair programming.']] },
  { id: 'sign', meta: ['SQLI Digital Experience · Oujda · 2025', 'SQLI Digital Experience · Oujda · 2025'],
    title: ['Plateforme d’e-signature', 'E-signature platform'],
    desc: ['Stage d’été dans la Practice Java Spring : une plateforme de signature électronique en production, du backend Spring Boot à l’interface React.',
           'Summer internship in the Java Spring practice: an e-signature platform in production, from the Spring Boot backend to the React interface.'],
    tags: ['Spring Boot', 'React', 'REST', 'Scrum'],
    images: [['projects/sqli-1.webp', 'Chez SQLI Digital Experience, Oujda', 'At SQLI Digital Experience, Oujda'],
             ['projects/sqli-2.webp', 'Les bureaux de SQLI Oujda', 'The SQLI Oujda offices']],
    details: [[
      'Responsabilité <b>de bout en bout</b> : backend Spring Boot et frontend React.',
      'Composants React robustes et responsives ; APIs REST, authentification sécurisée et traitement des données métier.',
      '<b>Scrum Master</b> d’une équipe de 4 personnes : tests, recette et déploiement en production.'], [
      '<b>End-to-end</b> ownership: Spring Boot backend and React frontend.',
      'Robust, responsive React components; REST APIs, secure authentication and business data processing.',
      '<b>Scrum Master</b> for a team of 4: testing, acceptance and production deployment.']] },
  { id: 'ar', meta: ['EHEI · Projet de fin d’année · 2025', 'EHEI · End-of-year project · 2025'],
    title: ['OptiTry, essayage de lunettes en AR', 'OptiTry, AR eyewear try-on'],
    desc: ['Essayage virtuel de lunettes en temps réel par webcam, avec des recommandations par IA selon la forme du visage.',
           'Real-time virtual eyewear try-on through the webcam, with AI recommendations based on face shape.'],
    tags: ['Symfony', '.NET', 'Python IA', 'Grafana'],
    images: [['projects/optitry-equipe.webp', 'Présentation d’OptiTry devant le jury', 'Presenting OptiTry to the jury'],
             ['projects/optitry-rapport.webp', 'Rapport du projet OptiTry', 'OptiTry project report'],
             ['projects/optitry-1.webp', 'Jour de la soutenance', 'Defence day'],
             ['projects/optitry-2.webp', 'Avec notre encadrant', 'With our supervisor']],
    details: [[
      '<b>Essayage virtuel</b> en temps réel via la webcam et <b>recommandations personnalisées</b> selon le genre et la forme du visage.',
      'Backend <b>Symfony</b> pour la gestion des utilisateurs et <b>.NET</b> pour le tableau de bord des opticiens.',
      'Module <b>Python</b> pour l’IA et l’essayage ; monitoring <b>Prometheus/Grafana</b>.',
      'Équipe de 3, 7 mois de projet.'], [
      'Real-time <b>virtual try-on</b> through the webcam and <b>personalised recommendations</b> by gender and face shape.',
      '<b>Symfony</b> backend for user management and <b>.NET</b> for the opticians’ dashboard.',
      '<b>Python</b> module for AI and try-on; <b>Prometheus/Grafana</b> monitoring.',
      'Team of 3, 7-month project.']] },
  { id: 'crm', meta: ['EHEI · Projet académique · 2025', 'EHEI · Academic project · 2025'],
    title: ['MyCRM Pro, Symfony & DevOps', 'MyCRM Pro, Symfony & DevOps'],
    desc: ['Un CRM de gestion des clients et des factures, livré avec une vraie chaîne CI/CD, de la qualité de code et du monitoring.',
           'A CRM for customers and invoices, shipped with a real CI/CD pipeline, code quality checks and monitoring.'],
    tags: ['Symfony 6', 'Docker', 'Jenkins', 'Ansible', 'Grafana'],
    images: [['projects/crm-1.webp', 'Écran de connexion MyCRM Pro', 'MyCRM Pro sign-in screen'],
             ['projects/crm-2.webp', 'Gestion des clients', 'Customer management'],
             ['projects/crm-3.webp', 'Factures d’un client', 'A customer’s invoices'],
             ['projects/crm-4.webp', 'Détail d’une facture', 'Invoice details'],
             ['projects/crm-5.webp', 'Modification d’une facture', 'Editing an invoice'],
             ['projects/crm-6.webp', 'Confirmation de suppression', 'Delete confirmation']],
    details: [[
      '<b>Symfony 6</b> : Services, DTOs, Voters et Repositories ; sécurité CSRF, firewalls, rôles et UserProvider ; interface Bootstrap responsive.',
      '<b>CI/CD</b> : Docker, Jenkins et GitLab CI pour le build, les tests et le déploiement ; <b>SonarQube</b> pour la qualité.',
      'Déploiement automatisé avec <b>Ansible</b> ; supervision avec <b>Prometheus, Node Exporter et Grafana</b>.',
      'Équipe de 5, en mode Agile.'], [
      '<b>Symfony 6</b>: Services, DTOs, Voters and Repositories; CSRF, firewalls, roles and UserProvider security; responsive Bootstrap UI.',
      '<b>CI/CD</b>: Docker, Jenkins and GitLab CI for build, test and deploy; <b>SonarQube</b> for code quality.',
      'Automated deployment with <b>Ansible</b>; monitoring with <b>Prometheus, Node Exporter and Grafana</b>.',
      'Team of 5, working Agile.']] },
  { id: 'gov', meta: ['Préfecture d’Oujda · 2023', 'Oujda Prefecture · 2023'],
    title: ['Application de gestion 300K+', '300K+ records management app'],
    desc: ['Une application Laravel en production qui gère plus de 300 000 enregistrements pour la Préfecture d’Oujda.',
           'A Laravel application in production managing over 300,000 records for the Oujda Prefecture.'],
    tags: ['PHP', 'Laravel', 'MySQL'],
    details: [[
      'Application <b>PHP/Laravel</b> en production avec base <b>MySQL</b>.',
      'Plus de <b>300 000 enregistrements</b> : architecture Full Stack, tests et optimisation des performances.'], [
      '<b>PHP/Laravel</b> application in production with a <b>MySQL</b> database.',
      'Over <b>300,000 records</b>: Full Stack architecture, testing and performance tuning.']] },
  { id: 'atm', meta: ['EHEI · Projet JEE · 2025', 'EHEI · Java EE project · 2025'],
    title: ['Billetterie Atlético de Madrid', 'Atlético de Madrid ticketing'],
    desc: ['Application web de gestion des matchs et de réservation de billets, avec les rencontres à venir chargées depuis une API externe.',
           'A web app for managing matches and booking tickets, with upcoming fixtures loaded from an external API.'],
    tags: ['Java EE', 'JSP', 'JDBC', 'MySQL', 'Tomcat'],
    images: [['projects/atletico.webp', 'Page d’accueil : le stade Wanda Metropolitano', 'Home page: the Wanda Metropolitano stadium']],
    details: [[
      '<b>Réservation de billets</b> en ligne et consultation dynamique des matchs via une <b>API externe</b>.',
      'Gestion des spectateurs, administrateurs et employés ; authentification sécurisée avec sessions.',
      'Backend <b>Java EE</b> (Servlets, JSP), JDBC et MySQL ; frontend Bootstrap ; serveur Apache Tomcat.',
      'Équipe de 3.'], [
      'Online <b>ticket booking</b> and live match listings from an <b>external API</b>.',
      'Spectator, admin and staff management; secure session-based authentication.',
      '<b>Java EE</b> backend (Servlets, JSP), JDBC and MySQL; Bootstrap frontend; Apache Tomcat server.',
      'Team of 3.']] },
  { id: 'soil', wide: true, doc: true, meta: ['EHEI · Machine learning · 2025', 'EHEI · Machine learning · 2025'],
    title: ['Détection du type de sol par IA', 'AI soil type detection'],
    desc: ['Vision par ordinateur pour l’agriculture de précision : l’application classe le type de sol à partir d’une simple image.',
           'Computer vision for precision farming: the app classifies the soil type from a single image.'],
    tags: ['Python', 'scikit-learn', 'Vision', 'Data'],
    images: [['projects/sol-rapport.webp', 'Rapport du projet (19 pages)', 'Project report (19 pages)'],
             ['projects/sol-sommaire.webp', 'Table des matières', 'Table of contents'],
             ['projects/sol-introduction.webp', 'Introduction du rapport', 'Report introduction']],
    details: [[
      '<b>Prétraitement</b> du jeu de données « Soil types » : images 64×64, normalisation et encodage des labels ; découpage 70/30.',
      'Modèle de <b>régression logistique</b>, évalué par matrice de confusion et rapport de classification : <b>63,83 %</b> de précision sur le jeu de test.',
      'Détection à partir d’une image fournie par l’utilisateur.',
      'Pistes : élargir le jeu de données et tester des CNN légers (MobileNet, ResNet).'], [
      '<b>Preprocessing</b> of the “Soil types” dataset: 64×64 images, normalisation and label encoding; 70/30 split.',
      '<b>Logistic regression</b> model, evaluated with a confusion matrix and classification report: <b>63.83%</b> accuracy on the test set.',
      'Detection from an image supplied by the user.',
      'Next steps: a larger dataset and lightweight CNNs (MobileNet, ResNet).']] }
];
const L = a => (LANG === 'en' ? a[1] : a[0]);

/* Visuels SVG pour les projets sans capture */
const E = '#ff4a1c', B = 'rgba(236,232,225,.75)', D = 'rgba(236,232,225,.22)';
const VISUALS = {
  odoo: () => `<svg viewBox="0 0 840 320" preserveAspectRatio="xMidYMid slice" fill="none">
    ${[0, 1, 2, 3].map(c => `<rect class="draw" x="${120 + c * 160}" y="60" width="140" height="210" rx="6" stroke="${D}" style="--len:720"/>
      <text x="${134 + c * 160}" y="86" fill="${B}" font-family="Instrument Sans" font-size="13">${(LANG === 'en' ? ['Quote', 'Job site', 'Invoiced', 'Paid'] : ['Devis', 'Chantier', 'Facturé', 'Payé'])[c]}</text>
      ${[0, 1, 2].slice(0, 3 - (c % 2)).map(r => `<rect x="${132 + c * 160}" y="${102 + r * 52}" width="116" height="40" rx="4" fill="${c === 1 && r === 0 ? E : 'rgba(236,232,225,.07)'}"/>`).join('')}`).join('')}
    <path class="draw" d="M60 160 C 90 100, 100 220, 118 160" stroke="${E}" stroke-width="2" style="--len:200"/>
    <circle cx="60" cy="160" r="22" stroke="${E}" stroke-width="2"/><text x="${LANG === 'en' ? 51 : 47}" y="165" fill="${E}" font-family="JetBrains Mono" font-size="12">${LANG === 'en' ? 'AI' : 'IA'}</text></svg>`,
  gov: () => `<svg viewBox="0 0 780 320" preserveAspectRatio="xMidYMid slice" fill="none">
    ${Array.from({ length: 26 }, (_, i) => { const h = 40 + Math.abs(Math.sin(i * 1.7)) * 170; return `<rect x="${120 + i * 21}" y="${270 - h}" width="12" height="${h}" fill="${i === 18 ? E : 'rgba(236,232,225,.14)'}"/>` }).join('')}
    <line x1="110" y1="270" x2="680" y2="270" stroke="${B}"/>
    <text x="120" y="70" fill="${B}" font-family="Anton" font-size="44">${LANG === 'en' ? '300,000+' : '300 000+'}</text>
    <text x="122" y="92" fill="${E}" font-family="JetBrains Mono" font-size="12">SELECT COUNT(*) FROM dossiers;</text></svg>`
};
const icoPhotos = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/></svg>';
const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

const MOMENTS = [
  ['moments/diplome.webp', 'Diplômé ingénieur d’État, EHEI Oujda', 'State engineering graduate, EHEI Oujda'],
  ['moments/soutenance.webp', 'Soutenance du PFE', 'Final-year project defence'],
  ['moments/toge.webp', 'Remise des diplômes 2026', 'Graduation day 2026'],
  ['moments/bouquet.webp', 'Fin de cinq ans de formation', 'Five years of study, done'],
  ['moments/rennes.webp', 'Premier jour à Rennes (Bruz)', 'First day in Rennes (Bruz)'],
  ['moments/forum-geni.webp', 'Forum GENI Entreprises, Rabat', 'GENI Companies Forum, Rabat'],
  ['moments/forum-conference.webp', 'Conférences du forum GENI', 'Talks at the GENI forum'],
  ['moments/forum-stand.webp', 'Rencontres avec les entreprises', 'Meeting companies'],
  ['moments/cadre.webp', 'Un souvenir encadré', 'A framed memory'],
  ['moments/forum-salon.webp', 'Stands du forum GENI', 'GENI forum stands']
];

/* Gabarits HTML partagés (navigateur + génération statique pour le SEO) */
function projectCardHTML(p) {
  const visual = p.images
    ? `<img src="${img(p.images[0][0])}" alt="${L(p.images[0].slice(1))}" decoding="async"><span class="count">${icoPhotos}${u('photos')(p.images.length)}</span>`
    : VISUALS[p.id]();
  return `<button class="project tilt${p.wide ? ' wide' : ''}" data-id="${p.id}" data-cursor="view" aria-haspopup="dialog"><div class="project-visual${p.doc ? ' doc' : ''}">${visual}<span class="hazard" aria-hidden="true"></span><span class="shine"></span></div>
    <div class="project-body"><div><p class="project-meta">${L(p.meta)}</p><h3>${L(p.title)}</h3><p class="project-desc">${L(p.desc)}</p>
    <div class="tags" style="padding-top:18px">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div></div>
    <span class="project-open" aria-hidden="true">${arrow}</span></div></button>`;
}
function momentHTML(m, style) {
  return `<figure${style ? ` style="${style}"` : ''}><img src="${img(m[0])}" alt="${L(m.slice(1))}" decoding="async"><figcaption>${L(m.slice(1))}</figcaption></figure>`;
}
