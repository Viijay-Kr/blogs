import "@reacttoid/react/dist/reactoid.css";
import { ReactToid, ReactoidContextProvider } from "@reacttoid/react";

export const EmbedReactToid = () => {
  return (
    <ReactoidContextProvider
      clientId={import.meta.env.PUBLIC_REACTOID_APP_CLIENT_ID}
      clientSecret={import.meta.env.PUBLIC_REACTOID_APP_CLIENT_SECRET}
      slug={location.pathname}
      projectId={import.meta.env.PUBLIC_REACTOID_APP_PROJECT_ID}
    >
      <ReactToid></ReactToid>
    </ReactoidContextProvider>
  );
};
