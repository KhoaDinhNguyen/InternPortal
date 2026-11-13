export default function GroupAvatar({ size = 36 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-primary-light"
      style={{ width: size, height: size }}>
      👥
    </div>
  );
}
