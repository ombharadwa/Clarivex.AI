import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Copy, Check, X, Volume2, Sparkles, AlertCircle } from 'lucide-react';

interface AudioTranscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTranscription?: (text: string) => void;
}

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
};

const getSpeechRecognition = (): (new () => SpeechRecognitionLike) | null => {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

export const AudioTranscriberModal: React.FC<AudioTranscriberModalProps> = ({
  isOpen,
  onClose,
  onApplyTranscription,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [interim, setInterim] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const supported = Boolean(getSpeechRecognition());

  useEffect(() => {
    if (!isOpen) {
      stopRecording();
      setTranscription('');
      setInterim('');
      setError(null);
    }
  }, [isOpen]);

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* already stopped */
      }
      recognitionRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setInterim('');
  };

  const startRecording = () => {
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) {
      setError('Your browser does not support speech recognition. Try Chrome or Edge.');
      return;
    }

    setError(null);
    setTranscription('');
    setInterim('');

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interimText += result[0].transcript;
      }
      if (finalText) {
        setTranscription(prev => (prev ? `${prev} ${finalText.trim()}` : finalText.trim()));
      }
      setInterim(interimText);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('Microphone access was denied. Allow microphone access and try again.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else if (event.error !== 'aborted') {
        setError(`Speech recognition error: ${event.error}`);
      }
      stopRecording();
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterim('');
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
      setRecordDuration(0);
      timerRef.current = setInterval(() => setRecordDuration(prev => prev + 1), 1000);
    } catch (err) {
      console.error('Could not start speech recognition', err);
      setError('Could not start speech recognition. Please try again.');
    }
  };

  const handleCopy = () => {
    if (!transcription) return;
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 backdrop-blur-md" style={{ background: 'rgba(4,7,18,0.72)' }}>
      <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-3xl p-6 sm:p-8" style={{ background: 'var(--elevated)', border: '1px solid var(--line-strong)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="absolute left-0 right-0 top-0 h-[2px]" style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }} />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(124,92,255,0.14)', border: '1px solid var(--line-strong)', color: 'var(--accent-soft)' }}>
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-[16px] font-extrabold" style={{ color: 'var(--fg)' }}>
                Voice Input
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ color: 'var(--accent-2)', background: 'rgba(0,212,255,0.1)' }}>
                  on-device
                </span>
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
                Speak your prompt — transcribed by your browser, no server needed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 transition-colors" style={{ color: 'var(--muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6 flex flex-col items-center justify-center rounded-2xl py-8 text-center" style={{ background: 'var(--surface-2)', border: '1px solid var(--line-soft)' }}>
          {isRecording ? (
            <div className="space-y-4 flex flex-col items-center">
              <div className="relative">
                <span className="absolute -inset-3 rounded-full bg-red-500/20 animate-ping" />
                <button
                  onClick={stopRecording}
                  className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center relative z-10 shadow-lg shadow-red-500/30 cursor-pointer"
                >
                  <Square className="w-6 h-6 fill-current" />
                </button>
              </div>
              <div className="font-mono text-lg font-bold" style={{ color: '#FF8A8A' }}>{formatTime(recordDuration)}</div>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Listening... Click to stop</p>
              {interim && <p className="px-6 text-xs italic" style={{ color: 'var(--accent-soft)' }}>{interim}</p>}
            </div>
          ) : (
            <div className="space-y-4 flex flex-col items-center">
              <button
                onClick={startRecording}
                disabled={!supported}
                className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full text-white transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100" style={{ background: 'linear-gradient(120deg, var(--accent), var(--accent-2))', boxShadow: '0 18px 44px -14px rgba(124,92,255,0.95)' }}
              >
                <Mic className="w-7 h-7" />
              </button>
              <div className="text-xs font-semibold" style={{ color: 'var(--fg)' }}>
                {supported ? 'Click to start speaking' : 'Speech recognition unavailable'}
              </div>
              <p className="max-w-xs text-[11px]" style={{ color: 'var(--muted)' }}>
                Audio never leaves your device. Works in Chrome, Edge and Safari.
              </p>
            </div>
          )}

          {error && (
            <div className="mx-4 mt-4 flex items-start gap-2 rounded-lg px-3 py-2 text-left text-[11px]" style={{ color: '#FBBF24', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {transcription && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              <span>Transcription</span>
              <button
                onClick={handleCopy}
                className="flex cursor-pointer items-center gap-1 font-medium lowercase transition-colors" style={{ color: 'var(--accent-2)' }}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy text'}
              </button>
            </div>
            <div className="max-h-36 overflow-y-auto whitespace-pre-wrap rounded-xl p-4 text-[13px] leading-relaxed" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--fg)' }}>
              {transcription}
            </div>

            {onApplyTranscription && (
              <button
                onClick={() => {
                  onApplyTranscription(transcription);
                  onClose();
                }}
                className="w-full btn btn-primary py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Insert Transcription Into Prompt
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
