import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function SafeHydrate({ children }: Props) {
  return (
    <div suppressHydrationWarning>
      {typeof window === "undefined" ? null : children}
    </div>
  );
}

export default SafeHydrate;
