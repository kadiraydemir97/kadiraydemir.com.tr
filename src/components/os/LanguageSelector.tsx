import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'tr', label: 'Türkçe' }
    ];

    const currentLang = i18n.language || 'en';

    const handleLanguageChange = (langCode: string) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors font-ubuntu text-sm font-bold uppercase"
            >
                {currentLang.split('-')[0]}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full right-0 mt-2 w-32 bg-[#2d2d2d] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden py-1"
                        >
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`w-full text-left px-4 py-2 text-sm font-ubuntu hover:bg-ubuntu-orange hover:text-white transition-colors flex items-center justify-between ${
                                        currentLang.startsWith(lang.code) ? 'text-ubuntu-orange' : 'text-gray-300'
                                    }`}
                                >
                                    <span className={currentLang.startsWith(lang.code) ? 'font-bold' : ''}>{lang.label}</span>
                                    {currentLang.startsWith(lang.code) && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-current group-hover:bg-white" />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
