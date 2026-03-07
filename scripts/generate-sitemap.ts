import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INDUSTRIES } from '../data/industryData.ts';
import { SIC_INDUSTRIES } from '../data/sicIndustries.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.reducemyinsurance.net';

const staticRoutes = [
  '/',
  '/apply',
  '/dashboard',
  '/carriers',
  '/service',
  '/auto',
  '/home',
  '/renters',
  '/umbrella',
  '/watercraft',
  '/flood',
  '/powersports',
  '/pet-insurance',
  '/sell-car',
  '/safety-course',
  '/home-security',
  '/arkay-warranty',
  '/choice-warranty',
  '/commercial',
  '/general-liability',
  '/workers-comp',
  '/commercial-auto',
  '/bop',
  '/cyber',
  '/builders-risk',
  '/bonds',
  '/sports',
  '/sola',
  '/insure-tax',
  '/industries',
  '/health',
  '/dental-vision',
  '/disability',
  '/life',
  '/financial',
  '/kickoff',
  '/tools',
  '/tools/inspection',
  '/knowledge',
  '/agent/academy',
  '/privacy',
  '/admin',
  '/sitemap'
];

const allIndustries = (() => {
  const mappedSic = SIC_INDUSTRIES.map(sic => ({
    slug: sic.slug,
    name: sic.name,
  }));
  const existingSlugs = new Set(INDUSTRIES.map(i => i.slug));
  const uniqueSic = mappedSic.filter(s => !existingSlugs.has(s.slug));
  
  return [...INDUSTRIES.map(i => ({ slug: i.slug, name: i.name })), ...uniqueSic];
})();

const industryRoutes = allIndustries.map(ind => `/insurance/${ind.slug}`);

const allRoutes = [...staticRoutes, ...industryRoutes];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
console.log('sitemap.xml generated successfully in public folder!');
