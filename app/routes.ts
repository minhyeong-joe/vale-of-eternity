import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/signIn.tsx"),
    route("home", "routes/home.tsx"),
] satisfies RouteConfig;