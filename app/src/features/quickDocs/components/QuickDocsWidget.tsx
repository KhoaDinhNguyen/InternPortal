import Card from "@components/Card";
import CardHeader from "@components/CardHeader";
import DocEntry from "./DocEntry";
import PostDocButton from "./PostDocButton";
import PostDocForm from "./PostDocForm";
import { usePostDoc } from "../hooks";
import type { DocStore } from "../types";

interface QuickDocsWidgetProps {
  docStore: DocStore;
  onExpand?: () => void;
  onClose?: () => void;
}

/**
 * Renders the quick docs widget, includes:
 * - Add document button & form
 * - Document list
 */
export default function QuickDocsWidget({ docStore, onExpand, onClose }: QuickDocsWidgetProps) {
  const { docs, addDoc } = docStore;
  const postDocForm = usePostDoc();

  function post() {
    const { title, url, type } = postDocForm;

    // stop the post function when the new document is invalid
    if (!addDoc(title, url, type)) return;

    // resets the form if the new document is valid
    postDocForm.reset();
  }

  return (
    <Card>
      <CardHeader
        title="Quick Docs"
        onExpand={onExpand}
        onClose={onClose}
        action={<PostDocButton isFormOpen={postDocForm.composing} setFormOpen={postDocForm.setComposing} />}
      />

      {postDocForm.composing && (
        <PostDocForm
          title={postDocForm.title}
          setTitle={postDocForm.setTitle}
          url={postDocForm.url}
          setUrl={postDocForm.setUrl}
          type={postDocForm.type}
          setType={postDocForm.setType}
          post={post}
        />
      )}

      <div className="flex flex-col gap-0.5 px-5 pb-4.5">
        {docs.length === 0 ? (
          <p className="py-6 text-center text-sm opacity-45">
            No documents yet — add one above
          </p>
        ) : (
          docs.map((doc) => <DocEntry key={doc.id} doc={doc} />)
        )}
      </div>
    </Card>
  );
}
