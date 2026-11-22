import { toggleChipClass } from "@styles/ui";

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
      className={toggleChipClass(isFormOpen)}>
      {isFormOpen ? "Cancel" : "+ Post"}
    </button>
  );
}
