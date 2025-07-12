import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import Waveform from "./Waveform";
import Spectrogram from "./Spectrogram";

const AudioPlayerSection = ({ id, title, audioPath, isDark, anomaly }) => {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const audio = new Audio(audioPath);
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("timeupdate", () =>
      setCurrentTime(audio.currentTime),
    );
    audio.addEventListener("ended", () => setIsPlaying(false));

    const fetchAudioBuffer = async () => {
      try {
        const ctx = new AudioContext();
        const res = await fetch(audioPath);
        const buf = await res.arrayBuffer();
        const decoded = await ctx.decodeAudioData(buf);
        setAudioBuffer(decoded);
      } catch (err) {
        console.warn("Could not decode audio for waveform", err);
      }
    };

    fetchAudioBuffer();

    return () => {
      audio.pause();
    };
  }, [audioPath]);

  useEffect(() => {
    if (anomaly) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [anomaly]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.volume = volume;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(setError);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !duration) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const newTime = percent * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const textColor = isDark ? "text-white" : "text-black";
  const bgColor = isDark ? "bg-black" : "bg-gray-100";

  return (
    <div className="space-y-6">
      <h1 className="title-section text-lg mb-3 text-gray-700">{title}</h1>

      {/* Controls */}
      <div
        className={`flex items-center gap-4 ${bgColor} p-2 rounded-full w-[60%]`}
      >
        <button
          onClick={togglePlay}
          disabled={!audioPath || error}
          className="w-8 h-8 text-black hover:opacity-80 transition-opacity disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            disabled={!audioPath || error}
            className="w-24 h-2 bg-gray-300 rounded-lg cursor-pointer slider-black"
          />
          <Volume2 className="w-5 h-5 text-black fill-black" />
        </div>
      </div>

      {/* Waveform */}
      <Waveform
        id={id}
        canvasRef={canvasRef}
        handleSeek={handleSeek}
        audioBuffer={audioBuffer}
        currentTime={currentTime}
        duration={duration}
      />

      {/* Spectrogram */}
      <div className="flex flex-col">
        <Spectrogram
          id={id}
          audioBuffer={audioBuffer}
          width={480}
          height={400}
        />
      </div>
    </div>
  );
};

export default AudioPlayerSection;
