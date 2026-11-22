import { cn } from "@lib/cn";
import { formPanelClass, inputClass, primaryButtonClass } from "@styles/ui";
import { DOC_TYPES } from "../mockData";

interface PostDocFormProps {
  title: string;
  setTitle: (title: string) => void;
  url: string;
  setUrl: (url: string) => void;
  type: string;
  setType: (type: string) => void;
  post: () => void;
}

/** Renders the input form for a new document: title, url and type */
export default function PostDocForm({ title, setTitle, url, setUrl, type, setType, post }: PostDocFormProps) {
  return (
    <div className={cn(formPanelClass, "mx-4 mb-3 p-3")}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document title…" className={inputClass} />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL (optional)"
        className={cn(inputClass, "text-xs")}
      />

      <div className="flex items-center gap-2">
        <select value={type} onChange={(e) => setType(e.target.value)} className={cn(inputClass, "px-2 py-1 text-caption")}>
          {DOC_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <span className="text-xs">Private to you</span>

        <button onClick={post} className={cn(primaryButtonClass, "ml-auto px-3.5 py-1 text-caption")}>
          Save
        </button>
      </div>
    </div>
  );
}
