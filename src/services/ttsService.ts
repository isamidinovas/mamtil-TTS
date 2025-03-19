
// Class for handling text-to-speech functionality
class TTSService {
  private readonly synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private maleVoices: SpeechSynthesisVoice[] = [];
  private femaleVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();

    // Some browsers (like Chrome) load voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }

  private loadVoices(): void {
    const voices = this.synth.getVoices();
    
    this.maleVoices = voices.filter(voice => 
      voice.lang.includes('en') && 
      !voice.name.includes('female') && 
      !voice.name.toLowerCase().includes('zira')
    );
    
    this.femaleVoices = voices.filter(voice => 
      voice.lang.includes('en') && 
      (voice.name.includes('female') || voice.name.toLowerCase().includes('zira'))
    );
    
    // If we couldn't accurately determine gender, make a guess based on common voice naming patterns
    if (this.maleVoices.length === 0) {
      this.maleVoices = voices.filter(voice => 
        voice.name.toLowerCase().includes('male') || 
        voice.name.toLowerCase().includes('david') || 
        voice.name.toLowerCase().includes('mark')
      );
    }
    
    if (this.femaleVoices.length === 0) {
      this.femaleVoices = voices.filter(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('zira') || 
        voice.name.toLowerCase().includes('lisa')
      );
    }
    
    // Still no voices? Default to first few voices
    if (this.maleVoices.length === 0 && voices.length > 0) {
      this.maleVoices = [voices[0]];
    }
    
    if (this.femaleVoices.length === 0 && voices.length > 1) {
      this.femaleVoices = [voices[1]];
    }
  }

  public speak(text: string, isFemaleVoice: boolean = true): void {
    // Cancel any current speech
    this.cancel();
    
    // Create a new utterance
    this.utterance = new SpeechSynthesisUtterance(text);
    
    // Select voice based on gender preference
    const voices = isFemaleVoice ? this.femaleVoices : this.maleVoices;
    
    if (voices.length > 0) {
      this.utterance.voice = voices[0];
    }
    
    // Set speech properties
    this.utterance.pitch = 1;
    this.utterance.rate = 0.9;
    
    // Speak the text
    this.synth.speak(this.utterance);
  }

  public pause(): void {
    if (this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  public cancel(): void {
    this.synth.cancel();
    this.utterance = null;
  }

  public get isPaused(): boolean {
    return this.synth.paused;
  }

  public get isSpeaking(): boolean {
    return this.synth.speaking;
  }

  // Function to get a downloadable audio blob
  // Note: Web Speech API doesn't support direct audio export
  // This is just a placeholder for potential future implementation
  public async getAudioBlob(text: string, isFemaleVoice: boolean = true): Promise<string> {
    // In a real implementation, we would generate an audio file
    // For now, we'll just return a data URL
    // In production, you might use a server-side TTS service that returns audio files
    
    alert("Audio download functionality requires a server-side text-to-speech API. This is a browser-based demo only.");
    return "";
  }
}

// Export a singleton instance
export const ttsService = new TTSService();
