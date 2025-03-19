
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TTSForm from "@/components/TTSForm";

const Index = () => {
  return (
    <div className="bg-gradient-animation flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
            Transform Text to Speech
          </h2>
          <p className="text-white/70">
            Enter your text below, choose a voice, and listen to it come to life.
            Create natural-sounding speech for content, accessibility, or just for fun!
          </p>
        </div>
        
        <TTSForm />
        
        <div className="mt-12 max-w-xl mx-auto text-center">
          <h3 className="text-xl font-medium text-white mb-3">
            How It Works
          </h3>
          <ol className="text-white/70 space-y-2 text-left list-decimal list-inside">
            <li>Type or paste your text in the input box</li>
            <li>Choose between male or female voice</li>
            <li>Click the "Speak" button to hear your text</li>
            <li>Use the controls to pause, resume or stop the audio</li>
          </ol>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
