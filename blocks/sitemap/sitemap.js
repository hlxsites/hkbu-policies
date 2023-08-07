import { getLanguage } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const endpoint = `/${getLanguage()}/query-index.json`;
  const response = await fetch(endpoint)
  if (!response.ok) {
    throw new Error('Error fetching index');
  }
  const index = await response.json();

  block.innerHTML = `
    <ul>
      ${index.data.map((item) => `
        <li>
            <a href="${item.path}">
                ${item.title} 
                <span class="icon icon-site-navigation"></span>
                <span class="icon icon-site-navigation-hover"></span>
            </a>
        </li>
      `).join('\n')}
      
    </ul>
  `;

  decorateIcons(block);
}
