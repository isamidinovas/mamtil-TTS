
import { Mic } from "lucide-react";

const Header = () => {
  return (
    <header className="py-6 px-4">
      <div className="container mx-auto flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Mic className="h-8 w-8 text-white" />
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-mamtil-light-purple">
            Mamtil TTS
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
