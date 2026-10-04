import type { Announcement } from "../types";
import TagBadge from "@components/badges/TagBadge";
import colors from "@styles/colors";

interface AnnContentProps {
  ann: Announcement;
  toggleAnnBody: (id: number) => void;
  openIds: Set<number>;
  deleteAnn: (id: number) => void;
}

/* Renders the content of the annoucement
- Title
- Body (only when the user expand the announcement)
- delete function
*/
export default function AnnContent(props: AnnContentProps) {
  const { ann, toggleAnnBody, openIds, deleteAnn } = props;

  return (
    <div style={{ borderBottom: "1px solid #D4E6F5" }}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => toggleAnnBody(ann.id)}
        onKeyDown={(e) => e.key === "Enter" && toggleAnnBody(ann.id)}
        style={{
          padding: "12px 20px",
          background: "transparent",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          transition: "background 0.1s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F9FF")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <TagBadge label={ann.tag} />
            <span
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: 12,
                color: "#1A1A1A",
                letterSpacing: "0.04em",
              }}>
              {ann.date}
            </span>
          </div>
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              fontSize: 16,
              color: "#1A1A1A",
              lineHeight: 1.4,
            }}>
            {ann.title}
          </div>
        </div>
        <span
          style={{
            color: colors.MAGENTA,
            fontSize: 18,
            flexShrink: 0,
            marginTop: 1,
            transition: "transform 0.2s",
            display: "inline-block",
            transform: openIds.has(ann.id) ? "rotate(-90deg)" : "rotate(90deg)",
            lineHeight: 1,
          }}>
          ›
        </span>
      </div>
      {openIds.has(ann.id) && (
        <div style={{ padding: "0 20px 14px" }}>
          {ann.body && (
            <div
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: 14,
                color: "#1A1A1A",
                lineHeight: 1.6,
                marginBottom: 10,
              }}>
              {ann.body}
            </div>
          )}
          <button
            onClick={() => deleteAnn(ann.id)}
            style={{
              padding: "5px 14px",
              borderRadius: 6,
              border: "1px solid #C8DCF0",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "#1A1A1A",
              letterSpacing: "0.04em",
              transition: "background 0.1s, color 0.1s, border-color 0.1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#FFF0F0";
              e.currentTarget.style.color = "#C0392B";
              e.currentTarget.style.borderColor = "#FFCCCC";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#1A1A1A";
              e.currentTarget.style.borderColor = "#C8DCF0";
            }}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
