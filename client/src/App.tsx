import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Library from "@/pages/Library";
import Reviews from "@/pages/Reviews";
import Statistics from "@/pages/Statistics";
import Discover from "@/pages/Discover";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";

function Router() {
  const [location] = useLocation();
  
  // Don't use Layout for landing and auth pages
  if (location === "/landing" || location === "/auth") {
    return (
      <Switch>
        <Route path="/landing" component={LandingPage} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    );
  }
  
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/library" component={Library} />
        <Route path="/reviews" component={Reviews} />
        <Route path="/stats" component={Statistics} />
        <Route path="/discover" component={Discover} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
