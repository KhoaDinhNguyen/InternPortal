import { toggleChipClass } from "@styles/ui";

interface PostDocButtonProps {
  isFormOpen: boolean;
  setFormOpen: (open: boolean) => void;
}

/** Toggles the new document form open and closed */
export default function PostDocButton({ isFormOpen, setFormOpen }: PostDocButtonProps) {
  return (
    <button onClick={() => setFormOpen(!isFormOpen)} className={toggleChipClass(isFormOpen)}>
      + Add
    </button>
  );
}
