import React, { useEffect, useRef, useState } from 'react'
import { Play, Pause, Download, Volume2, VolumeX } from 'lucide-react'

interface AudioPlayerProps {
  src: string
  title?: string
  className?: string
}

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title, className = '' }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(audio.duration || 0)
    const onEnd = () => setPlaying(false)
    const onErr = () => setError('Unable to load audio')

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('error', onErr)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('error', onErr)
    }
  }, [src])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch((err) => setError(err.message || 'Playback failed'))
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const value = Number(e.target.value)
    audio.currentTime = value
    setCurrentTime(value)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setMuted(audio.muted)
  }

  if (!src) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500 ${className}`}>
        Audio not available for this episode yet.
      </div>
    )
  }

  return (
    <div className={`bg-gray-900 text-white rounded-lg p-4 ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      {title && <div className="text-sm font-medium mb-3 truncate">{title}</div>}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-500 rounded-full transition-colors"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={onSeek}
            className="w-full accent-blue-500"
            disabled={!duration}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleMute}
          className="p-2 hover:bg-gray-800 rounded"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <a
          href={src}
          download
          className="p-2 hover:bg-gray-800 rounded"
          aria-label="Download"
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="w-4 h-4" />
        </a>
      </div>
      {error && <div className="text-xs text-red-400 mt-2">{error}</div>}
    </div>
  )
}

export default AudioPlayer
