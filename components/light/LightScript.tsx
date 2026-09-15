/**
 * Runs inline in <head> before first paint: the regime for the visitor's hour (or ?at=HH:MM),
 * the clock position, whether the house is open, and whether motion is allowed.
 * KEEP IN SYNC with lib/daylight.ts (same piecewise curve).
 */
const script = `(function(){try{var D=new Date(),h=D.getHours()+D.getMinutes()/60;var q=/[?&]at=(\\d{1,2})(?::(\\d{2}))?/.exec(location.search);if(q){var qh=+q[1],qm=q[2]?+q[2]:0;if(qh<24&&qm<60)h=qh+qm/60}if(h<3)h+=24;function s(a,b,p,r){return p+(r-p)*((h-a)/(b-a))}var d=h<5.5?0:h<6.5?s(5.5,6.5,0,.5):h<11?s(6.5,11,.5,1):h<15?s(11,15,1,.9):h<18.75?s(15,18.75,.9,.5):h<19.5?s(18.75,19.5,.5,.25):h<25?s(19.5,25,.25,.05):h<27?s(25,27,.05,0):0;var e=document.documentElement,t=Math.min(1,Math.max(0,(h-11)/16));e.style.setProperty('--daylight',d.toFixed(3));e.style.setProperty('--clock-t',t.toFixed(4));e.setAttribute('data-regime',d>=.375?'day':'night');e.setAttribute('data-open',h>=11&&h<27?'1':'0');e.setAttribute('data-motion',matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'on')}catch(x){}})();`;

export function LightScript() {
  return <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} />;
}
