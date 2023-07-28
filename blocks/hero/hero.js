import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const background = document.createElement('div');
  background.classList.add('hero-background');
  block.append(background);

  block.querySelector('img').classList.add('hero-image');

  ['deco-bu', 'deco-bu-dark'].forEach((logoName) => {
    const buLogo = createOptimizedPicture(`/icons/${logoName}.png`);
    buLogo.classList.add('bu-logo', logoName);
    block.querySelector(':scope > div > div').append(buLogo);
  });
}
