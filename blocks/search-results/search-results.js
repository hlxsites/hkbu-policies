import { getLanguage } from '../../scripts/scripts.js';
import { createOptimizedPicture, decorateIcons } from '../../scripts/lib-franklin.js';

function highlightText(text, positions, length) {
  const modifiedTextLength = '<em></em>'.length;
  let outputText = text;
  for (let i = 0; i < positions.length; i += 1) {
    const position = positions[i] + modifiedTextLength * i;
    // eslint-disable-next-line prefer-template
    outputText = outputText.substring(0, position)
      + `<em>${outputText.substring(position, position + length)}</em>` + outputText.substring(position + length);
  }

  return outputText;
}

function findAllMatches(text, searchTerm) {
  return [...text.toLowerCase().matchAll(searchTerm.toLowerCase())].map((result) => result.index);
}

function renderSearchResult(item, searchTerm) {
  const titleMatches = findAllMatches(item.title, searchTerm);
  const descriptionMatches = findAllMatches(item.description, searchTerm);

  const titleHtml = highlightText(item.title, titleMatches, searchTerm.length);
  const descriptionHtml = highlightText(item.description, descriptionMatches, searchTerm.length);

  return `<div>
            <span class="icon icon-page"></span>
            <h2><a href="${item.path}">${titleHtml}</a></h2>
            <div class="description">${descriptionHtml}</div>
          </div>`;
}

export default async function decorate(block) {
  const endpoint = `/${getLanguage()}/query-index.json`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error('Error fetching index');
  }
  const index = await response.json();

  const searchTerm = new URLSearchParams(window.location.search).get('q') || '';

  const findInIndexItem = (indexItem, search) => indexItem
    .title.toLowerCase().includes(search.toLowerCase())
    || indexItem.description.toLowerCase().includes(search.toLowerCase());

  const results = index.data.filter((item) => findInIndexItem(item, searchTerm));

  let resultsHtml = `<div class="no-results">
    ${createOptimizedPicture(
    '/icons/search-no-result.png',
    'Icon symbolizing no results found',
    false,
    [{ width: 86 }],
  ).outerHTML}
    <h2>SORRY</h2>
    <p>We couldn't find any results, please try a new search</p>
  </div>`;

  if (searchTerm && results.length !== 0) {
    resultsHtml = `
      <span class="showing-x">Showing ${results.length} of ${results.length}</span>
      <div class="results">
        ${results.map(((item) => renderSearchResult(item, searchTerm))).join('')}
      </div>
    `;
  }

  block.innerHTML = `
    <form class="input-wrapper" action="/${getLanguage()}/search-result">
      <input value="${searchTerm}" type="text" name="q" placeholder="What are you looking for?">
      <button type="submit"><span class="icon icon-search"></span></button>
    </form>
    ${resultsHtml}
  `;

  decorateIcons(block);
}
