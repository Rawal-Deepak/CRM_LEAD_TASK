export default function Section({
  children,
  className = "",
  gray = false,
}: {
  children: React.ReactNode;
  className?: string;
  gray?: boolean;
}) {
  return (
    <section
      className={`${
        gray
          ? "bg-[#FAFBFC] dark:bg-gray-900"
          : "bg-[#FFFFFF] dark:bg-gray-950"
      } relative ${className}`}
    >
      {children}
    </section>
  );
}
