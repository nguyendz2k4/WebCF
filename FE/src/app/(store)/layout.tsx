import { AppProvider } from "@/stores/AppContext";
import { LenisProvider } from "@/components/shared/LenisProvider";
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <LenisProvider>{children}</LenisProvider>
    </AppProvider>
  );
}
