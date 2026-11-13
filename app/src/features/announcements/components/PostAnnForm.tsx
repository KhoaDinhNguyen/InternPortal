import { cn } from "@lib/cn";
import { formPanelClass, inputClass, primaryButtonClass } from "@styles/ui";
import type { usePostAnnouncements } from "../hooks";

const TAGS = ["General", "Welcome", "HR", "Events", "Operations"];

interface PostAnnFormProps {
  form: ReturnType<typeof usePostAnnouncements>;
  onPost: () => void;
}

/** Renderes the form for creating new announcement, include:
  - Input: title, body, tag
  - post function
*/
export default function PostAnnForm({ form, onPost }: PostAnnFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onPost();
      }}
      className={cn(formPanelClass, "mx-5 mb-3.5")}>
      <input
        aria-label="Announcement title"
        value={form.title}
        onChange={(e) => form.setTitle(e.target.value)}
        placeholder="Announcement title"
        className={cn(inputClass, "text-base font-semibold")}
      />
      <textarea
        aria-label="Announcement body"
        value={form.body}
        onChange={(e) => form.setBody(e.target.value)}
        placeholder="Body (optional)"
        rows={2}
        className={cn(inputClass, "resize-none")}
      />
      <div className="flex items-center gap-2">
        <select
          aria-label="Tag"
          value={form.tag}
          onChange={(e) => form.setTag(e.target.value)}
          className={cn(inputClass, "py-1.5")}>
          {TAGS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!form.title.trim()}
          className={cn(primaryButtonClass, "ml-auto py-1.5 disabled:cursor-default")}>
          Post to team
        </button>
      </div>
    </form>
  );
}
