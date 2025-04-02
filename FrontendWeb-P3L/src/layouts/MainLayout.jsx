import { Outlet } from "react-router-dom";

const routes = [
  {
    path: "/",
    name: "Home",
  },
];

const MainLayout = () => {
  return (
    <div>
      {/* <Header routes={routes} /> */}
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
};


export default MainLayout;
