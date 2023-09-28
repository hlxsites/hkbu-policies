import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';
import { fragment, getLanguage } from '../../scripts/scripts.js';

const isDesktop = window.matchMedia('(min-width: 1024px)');

// Opens/closes mobile menu
function toggleMenu(block) {
  block.querySelector('nav').toggleAttribute('aria-expanded');
}

// Opens/closes sub-menu
function toggleSubmenu(li) {
  li.toggleAttribute('aria-expanded');
}

function closeAllSubmenus(block) {
  block.querySelectorAll('.nav-sections li[aria-expanded]').forEach((section) => {
    section.removeAttribute('aria-expanded');
  });
}

// Adds the appropriate class name if the user has scrolled on the page
function toggleHasScrolled(block) {
  const nav = block.querySelector('nav');
  if (window.scrollY > 0 && !nav.classList.contains('has-scrolled')) {
    block.querySelector('nav').classList.add('has-scrolled');
  } else if (window.scrollY <= 0 && nav.classList.contains('has-scrolled')) {
    block.querySelector('nav').classList.remove('has-scrolled');
  }
}

// Closes the open toolbars (language selector/font size)
function closeAllExpandedTools(block) {
  block.querySelectorAll('.nav-toolbar [expanded]').forEach((element) => {
    element.removeAttribute('expanded');
  });
}

// Adds event listeners that are shared between mobile and desktop
function setupSharedEventListeners(block) {
  // Implements font size tool
  block.querySelectorAll('.icon-font-size ~ .tool-dropdown-content > span').forEach((fontSizeButton, i) => {
    const sizes = [9, 10, 11];
    fontSizeButton.addEventListener('click', () => {
      fontSizeButton.parentElement.querySelector('[aria-selected]').removeAttribute('aria-selected');
      fontSizeButton.setAttribute('aria-selected', true);
      document.querySelector('html').style.fontSize = `${sizes[i]}px`;
    });
  });
  // Add search overlay toggle
  block.querySelectorAll('.nav-search .icon-search, .nav-toolbar .icon-search').forEach((searchIcon) => {
    searchIcon.addEventListener('click', () => {
      block.querySelector('.nav-search-overlay').toggleAttribute('visible');
    });
  });
  // Close search overlay
  block.querySelector('.nav-search-overlay button[name="close"]').addEventListener('click', () => {
    block.querySelector('.nav-search-overlay').toggleAttribute('visible');
  });
  // Search overlay suggestions
  block.querySelectorAll('.nav-search-overlay .search-ideas ul li').forEach((li) => {
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => {
      block.querySelector('.nav-search-overlay input').value = li.textContent;
    });
  });
}

// Adds event listeners that are used only on mobile
function setupMobileEventListeners(block) {
  // open menu on hamburger click
  block.querySelector('.nav-hamburger').addEventListener('click', () => toggleMenu(block));
  // close menu on click outside of menu
  block.querySelector('.nav-close-background').addEventListener('click', () => toggleMenu(block));
  // open/close sub-menu
  block.querySelectorAll('.nav-sections > ul > li > ul').forEach((ul) => {
    const parent = ul.parentElement;
    parent.querySelector(':scope > .icon-chevron-down')
      .addEventListener('click', () => toggleSubmenu(parent));
  });
  // Open/close language selector and font size tool
  block.querySelectorAll('.nav-toolbar .tool-dropdown').forEach((tool) => {
    tool.addEventListener('click', () => {
      if (tool.hasAttribute('expanded')) {
        closeAllExpandedTools(block);
      } else {
        closeAllExpandedTools(block);
        tool.toggleAttribute('expanded');
      }
    });
  });
  setupSharedEventListeners(block);
}

// Adds event listeners that are used only on desktop
function setupDesktopEventListeners(block) {
  // Change menu size on scroll
  document.addEventListener('scroll', () => toggleHasScrolled(block));

  // open menu when user's mouse enters the sidebar
  block.querySelectorAll('.nav-sections, .nav-toolbar, .nav-hamburger').forEach((section) => {
    section.addEventListener('mouseenter', () => block.querySelector('nav').setAttribute('data-hovering', ''));
  });
  // close menu when user's mouse enters invisible div over the content
  block.querySelector('.nav-close-background').addEventListener('mouseenter', () => {
    block.querySelector('nav').removeAttribute('data-hovering');
    closeAllExpandedTools(block);
  });
  // toggle sub-menus
  block.querySelectorAll('.nav-sections > ul > li > ul').forEach((ul) => {
    const parent = ul.parentElement;
    parent.addEventListener('mouseenter', () => toggleSubmenu(parent));
    parent.addEventListener('mouseleave', () => closeAllSubmenus(block));
  });
  // Open/close language selector and font size tool
  block.querySelectorAll('.nav-toolbar .tool-dropdown').forEach((tool) => {
    tool.addEventListener('mouseenter', () => {
      closeAllExpandedTools(block);
      tool.toggleAttribute('expanded');
    });
    tool.addEventListener('mouseleave', () => {
      closeAllExpandedTools(block);
    });
  });
  setupSharedEventListeners(block);
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
    nav.querySelector(':scope > div:first-child').className = 'nav-sections';
    nav.querySelector(':scope > div:nth-child(2)').className = 'nav-search-overlay';
    nav.querySelector('.nav-search-overlay').innerHTML = `
      <form class="input-wrapper" action="/${getLanguage()}/search-result">
        <input type="text" name="q" placeholder="What are you looking for?">
        <button type="submit"><span class="icon icon-search"></span></button>
      </form>
      <div class="search-ideas">${nav.querySelector('.nav-search-overlay').innerHTML}</div>
      <button name="close"><span class="icon icon-close"></span></button>
    `;
    nav.prepend(fragment(`
      <div class="nav-close-background"></div>
      <div class="nav-hamburger"><span class="burger"></span></div>
      <div class='nav-logo'>
        <a href="https://www.hkbu.edu.hk/" aria-label="Link to home page">
          <span class="icon icon-logo-white"></span>
          <span class="icon icon-logo-small"></span>
        </a>
      </div>
      <div class="nav-search"><span class="icon icon-search"></span></div>
      <div class="nav-toolbar">
        <div class="tool-dropdown">
            <span role="button" class="icon icon-font-size"></span>
            <div class="tool-dropdown-content">
                <span role="button" class="icon icon-font-size-single scale-07"></span>
                <span aria-selected="true" role="button" class="icon icon-font-size-single"></span>
                <span role="button" class="icon icon-font-size-single scale-13"></span>
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

    // Append nav to document
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

    // initially check if the page loaded at an offset
    toggleHasScrolled(block);
  }
}

// Re-render block if switching between mobile and desktop
isDesktop.addEventListener('change', () => {
  decorate(document.querySelector('.block.header'));
});
