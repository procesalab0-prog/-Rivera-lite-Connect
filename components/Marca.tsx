// Wordmark de la marca "Rivera Élite Garage".
export default function Marca({
  size = '30px',
  sub = false,
}: {
  size?: string;
  sub?: boolean;
}) {
  return (
    <div
      className="inline-flex flex-col whitespace-nowrap"
      style={{ lineHeight: 0.82, fontSize: size }}
    >
      <span
        className="font-cond italic font-extrabold text-rivera-red"
        style={{
          fontSize: '1em',
          letterSpacing: '-.01em',
          textShadow: '1px 1px 0 #000,-1px -1px 0 rgba(255,255,255,.18)',
        }}
      >
        Rivera
      </span>
      <span className="flex flex-nowrap items-center whitespace-nowrap" style={{ gap: '.34em', marginTop: '.06em' }}>
        <span
          className="font-cond font-bold text-rivera-ink"
          style={{ fontSize: '.4em', letterSpacing: '.22em' }}
        >
          ÉLITE GARAGE
        </span>
        {sub && (
          <span
            className="font-saira font-medium uppercase text-rivera-dim"
            style={{ fontSize: '.26em', letterSpacing: '.14em' }}
          >
            Mecánica Automotriz
          </span>
        )}
      </span>
    </div>
  );
}
