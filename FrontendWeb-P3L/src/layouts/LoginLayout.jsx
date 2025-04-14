import { Outlet } from "react-router-dom";
// import Footer from '../components/headerFooter/Footer';
// import Header from '../components/headerFooter/HeaderLogin';

const routes = [
  {
    path: "/",
    name: "Home",
  },
];

const LoginLayout = () => {
  return (
    <div>
      {/* <Header routes={routes} /> */}
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
};


export default LoginLayout;
