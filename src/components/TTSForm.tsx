
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mic, Volume2, Pause, Play, Download } from "lucide-react";
import { ttsService } from "@/services/ttsService";
import AudioWaveform from "./AudioWaveform";
import { useToast } from "@/components/ui/use-toast";

const TTSForm = () => {
  const [text, setText] = useState("");
  const [isFemaleVoice, setIsFemaleVoice] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();

  // Maximum character limit for the textarea
  const MAX_CHARS = 500;

  // Handle text input
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARS) {
      setText(newText);
    }
  };

  // Handle play/pause button click
  const handlePlayPause = () => {
    if (text.trim() === "") {
      toast({
        title: "Oops!",
        description: "Please enter some text to convert to speech",
        variant: "destructive",
      });
      return;
    }

    if (isPlaying) {
      if (isPaused) {
        ttsService.resume();
        setIsPaused(false);
      } else {
        ttsService.pause();
        setIsPaused(true);
      }
    } else {
      ttsService.speak(text, isFemaleVoice);
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  // Handle stop button click
  const handleStop = () => {
    ttsService.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Handle download button click
  const handleDownload = async () => {
    if (text.trim() === "") {
      toast({
        title: "Oops!",
        description: "Please enter some text to convert to speech",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Feature not available",
      description: "Audio download requires a server-side TTS API",
    });
  };

  // Log available voices for debugging
  useEffect(() => {
    console.log("Male voices:", ttsService.getMaleVoices().map(v => v.name));
    console.log("Female voices:", ttsService.getFemaleVoices().map(v => v.name));
  }, []);

  // Set up event listeners for speech events
  useEffect(() => {
    const handleEnd = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    speechSynthesis.addEventListener("end", handleEnd);
    
    return () => {
      speechSynthesis.removeEventListener("end", handleEnd);
      // Clean up any ongoing speech when component unmounts
      ttsService.cancel();
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 shadow-xl">
      <div className="space-y-6">
        {/* Text input area */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="text" className="text-lg font-medium text-white">Enter your text</Label>
            <span className="text-sm text-white/70">
              {text.length} / {MAX_CHARS}
            </span>
          </div>
          <Textarea
            id="text"
            placeholder="Type or paste text here to convert to speech..."
            className="min-h-32 bg-black/30 text-white border-mamtil-purple/50 focus:border-mamtil-purple"
            value={text}
            onChange={handleTextChange}
          />
        </div>
        
        {/* Voice selection */}
        <div className="space-y-2">
          <Label className="text-lg font-medium text-white">Select voice</Label>
          <RadioGroup 
            value={isFemaleVoice ? "female" : "male"} 
            onValueChange={(value) => setIsFemaleVoice(value === "female")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" className="border-mamtil-purple text-mamtil-purple" />
              <Label htmlFor="female" className="text-white">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" className="border-mamtil-purple text-mamtil-purple" />
              <Label htmlFor="male" className="text-white">Male</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Audio waveform visualizer */}
        <div className="py-4">
          <AudioWaveform isPlaying={isPlaying && !isPaused} className="my-4" />
        </div>
        
        {/* Control buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button 
            onClick={handlePlayPause}
            className="flex items-center space-x-2 bg-mamtil-purple hover:bg-mamtil-dark-purple"
          >
            {isPlaying ? 
              (isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />) :
              <Volume2 className="h-5 w-5" />
            }
            <span>{isPlaying ? (isPaused ? "Resume" : "Pause") : "Speak"}</span>
          </Button>
          
          {isPlaying && (
            <Button 
              onClick={handleStop}
              variant="outline"
              className="flex items-center space-x-2 border-white/30 text-white hover:bg-white/10"
            >
              <span>Stop</span>
            </Button>
          )}
          
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex items-center space-x-2 border-white/30 text-white hover:bg-white/10"
          >
            <Download className="h-5 w-5" />
            <span>Download</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TTSForm;
