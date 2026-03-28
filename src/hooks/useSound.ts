import { useRef, useCallback, useEffect } from 'react';
import { Audio } from 'expo-av';
import { useSettingsStore } from '../stores/useSettingsStore';
import type { Asset } from 'expo-asset';

export type SoundType = 'click' | 'success' | 'error' | 'celebration';

interface SoundConfig {
  source: Asset | number;
  volume: number;
}

const SOUND_CONFIGS: Record<SoundType, SoundConfig> = {
  click: {
    source: require('../../assets/sounds/click.mp3') as number,
    volume: 0.5,
  },
  success: {
    source: require('../../assets/sounds/success.mp3') as number,
    volume: 0.7,
  },
  error: {
    source: require('../../assets/sounds/error.mp3') as number,
    volume: 0.6,
  },
  celebration: {
    source: require('../../assets/sounds/celebration.mp3') as number,
    volume: 0.8,
  },
};

export function useSound() {
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const soundsRef = useRef<Map<SoundType, Audio.Sound>>(new Map());
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const initializeSounds = async () => {
      if (isInitializedRef.current) return;

      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        isInitializedRef.current = true;
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    };

    initializeSounds();

    return () => {
      soundsRef.current.forEach((sound) => {
        sound.unloadAsync();
      });
      soundsRef.current.clear();
    };
  }, []);

  const loadSound = useCallback(async (type: SoundType): Promise<Audio.Sound | null> => {
    if (soundsRef.current.has(type)) {
      return soundsRef.current.get(type)!;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(SOUND_CONFIGS[type].source);
      soundsRef.current.set(type, sound);
      return sound;
    } catch (error) {
      console.error(`Failed to load sound: ${type}`, error);
      return null;
    }
  }, []);

  const playSound = useCallback(
    async (type: SoundType, volume?: number): Promise<void> => {
      if (!soundEnabled) return;

      try {
        const sound = await loadSound(type);
        if (!sound) return;

        const configVolume = SOUND_CONFIGS[type].volume;
        const finalVolume = volume !== undefined ? volume : configVolume;

        await sound.setVolumeAsync(finalVolume);
        await sound.setPositionAsync(0);
        await sound.playAsync();
      } catch (error) {
        console.error(`Failed to play sound: ${type}`, error);
      }
    },
    [soundEnabled, loadSound]
  );

  const playClick = useCallback(
    (volume?: number) => playSound('click', volume),
    [playSound]
  );

  const playSuccess = useCallback(
    (volume?: number) => playSound('success', volume),
    [playSound]
  );

  const playError = useCallback(
    (volume?: number) => playSound('error', volume),
    [playSound]
  );

  const playCelebration = useCallback(
    (volume?: number) => playSound('celebration', volume),
    [playSound]
  );

  const stopSound = useCallback(async (type: SoundType): Promise<void> => {
    const sound = soundsRef.current.get(type);
    if (sound) {
      try {
        await sound.stopAsync();
      } catch (error) {
        console.error(`Failed to stop sound: ${type}`, error);
      }
    }
  }, []);

  const stopAllSounds = useCallback(async (): Promise<void> => {
    const stopPromises: Promise<void>[] = [];
    soundsRef.current.forEach((sound, type) => {
      stopPromises.push(
        sound.stopAsync().then(() => {}).catch((error) => {
          console.error(`Failed to stop sound: ${type}`, error);
        })
      );
    });
    await Promise.all(stopPromises);
  }, []);

  const setVolume = useCallback(
    async (type: SoundType, volume: number): Promise<void> => {
      const sound = soundsRef.current.get(type);
      if (sound) {
        try {
          await sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
        } catch (error) {
          console.error(`Failed to set volume for sound: ${type}`, error);
        }
      }
    },
    []
  );

  return {
    playSound,
    playClick,
    playSuccess,
    playError,
    playCelebration,
    stopSound,
    stopAllSounds,
    setVolume,
    soundEnabled,
  };
}
