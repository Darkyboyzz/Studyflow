const fs = require('fs');
const path = require('path');

// 1. Add colors to globals.css
const cssFile = path.join(__dirname, 'src/app/globals.css');
let cssContent = fs.readFileSync(cssFile, 'utf8');

const themeColors = `
  --color-surface-bright: #fdf7ff;
  --color-tertiary-container: #c9a74d;
  --color-surface-container-highest: #e6e0e9;
  --color-surface-container-low: #f8f2fa;
  --color-on-tertiary-fixed-variant: #594400;
  --color-inverse-on-surface: #f5eff7;
  --color-on-surface: #1d1b20;
  --color-on-primary-container: #e0d2ff;
  --color-on-primary-fixed-variant: #4f378a;
  --color-error-container: #ffdad6;
  --color-inverse-surface: #322f35;
  --color-on-tertiary-fixed: #241a00;
  --color-surface: #fdf7ff;
  --color-on-error-container: #93000a;
  --color-surface-tint: #6750a4;
  --color-primary-container: #6750a4;
  --color-surface-variant: #e6e0e9;
  --color-on-tertiary-container: #503d00;
  --color-outline: #7a7582;
  --color-outline-variant: #cbc4d2;
  --color-on-tertiary: #ffffff;
  --color-on-secondary-container: #645a7d;
  --color-on-error: #ffffff;
  --color-on-primary-fixed: #22005d;
  --color-surface-container: #f2ecf4;
  --color-on-background: #1d1b20;
  --color-surface-dim: #ded8e0;
  --color-on-surface-variant: #494551;
  --color-error: #ba1a1a;
  --color-surface-container-lowest: #ffffff;
  --color-tertiary-fixed-dim: #e7c365;
  --color-on-secondary-fixed-variant: #4b4263;
  --color-primary-fixed-dim: #cfbcff;
  --color-inverse-primary: #cfbcff;
  --color-tertiary-fixed: #ffdf93;
  --color-on-primary: #ffffff;
  --color-tertiary: #765b00;
  --color-secondary-fixed-dim: #cdc0e9;
  --color-secondary: #63597c;
  --color-primary-fixed: #e9ddff;
  --color-on-secondary-fixed: #1f1635;
  --color-secondary-container: #e1d4fd;
  --color-on-secondary: #ffffff;
  --color-secondary-fixed: #e9ddff;
  --color-surface-container-high: #ece6ee;

  --font-headline-md: "Plus Jakarta Sans";
  --font-body-md: "Inter";
  --font-display: "Plus Jakarta Sans";
  --font-label-md: "Inter";
  --font-body-lg: "Inter";
  --font-label-sm: "Inter";
  --font-headline-lg-mobile: "Plus Jakarta Sans";
  --font-headline-lg: "Plus Jakarta Sans";
`;

if (!cssContent.includes('--color-surface-bright')) {
  cssContent = cssContent.replace('@theme inline {', '@theme inline {\\n' + themeColors);
  fs.writeFileSync(cssFile, cssContent);
}

// 2. Replace base64 logo in NewHero.tsx
const heroFile = path.join(__dirname, 'src/components/landing/NewHero.tsx');
let heroContent = fs.readFileSync(heroFile, 'utf8');

// Replace all occurrences of the base64 image with /logo.png
heroContent = heroContent.replace(/src="data:image\/png;base64,[^"]+"/g, 'src="/logo.png"');

fs.writeFileSync(heroFile, heroContent);
