import { decorateIcons } from '../../scripts/lib-franklin.js';
import { getLanguage } from '../../scripts/scripts.js';

export default function decorate(block) {
  const currentPathEl = block.querySelector('span');
  currentPathEl.classList.add('current-path');

  const noButton = document.querySelector('meta[name="breadcrumbs-no-back-button"]');

  let button = '';
  if (block.classList.contains('with-button') && !noButton) {
    button = `
      <a class="button primary" href="/${getLanguage()}/policies">
        < Back to the Policies page
      </a>
    `;
  }

  block.innerHTML = `
    ${button}
    <div class="breadcrumb-content">
      <a href="/${getLanguage()}/">Home</a> / ${currentPathEl.outerHTML}
    </div>
  `;

  decorateIcons(block);
}
