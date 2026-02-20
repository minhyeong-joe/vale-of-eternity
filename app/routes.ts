import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/signIn.tsx"),
    route("lobby", "routes/lobby.tsx"),
    route("game-room", "routes/gameRoom.tsx"),
    route("sprites-test", "routes/spritesTest.tsx"),
] satisfies RouteConfig;