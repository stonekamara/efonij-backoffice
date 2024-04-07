/** Petit QR code factice (SVG) utilisé pour les maquettes visuelles. */
export default function FakeQr({ color = "#191C1F" }: { color?: string }) {
  const cells: Array<[number, number]> = [];
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      const inFinder =
        (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5);
      if (inFinder) continue;
      if ((x * 7 + y * 13 + x * y * 3) % 5 < 2) cells.push([x, y]);
    }
  }
  return (
    <svg viewBox="0 0 9 9" className="h-full w-full" shapeRendering="crispEdges">
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />
      ))}
      {[
        [0, 0],
        [6, 0],
        [0, 6],
      ].map(([ox, oy]) => (
        <g key={`${ox}-${oy}`}>
          <rect x={ox} y={oy} width="3" height="3" fill={color} />
          <rect x={ox + 0.5} y={oy + 0.5} width="2" height="2" fill="#fff" />
          <rect x={ox + 1} y={oy + 1} width="1" height="1" fill={color} />
        </g>
      ))}
    </svg>
  );
}
