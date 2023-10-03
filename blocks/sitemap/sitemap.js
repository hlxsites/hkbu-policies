import { getLanguage } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const endpoint = `/${getLanguage()}/query-index.json`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error('Error fetching index');
  }
  const index = await response.json();

  const rootPages = index.data.filter((item) => item['root-page'] === 'true');
  const nonRootPages = index.data.filter((item) => item['root-page'] !== 'true');

  block.innerHTML = `
    <ul>
      ${rootPages.map((item) => `
        <li>
            <a href="${item.path}">
                ${item.title} 
                <span class="icon icon-site-navigation"></span>
                <span class="icon icon-site-navigation-hover"></span>
            </a>
            ${item.title.toLowerCase() === 'policies' ? `
              <ul>
                ${nonRootPages.map((itemInner) => `
                  <li>
                    <a href="${itemInner.path}">
                      ${itemInner.title} 
                      <span class="icon icon-site-navigation"></span>
                      <span class="icon icon-site-navigation-hover"></span>
                    </a>
                  </li>
                `).join('\n')}
              </ul>
            ` : ''}
        </li>
      `).join('\n')}
    </ul>
  `;

  decorateIcons(block);
}
