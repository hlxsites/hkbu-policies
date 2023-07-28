import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';

const isDesktop = window.matchMedia('(min-width: 768px)');

function setupMobileEventListeners(block) {

}

function setupDesktopEventListeners(block) {

}

export default async function decorate(block) {
  block.innerHTML = '';
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = html;

    // Add sections
    nav.querySelector(':scope > div').className = 'nav-sections';

    // Add logo
    nav.append(document.createRange().createContextualFragment(`
      <div class="nav-hamburger"></div>
      <div class='nav-logo'><span class="icon icon-logo-white"></span></div>
      <div class="nav-search"><span class="icon icon-search"></span></div>
    `));

    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    block.append(navWrapper);

    decorateIcons(block);

    // Add event listeners
    const onMediaChange = () => (isDesktop.matches
      ? setupDesktopEventListeners(block)
      : setupMobileEventListeners(block));
    isDesktop.addEventListener('change', onMediaChange);
  }
}
