import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INDUSTRIES } from '../data/industryData.ts';
import { SIC_INDUSTRIES } from '../data/sicIndustries.ts';
import { CARRIERS_DATA } from '../data/carriers.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.reducemyinsurance.net';
const TODAY = new Date().toISOString().split('T')[0];

// High-value public pages only — no auth-walled, admin, or internal routes
const staticRoutes: Array<{ path: string; priority: string; changefreq: string }> = [
  // Homepage
  { path: '/',                  priority: '1.0', changefreq: 'weekly' },

  // Primary commercial lines — high purchase intent
  { path: '/commercial',        priority: '0.9', changefreq: 'monthly' },
  { path: '/general-liability', priority: '0.9', changefreq: 'monthly' },
  { path: '/workers-comp',      priority: '0.9', changefreq: 'monthly' },
  { path: '/commercial-auto',   priority: '0.9', changefreq: 'monthly' },
  { path: '/bop',               priority: '0.9', changefreq: 'monthly' },
  { path: '/cyber',             priority: '0.9', changefreq: 'monthly' },
  { path: '/builders-risk',     priority: '0.9', changefreq: 'monthly' },

  // Primary personal lines
  { path: '/auto',              priority: '0.9', changefreq: 'monthly' },
  { path: '/home',              priority: '0.9', changefreq: 'monthly' },
  { path: '/renters',           priority: '0.9', changefreq: 'monthly' },
  { path: '/life',              priority: '0.9', changefreq: 'monthly' },
  { path: '/health',            priority: '0.9', changefreq: 'monthly' },

  // Quote / conversion page
  { path: '/apply',             priority: '0.9', changefreq: 'monthly' },

  // Key navigation / discovery pages
  { path: '/carriers',          priority: '0.8', changefreq: 'monthly' },
  { path: '/service',           priority: '0.8', changefreq: 'monthly' },
  { path: '/industries',        priority: '0.8', changefreq: 'monthly' },

  // Secondary personal lines
  { path: '/umbrella',          priority: '0.7', changefreq: 'monthly' },
  { path: '/flood',             priority: '0.7', changefreq: 'monthly' },
  { path: '/watercraft',        priority: '0.7', changefreq: 'monthly' },
  { path: '/powersports',       priority: '0.7', changefreq: 'monthly' },
  { path: '/pet-insurance',     priority: '0.7', changefreq: 'monthly' },
  { path: '/dental-vision',     priority: '0.7', changefreq: 'monthly' },
  { path: '/disability',        priority: '0.7', changefreq: 'monthly' },

  // Secondary commercial
  { path: '/bonds',             priority: '0.7', changefreq: 'monthly' },
  { path: '/sports',            priority: '0.7', changefreq: 'monthly' },

  // Specialty / partner pages
  { path: '/financial',         priority: '0.6', changefreq: 'monthly' },
  { path: '/insure-tax',        priority: '0.6', changefreq: 'monthly' },
  { path: '/sola',              priority: '0.6', changefreq: 'monthly' },
  { path: '/sell-car',          priority: '0.6', changefreq: 'monthly' },
  { path: '/safety-course',     priority: '0.6', changefreq: 'monthly' },
  { path: '/home-security',     priority: '0.6', changefreq: 'monthly' },
  { path: '/arkay-warranty',    priority: '0.6', changefreq: 'monthly' },
  { path: '/choice-warranty',   priority: '0.6', changefreq: 'monthly' },

  // Utility
  { path: '/privacy',           priority: '0.3', changefreq: 'yearly' },
  { path: '/sitemap',           priority: '0.3', changefreq: 'yearly' },
];

// Individual carrier detail pages — useful for brand-name searches
const carrierRoutes = CARRIERS_DATA.map(c => ({
  path: `/carrier/${c.slug}`,
  priority: '0.8',
  changefreq: 'monthly',
}));

// Industry-specific landing pages
const allIndustries = (() => {
  const mappedSic = SIC_INDUSTRIES.map(sic => ({ slug: sic.slug }));
  const existingSlugs = new Set(INDUSTRIES.map(i => i.slug));
  const uniqueSic = mappedSic.filter(s => !existingSlugs.has(s.slug));
  return [...INDUSTRIES.map(i => ({ slug: i.slug })), ...uniqueSic];
})();

const industryRoutes = allIndustries.map(ind => ({
  path: `/insurance/${ind.slug}`,
  priority: '0.7',
  changefreq: 'monthly',
}));

const allRoutes = [...staticRoutes, ...carrierRoutes, ...industryRoutes];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(r => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
console.log(`sitemap.xml generated: ${allRoutes.length} URLs`);
