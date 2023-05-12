import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../tailwind.config';

export const fullTailwindConfig = resolveConfig(tailwindConfig);
// export const extendedColors = fullTailwindConfig.theme.extend.colors;
export const extendedColors = fullTailwindConfig!.theme!.extend!.colors;
