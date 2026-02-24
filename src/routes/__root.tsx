import {
  Outlet,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import { TRPCReactProvider } from "~/trpc/react";
import { CookieConsent } from "~/components/CookieConsent";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const isFetching = useRouterState({ select: (s) => s.isLoading });

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <TRPCReactProvider>
      <Toaster position="top-center" />
      <CookieConsent />
      <Outlet />
    </TRPCReactProvider>
  );
}
