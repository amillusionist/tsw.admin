import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
  
} from "react-admin";
import { BrowserRouter } from "react-router-dom";
import { authProvider } from "./providers/authProvider";
import { LoginPage } from "@/pages/LoginPage";
import DashboardLayout from "./dashboard/page";
import { dataProvider } from "./providers/dataProvider";

// Create a stable reference to prevent infinite re-renders
const stableAuthProvider = authProvider;

export const App = () => (
  <BrowserRouter>
    <Admin 
      layout={DashboardLayout} 
      authProvider={stableAuthProvider}
      loginPage={LoginPage}
      dataProvider={dataProvider}
    >
    <Resource
      name="dashboard"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />
    <Resource
      name="bookings"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />
    <Resource
      name="services"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />
    <Resource
      name="users"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />
    <Resource
      name="reviews"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />
    <Resource
      name="content"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />

    </Admin>
  </BrowserRouter>
);
