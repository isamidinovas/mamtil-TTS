
// Class for handling text-to-speech functionality
class TTSService {
  private readonly synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private maleVoices: SpeechSynthesisVoice[] = [];
  private femaleVoices: SpeechSynthesisVoice[] = [];
  private selectedMaleVoice: SpeechSynthesisVoice | null = null;
  private selectedFemaleVoice: SpeechSynthesisVoice | null = null;

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
    console.log("Available voices:", voices.map(v => `${v.name} (${v.lang})`));
    
    // Better filtering for English voices
    const englishVoices = voices.filter(voice => 
      voice.lang.includes('en') || voice.lang.includes('US') || voice.lang.includes('GB')
    );
    
    // More aggressive filtering for male voices
    this.maleVoices = englishVoices.filter(voice => {
      const nameLower = voice.name.toLowerCase();
      return (
        (nameLower.includes('male') && !nameLower.includes('female')) || 
        nameLower.includes('david') || 
        nameLower.includes('thomas') || 
        nameLower.includes('james') ||
        nameLower.includes('daniel') ||
        nameLower.includes('george') ||
        nameLower.includes('guy') ||
        nameLower.includes('john') ||
        nameLower.includes('paul')
      ) && !nameLower.includes('female');
    });
    
    // Better filtering for female voices
    this.femaleVoices = englishVoices.filter(voice => {
      const nameLower = voice.name.toLowerCase();
      return (
        nameLower.includes('female') || 
        nameLower.includes('zira') ||
        nameLower.includes('lisa') ||
        nameLower.includes('sarah') ||
        nameLower.includes('karen') ||
        nameLower.includes('moira') ||
        nameLower.includes('samantha') ||
        nameLower.includes('victoria')
      );
    });
    
    // If specific filtering failed, try to identify by common patterns
    if (this.maleVoices.length === 0) {
      // Try to find voices with deep pitch that are likely male
      const nonFemaleVoices = englishVoices.filter(voice => 
        !voice.name.toLowerCase().includes('female')
      );
      
      if (nonFemaleVoices.length > 0) {
        // Take the first few non-female voices, they're likely male
        this.maleVoices = nonFemaleVoices.slice(0, 3);
      } else if (voices.length > 0) {
        // Last resort - take first voice
        this.maleVoices = [voices[0]];
      }
    }
    
    if (this.femaleVoices.length === 0) {
      // If we still don't have female voices, take ones not classified as male
      const remainingVoices = englishVoices.filter(voice => 
        !this.maleVoices.includes(voice)
      );
      
      if (remainingVoices.length > 0) {
        this.femaleVoices = remainingVoices.slice(0, 3);
      } else if (voices.length > 1) {
        // Last resort
        this.femaleVoices = [voices[1]];
      }
    }
    
    console.log("Male voices:", this.maleVoices.map(v => v.name));
    console.log("Female voices:", this.femaleVoices.map(v => v.name));
    
    // Select default voices (pick ones with lower/higher pitch when possible)
    if (this.maleVoices.length > 0) {
      // Try to find a voice with "deep" in the name, or default to the first
      const deepVoice = this.maleVoices.find(v => 
        v.name.toLowerCase().includes('deep')
      );
      this.selectedMaleVoice = deepVoice || this.maleVoices[0];
    }
    
    if (this.femaleVoices.length > 0) {
      this.selectedFemaleVoice = this.femaleVoices[0];
    }
  }

  public speak(text: string, isFemaleVoice: boolean = true): void {
    // Cancel any current speech
    this.cancel();
    
    // Create a new utterance
    this.utterance = new SpeechSynthesisUtterance(text);
    
    // Select voice based on gender preference
    if (isFemaleVoice && this.selectedFemaleVoice) {
      this.utterance.voice = this.selectedFemaleVoice;
      this.utterance.pitch = 1.1;  // Slightly higher pitch for female voice
      this.utterance.rate = 0.95;
    } else if (!isFemaleVoice && this.selectedMaleVoice) {
      this.utterance.voice = this.selectedMaleVoice;
      this.utterance.pitch = 0.8;  // Lower pitch for male voice
      this.utterance.rate = 0.9;
    }
    
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

  // Function to get all available voices for debugging
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }

  public getMaleVoices(): SpeechSynthesisVoice[] {
    return this.maleVoices;
  }

  public getFemaleVoices(): SpeechSynthesisVoice[] {
    return this.femaleVoices;
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
