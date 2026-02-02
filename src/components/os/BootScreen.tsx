import { useEffect, useState } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Power } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BootScreen = () => {
    const { setBootState } = useOSStore();
    const [checkPhase, setCheckPhase] = useState(0);

    useEffect(() => {
        // Mock boot sequence - sped up
        const timers = [
            setTimeout(() => setCheckPhase(1), 300), // BIOS
            setTimeout(() => setCheckPhase(2), 800), // Loading
            setTimeout(() => setBootState('desktop'), 1500) // Transition directly to desktop
        ];
        return () => timers.forEach(clearTimeout);
    }, [setBootState]);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-white"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Ubuntu Logo Construction */}
                <div className="mb-12 relative w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-spin duration-[1000ms]"></div>
                    <div className="w-24 h-24 bg-ubuntu-orange rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(233,84,32,0.6)]">
                        <Power size={48} className="text-white" />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-3xl font-bold tracking-widest text-white">KADIR AYDEMIR</h1>
                    <div className="flex gap-2 mt-4">
                        <div className={`w-3 h-3 rounded-full transition-colors duration-200 ${checkPhase >= 0 ? 'bg-ubuntu-orange' : 'bg-gray-700'}`} />
                        <div className={`w-3 h-3 rounded-full transition-colors duration-200 ${checkPhase >= 1 ? 'bg-ubuntu-orange' : 'bg-gray-700'}`} />
                        <div className={`w-3 h-3 rounded-full transition-colors duration-200 ${checkPhase >= 2 ? 'bg-ubuntu-orange' : 'bg-gray-700'}`} />
                    </div>
                </div>

                <div className="absolute bottom-10 text-gray-500 text-sm font-mono">
                    {checkPhase === 0 && "System Check..."}
                    {checkPhase === 1 && "Loading Resources..."}
                    {checkPhase === 2 && "Starting Desktop Environment..."}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
