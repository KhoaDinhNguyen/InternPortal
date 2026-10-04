import colors from "@styles/colors";
import type { usePostAnnouncements } from "../hooks";

const TAGS = ["General", "Welcome", "HR", "Events", "Operations"];

const input: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 7,
  border: "1px solid #C8DCF0",
  fontFamily: "Helvetica, Arial, sans-serif",
  color: "#1A1A1A",
  outline: "none",
  background: "#fff",
};

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
      style={{
        margin: "0 20px 14px",
        padding: 14,
        borderRadius: 10,
        background: colors.MAGENTA_LIGHT,
        border: `1px solid ${colors.MAGENTA}33`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}>
      <input
        aria-label="Announcement title"
        value={form.title}
        onChange={(e) => form.setTitle(e.target.value)}
        placeholder="Announcement title"
        style={{ ...input, fontSize: 16, fontWeight: 600 }}
      />
      <textarea
        aria-label="Announcement body"
        value={form.body}
        onChange={(e) => form.setBody(e.target.value)}
        placeholder="Body (optional)"
        rows={2}
        style={{ ...input, fontSize: 14, resize: "none" }}
      />
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <select
          aria-label="Tag"
          value={form.tag}
          onChange={(e) => form.setTag(e.target.value)}
          style={{ ...input, padding: "6px 10px", fontSize: 14, cursor: "pointer" }}>
          {TAGS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!form.title.trim()}
          style={{
            marginLeft: "auto",
            padding: "6px 16px",
            borderRadius: 7,
            border: "none",
            background: colors.MAGENTA,
            color: "#fff",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            cursor: form.title.trim() ? "pointer" : "default",
            opacity: form.title.trim() ? 1 : 0.6,
          }}>
          Post to team
        </button>
      </div>
    </form>
  );
}
