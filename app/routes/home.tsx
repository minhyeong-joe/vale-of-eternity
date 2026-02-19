import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Vale of Eternity" },
    { name: "description", content: "Vale of Eternity Board Game" },
  ];
}

export default function Home() {
  return <h1>Welcome to Vale of Eternity</h1>;
}
