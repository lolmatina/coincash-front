import { CSSProperties, ReactNode } from "react";

export default function Container({
  children,
  className,
  maxWidth,
}: {
  children: ReactNode;
  className?: string;
  maxWidth?: number;
}) {
  const styles: CSSProperties = {
    width: `min(90%, ${maxWidth || "1280px"})`,
    height: "100%",
    margin: "0 auto",
  };
  return (
    <div className={className} style={styles}>
      {children}
    </div>
  );
}
