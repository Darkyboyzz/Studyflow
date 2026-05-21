
import React from 'react';
import Head from 'next/head';

export function NewHero() {
  return (
    <>
      <Head>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `
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
        `}} />
        <style dangerouslySetInnerHTML={{ __html: `
          .glass-effect { background-color: rgba(255,255,255,0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.4); }
          .primary-gradient { background: linear-gradient(to right, #4f378a, #8b5cf6); }
          .text-gradient { -webkit-background-clip: text; color: transparent; background-image: linear-gradient(to right, #4f378a, #8b5cf6); }
          .ambient-shadow { box-shadow: 0 12px 40px -12px rgba(79, 55, 138, 0.15); }
          .ambient-shadow-hover:hover { box-shadow: 0 20px 50px -10px rgba(79, 55, 138, 0.2); }
        `}} />
      </Head>
      <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container">
        <>

{/**/}
<nav className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-desktop h-16 bg-surface/70 dark:bg-surface-dim/70 backdrop-blur-xl border-b border-white/20 shadow-sm hidden md:flex">
<div className="flex items-center gap-4">
<img alt="StudyFlow Logo" className="w-8 h-8 rounded-lg" src="/logo.png"/>
<span className="font-display text-headline-md font-bold text-primary dark:text-primary-fixed-dim">StudyFlow</span>
</div>
<div className="hidden md:flex items-center gap-8">
<a className="font-body-md text-body-md text-on-surface-variant font-medium hover:text-primary transition-colors duration-200" href="#">Features</a>
<a className="font-body-md text-body-md text-on-surface-variant font-medium hover:text-primary transition-colors duration-200" href="#">Pricing</a>
<a className="font-body-md text-body-md text-on-surface-variant font-medium hover:text-primary transition-colors duration-200" href="#">Demo</a>
<a className="font-body-md text-body-md text-on-surface-variant font-medium hover:text-primary transition-colors duration-200" href="#">Login</a>
</div>
<div>
<button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-full shadow-md hover:bg-primary/90 transition-all active:scale-95">Start Free</button>
</div>
</nav>
{/**/}
<header className="md:hidden flex justify-between items-center w-full px-margin-mobile py-4 bg-surface-bright sticky top-0 z-40 border-b border-surface-variant/50">
<div className="flex items-center gap-3">
<img alt="StudyFlow Logo" className="w-8 h-8 rounded-lg" src="/logo.png"/>
<span className="font-display text-[20px] font-bold text-primary">StudyFlow</span>
</div>
<button className="text-on-surface-variant p-2 rounded-full hover:bg-surface-container-highest transition-colors">
<span className="material-symbols-outlined">menu</span>
</button>
</header>
{/**/}
<main className="flex-grow pt-24 md:pt-32 pb-section-gap flex flex-col items-center">
{/**/}
<section className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center text-center mb-section-gap">
<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container/50 border border-secondary-container text-on-secondary-container font-label-sm text-label-sm mb-8">
<span className="material-symbols-outlined text-[16px]">stars</span>
<span>The smart way to manage your academic life</span>
</div>
<h1 className="font-display text-display max-w-4xl mx-auto mb-6 text-on-background">
                Plan your study week and <br className="hidden md:block"/>
<span className="text-gradient">never miss a deadline.</span>
</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
                StudyFlow helps students track assignments, organize subjects, take notes, and create simple study plans in minutes.
            </p>
<div className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full sm:w-auto justify-center">
<button className="primary-gradient text-on-primary font-label-md text-label-md px-8 py-4 rounded-full shadow-lg ambient-shadow hover:ambient-shadow-hover hover:-translate-y-0.5 transition-all w-full sm:w-auto">
                    Start Free
                </button>
<button className="glass-effect text-on-surface font-label-md text-label-md px-8 py-4 rounded-full hover:bg-white/90 transition-all w-full sm:w-auto flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-[18px]">play_circle</span>
                    View Demo
                </button>
</div>
<div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-on-surface-variant/70 font-label-sm text-label-sm mb-16">
<div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">check_circle</span> Free to start</div>
<div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">check_circle</span> No credit card</div>
<div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-primary">check_circle</span> Built for students</div>
</div>
{/**/}
<div className="w-full max-w-5xl mx-auto relative group">
<div className="absolute -inset-1 primary-gradient rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>
<div className="relative glass-effect rounded-[2rem] p-6 md:p-8 ambient-shadow grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
{/**/}
<div className="md:col-span-2 bg-surface-bright rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
<div className="flex justify-between items-center mb-2">
<h3 className="font-headline-md text-headline-md">This Week</h3>
<button className="text-primary hover:bg-primary-container/20 p-2 rounded-full transition-colors"><span className="material-symbols-outlined">add</span></button>
</div>
{/**/}
<div className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/20">
<div className="w-5 h-5 rounded-md border-2 border-outline flex-shrink-0"></div>
<div className="flex-grow">
<p className="font-label-md text-label-md text-on-surface">Calculus Midterm Prep</p>
<p className="font-label-sm text-label-sm text-on-surface-variant">Mathematics 101</p>
</div>
<div className="bg-error-container text-on-error-container px-2 py-1 rounded-md font-label-sm text-[10px]">Tomorrow</div>
</div>
{/**/}
<div className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/20">
<div className="w-5 h-5 rounded-md border-2 border-outline flex-shrink-0"></div>
<div className="flex-grow">
<p className="font-label-md text-label-md text-on-surface">Read Chapter 4 &amp; 5</p>
<p className="font-label-sm text-label-sm text-on-surface-variant">World History</p>
</div>
<div className="bg-surface-variant text-on-surface-variant px-2 py-1 rounded-md font-label-sm text-[10px]">Wed</div>
</div>
{/**/}
<div className="mt-auto pt-4">
<div className="flex justify-between font-label-sm text-label-sm mb-2 text-on-surface-variant">
<span>Weekly Progress</span>
<span>65%</span>
</div>
<div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full primary-gradient rounded-full" style={{ width: '65%' }}></div>
</div>
</div>
</div>
{/**/}
<div className="flex flex-col gap-6">
{/**/}
<div className="bg-surface-bright rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center text-center">
<span className="material-symbols-outlined text-primary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Next Exam</p>
<p className="font-headline-md text-headline-md text-primary">14 Days</p>
<p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Physics Finals</p>
</div>
{/**/}
<div className="primary-gradient rounded-2xl p-5 shadow-sm flex items-center gap-4 text-on-primary">
<div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
</div>
<div>
<p className="font-headline-md text-[20px] font-bold">12 Days</p>
<p className="font-label-sm text-label-sm text-white/80">Study Streak</p>
</div>
</div>
</div>
</div>
</div>
</section>
</main>

</>
      </div>
    </>
  );
}
