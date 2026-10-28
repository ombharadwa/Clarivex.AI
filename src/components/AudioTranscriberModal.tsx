import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Copy, Check, Upload, X, Volume2, Sparkles } from 'lucide-react';

interface AudioTranscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTranscription?: (text: string) => void;
}

export const AudioTranscriberModal: React.FC<AudioTranscriberModalProps> = ({
  isOpen,
  onClose,
  onApplyTranscription,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [copied, setCopied] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      handleStopRecording();
      setTranscription('');
      setAudioUrl(null);
    }
  }, [isOpen]);

  const startRecording = async () => {
    try {
      setTranscription('');
      setAudioUrl(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Convert to base64 and send to gemini-3.5-transcribe
        await processAudioTranscription(audioBlob);

        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordDuration(0);

      timerRef.current = setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone access is required for audio transcription.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const processAudioTranscription = async (blob: Blob) => {
    setTranscribing(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const base64Data = await base64Promise;

      const res = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData: base64Data,
          mimeType: blob.type || 'audio/webm',
        }),
      });

      const data = await res.json();
      if (data.transcription) {
        setTranscription(data.transcription);
      } else {
        setTranscription('No transcription detected. Please speak clearly and try again.');
      }
    } catch (err) {
      console.error('Transcription error:', err);
      setTranscription('Could not process audio transcription. Please verify your connection.');
    } finally {
      setTranscribing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('Audio file must be under 20 MB.');
      return;
    }

    setAudioUrl(URL.createObjectURL(file));
    processAudioTranscription(file);
    e.target.value = '';
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
        {/* Glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF]" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 flex items-center justify-center text-[#A48BFF]">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[16px] text-white flex items-center gap-2">
                Audio Transcription
                <span className="text-[10px] font-bold text-[#00D4FF] bg-[#00D4FF]/10 px-2 py-0.5 rounded-full">
                  gemini-3.5-transcribe
                </span>
              </h3>
              <p className="text-[11px] text-[#8892B0]">
                Record with your microphone or upload audio to transcribe
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

        {/* Center Recording Area */}
        <div className="py-8 flex flex-col items-center justify-center border border-white/5 bg-[#0B1020]/60 rounded-2xl mb-6 text-center">
          {isRecording ? (
            <div className="space-y-4 flex flex-col items-center">
              <div className="relative">
                <span className="absolute -inset-3 rounded-full bg-red-500/20 animate-ping" />
                <button
                  onClick={handleStopRecording}
                  className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center relative z-10 shadow-lg shadow-red-500/30 cursor-pointer"
                >
                  <Square className="w-6 h-6 fill-current" />
                </button>
              </div>
              <div className="font-mono text-lg font-bold text-red-400">
                {formatTime(recordDuration)}
              </div>
              <p className="text-xs text-[#8892B0]">Listening... Click button to stop & transcribe</p>
            </div>
          ) : transcribing ? (
            <div className="space-y-3 flex flex-col items-center py-4">
              <Loader2 className="w-10 h-10 text-[#7C5CFF] animate-spin" />
              <p className="text-xs text-white font-medium">Transcribing audio with Gemini 3.5...</p>
            </div>
          ) : (
            <div className="space-y-4 flex flex-col items-center">
              <button
                onClick={startRecording}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all cursor-pointer"
              >
                <Mic className="w-7 h-7" />
              </button>
              <div className="text-xs font-semibold text-white">Click to start recording</div>
              <div className="flex items-center gap-2 text-xs text-[#8892B0]">
                <span>or</span>
                <label className="text-[#00D4FF] hover:underline cursor-pointer flex items-center gap-1 font-medium">
                  <Upload className="w-3.5 h-3.5" />
                  upload audio file (.mp3, .wav, .webm)
                  <input
                    type="file"
                    accept="audio/*,.mp3,.wav,.ogg,.m4a,.webm"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>
          )}

          {audioUrl && (
            <div className="mt-4 px-4 w-full">
              <audio src={audioUrl} controls className="w-full h-8 opacity-80" />
            </div>
          )}
        </div>

        {/* Transcription Output */}
        {transcription && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#8892B0] uppercase tracking-wider">
              <span>Transcription Output</span>
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
