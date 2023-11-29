import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

const Homepage=lazy(()=>import("./pages/HomePage"))
const Product=lazy(()=>import("./pages/Product"))
const Pricing=lazy(()=>import("./pages/Pricing"))
const AppLayout=lazy(()=>import("./pages/AppLayout"))
const Login=lazy(()=>import("./pages/Login"))
const PageNotFound=lazy(()=>import("./pages/PageNotFound"))

import CityList from "./components/CityList";
import CountriesList from "./components/CountriesList";
import City from "./components/City";
import Form from "./components/Form"
import SpinnerFullPage from "./components/SpinnerFullPage"


import { CitiesProvider } from "./contexts/CitiesContext";
import { Authprovider } from "./contexts/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {

  //the first thimg we do in the app is to set up our pages and make routes to them and each route points to a path url and element page
  //instead of passing props down we use the context api to pass those props but how ? we createcontext and make it equal to a variable
  //use this variable.provider and pass value={} object to it which contains all the props we need to pass to the components under this provider
  //SIMPLY the provider is going to provide those values to the children of it 
  //use context function is used whenever i want to retrive any prop and i can encapsulate it to another function like useCities which we call 
  //custom hook now we got the routes linked to pages components and the context public props ready to be retrived from any child 
  //now we will place components inside the pages and navlink is used to navigate through differint routes or pages with to='path'
  return (
    <Authprovider>
    <CitiesProvider>
    <BrowserRouter>
        <Suspense fallback={<SpinnerFullPage/>}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="product" element={<Product />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate replace to='cities'/>} /> { /*def route if i did not choose from the nav yet*/ }
          <Route path="cities" element={<CityList  />} />
          <Route path="cities/:id" element={<City/>}/>
          <Route path="countries" element={<CountriesList />} />
          <Route path="form" element={<Form/>}/>
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
    </CitiesProvider>
    </Authprovider>

  );
}

export default App;
