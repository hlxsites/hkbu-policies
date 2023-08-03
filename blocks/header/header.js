import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';
import { fragment } from '../../scripts/scripts.js';

const isDesktop = window.matchMedia('(min-width: 1024px)');

function toggleMenu(block) {
  block.querySelector('nav').toggleAttribute('aria-expanded');
}

function toggleSubmenu(li) {
  li.toggleAttribute('aria-expanded');
}

function toggleHasScrolled(block) {
  const nav = block.querySelector('nav');
  if (window.scrollY > 0 && !nav.classList.contains('has-scrolled')) {
    block.querySelector('nav').classList.add('has-scrolled');
  } else if (window.scrollY <= 0 && nav.classList.contains('has-scrolled')) {
    block.querySelector('nav').classList.remove('has-scrolled');
  }
}

function setupMobileEventListeners(block) {
  block.querySelector('.nav-hamburger').addEventListener('click', () => toggleMenu(block));
  block.querySelectorAll('.nav-sections > ul > li > ul').forEach((ul) => {
    const parent = ul.parentElement;
    parent.querySelector(':scope > .icon-chevron-down')
      .addEventListener('click', () => toggleSubmenu(parent));
  });
  block.querySelector('.nav-close-background').addEventListener('click', () => toggleMenu(block));
  block.querySelectorAll('.nav-toolbar .tool-dropdown').forEach((tool) => {
    tool.addEventListener('click', () => tool.toggleAttribute('expanded'));
  });
  block.querySelectorAll('.icon-font-size ~ .tool-dropdown-content > span').forEach((fontSizeButton, i) => {
    const sizes = [9, 10, 11];
    fontSizeButton.addEventListener('click', () => {
      fontSizeButton.parentElement.querySelector('[aria-selected]').removeAttribute('aria-selected');
      fontSizeButton.setAttribute('aria-selected', true);
      document.querySelector('html').style.fontSize = `${sizes[i]}px`;
    });
  });
}

function setupDesktopEventListeners(block) {
  document.addEventListener('scroll', () => toggleHasScrolled(block));

  block.querySelectorAll('.nav-sections, .nav-toolbar, .nav-hamburger').forEach((section) => {
    section.addEventListener('mouseenter', () => block.querySelector('nav').setAttribute('data-hovering', ''));
  });
  block.querySelector('.nav-close-background').addEventListener('mouseenter', () => {
    block.querySelector('nav').removeAttribute('data-hovering');
  });
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
        <div class="tool-dropdown">
            <span role="button" class="icon icon-font-size"></span>
            <div class="tool-dropdown-content">
                <span style="scale: 0.7" role="button" class="icon icon-font-size-single"></span>
                <span aria-selected="true" role="button" class="icon icon-font-size-single"></span>
                <span style="scale: 1.3" role="button" class="icon icon-font-size-single"></span>
            </div>
        </div>
        <div class="tool-dropdown">
            <span role="button" class="icon icon-language"></span>
            <div class="tool-dropdown-content">
                <span aria-selected="true" role="button" class="">EN</span>
                <span role="button" class="">简</span>
                <span role="button" class="">繁</span>
            </div>
        </div>
        <span class="icon icon-search"></span>
      </div>
    `));
    nav.append(fragment(`
      <div class="nav-sidebar-background"></div>
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
    if (isDesktop.matches) {
      setupDesktopEventListeners(block);
    } else {
      setupMobileEventListeners(block);
    }
  }
}

// Re-render block if switching between mobile and desktop
isDesktop.addEventListener('change', () => {
  decorate(document.querySelector('.block.header'));
});
