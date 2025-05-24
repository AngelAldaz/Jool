export default function HashTag({ children }) {
  return (
    <div className="bg-secundary px-3 py-1 rounded-full w-fit ">
      <span className="text-white text-sm font-light tracking-wide">
        #{children}
      </span>
    </div>
  );
}
