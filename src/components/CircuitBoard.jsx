import { useId, useLayoutEffect, useRef, useState } from 'react';

const sectionIds = ['home', 'about', 'work', 'skills', 'contact'];
const chipInset = 12;
const sidePads = [.24, .38, .52, .66, .80];
const endPads = [.20, .40, .60, .80];

function tracePath(points) {
  const [[startX, startY], ...turns] = points;
  return turns.reduce((path, [x, y], index) => {
    const [previousX, previousY] = points[index];
    if (x === previousX || y === previousY) return `${path}L${x} ${y}`;
    const bevel = Math.min(Math.abs(x - previousX), Math.abs(y - previousY) / 2, 26);
    const vertical = Math.sign(y - previousY) * bevel;
    return `${path}V${y - vertical}l${Math.sign(x - previousX) * bevel} ${vertical}H${x}`;
  }, `M${startX} ${startY}`);
}

function chipPins({ left, top, width, height }) {
  const side = x => sidePads.map(progress => [x, Math.round(top + height * progress)]);
  const end = y => endPads.map(progress => [Math.round(left + width * progress), y]);
  return {
    left: side(left),
    right: side(left + width),
    top: end(top),
    bottom: end(top + height),
  };
}

function PortraitChip({ chip, pins, fillId }) {
  const { left, top, width, height } = chip;
  const outline = (inset, cut) => {
    const x = left + inset, y = top + inset;
    const right = left + width - inset, bottom = top + height - inset;
    return `M${x + cut} ${y}H${right - cut}L${right} ${y + cut}V${bottom - cut}
      L${right - cut} ${bottom}H${x + cut}L${x} ${bottom - cut}V${y + cut}Z`;
  };
  const shell = outline(0, 22);
  return <g>
    <path className="chip-shell" d={shell} fill={`url(#${fillId})`}/>
    <path className="chip-charge" d={shell}/>
    <path className="chip-inset" d={outline(7, 17)}/>
    {Object.entries(pins).map(([edge, points]) => (
      <g key={edge} className="chip-pins">
        {points.map(([x, y]) => {
          const horizontal = edge === 'left' || edge === 'right';
          return <rect key={`${x}:${y}`}
            x={x - (horizontal ? (edge === 'left' ? 9 : 1) : 2)}
            y={y - (horizontal ? 2 : edge === 'top' ? 9 : 1)}
            width={horizontal ? 10 : 4} height={horizontal ? 4 : 10}/>;
        })}
      </g>
    ))}
    <circle className="chip-index" cx={left + 25} cy={top + 24} r="3"/>
  </g>;
}

function boardRoutes({ width, gutter, bands }, chip, pins) {
  const [, about, work, skills, contact] = bands;
  const left = (depth, y) => [Math.round(gutter * depth), Math.round(y)];
  const right = (depth, y) => [width - Math.round(gutter * depth), Math.round(y)];
  const at = ({ top, height }, progress) => top + height * progress;
  const heroExit = progress => at(chip, progress);
  const fromSide = (point, side, length) => [
    side === 'left' ? Math.max(5, point[0] - length) : Math.min(width - 5, point[0] + length),
    point[1],
  ];
  const fan = Math.min(44, gutter * .7);

  const leftRoutes = [
    [pins.left[2], fromSide(pins.left[2], 'left', fan), left(.27, heroExit(.79)),
      left(.27, at(about, .21)), left(.12, at(about, .56)),
      left(.38, at(work, .09)), left(.38, at(work, .36)), left(.16, at(work, .57)),
      left(.16, at(skills, .17)), left(.43, at(skills, .37)),
      left(.43, at(contact, .12)), left(.20, at(contact, .54)), left(.69, at(contact, .76))],
    [pins.left[3], fromSide(pins.left[3], 'left', fan * .63), left(.67, heroExit(.88)),
      left(.67, at(about, .28)), left(.87, at(about, .43)),
      left(.64, at(work, .14)), left(.64, at(work, .51)), left(.53, at(work, .78)),
      left(.81, at(skills, .23)), left(.74, at(skills, .86)),
      left(.74, at(contact, .29)), left(.85, at(contact, .49))],
  ];

  const rightRoutes = [
    [pins.right[1], fromSide(pins.right[1], 'right', fan * .74), right(.28, heroExit(.56)),
      right(.28, at(about, .12)), right(.54, at(about, .30)), right(.54, at(about, .70)),
      right(.18, at(work, .04)), right(.18, at(work, .60)), right(.33, at(work, .86)),
      right(.33, at(skills, .68)), right(.12, at(skills, .83)),
      right(.12, at(contact, .24)), right(.43, at(contact, .66)), right(.85, at(contact, .87))],
    [pins.right[3], fromSide(pins.right[3], 'right', fan * .54), right(.72, heroExit(.75)),
      right(.82, at(about, .32)), right(.82, at(about, .56)),
      right(.60, at(work, .17)), right(.86, at(work, .38)), right(.86, at(work, .64)),
      right(.67, at(skills, .11)), right(.83, at(skills, .55)),
      right(.70, at(contact, .15)), right(.66, at(contact, .40))],
  ];

  const chipBranches = [
    [pins.top[0], [pins.top[0][0] - fan, chip.top - 24], [chip.left - fan, chip.top - 24]],
    [pins.top[1], [pins.top[1][0] + fan * .72, chip.top - 34]],
    [pins.top[2], [pins.top[2][0] + fan * .72, chip.top - 26]],
    [pins.top[3], [pins.top[3][0] + fan, chip.top - 14], [width - gutter * .69, chip.top - 14]],
    [pins.left[0], fromSide(pins.left[0], 'left', fan), left(.82, heroExit(.16))],
    [pins.left[1], fromSide(pins.left[1], 'left', fan * .58),
      [chip.left - fan * 1.6, heroExit(.32)]],
    [pins.right[0], fromSide(pins.right[0], 'right', fan * .52), right(.37, heroExit(.12))],
    [pins.right[2], fromSide(pins.right[2], 'right', fan * .48), right(.62, heroExit(.61))],
    [pins.bottom[0], left(.86, at(about, .045)), left(.86, at(about, .15))],
    [pins.bottom[1], [pins.bottom[1][0] - fan, at(about, .065)]],
    [pins.bottom[2], [pins.bottom[2][0] + fan, at(about, .036)]],
    [pins.bottom[3], right(.48, at(about, .08)), right(.48, at(about, .19))],
  ];

  const pageBranches = [
    [leftRoutes[1][4], left(1.35, at(about, .59)), left(2.8, at(about, .65))],
    [rightRoutes[0][5], right(.30, at(about, .77)), right(.30, at(about, .91))],
    [leftRoutes[1][6], left(.80, at(work, .58)), left(.80, at(work, .66))],
    [rightRoutes[1][6], right(1.33, at(work, .43)), right(1.33, at(work, .55))],
    [leftRoutes[0][9], left(.22, at(skills, .53)), left(.22, at(skills, .74))],
    [rightRoutes[1][9], right(.58, at(skills, .67)), right(.58, at(skills, .80))],
    [leftRoutes[0][11], left(.35, at(contact, .69)), left(.35, at(contact, .81))],
  ];

  return { trunks: [...leftRoutes, ...rightRoutes], chipBranches, pageBranches };
}

