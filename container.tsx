import { PropsWithChildren } from "react";
export default function Container({ children }: PropsWithChildren) {
  return <div className="container mx-auto max-w-6xl px-4 py-8">{children}</div>;
}
