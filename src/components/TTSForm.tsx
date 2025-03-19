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
  const MAX_CHARS = 1000;

  // Handle text input
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARS) {
      setText(newText);
    }
  };

  // Handle voice selection
  const handleVoiceChange = (value: string) => {
    setIsFemaleVoice(value === "female");
  };

  // Handle play/pause button click
  const handlePlayPause = async () => {
    if (text.trim() === "") {
      toast({
        title: "Ой!",
        description: "Сураныч, үнгө айландыруу үчүн текст киргизиңиз",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isPlaying) {
        if (isPaused) {
          ttsService.resume();
          setIsPaused(false);
        } else {
          ttsService.pause();
          setIsPaused(true);
        }
      } else {
        await ttsService.speak(text, isFemaleVoice);
        setIsPlaying(true);
        setIsPaused(false);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      toast({
        title: "Ката",
        description:
          "Текстти үнгө айландырууда ката кетти. Сураныч, кайра аракет кылыңыз.",
        variant: "destructive",
      });
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
        title: "Ой!",
        description: "Сураныч, үнгө айландыруу үчүн текст киргизиңиз",
        variant: "destructive",
      });
      return;
    }

    try {
      const audioBlob = await ttsService.getAudioBlob(text, isFemaleVoice);
      const url = window.URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "audio.mp3";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Даяр!",
        description: "Аудио файл ийгиликтүү жүктөлдү",
      });
    } catch (error) {
      console.error("Error downloading audio:", error);
      toast({
        title: "Ката",
        description:
          "Аудио файлды жүктөөдө ката кетти. Сураныч, кайра аракет кылыңыз.",
        variant: "destructive",
      });
    }
  };

  // Log available voices for debugging
  useEffect(() => {
    console.log("TTS Service initialized");
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
    <div className="w-full max-w-3xl mx-auto p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.2)] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />

      <div className="space-y-8 relative">
        {/* Text input area */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="text"
              className="text-xl font-semibold text-white drop-shadow-lg flex items-center gap-2"
            >
              <Mic className="h-5 w-5" />
              Текст киргизиңиз
            </Label>
            <span className="text-sm bg-purple-500/20 px-3 py-1 rounded-full text-white/80 font-medium">
              {text.length} / {MAX_CHARS}
            </span>
          </div>
          <Textarea
            id="text"
            placeholder="Үнгө айландыруу үчүн текстти бул жерге жазыңыз же коюңуз..."
            className="min-h-[150px] bg-black/30 text-white border-purple-500/30 focus:border-purple-500/50 rounded-xl p-4 text-lg transition-all placeholder:text-white/40"
            value={text}
            onChange={handleTextChange}
          />
        </div>

        {/* Voice selection */}
        <div className="space-y-3">
          <Label className="text-xl font-semibold text-white drop-shadow-lg flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Үндү тандаңыз
          </Label>
          <RadioGroup
            value={isFemaleVoice ? "female" : "male"}
            onValueChange={handleVoiceChange}
            className="flex gap-4"
          >
            {[
              { value: "male", label: "Эркек" },
              { value: "female", label: "Аял" },
            ].map((option) => (
              <div
                key={option.value}
                className={`flex-1 relative overflow-hidden transition-all ${
                  (isFemaleVoice ? "female" : "male") === option.value
                    ? "scale-105"
                    : "opacity-70"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-transparent" />
                <label
                  className="flex items-center justify-center gap-3 p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 cursor-pointer transition-all hover:bg-white/5"
                  htmlFor={option.value}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="border-purple-500 text-purple-500"
                  />
                  <span className="text-lg font-medium text-white">
                    {option.label}
                  </span>
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Audio waveform visualizer */}
        <div className="py-6">
          <AudioWaveform isPlaying={isPlaying && !isPaused} className="my-4" />
        </div>

        {/* Control buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={handlePlayPause}
            className={`flex items-center gap-3 px-6 py-3 text-lg font-medium transition-all ${
              isPlaying
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
            }`}
          >
            {isPlaying ? (
              isPaused ? (
                <Play className="h-6 w-6" />
              ) : (
                <Pause className="h-6 w-6" />
              )
            ) : (
              <Volume2 className="h-6 w-6" />
            )}
            <span>
              {isPlaying ? (isPaused ? "Улантуу" : "Тыныгуу") : "Үн чыгаруу"}
            </span>
          </Button>

          {isPlaying && (
            <Button
              onClick={handleStop}
              className="flex items-center gap-3 px-6 py-3 text-lg font-medium bg-purple-600 hover:bg-purple-700 border-none text-white"
            >
              <span>Токтотуу</span>
            </Button>
          )}

          <Button
            onClick={handleDownload}
            className="flex items-center gap-3 px-6 py-3 text-lg font-medium bg-purple-600 hover:bg-purple-700 border-none text-white"
          >
            <Download className="h-6 w-6" />
            <span>Жүктөө</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TTSForm;
