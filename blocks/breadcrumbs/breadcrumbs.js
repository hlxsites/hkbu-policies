export default function decorate(block) {
  const currentPathEl = block.querySelector('span');
  currentPathEl.classList.add('current-path');

  block.innerHTML = `
    <a href="/en/">Home</a> / ${currentPathEl.outerHTML}
  `;
}
