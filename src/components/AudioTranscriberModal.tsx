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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-[#151B35] border border-[#7C5CFF]/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF]" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 flex items-center justify-center text-[#A48BFF]">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[16px] text-white flex items-center gap-2">
                Voice Input
                <span className="text-[10px] font-bold text-[#00D4FF] bg-[#00D4FF]/10 px-2 py-0.5 rounded-full">
                  on-device
                </span>
              </h3>
              <p className="text-[11px] text-[#8892B0]">
                Speak your prompt — transcribed by your browser, no server needed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8892B0] hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-8 flex flex-col items-center justify-center border border-white/5 bg-[#0B1020]/60 rounded-2xl mb-6 text-center">
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
              <div className="font-mono text-lg font-bold text-red-400">{formatTime(recordDuration)}</div>
              <p className="text-xs text-[#8892B0]">Listening... Click to stop</p>
              {interim && <p className="text-xs text-[#A48BFF] italic px-6">{interim}</p>}
            </div>
          ) : (
            <div className="space-y-4 flex flex-col items-center">
              <button
                onClick={startRecording}
                disabled={!supported}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 transition-all cursor-pointer"
              >
                <Mic className="w-7 h-7" />
              </button>
              <div className="text-xs font-semibold text-white">
                {supported ? 'Click to start speaking' : 'Speech recognition unavailable'}
              </div>
              <p className="text-[11px] text-[#8892B0] max-w-xs">
                Audio never leaves your device. Works in Chrome, Edge and Safari.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 mx-4 flex items-start gap-2 text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/25 rounded-lg px-3 py-2 text-left">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {transcription && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#8892B0] uppercase tracking-wider">
              <span>Transcription</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[#00D4FF] hover:text-white transition-colors cursor-pointer lowercase font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy text'}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-[#0B1020] border border-[#7C5CFF]/20 text-[13px] text-white leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap">
              {transcription}
            </div>

            {onApplyTranscription && (
              <button
                onClick={() => {
                  onApplyTranscription(transcription);
                  onClose();
                }}
                className="w-full btn-grad text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
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
