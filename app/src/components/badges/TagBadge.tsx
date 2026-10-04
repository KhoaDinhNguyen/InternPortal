import colors from "../../styles/colors";

const colorsBadge: Record<string, { bg: string; text: string }> = {
  Welcome: { bg: colors.MAGENTA_LIGHT, text: colors.MAGENTA },
  HR: { bg: `${colors.SECONDARY}22`, text: colors.SECONDARY },
  Events: { bg: `${colors.TERTIARY}18`, text: colors.TERTIARY },
  Operations: { bg: `${colors.TERTIARY}18`, text: colors.TERTIARY },
  General: { bg: "#EBF4FF", text: "#1A1A1A" },
  Approved: { bg: `${colors.SECONDARY}22`, text: colors.SECONDARY },
  Rejected: { bg: "#FFEEEE", text: "#C0392B" },
};

export default function TagBadge({ label }: { label: string }) {
  const c = colorsBadge[label] || { bg: "#F3F4F6", text: "#6B7280" };

  return (
    <span
      style={{
        fontSize: 12,
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 500,
        letterSpacing: "0.05em",
        padding: "2px 7px",
        borderRadius: 4,
        background: c.bg,
        color: c.text,
      }}>
      {label.toUpperCase()}
    </span>
  );
}
