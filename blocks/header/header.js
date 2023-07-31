import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';
import { fragment } from '../../scripts/scripts.js';

const isDesktop = window.matchMedia('(min-width: 1024px)');

function toggleMenu(block) {
  block.querySelector('nav').toggleAttribute('aria-expanded');
}

function toggleSubmenu(li) {
  li.toggleAttribute('aria-expanded');
}

function setupMobileEventListeners(block) {
  block.querySelector('.nav-hamburger').addEventListener('click', () => toggleMenu(block));
  block.querySelectorAll('.nav-sections > ul > li > ul').forEach((ul) => {
    const parent = ul.parentElement;
    parent.querySelector(':scope > .icon-chevron-down')
      .addEventListener('click', () => toggleSubmenu(parent));
  });
  block.querySelector('.nav-close-background').addEventListener('click', () => toggleMenu(block));
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

    // Add different sections to nav
    nav.querySelector(':scope > div').className = 'nav-sections';
    nav.prepend(fragment(`
      <div class="nav-close-background"></div>
      <div class="nav-hamburger"><span class="burger"></span></div>
      <div class='nav-logo'>
        <span class="icon icon-logo-white"></span>
        <span class="icon icon-logo-small"></span>
      </div>
      <div class="nav-search"><span class="icon icon-search"></span></div>
      <div class="nav-toolbar">
        <span class="icon icon-font-size"></span>
        <span class="icon icon-language"></span>
        <span class="icon icon-search"></span>
      </div>
    `));

    // add chevrons to lis with submenu or lis in sub menu with link
    nav.querySelectorAll('.nav-sections > ul > li > ul, .nav-sections > ul > li > ul > li > a').forEach((item) => {
      item.parentElement.append(fragment('<span class="icon icon-chevron-down"></span>'));
    });

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
    onMediaChange();
  }
}
