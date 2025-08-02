import { CSSProperties } from "react";

const styles: CSSProperties = {
  paddingBlock: "4.5rem",
};

export default function Section({
  className,
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section style={styles} className={className}>
      {children}
    </section>
  );
}
