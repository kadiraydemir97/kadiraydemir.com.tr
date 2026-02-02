import { useState } from 'react';
import { User, Power, Volume2, ArrowRight } from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';
import { motion, AnimatePresence } from 'framer-motion';
import backgroundImage from '../../assets/wallpapers/ubuntu-bg.png';
import { useTime } from '../../hooks/useTime';

export const LoginScreen = () => {
    const { setBootState } = useOSStore();
    const { formattedTime, fullDate } = useTime();
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleLogin = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        // Allow entry without actual password check
        setBootState('desktop');
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center text-white select-none overflow-hidden"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

            {/* Top Bar (Time) - Ubuntu Style */}
            <div className="absolute top-10 flex flex-col items-center z-10">
                <span className="text-8xl font-ubuntu font-light tracking-tight drop-shadow-2xl">{formattedTime}</span>
                <span className="text-xl font-ubuntu opacity-90 mt-2 font-medium drop-shadow-md">{fullDate}</span>
            </div>

            {/* Profile Section */}
            <div className="z-10 flex flex-col items-center w-full max-w-sm px-6">
                <AnimatePresence mode="wait">
                    {!isPasswordVisible ? (
                        <motion.button
                            key="profile-select"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={() => setIsPasswordVisible(true)}
                            className="group flex flex-col items-center gap-6 hover:bg-white/10 p-10 rounded-[40px] transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/10 shadow-2xl"
                        >
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-ubuntu-orange to-orange-600 flex items-center justify-center shadow-[0_0_50px_rgba(233,84,32,0.4)] group-hover:scale-105 transition-transform duration-500">
                                <User size={64} className="text-white" />
                            </div>
                            <span className="text-3xl font-ubuntu font-semibold tracking-wide drop-shadow-lg">Kadir Aydemir</span>
                            <span className="text-sm opacity-60 font-ubuntu">Click to login</span>
                        </motion.button>
                    ) : (
                        <motion.div
                            key="password-entry"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col items-center gap-8 p-10 rounded-[40px] bg-black/40 backdrop-blur-2xl border border-white/20 w-full shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
                        >
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-ubuntu-orange to-orange-600 flex items-center justify-center shadow-lg">
                                <User size={48} />
                            </div>
                            <div className="flex flex-col items-center gap-6 w-full">
                                <div className="text-center">
                                    <h2 className="text-2xl font-ubuntu font-semibold mb-1">Kadir Aydemir</h2>
                                    <p className="text-xs text-white/50 font-ubuntu">Password: Just press enter</p>
                                </div>

                                <form onSubmit={handleLogin} className="relative w-full">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoFocus
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-ubuntu-orange transition-all placeholder:text-white/20 pr-14 text-lg font-ubuntu"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-ubuntu-orange hover:bg-orange-600 rounded-lg transition-colors shadow-lg"
                                    >
                                        <ArrowRight size={24} />
                                    </button>
                                </form>

                                <button
                                    onClick={() => setIsPasswordVisible(false)}
                                    className="text-sm text-white/40 hover:text-white transition-colors font-ubuntu py-2"
                                >
                                    Log in as another user
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-12 flex items-center gap-8 z-10">
                <button className="p-3 hover:bg-white/10 rounded-full transition-all group">
                    <Volume2 size={24} className="opacity-70 group-hover:opacity-100" />
                </button>
                <button
                    onClick={() => setBootState('off')}
                    className="p-3 hover:bg-white/10 rounded-full transition-all group"
                >
                    <Power size={24} className="opacity-70 group-hover:text-red-400 group-hover:opacity-100" />
                </button>
            </div>

            {/* Hint for mobile or first time users */}
            <div className="absolute bottom-6 text-[10px] text-white/20 font-ubuntu uppercase tracking-widest">
                Press any key or click to interact
            </div>
        </div>
    );
};
