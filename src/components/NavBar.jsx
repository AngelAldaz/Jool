import SearchBar from "./SearchBar";
import UserButton from "./UserButton";
import FilterButtons from "./FilterButtons";
import Link from "next/link";
export default function NavBar() {
  return (
    <section className="flex flex-col gap-2 w-4/5 md:w-fit mx-auto">
      <Link href="/">
        <img
          src="/JOOL.svg"
          alt="Jool Logo"
          className="block md:hidden h-20 mx-auto "
        />
      </Link>
      <div className="md:hidden block">
        <UserButton />
      </div>
      <nav className="flex justify-center gap-3 md:mt-5">
        <div className="md:block hidden">
          <UserButton />
        </div>
        <SearchBar />
      </nav>
      <div className="flex justify-end">
        <FilterButtons />
      </div>
    </section>
  );
}
