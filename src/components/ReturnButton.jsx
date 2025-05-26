import Link from "next/link";

export default function ReturnButton() {
  return (
    <Link
      className="inline-flex items-center justify-center py-2 px-3 rounded-full bg-primary hover:bg-primary/90 transition-colors w-fit mt-2 ml-2"
      href="/"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        className="w-8 h-8 fill-white"
      >
        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
      </svg>
    </Link>
  );
}
