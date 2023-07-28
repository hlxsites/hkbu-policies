import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const buLogo = createOptimizedPicture('/icons/deco-bu.png');
  buLogo.classList.add('bu-logo');
  block.append(buLogo);
}
