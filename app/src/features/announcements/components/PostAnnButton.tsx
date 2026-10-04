import colors from "@styles/colors";

interface PostAnnButtonProps {
  isFormOpen: boolean;
  setFormOpen: (status: boolean) => void;
}

export default function PostAnnButton({ isFormOpen, setFormOpen }: PostAnnButtonProps) {
  return (
    <button
      type="button"
      aria-expanded={isFormOpen}
      onClick={() => setFormOpen(!isFormOpen)}
      style={{
        padding: "4px 10px",
        borderRadius: 7,
        border: `1px solid ${isFormOpen ? colors.MAGENTA : "#C8DCF0"}`,
        background: isFormOpen ? colors.MAGENTA_LIGHT : "transparent",
        color: isFormOpen ? colors.MAGENTA : "#1A1A1A",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.15s",
      }}>
      {isFormOpen ? "Cancel" : "+ Post"}
    </button>
  );
}
