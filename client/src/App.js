import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { AuthCheck } from "./auth";
import { SignUpPage } from "./pages/SignUpPage";
import { SignInPage } from "./pages/SignInPage";
import { LandingPage } from "./pages/LandingPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage/CartPage";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import NavBar from "./components/Navbar/Navbar";
import { HistoryPage } from "./pages/HistoryPage";
const promise = loadStripe(
  "pk_test_51HTozRFhgBIvpBlsRu3y3QRT26T18zvLeGR20Z1YIjES2pOsI0a80CiuhjYkn25PuOqCJP6J0cazmM0O0N7U3BD500PUlDzzXo"
);

function App() {
  return (
    <Router>
      <NavBar />
      <div style={{ paddingTop: "75px", minHeight: "calc(100vh - 80px)" }}>
        <Switch>
          <Route exact path="/" component={AuthCheck(LandingPage, null)} />
          <Route path="/login" component={AuthCheck(SignInPage, false)} />
          <Route path="/register" component={AuthCheck(SignUpPage, false)} />
          <Route
            exact
            path="/product/:productId"
            component={AuthCheck(ProductDetailPage, null)}
          />
          <Route
            exact
            path="/history"
            component={AuthCheck(HistoryPage, true)}
          />
          <Elements stripe={promise}>
            <Route exact path="/cart" component={AuthCheck(CartPage, true)} />
          </Elements>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
