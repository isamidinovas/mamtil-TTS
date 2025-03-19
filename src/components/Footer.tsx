
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-6 px-4 mt-auto">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="flex items-center space-x-1 text-white/70 text-sm">
          <span>Made with</span>
          <Heart className="h-4 w-4 text-red-400 fill-red-400" />
          <span>by Mamtil</span>
        </div>
        <p className="text-xs text-white/50 mt-2">
          © {new Date().getFullYear()} Mamtil TTS - Text to Speech Converter
        </p>
      </div>
    </footer>
  );
};

export default Footer;
