import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/auth.service";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      console.log(result);
    } catch (error) {
      console.log("Logout error", error);
    } finally {
      // Reload the app so auth state and protected routes cannot redirect back
      // to the dashboard with stale user data.
      window.location.replace("/login");
    }
  };
  return (
    <div className="w-full flex items-center justify-between bg-white px-6 py-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Finance
        </h1>
      </div>
      <div className="flex items-center gap-7">
        <ul className="flex items-center gap-7 *:cursor-pointer *:text-sm *:font-medium *:text-slate-600 *:transition-colors hover:*:text-slate-900">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/accounts">Account</Link>
          <Link to="/settings">Settings</Link>
        </ul>
        <button
          onClick={() => {
            handleLogout();
          }}
          className="cursor-pointer rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
