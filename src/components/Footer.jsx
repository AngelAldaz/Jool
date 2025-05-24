import { Instagram, Facebook, Globe } from "lucide-react";
export default function Footer() {
  return (
    <footer className="w-full px-25 py-4 bg-primary text-white flex justify-between items-center">
      <p>
        © 2025 JOOL <b>·</b> Powered by AAAIMX <b>·</b> Software Division
      </p>
      <div className="flex gap-1 items-center ">
        <a href="#" className="hover:text-gray-300 transition-colors">
          <Instagram size={23} />
        </a>
        <a href="#" className="hover:text-gray-300 transition-colors">
          <Facebook size={23} />
        </a>
        <a href="#" className="hover:text-gray-300 transition-colors">
          <Globe size={23} />
        </a>
      </div>
    </footer>
  );
}
