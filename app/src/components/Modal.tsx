interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

/** Centered dialog over a blurred backdrop; clicking the backdrop closes it */
export default function Modal({ onClose, children }: ModalProps) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/35 p-6 backdrop-blur-xs">
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
