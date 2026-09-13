type NetworkGraphicProps = {
  className?: string;
};

// 人・企業・地域のつながりを表す、抽象度の高いシンプルなグラフィック。
// AIの脳・ロボット・回路・3D球体は使用しない。
export default function NetworkGraphic({ className }: NetworkGraphicProps) {
  const nodes = [
    { x: 90, y: 70, r: 7 },
    { x: 260, y: 40, r: 5 },
    { x: 340, y: 150, r: 9 },
    { x: 180, y: 190, r: 5 },
    { x: 60, y: 230, r: 6 },
    { x: 300, y: 260, r: 5 },
    { x: 200, y: 100, r: 4 },
  ];

  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 3],
    [3, 4],
    [3, 5],
    [2, 5],
    [1, 6],
    [6, 3],
  ];

  return (
    <svg
      viewBox="0 0 400 320"
      className={className}
      role="img"
      aria-label="人・企業・地域がつながるイメージ図"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="#C9D8EC"
          strokeWidth="1.5"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill={i === 2 ? "#1E5BA8" : "#3B7DD8"}
          opacity={i === 2 ? 1 : 0.85}
        />
      ))}
    </svg>
  );
}