export default function CircuitBoard() {
  const inkId = useId();
  const fillId = useId();
  const signalId = useId();
  const boardRef = useRef(null);
  const [layout, setLayout] = useState(null);

  useLayoutEffect(() => {
    const board = boardRef.current;
    const page = board.parentElement;
    const sections = sectionIds.map(id => page.querySelector(`#${id}`));
    const portrait = sections[0].querySelector('.hero-visual');
    const heading = sections[1].querySelector('.section-heading');

    const measure = () => {
      const pageRect = page.getBoundingClientRect();
      const portraitRect = portrait.getBoundingClientRect();
      setLayout({
        width: Math.round(pageRect.width),
        height: Math.round(pageRect.height),
        gutter: Math.min(140, heading.getBoundingClientRect().left - pageRect.left),
        chip: {
          left: Math.round(portraitRect.left - pageRect.left) + chipInset,
          top: Math.round(portraitRect.top - pageRect.top) + chipInset,
          width: Math.round(portraitRect.width) - 2 * chipInset,
          height: Math.round(portraitRect.height) - 2 * chipInset,
        },
        bands: sections.map(section => {
          const { top, height } = section.getBoundingClientRect();
          return { top: top - pageRect.top, height };
        }),
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    [page, portrait, heading, ...sections].forEach(element => observer.observe(element));

    const headerHeight = getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim();
    const visibility = new IntersectionObserver(([entry]) => {
      board.toggleAttribute('data-chip-visible', entry.intersectionRatio >= .15);
    }, { rootMargin: `-${headerHeight} 0px 0px`, threshold: .15 });
    visibility.observe(portrait);

    return () => {
      observer.disconnect();
      visibility.disconnect();
    };
  }, []);

  if (!layout) return <svg ref={boardRef} className="circuit-board" aria-hidden="true"/>;
  const footerStart = layout.bands.at(-1).top / layout.height;
  const pins = chipPins(layout.chip);
  const { trunks, chipBranches, pageBranches } = boardRoutes(layout, layout.chip, pins);

  return <svg ref={boardRef} className="circuit-board" aria-hidden="true"
    viewBox={`0 0 ${layout.width} ${layout.height}`} preserveAspectRatio="none">
    <defs>
      <linearGradient id={inkId} x1="0" y1="0" x2="0" y2={layout.height} gradientUnits="userSpaceOnUse">
        <stop offset={footerStart} className="circuit-ink"/>
        <stop offset={footerStart} className="circuit-ink-dark"/>
      </linearGradient>
      <linearGradient id={signalId} x1="0" y1="0" x2="0" y2={layout.height} gradientUnits="userSpaceOnUse">
        <stop offset={footerStart} className="circuit-pulse-ink"/>
        <stop offset={footerStart} className="circuit-pulse-ink-dark"/>
      </linearGradient>
      <linearGradient id={fillId} x2="0" y2="1">
        <stop offset="0" className="chip-surface"/>
        <stop offset="1" className="chip-surface-bottom"/>
      </linearGradient>
    </defs>
    <g stroke={`url(#${inkId})`} fill="none">
      {[...trunks, ...chipBranches, ...pageBranches].map((points, index) => {
        const path = tracePath(points);
        const [x, y] = points.at(-1);
        const trunk = index < trunks.length;
        return <g key={index}>
          <path className="circuit-trace" d={path}/>
          {index < trunks.length + chipBranches.length &&
          <path className={`circuit-signal ${trunk ? 'circuit-signal-trunk' : 'circuit-signal-local'}`}
            d={path} pathLength="1" stroke={`url(#${signalId})`}
            style={{ '--signal-delay': `${.18 + (index % 4) * .14}s` }}/>}
          <circle className="circuit-terminal" cx={x} cy={y} r="3"/>
          <circle className="circuit-pin" fill={`url(#${inkId})`} cx={x} cy={y} r="1"/>
        </g>;
      })}
    </g>
    <PortraitChip chip={layout.chip} pins={pins} fillId={fillId}/>
  </svg>;
}
