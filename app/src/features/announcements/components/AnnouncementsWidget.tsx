import Card from "@components/Card";
import CardHeader from "@components/CardHeader";
import { usePostAnnouncements } from "../hooks";
import PostAnnButton from "./PostAnnButton";
import PostAnnForm from "./PostAnnForm";
import AnnContent from "./AnnContent";
import type { AnnouncementStore } from "../types";

interface AnnouncementsWidgetProps {
  annStore: AnnouncementStore;
  onExpand?: () => void;
  onClose?: () => void;
}

/**
 * Renders the announcements card, including:
 * - the "+ Post" button and the new-announcement form
 * - the list (personal notices first, then team announcements)
 */
export default function AnnouncementsWidget({ annStore, onExpand, onClose }: AnnouncementsWidgetProps) {
  const { anns, openIds, pushAnn, toggleBody, deleteAnn } = annStore;
  const form = usePostAnnouncements();

  function post() {
    // pushAnn returns null for an invalid announcement; keep the form open then
    if (pushAnn(form.title, form.body, form.tag)) form.reset();
  }

  return (
    <Card>
      <CardHeader
        title="Announcements"
        count={anns.length}
        onExpand={onExpand}
        onClose={onClose}
        action={<PostAnnButton isFormOpen={form.composing} setFormOpen={form.setComposing} />}
      />

      {form.composing && <PostAnnForm form={form} onPost={post} />}

      {anns.length === 0 ? (
        <div
          style={{
            padding: "32px 20px",
            textAlign: "center",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: 14,
            color: "#1A1A1A",
            opacity: 0.45,
          }}>
          You're all caught up — no announcements
        </div>
      ) : (
        anns.map((ann) => (
          <AnnContent key={ann.id} ann={ann} openIds={openIds} toggleAnnBody={toggleBody} deleteAnn={deleteAnn} />
        ))
      )}
    </Card>
  );
}
