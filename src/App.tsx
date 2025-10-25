import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import RequestForm from './components/RequestForm';
import ResponseDisplay from './components/ResponseDisplay';
import SettingsModal from './components/SettingsModal';
import SettingsIcon from './components/icons/SettingsIcon';
import type { ApiRequest, ApiResponse, AppSettings, Cookie } from '../types';

type MobileView = 'request' | 'response';

const App: React.FC = () => {
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [panelWidth, setPanelWidth] = useState(50); // Initial width as a percentage
    const [mobileView, setMobileView] = useState<MobileView>('request');

    const mainContainerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const initialSettings: AppSettings = {
        colors: {
            keyColor: '#5b21b6', // violet-800
            stringColor: '#166534', // green-800
            numberColor: '#be123c', // rose-700
            booleanColor: '#86198f', // fuchsia-800
            nullColor: '#64748b', // slate-500
            urlColor: '#0f172a', // slate-900
            inputTextColor: '#0f172a', // slate-900
            responseTextColor: '#0f172a', // slate-900
        },
        fontSizes: {
            inputFontSize: 14,
            responseFontSize: 14,
        }
    };

    const [settings, setSettings] = useState<AppSettings>(() => {
        try {
            const savedSettings = localStorage.getItem('apiClientAppSettings');
            if (savedSettings) {
                // Basic merge to ensure new settings properties are added if they don't exist in localStorage
                const parsed = JSON.parse(savedSettings);
                return {
                    colors: { ...initialSettings.colors, ...parsed.colors },
                    fontSizes: { ...initialSettings.fontSizes, ...parsed.fontSizes },
                };
            }
            return initialSettings;
        } catch (error) {
            return initialSettings;
        }
    });

    const handleSaveSettings = (newSettings: AppSettings) => {
        setSettings(newSettings);
        try {
            localStorage.setItem('apiClientAppSettings', JSON.stringify(newSettings));
        } catch (error) {
            console.error("Failed to save settings to localStorage", error);
        }
    };

    const parseSetCookieHeader = (headerValue: string | null): Cookie[] => {
        if (!headerValue) return [];
        return headerValue.split(', ').map(cookieStr => {
            const parts = cookieStr.split(';').map(part => part.trim());
            const [name, value] = parts[0].split('=');
            const cookie: Cookie = { name, value, httpOnly: false, secure: false };

            for (let i = 1; i < parts.length; i++) {
                const [key, val] = parts[i].split('=');
                const lowerKey = key.toLowerCase();
                if (lowerKey === 'expires') cookie.expires = val;
                else if (lowerKey === 'domain') cookie.domain = val;
                else if (lowerKey === 'path') cookie.path = val;
                else if (lowerKey === 'max-age') cookie.maxAge = val;
                else if (lowerKey === 'secure') cookie.secure = true;
                else if (lowerKey === 'httponly') cookie.httpOnly = true;
            }
            return cookie;
        }).filter(c => c.name);
    };


    const handleSendRequest = async (request: ApiRequest) => {
        setLoading(true);
        setError(null);
        setResponse(null);
        setMobileView('response'); // Switch to response view on mobile after sending

        const startTime = Date.now();

        try {
            const requestHeaders: Record<string, string> = {};
            request.headers
                .filter(h => h.enabled && h.key)
                .forEach(h => {
                    requestHeaders[h.key] = h.value;
                });

            if (request.authToken) {
                requestHeaders['Authorization'] = `Bearer ${request.authToken}`;
            }

            let body: BodyInit | undefined = undefined;

            if (request.method !== 'GET') {
                if (request.bodyType === 'raw') {
                    body = request.rawBody || undefined;
                    if (!requestHeaders['Content-Type'] && request.rawBody.startsWith('{')) {
                        requestHeaders['Content-Type'] = 'application/json';
                    }
                } else if (request.bodyType === 'form-data') {
                    const formData = new FormData();
                    request.formData
                        .filter(item => item.enabled && item.key)
                        .forEach(item => {
                            formData.append(item.key, item.value);
                        });
                    body = formData;
                    delete requestHeaders['Content-Type'];
                }
            }

            const res = await fetch(request.url, {
                method: request.method,
                headers: requestHeaders,
                body,
            });

            const endTime = Date.now();

            const responseHeaders: Record<string, string> = {};
            res.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });

            const rawBody = await res.text();
            const size = parseInt(res.headers.get('content-length') || '0') || new Blob([rawBody]).size;

            let data: any;
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                try {
                    data = JSON.parse(rawBody);
                } catch (e) {
                    data = rawBody;
                }
            } else {
                data = rawBody;
            }

            setResponse({
                status: res.status,
                statusText: res.statusText,
                headers: responseHeaders,
                data,
                time: endTime - startTime,
                size,
                cookies: parseSetCookieHeader(res.headers.get('set-cookie')),
            });

        } catch (err: any) {
            if (err instanceof TypeError && err.message === 'Failed to fetch') {
                setError('Network error. This could be due to several reasons:\n\n- CORS Policy: The API may not allow requests from this web client.\n- DNS Failure: The domain name may not be correct or accessible.\n- Server Unreachable: The server may be down or there might be a network issue.\n\nPlease check the URL and your network connection. For CORS issues, consider using a public API or a server that allows cross-origin requests.');
            } else {
                setError(err.message || 'An unknown network error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
    }, []);

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging.current || !mainContainerRef.current) return;
        e.preventDefault();

        const containerRect = mainContainerRef.current.getBoundingClientRect();
        const relativeX = e.clientX - containerRect.left;
        let newWidth = (relativeX / containerRect.width) * 100;

        if (newWidth < 20) newWidth = 20;
        if (newWidth > 80) newWidth = 80;

        setPanelWidth(newWidth);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    const renderMobileTabs = () => (
        <div className="lg:hidden flex border-b border-border mb-4">
            <button
                onClick={() => setMobileView('request')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${mobileView === 'request' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            >
                Request
            </button>
            <button
                onClick={() => setMobileView('response')}
                disabled={!response && !error && !loading}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${mobileView === 'response' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'} disabled:text-slate-300 disabled:cursor-not-allowed`}
            >
                Response
            </button>
        </div>
    );


    return (
   <div className="flex flex-col h-full w-full">
            <div className="bg-background text-foreground min-h-screen font-sans flex flex-col">
                <header className="p-4 border-b border-border flex justify-between items-center flex-shrink-0 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
                    <h1 className="text-xl font-bold">API Client</h1>
                    <button onClick={() => setIsSettingsOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Open settings">
                        <SettingsIcon />
                    </button>
                </header>
                <main ref={mainContainerRef} className="flex-grow flex flex-col lg:flex-row p-2 sm:p-4 lg:p-6 overflow-hidden">
                    {/* Mobile View */}
                    <div className="lg:hidden flex flex-col h-full">
                        {renderMobileTabs()}
                        <div className="flex-grow overflow-auto">
                            {mobileView === 'request' && <RequestForm onSendRequest={handleSendRequest} loading={loading} settings={settings} />}
                            {mobileView === 'response' && <ResponseDisplay response={response} loading={loading} error={error} settings={settings} />}
                        </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden lg:flex h-full" style={{ width: `${panelWidth}%` }}>
                        <div className="pr-3 h-full flex flex-col w-full">
                            <RequestForm onSendRequest={handleSendRequest} loading={loading} settings={settings} />
                        </div>
                    </div>
                    <div
                        onMouseDown={handleMouseDown}
                        className="w-2 cursor-col-resize flex-shrink-0 bg-muted hover:bg-primary/20 transition-colors rounded-full hidden lg:flex"
                    />
                    <div className="hidden lg:flex flex-1 h-full overflow-hidden">
                        <div className="pl-3 h-full flex flex-col w-full">
                            <ResponseDisplay response={response} loading={loading} error={error} settings={settings} />
                        </div>
                    </div>
                </main>

                 
                <SettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    onSave={handleSaveSettings}
                    initialSettings={settings}
                />
            </div>
        </div>
    );
};

export default App;