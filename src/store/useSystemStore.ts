import { create } from 'zustand';

interface SystemState {
    volume: number;
    brightness: number;
    isWifiOn: boolean;
    isBluetoothOn: boolean;
    isDarkMode: boolean;
    setVolume: (v: number) => void;
    setBrightness: (b: number) => void;
    toggleWifi: () => void;
    toggleBluetooth: () => void;
    toggleDarkMode: () => void;
}

export const useSystemStore = create<SystemState>((set) => ({
    volume: 75,
    brightness: 80,
    isWifiOn: true,
    isBluetoothOn: false,
    isDarkMode: true,
    setVolume: (volume) => set({ volume }),
    setBrightness: (brightness) => set({ brightness }),
    toggleWifi: () => set((state) => ({ isWifiOn: !state.isWifiOn })),
    toggleBluetooth: () => set((state) => ({ isBluetoothOn: !state.isBluetoothOn })),
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));
