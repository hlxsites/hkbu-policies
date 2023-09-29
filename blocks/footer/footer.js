import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';
import { openExternalLinksInNewTab } from '../../scripts/scripts.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    footer.innerHTML = html;

    const footerSections = ['logo', 'links', 'copyright'];
    footer.querySelectorAll(':scope > div').forEach((div, i) => {
      div.classList.add(footerSections[i]);
    });

    footer.querySelector('a[href="https://www.hkbu.edu.hk/"]')
      ?.setAttribute('aria-label', 'Link to home page');

    decorateIcons(footer);
    openExternalLinksInNewTab(footer);
    block.append(footer);
  }
}
