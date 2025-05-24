import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex-1 space-y-6 mt-5">
        <PostCard />
        <PostCard />
        <PostCard />
      </main>
      <Footer />
    </>
  );
}
