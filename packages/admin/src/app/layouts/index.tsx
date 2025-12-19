import { AppLayoutGuard } from "./guard";
import { AppLayoutUI } from "./ui";

export const AppLayout = () => {
  return (
    <AppLayoutGuard>
      <AppLayoutUI />
    </AppLayoutGuard>
  );
};
