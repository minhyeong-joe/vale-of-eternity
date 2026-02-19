import type { Route } from "./+types/home";

import "../components/sprites.css";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Vale of Eternity" },
    { name: "description", content: "Vale of Eternity Board Game" },
  ];
}

export default function Home() {
  return (<div className="p-8">
    <h1 className="mb-8">Sprite Testing</h1>

    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">Card & Title (Scale: 100%)</h2>
      <div className="flex gap-4">
        <div className="sprite card-back border x100"></div>
        <div className="sprite title border x100"></div>
      </div>
    </div>

    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">Card & Title (Scale: 50%)</h2>
      <div className="flex gap-4">
        <div className="sprite card-back border x50"></div>
        <div className="sprite title border x50"></div>
      </div>
    </div>

    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">Card Headers (Scale: 50%)</h2>
      <div className="flex gap-4 flex-wrap">
        {['water', 'fire', 'earth', 'air', 'dragon'].map(type => (
          <div key={type} className={`sprite ${type}-cards-header border x50`}></div>
        ))}
      </div>
    </div>

    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">Tokens (Scale: 50%)</h2>
      <div className="flex gap-4">
        {['stone-1', 'stone-3', 'stone-6'].map(stone => (
          <div key={stone} className={`sprite ${stone} border x50`}></div>
        ))}
      </div>
    </div>

    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">Card Descriptions</h2>
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 'dynamic'].map(num => (
          <div key={num} className={`sprite description-score-${num} border x100`}></div>
        ))}
      </div>
    </div>
  </div>);
}
