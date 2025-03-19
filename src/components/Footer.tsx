import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-8 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-transparent" />
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-white/60 text-sm text-center">
            © {new Date().getFullYear()} Мамтил ТТС - Текстти үнгө айландыруучу
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
