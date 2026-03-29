import { useRef, useCallback, useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { useSettingsStore } from '../stores/useSettingsStore';
import type { Asset } from 'expo-asset';

export type SoundType = 'click' | 'success' | 'error';

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
};

// 背景音乐配置
const BACKGROUND_MUSIC_SOURCE = require('../../assets/sounds/background-music.mp3') as number;
const BACKGROUND_MUSIC_VOLUME = 0.3; // 背景音乐音量较低

export function useSound() {
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const musicEnabled = useSettingsStore((state) => state.musicEnabled);
  const soundsRef = useRef<Map<SoundType, Audio.Sound>>(new Map());
  const bgMusicRef = useRef<Audio.Sound | null>(null);
  const isInitializedRef = useRef(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    const initializeSounds = async () => {
      if (isInitializedRef.current) return;

      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        // 加载背景音乐
        const { sound } = await Audio.Sound.createAsync(
          BACKGROUND_MUSIC_SOURCE,
          {
            volume: BACKGROUND_MUSIC_VOLUME,
            isLooping: true,
          }
        );
        bgMusicRef.current = sound;

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
      
      if (bgMusicRef.current) {
        bgMusicRef.current.unloadAsync();
      }
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

  // 背景音乐控制
  const playBackgroundMusic = useCallback(async (): Promise<void> => {
    if (!musicEnabled || !bgMusicRef.current) return;

    try {
      const status = await bgMusicRef.current.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await bgMusicRef.current.playAsync();
        setIsMusicPlaying(true);
      }
    } catch (error) {
      console.error('Failed to play background music:', error);
    }
  }, [musicEnabled]);

  const pauseBackgroundMusic = useCallback(async (): Promise<void> => {
    if (!bgMusicRef.current) return;

    try {
      await bgMusicRef.current.pauseAsync();
      setIsMusicPlaying(false);
    } catch (error) {
      console.error('Failed to pause background music:', error);
    }
  }, []);

  const stopBackgroundMusic = useCallback(async (): Promise<void> => {
    if (!bgMusicRef.current) return;

    try {
      await bgMusicRef.current.stopAsync();
      setIsMusicPlaying(false);
    } catch (error) {
      console.error('Failed to stop background music:', error);
    }
  }, []);

  // 监听音乐开关变化
  useEffect(() => {
    if (musicEnabled) {
      playBackgroundMusic();
    } else {
      pauseBackgroundMusic();
    }
  }, [musicEnabled, playBackgroundMusic, pauseBackgroundMusic]);

  return {
    playSound,
    playClick,
    playSuccess,
    playError,
    stopSound,
    stopAllSounds,
    setVolume,
    soundEnabled,
    playBackgroundMusic,
    pauseBackgroundMusic,
    stopBackgroundMusic,
    isMusicPlaying,
  };
}
