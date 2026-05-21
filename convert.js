const fs = require('fs');
const path = require('path');

function htmlToJsx(html) {
  let jsx = html;
  
  // Replace class= with className=
  jsx = jsx.replace(/class=/g, 'className=');
  
  // Replace for= with htmlFor=
  jsx = jsx.replace(/for=/g, 'htmlFor=');
  
  // Fix unclosed tags (img, input, br, hr)
  jsx = jsx.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
  jsx = jsx.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
  jsx = jsx.replace(/<br([^>]*[^\/])>/g, '<br$1 />');
  jsx = jsx.replace(/<hr([^>]*[^\/])>/g, '<hr$1 />');
  
  // Replace inline styles (very basic, won't cover complex cases, but helps)
  // E.g. style="width: 100%" -> style={{ width: '100%' }}
  jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
    const styleObj = p1.split(';').filter(s => s.trim()).reduce((acc, curr) => {
      let [key, value] = curr.split(':');
      if (!key || !value) return acc;
      // camelCase key
      key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      acc.push(`${key}: '${value.trim()}'`);
      return acc;
    }, []).join(', ');
    return `style={{ ${styleObj} }}`;
  });

  // Extract body content
  const bodyMatch = jsx.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    jsx = bodyMatch[1];
  }

  // Remove script tags from body
  jsx = jsx.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Wrap in a fragment
  return `<>\n${jsx}\n</>`;
}

const inputPath = path.join(__dirname, 'UI/stitch_studyflow_productivity_suite/landing_page/code.html');
const outputPath = path.join(__dirname, 'src/components/landing/NewHero.tsx');

const html = fs.readFileSync(inputPath, 'utf8');
const jsx = htmlToJsx(html);

// Add the config styles to the top so it doesn't break the Next.js app
const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
let headContent = '';
if (headMatch) {
  // Extract just the style blocks and external links
  const styles = headMatch[1].match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  const links = headMatch[1].match(/<link[^>]*>/gi) || [];
  const scripts = headMatch[1].match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
  
  headContent = `
    ${links.join('\n')}
    ${styles.join('\n')}
  `;
}

const componentCode = `
import React from 'react';
import Head from 'next/head';

export function NewHero() {
  return (
    <>
      <Head>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: \`
          tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "surface-bright": "#fdf7ff",
                        "tertiary-container": "#c9a74d",
                        "surface-container-highest": "#e6e0e9",
                        "surface-container-low": "#f8f2fa",
                        "on-tertiary-fixed-variant": "#594400",
                        "inverse-on-surface": "#f5eff7",
                        "on-surface": "#1d1b20",
                        "on-primary-container": "#e0d2ff",
                        "on-primary-fixed-variant": "#4f378a",
                        "error-container": "#ffdad6",
                        "inverse-surface": "#322f35",
                        "on-tertiary-fixed": "#241a00",
                        "surface": "#fdf7ff",
                        "background": "#fdf7ff",
                        "on-error-container": "#93000a",
                        "surface-tint": "#6750a4",
                        "primary-container": "#6750a4",
                        "surface-variant": "#e6e0e9",
                        "on-tertiary-container": "#503d00",
                        "outline": "#7a7582",
                        "outline-variant": "#cbc4d2",
                        "on-tertiary": "#ffffff",
                        "on-secondary-container": "#645a7d",
                        "on-error": "#ffffff",
                        "on-primary-fixed": "#22005d",
                        "surface-container": "#f2ecf4",
                        "on-background": "#1d1b20",
                        "surface-dim": "#ded8e0",
                        "on-surface-variant": "#494551",
                        "error": "#ba1a1a",
                        "surface-container-lowest": "#ffffff",
                        "tertiary-fixed-dim": "#e7c365",
                        "on-secondary-fixed-variant": "#4b4263",
                        "primary-fixed-dim": "#cfbcff",
                        "inverse-primary": "#cfbcff",
                        "tertiary-fixed": "#ffdf93",
                        "on-primary": "#ffffff",
                        "primary": "#4f378a",
                        "tertiary": "#765b00",
                        "secondary-fixed-dim": "#cdc0e9",
                        "secondary": "#63597c",
                        "primary-fixed": "#e9ddff",
                        "on-secondary-fixed": "#1f1635",
                        "secondary-container": "#e1d4fd",
                        "on-secondary": "#ffffff",
                        "secondary-fixed": "#e9ddff",
                        "surface-container-high": "#ece6ee"
                    },
                    "fontFamily": {
                        "headline-md": ["Plus Jakarta Sans"],
                        "body-md": ["Inter"],
                        "display": ["Plus Jakarta Sans"],
                        "label-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "label-sm": ["Inter"],
                        "headline-lg-mobile": ["Plus Jakarta Sans"],
                        "headline-lg": ["Plus Jakarta Sans"]
                    }
                }
            }
          }
        \`}} />
        <style dangerouslySetInnerHTML={{ __html: \`
          .glass-effect { background-color: rgba(255,255,255,0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.4); }
          .primary-gradient { background: linear-gradient(to right, #4f378a, #8b5cf6); }
          .text-gradient { -webkit-background-clip: text; color: transparent; background-image: linear-gradient(to right, #4f378a, #8b5cf6); }
          .ambient-shadow { box-shadow: 0 12px 40px -12px rgba(79, 55, 138, 0.15); }
          .ambient-shadow-hover:hover { box-shadow: 0 20px 50px -10px rgba(79, 55, 138, 0.2); }
        \`}} />
      </Head>
      <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container">
        ${jsx}
      </div>
    </>
  );
}
`;

fs.writeFileSync(outputPath, componentCode);
console.log('Successfully wrote to', outputPath);
