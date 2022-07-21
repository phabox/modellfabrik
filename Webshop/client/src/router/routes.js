import Shop from "../views/Shop";
import Orders from "../views/Orders";
import About from "../views/About";
import NotFound from "../views/NotFound";
const routes = [
  { path: "/", redirect: "/shop" },
  { path: "/shop", component: Shop },
  { path: "/orders", component: Orders },
  { path: "/about", component: About },
  { path: "*", component: NotFound },
];

export default routes;
