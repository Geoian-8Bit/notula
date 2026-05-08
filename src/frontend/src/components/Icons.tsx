import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 24, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    />
  );
}

export const MenuIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </Base>
);

export const SearchIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="6" />
    <path d="m20 20-3.5-3.5" />
  </Base>
);

export const PlusIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </Base>
);

export const HeartIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 20s-7-4.35-9-9.5C1.5 6.5 4.5 4 7.5 4c1.74 0 3.41 1 4.5 2.5C13.09 5 14.76 4 16.5 4c3 0 6 2.5 4.5 6.5C19 15.65 12 20 12 20Z" />
  </Base>
);

export const HeartFilledIcon = (p: IconProps) => (
  <Base {...p} fill="currentColor" stroke="currentColor">
    <path d="M12 20s-7-4.35-9-9.5C1.5 6.5 4.5 4 7.5 4c1.74 0 3.41 1 4.5 2.5C13.09 5 14.76 4 16.5 4c3 0 6 2.5 4.5 6.5C19 15.65 12 20 12 20Z" />
  </Base>
);

export const BarChartIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 20V10M12 20V4M19 20v-7" />
  </Base>
);

export const BooksIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 4h3v16H5zM10 4h3v16h-3zM16 6l3 .5-2.5 13L13.5 19z" />
  </Base>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 6 8 12l6 6" />
  </Base>
);

export const MoreHorizontalIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="6" cy="12" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="18" cy="12" r="1" fill="currentColor" />
  </Base>
);

export const CameraIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13" r="3.5" />
  </Base>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m7 10 5 5 5-5" />
  </Base>
);

export const StarIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 4 2.5 5 5.5.5-4 4 1 5.5L12 16l-5 3 1-5.5-4-4 5.5-.5L12 4Z" />
  </Base>
);

export const StarFilledIcon = (p: IconProps) => (
  <Base {...p} fill="currentColor">
    <path d="m12 4 2.5 5 5.5.5-4 4 1 5.5L12 16l-5 3 1-5.5-4-4 5.5-.5L12 4Z" />
  </Base>
);

export const PaletteIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.5 1.5-1.5 0-.6-.3-1-.7-1.4-.4-.4-.8-.9-.8-1.6 0-1.1.9-2 2-2H16a5 5 0 0 0 5-5c0-3.6-4-6.5-9-6.5Z" />
    <circle cx="7.5" cy="11" r="1" fill="currentColor" />
    <circle cx="9.5" cy="7" r="1" fill="currentColor" />
    <circle cx="14" cy="7" r="1" fill="currentColor" />
    <circle cx="16.5" cy="11" r="1" fill="currentColor" />
  </Base>
);

export const LeafIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 19c0-7 6-13 14-13 0 8-6 14-14 14v-1Z" />
    <path d="M6 18c3-3 6-5 11-7" />
  </Base>
);

export const QuoteIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 8c-2 0-3 1.5-3 3.5C4 14 5.5 15 7 15v3c-3 0-5-2.5-5-6.5S4 5 7 5v3Zm10 0c-2 0-3 1.5-3 3.5 0 2.5 1.5 3.5 3 3.5v3c-3 0-5-2.5-5-6.5S14 5 17 5v3Z" />
  </Base>
);

export const CheckIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m5 12 5 5 9-10" />
  </Base>
);
