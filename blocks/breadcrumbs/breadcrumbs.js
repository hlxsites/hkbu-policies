import { decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const currentPathEl = block.querySelector('span');
  currentPathEl.classList.add('current-path');

  let button = '';
  if (block.classList.contains('with-button')) {
    button = `
      <a class="button primary" href="/en/">
        < Back to the Policies page
      </a>
    `;
  }

  block.innerHTML = `
    ${button}
    <div class="breadcrumb-content">
      <a href="/en/">Home</a> / ${currentPathEl.outerHTML}
    </div>
  `;

  decorateIcons(block);
}
