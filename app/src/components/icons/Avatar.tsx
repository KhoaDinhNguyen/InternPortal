const AVATAR_COLORS = [
  "#C66EC2",
  "#A050A0",
  "#A8C7A1",
  "#49BDB8",
  "#3AADA8",
  "#7BA875",
  "#D49BD0",
  "#6EC4BF",
  "#8FB88A",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Deterministic colour per name, so a person always gets the same avatar */
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export default function Avatar({ name, size = 22 }: { name: string; size?: number }) {
  return (
    // Size and colour come from props/data, so they stay inline
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold leading-none text-white"
      style={{ width: size, height: size, fontSize: size * 0.38, background: avatarColor(name) }}>
      {initials(name)}
    </div>
  );
}
