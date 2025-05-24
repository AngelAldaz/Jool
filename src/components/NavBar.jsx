import SearchBar from "./SearchBar";
import UserButton from "./UserButton";
import FilterButtons from "./FilterButtons";
export default function NavBar() {
  return (
    <section className="flex flex-col gap-2  w-fit mx-auto">
      <nav className="flex justify-center gap-3 mt-5">
        <UserButton />
        <SearchBar />
      </nav>
      <div className="flex justify-end">
        <FilterButtons />
      </div>
    </section>
  );
}
