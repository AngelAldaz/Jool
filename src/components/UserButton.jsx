export default function UserButton() {
  return (
    <a
      className="py-1 px-3 rounded-full  bg-primary hover:cursor-pointer block "
      href="/login"
    >
      <svg
        viewBox="0 0 24 24"
        className="md:w-14 md:h-14 w-10 h-10 fill-white mx-auto"
      >
        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
      </svg>
    </a>
  );
}
