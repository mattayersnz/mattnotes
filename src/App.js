import React from "react";
import LoginScreen from "./components/LoginScreen";
import HunchApp from "./HunchApp";
import RealmApolloProvider from "./graphql/RealmApolloProvider";
import { useRealmApp, RealmAppProvider } from "./RealmApp";
import ErrorBoundary from './components/ErrorBoundary';

export const APP_ID = "hunchapp_staging-zipht";

const RequireLoggedInUser = ({ children }) => {
  // Only render children if there is a logged in user.
  const app = useRealmApp();
  return app.currentUser ? children : <LoginScreen />;
};

export default function App() {

  return (
    <ErrorBoundary>
      <RealmAppProvider appId={APP_ID}>
        <RequireLoggedInUser >
          <RealmApolloProvider>
            <HunchApp />
          </RealmApolloProvider>
        </RequireLoggedInUser>
      </RealmAppProvider>
    </ErrorBoundary>
  );
}
