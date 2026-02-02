import React, { useState, useEffect } from 'react';
import { Globe, RefreshCw, AlertCircle, WifiOff, RotateCcw } from 'lucide-react';

interface BrowserAppProps {
    defaultUrl?: string;
}

export const BrowserApp: React.FC<BrowserAppProps> = ({
    defaultUrl = "https://www.linkedin.com/in/kadir-aydemir-3a1a55148/"
}) => {
    const [url, setUrl] = useState(defaultUrl);
    const [inputValue, setInputValue] = useState(defaultUrl);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isError, setIsError] = useState(false);

    const handleNavigation = (newUrl: string) => {
        // Simple logic: if navigation is attempted to a different domain or unknown address, show error
        // For this portfolio, we only "cache" the LinkedIn profile
        if (newUrl !== defaultUrl && !newUrl.includes('linkedin.com/in/kadir-aydemir')) {
            setIsError(true);
        } else {
            setIsError(false);
            setUrl(newUrl);
        }
    };

    useEffect(() => {
        if (url.includes('linkedin.com')) {
            const scriptID = 'linkedin-profile-badge-script';

            // Remove existing script to force reload and re-parse
            const existingScript = document.getElementById(scriptID);
            if (existingScript) {
                existingScript.remove();
            }

            // Create and append new script
            const script = document.createElement('script');
            script.id = scriptID;
            script.src = "https://platform.linkedin.com/badges/js/profile.js";
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);

            const checkAndParse = (retries = 0) => {
                const badgeElement = document.querySelector('.LI-profile-badge');
                if ((window as any).LInGlobal && (window as any).LInGlobal.parseBadges && badgeElement) {
                    (window as any).LInGlobal.parseBadges();
                } else if (retries < 20) {
                    setTimeout(() => checkAndParse(retries + 1), 100);
                }
            };

            script.onload = () => checkAndParse();

            // Also try after a short delay in case script was already in cache
            const timeoutId = setTimeout(() => checkAndParse(), 500);

            return () => {
                clearTimeout(timeoutId);
                const scriptToRemove = document.getElementById(scriptID);
                if (scriptToRemove) {
                    scriptToRemove.remove();
                }
                // Also clean up LinkedIn global to ensure fresh start next time
                if ((window as any).LInGlobal) {
                    delete (window as any).LInGlobal;
                }
            };
        }
    }, [url, refreshKey]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            let newUrl = inputValue;
            if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
                newUrl = 'https://' + newUrl;
            }
            handleNavigation(newUrl);
            setInputValue(newUrl);
        }
    };

    return (
        <div className="w-full h-full bg-white flex flex-col font-sans">
            {/* Browser Toolbar */}
            <div className="p-2 border-b flex gap-2 bg-gray-100 items-center shrink-0">
                <div className="flex gap-1 px-2">
                    <button
                        onClick={() => {
                            setIsError(false);
                            setUrl(defaultUrl);
                            setInputValue(defaultUrl);
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-ubuntu-orange"
                        title="Ana Sayfa"
                    >
                        <Globe size={18} />
                    </button>
                    <button
                        onClick={() => {
                            setIsError(false);
                            setRefreshKey(prev => prev + 1);
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                        title="Yenile"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-white border rounded-full px-4 py-1 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-ubuntu-orange border-gray-300 shadow-sm"
                    placeholder="Search or enter address"
                />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-[#f3f2ef] flex flex-col items-center justify-center">
                {isError ? (
                    <div className="w-full h-full bg-white flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
                        <div className="bg-red-50 p-6 rounded-full mb-6">
                            <WifiOff size={64} className="text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">İnternet Bağlantısı Yok</h2>
                        <p className="text-gray-500 text-center max-w-sm mb-8">
                            Görünüşe göre internete bağlı değilsiniz. Lütfen ağ ayarlarınızı kontrol edin veya daha sonra tekrar deneyin.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => { /* Do nothing as requested */ }}
                                className="flex items-center gap-2 px-6 py-2 bg-gray-400 text-white rounded-full cursor-not-allowed font-medium"
                            >
                                <RotateCcw size={18} />
                                Tekrar Dene
                            </button>
                            <button
                                onClick={() => {
                                    setIsError(false);
                                    setUrl(defaultUrl);
                                    setInputValue(defaultUrl);
                                    setRefreshKey(prev => prev + 1); // Increment key to force LinkedIn re-render
                                }}
                                className="flex items-center gap-2 px-6 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition-colors font-medium"
                            >
                                Ana Sayfaya Dön
                            </button>
                        </div>

                        <div className="mt-12 flex items-center gap-2 text-gray-400 text-sm">
                            <AlertCircle size={16} />
                            <span>Hata Kodu: ERR_INTERNET_DISCONNECTED</span>
                        </div>
                    </div>
                ) : url.includes('linkedin.com') ? (
                    <div className="flex flex-col items-center animate-in fade-in duration-700 w-full py-4">
                        {/* Clean Official Badge Container */}
                        <div key={refreshKey} className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                            <div
                                className="badge-base LI-profile-badge"
                                data-locale="tr_TR"
                                data-size="large"
                                data-theme="light"
                                data-type="HORIZONTAL"
                                data-vanity="kadir-aydemir-3a1a55148"
                                data-version="v1"
                            >
                                <a
                                    className="badge-base__link LI-simple-link"
                                    href="https://tr.linkedin.com/in/kadir-aydemir-3a1a55148?trk=profile-badge"
                                >
                                    Profil Yükleniyor...
                                </a>
                            </div>
                        </div>

                        <div className="mt-8 text-center max-w-xs">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">LinkedIn Official Profile</p>
                            <p className="text-[10px] text-gray-400">Veriler doğrudan LinkedIn üzerinden güncellenmektedir.</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full bg-white relative">
                        <iframe
                            src={url}
                            className="w-full h-full border-none"
                            title="Web Browser"
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
