import { useCallback } from 'react';
import * as Speech from 'expo-speech';
import { useSettingsStore } from '../stores/useSettingsStore';

export function useSpeech() {
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);

  const speakNumber = useCallback(
    async (number: number): Promise<void> => {
      if (!soundEnabled) return;

      try {
        // 停止当前播放的语音
        await Speech.stop();

        // 播报数字
        await Speech.speak(number.toString(), {
          language: 'zh-CN',
          pitch: 1.2,
          rate: 0.8,
        });
      } catch (error) {
        console.error('Failed to speak number:', error);
      }
    },
    [soundEnabled]
  );

  const speakText = useCallback(
    async (text: string): Promise<void> => {
      if (!soundEnabled) return;

      try {
        await Speech.stop();
        await Speech.speak(text, {
          language: 'zh-CN',
          pitch: 1.1,
          rate: 0.9,
        });
      } catch (error) {
        console.error('Failed to speak text:', error);
      }
    },
    [soundEnabled]
  );

  const stopSpeaking = useCallback(async (): Promise<void> => {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Failed to stop speaking:', error);
    }
  }, []);

  return {
    speakNumber,
    speakText,
    stopSpeaking,
    soundEnabled,
  };
}
