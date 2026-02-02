import { Volume2, Sun, Wifi, Bluetooth, Moon, Zap, Settings, Lock, Power, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '../../store/useOSStore';
import { useSystemStore } from '../../store/useSystemStore';
import { useProcess } from '../../hooks/useProcess';

interface SystemMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SystemMenu = ({ isOpen, onClose }: SystemMenuProps) => {
    const { setBootState } = useOSStore();
    const {
        volume, setVolume,
        brightness, setBrightness,
        isWifiOn, toggleWifi,
        isBluetoothOn, toggleBluetooth,
        isDarkMode, toggleDarkMode
    } = useSystemStore();

    const { openSettings } = useProcess();

    const handlePowerOff = () => {
        setBootState('off');
        onClose();
    };

    const handleLock = () => {
        setBootState('login');
        onClose();
    };

    const handleSettings = () => {
        openSettings();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={onClose} />

                    {/* Menu Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="fixed top-9 right-2 w-80 bg-[#2d2d2d]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden text-white p-4 select-none"
                    >
                        {/* User Profile Section */}
                        <div className="flex items-center gap-3 mb-6 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-ubuntu-orange flex items-center justify-center">
                                <User size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">Kadir Aydemir</span>
                                <span className="text-[10px] text-gray-400">Senior Full Stack Developer</span>
                            </div>
                        </div>

                        {/* Quick Settings Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            <QuickTile
                                icon={<Wifi size={18} />}
                                label="Wi-Fi"
                                active={isWifiOn}
                                onClick={toggleWifi}
                                sublabel={isWifiOn ? "Aydemir_Home" : "Off"}
                            />
                            <QuickTile
                                icon={<Bluetooth size={18} />}
                                label="Bluetooth"
                                active={isBluetoothOn}
                                onClick={toggleBluetooth}
                                sublabel={isBluetoothOn ? "On" : "Off"}
                            />
                            <QuickTile
                                icon={<Moon size={18} />}
                                label="Night Light"
                                active={isDarkMode}
                                onClick={toggleDarkMode}
                            />
                            <QuickTile
                                icon={<Zap size={18} />}
                                label="Power Mode"
                                active={true}
                                sublabel="Balanced"
                            />
                        </div>

                        {/* Sliders */}
                        <div className="space-y-4 mb-6 px-1">
                            <div className="flex items-center gap-3">
                                <Volume2 size={18} className="text-gray-400" />
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full relative group">
                                    <div
                                        className="absolute h-full bg-ubuntu-orange rounded-full"
                                        style={{ width: `${volume}%` }}
                                    />
                                    <input
                                        type="range"
                                        min="0" max="100"
                                        value={volume}
                                        onChange={(e) => setVolume(parseInt(e.target.value))}
                                        className="absolute inset-x-0 -top-1 opacity-0 cursor-pointer w-full"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Sun size={18} className="text-gray-400" />
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full relative">
                                    <div
                                        className="absolute h-full bg-ubuntu-orange rounded-full"
                                        style={{ width: `${brightness}%` }}
                                    />
                                    <input
                                        type="range"
                                        min="0" max="100"
                                        value={brightness}
                                        onChange={(e) => setBrightness(parseInt(e.target.value))}
                                        className="absolute inset-x-0 -top-1 opacity-0 cursor-pointer w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between border-t border-white/10 pt-4 px-2">
                            <button
                                onClick={handleSettings}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                title="Settings"
                            >
                                <Settings size={18} />
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleLock}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    title="Lock"
                                >
                                    <Lock size={18} />
                                </button>
                                <button
                                    onClick={handlePowerOff}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-red-400"
                                    title="Power Off"
                                >
                                    <Power size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

interface QuickTileProps {
    icon: React.ReactNode;
    label: string;
    sublabel?: string;
    active: boolean;
    onClick?: () => void;
}

const QuickTile = ({ icon, label, sublabel, active, onClick }: QuickTileProps) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${active ? 'bg-ubuntu-orange text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
    >
        <div className={`p-2 rounded-lg ${active ? 'bg-white/20' : 'bg-white/10'}`}>
            {icon}
        </div>
        <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold truncate font-ubuntu">{label}</span>
            {sublabel && <span className="text-[10px] opacity-70 truncate font-ubuntu">{sublabel}</span>}
        </div>
    </div>
);
