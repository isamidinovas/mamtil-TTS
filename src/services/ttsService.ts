// Class for handling text-to-speech functionality
class TTSService {
  private readonly API_URL = "/api/tts";
  private readonly API_TOKEN =
    "a4ee19f2d1f61a48a953427aa739d6585f65cad00135a69a9541a6839919906b2feabdfcc453fb7d1db37153530d8bbcc1ffa5208906173f23523b9091474ccf";
  private audio: HTMLAudioElement | null = null;

  constructor() {
    this.audio = new Audio();
  }

  private getSpeakerId(isFemaleVoice: boolean): string {
    // 1 - мужской голос, 2 - женский голос
    return isFemaleVoice ? "2" : "1";
  }

  public async speak(
    text: string,
    isFemaleVoice: boolean = true
  ): Promise<void> {
    try {
      // Отменяем текущее воспроизведение
      this.cancel();

      // Создаем объект с данными для API
      const requestData = {
        text: text,
        speaker_id: this.getSpeakerId(isFemaleVoice),
      };

      // Отправляем запрос к API
      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.API_TOKEN}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Получаем аудио данные
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Создаем новый аудио элемент
      this.audio = new Audio(audioUrl);

      // Воспроизводим
      await this.audio.play();
    } catch (error) {
      console.error("Error in TTS service:", error);
      throw error;
    }
  }

  public pause(): void {
    if (this.audio) {
      this.audio.pause();
    }
  }

  public resume(): void {
    if (this.audio) {
      this.audio.play();
    }
  }

  public cancel(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  public get isPaused(): boolean {
    return this.audio ? this.audio.paused : true;
  }

  public get isSpeaking(): boolean {
    return this.audio ? !this.audio.paused && !this.audio.ended : false;
  }

  // Метод для получения аудио файла
  public async getAudioBlob(
    text: string,
    isFemaleVoice: boolean = true
  ): Promise<Blob> {
    try {
      const requestData = {
        text: text,
        speaker_id: this.getSpeakerId(isFemaleVoice),
      };

      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.API_TOKEN}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.blob();
    } catch (error) {
      console.error("Error getting audio blob:", error);
      throw error;
    }
  }
}

// Экспортируем экземпляр сервиса
export const ttsService = new TTSService();
