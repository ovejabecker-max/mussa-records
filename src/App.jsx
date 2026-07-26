import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc } from 'lucide-react';

const GlitchStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @keyframes glitch-anim-1 {
      0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
      20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
      40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
      60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
      80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
      100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
    }
    @keyframes glitch-anim-2 {
      0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); }
      20% { clip-path: inset(30% 0 20% 0); transform: translate(-2px, 1px); }
      40% { clip-path: inset(70% 0 10% 0); transform: translate(2px, -2px); }
      60% { clip-path: inset(20% 0 50% 0); transform: translate(-2px, 2px); }
      80% { clip-path: inset(50% 0 30% 0); transform: translate(1px, -1px); }
      100% { clip-path: inset(5% 0 80% 0); transform: translate(-1px, 1px); }
    }
    .glitch-wrapper {
      position: relative;
      display: inline-block;
    }
    .glitch-wrapper::before, .glitch-wrapper::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: black;
    }
    .glitch-wrapper::before {
      left: 2px;
      text-shadow: -2px 0 #0ff;
      animation: glitch-anim-1 2s infinite linear alternate-reverse;
    }
    .glitch-wrapper::after {
      left: -2px;
      text-shadow: -2px 0 #f0f;
      animation: glitch-anim-2 3s infinite linear alternate-reverse;
    }
    .hover-glitch:hover {
      filter: url('#glitch-filter') contrast(150%) saturate(200%) hue-rotate(90deg);
      transform: skew(-2deg);
      transition: all 0.1s;
    }
    .grid-dense {
      grid-auto-flow: dense;
    }
    .crt-overlay {
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      background-size: 100% 2px, 3px 100%;
      pointer-events: none;
    }
  `}} />
);

const InteractiveCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      time += 0.05;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#0ff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      for (let i = 0; i < canvas.width; i += 10) {
        const y = canvas.height / 2 + Math.sin(i * 0.01 + time) * 100 * Math.sin(time * 0.5) + (Math.random() * 20 - 10);
        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();

      if (Math.random() > 0.9) {
        ctx.fillStyle = Math.random() > 0.5 ? '#f0f' : '#0ff';
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 100, Math.random() * 10);
      }

      animationFrameId = window.requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 opacity-40 pointer-events-none" />;
};

const AudioVisualizer = ({ isPlaying }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = 100;
    canvas.height = 40;

    const bars = Array.from({ length: 15 }, () => Math.random() * canvas.height);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0ff';

      bars.forEach((bar, i) => {
        const targetHeight = isPlaying ? Math.random() * canvas.height : 2;
        bars[i] += (targetHeight - bars[i]) * 0.2;
        
        ctx.fillRect(i * 7, canvas.height - bars[i], 5, bars[i]);
      });

      animationFrameId = window.requestAnimationFrame(draw);
    };
    draw();

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  return <canvas ref={canvasRef} className="ml-4 w-24 h-10" />;
};

const DISCOGRAPHY = [
  { id: '01', title: 'NEURAL_LINK', year: '2025', span: 'col-span-12 md:col-span-8 row-span-2', img: '10' },
  { id: '02', title: 'VOID.WAV', year: '2024', span: 'col-span-12 md:col-span-4 row-span-1', img: '20' },
  { id: '03', title: 'ANOMALY', year: '2023', span: 'col-span-12 md:col-span-4 row-span-2', img: '30' },
  { id: '04', title: 'SEVEN_FOUR', year: '2022', span: 'col-span-12 md:col-span-4 row-span-1', img: '40' },
  { id: '05', title: 'GLITCH_PROTOCOL', year: '2021', span: 'col-span-12 md:col-span-4 row-span-1', img: '50' },
];

const MANIATIC_WORKS = [
  {
    id: 'MB-001',
    title: 'HYPERDRIVE DRILL',
    style: 'Drill / Cinematic',
    bpm: 144,
    tone: 'F#m',
    trackIndex: 0,
    notes: 'Bajo modular, percusión fracturada y capas sintéticas con impacto de trailer.',
  },
  {
    id: 'MB-002',
    title: 'GHOST PROTOCOL TRAP',
    style: 'Trap / Dark',
    bpm: 138,
    tone: 'Cm',
    trackIndex: 3,
    notes: 'Melodías sombrías, 808 agresivo y texturas vocales distorsionadas.',
  },
  {
    id: 'MB-003',
    title: 'NEON RAGE',
    style: 'Hypertrap / Rage',
    bpm: 160,
    tone: 'Dm',
    trackIndex: 5,
    notes: 'Leads digitales, glitches sincronizados y energía alta para hooks vocales.',
  },
];

const BEAT_STORE = [
  {
    sku: 'BT-011',
    name: 'SYNAPTIC CODE',
    format: 'WAV + STEMS',
    lease: '$49',
    exclusive: '$299',
    mood: 'Agresivo / Futurista',
    bpm: 150,
  },
  {
    sku: 'BT-021',
    name: 'VANTA SIGNAL',
    format: 'WAV + MP3',
    lease: '$39',
    exclusive: '$249',
    mood: 'Oscuro / Cinemático',
    bpm: 136,
  },
  {
    sku: 'BT-034',
    name: 'NEXUS BLOODLINE',
    format: 'WAV + STEMS + MIDI',
    lease: '$59',
    exclusive: '$349',
    mood: 'Épico / Melódico',
    bpm: 128,
  },
];

const TRACKS = [
  {
    id: 'T-01',
    title: 'SPOTIFY // TRACK_01',
    source: 'Spotify',
    provider: 'spotify',
    spotifyUri: 'spotify:track:4UXh8xYt75DBVsBGSQPZpo',
    spotifyUrl: 'https://open.spotify.com/track/4UXh8xYt75DBVsBGSQPZpo?utm_source=generator&theme=0',
    previewSrc: 'https://open.spotify.com/embed/track/4UXh8xYt75DBVsBGSQPZpo?utm_source=generator&theme=0',
    allow: 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
  },
  {
    id: 'T-02',
    title: 'SPOTIFY // TRACK_02',
    source: 'Spotify',
    provider: 'spotify',
    spotifyUri: 'spotify:track:6Ln6fOUdjqbXjbgSIvx8AV',
    spotifyUrl: 'https://open.spotify.com/track/6Ln6fOUdjqbXjbgSIvx8AV?utm_source=generator&theme=0',
    previewSrc: 'https://open.spotify.com/embed/track/6Ln6fOUdjqbXjbgSIvx8AV?utm_source=generator&theme=0',
    allow: 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
  },
  {
    id: 'T-03',
    title: 'SPOTIFY // TRACK_03',
    source: 'Spotify',
    provider: 'spotify',
    spotifyUri: 'spotify:track:3QquXggtCbmOUcBVKK5PYC',
    spotifyUrl: 'https://open.spotify.com/track/3QquXggtCbmOUcBVKK5PYC?utm_source=generator&theme=0',
    previewSrc: 'https://open.spotify.com/embed/track/3QquXggtCbmOUcBVKK5PYC?utm_source=generator&theme=0',
    allow: 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
  },
  {
    id: 'T-04',
    title: 'SOUNDCLOUD // necrofusion-indigo',
    source: 'SoundCloud',
    provider: 'soundcloud',
    soundcloudUrl: 'https://soundcloud.com/necrofusion/necrofusion-indigo',
    previewSrc: 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/necrofusion/necrofusion-indigo&color=%2300ffff&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false',
    allow: 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
  },
  {
    id: 'T-05',
    title: 'YOUTUBE // H4csyG7-hjk',
    source: 'YouTube',
    provider: 'youtube',
    videoId: 'H4csyG7-hjk',
    previewSrc: 'https://www.youtube.com/embed/H4csyG7-hjk',
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
  },
  {
    id: 'T-06',
    title: 'YOUTUBE // 68LoY53VvWo',
    source: 'YouTube',
    provider: 'youtube',
    videoId: '68LoY53VvWo',
    previewSrc: 'https://www.youtube.com/embed/68LoY53VvWo',
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
  },
];

const buildSoundCloudEmbedSrc = (url) =>
  `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%2300ffff&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false&enable_api=true`;

const SOUNDCLOUD_INITIAL_TRACK = TRACKS.find((track) => track.provider === 'soundcloud');

export default function App() {
  const currentTrackRef = useRef(TRACKS[0]);
  const youtubeHostRef = useRef(null);
  const spotifyHostRef = useRef(null);
  const soundcloudIframeRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const spotifyControllerRef = useRef(null);
  const soundcloudWidgetRef = useRef(null);
  const soundcloudApiReadyRef = useRef(false);
  const lastNonZeroVolumeRef = useRef(70);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [youtubeReady, setYoutubeReady] = useState(false);
  const [spotifyReady, setSpotifyReady] = useState(false);
  const [soundcloudReady, setSoundcloudReady] = useState(false);
  const [pendingAutoplay, setPendingAutoplay] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [playerNotice, setPlayerNotice] = useState('Inicializando barra de reproducción...');
  const currentTrack = TRACKS[currentTrackIndex];

  const supportsVolumeControl = currentTrack.provider !== 'spotify';

  const loadYouTubeTrack = (track, autoplay = true) => {
    const player = youtubePlayerRef.current;
    if (!player || !youtubeReady) {
      setPlayerNotice('YouTube aún no está listo.');
      return false;
    }
    if (autoplay) {
      player.loadVideoById(track.videoId);
    } else {
      player.cueVideoById(track.videoId);
    }
    return true;
  };

  const loadSpotifyTrack = (track, autoplay = true) => {
    const controller = spotifyControllerRef.current;
    if (!controller || !spotifyReady) {
      setPlayerNotice('Spotify aún no está listo.');
      return false;
    }
    if (typeof controller.loadEntity === 'function') {
      controller.loadEntity(track.spotifyUrl || track.spotifyUri);
    } else if (typeof controller.loadUri === 'function') {
      controller.loadUri(track.spotifyUri);
    }
    if (autoplay) {
      if (typeof controller.resume === 'function') {
        controller.resume();
      } else if (typeof controller.play === 'function') {
        controller.play();
      }
    }
    return true;
  };

  const loadSoundCloudTrack = (track, autoplay = true) => {
    const widget = soundcloudWidgetRef.current;
    if (!widget || !soundcloudReady) {
      setPlayerNotice('SoundCloud aún no está listo.');
      return false;
    }
    widget.load(track.soundcloudUrl, {
      auto_play: autoplay,
      hide_related: true,
      show_comments: false,
      show_user: true,
      show_reposts: false,
      show_teaser: false,
      visual: false,
      color: '#00ffff',
    });
    return true;
  };

  const loadCurrentTrack = (autoplay = true) => {
    if (currentTrack.provider === 'youtube') {
      return loadYouTubeTrack(currentTrack, autoplay);
    }
    if (currentTrack.provider === 'spotify') {
      return loadSpotifyTrack(currentTrack, autoplay);
    }
    if (currentTrack.provider === 'soundcloud') {
      return loadSoundCloudTrack(currentTrack, autoplay);
    }
    return false;
  };

  const pauseOtherProviders = (nextProvider) => {
    if (nextProvider !== 'youtube' && youtubePlayerRef.current) {
      youtubePlayerRef.current.pauseVideo();
    }
    if (nextProvider !== 'spotify' && spotifyControllerRef.current && typeof spotifyControllerRef.current.pause === 'function') {
      spotifyControllerRef.current.pause();
    }
    if (nextProvider !== 'soundcloud' && soundcloudWidgetRef.current) {
      soundcloudWidgetRef.current.pause();
    }
  };

  const playTrackAtIndex = (index) => {
    const selectedTrack = TRACKS[index];
    if (selectedTrack) {
      pauseOtherProviders(selectedTrack.provider);
    }
    setCurrentTrackIndex(index);
    setPendingAutoplay(true);
  };

  const handlePreviousTrack = () => {
    const previousIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    playTrackAtIndex(previousIndex);
  };

  const handleNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % TRACKS.length;
    playTrackAtIndex(nextIndex);
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      const loaded = loadCurrentTrack(true);
      if (!loaded) {
        setPendingAutoplay(true);
      }
      return;
    }

    if (currentTrack.provider === 'youtube' && youtubePlayerRef.current) {
      youtubePlayerRef.current.pauseVideo();
      return;
    }

    if (currentTrack.provider === 'spotify' && spotifyControllerRef.current && typeof spotifyControllerRef.current.pause === 'function') {
      spotifyControllerRef.current.pause();
      return;
    }

    if (currentTrack.provider === 'soundcloud' && soundcloudWidgetRef.current) {
      soundcloudWidgetRef.current.pause();
    }
  };

  const handleToggleMute = () => {
    if (!supportsVolumeControl) {
      setPlayerNotice('Spotify no expone mute/volumen por API en este embed.');
      return;
    }

    if (isMuted) {
      const restoredVolume = lastNonZeroVolumeRef.current || 70;
      if (currentTrack.provider === 'youtube' && youtubePlayerRef.current) {
        youtubePlayerRef.current.unMute();
        youtubePlayerRef.current.setVolume(restoredVolume);
      } else if (currentTrack.provider === 'soundcloud' && soundcloudWidgetRef.current) {
        soundcloudWidgetRef.current.setVolume(restoredVolume);
      }
      setVolume(restoredVolume);
      setIsMuted(false);
      return;
    }

    if (volume > 0) {
      lastNonZeroVolumeRef.current = volume;
    }
    if (currentTrack.provider === 'youtube' && youtubePlayerRef.current) {
      youtubePlayerRef.current.mute();
    } else if (currentTrack.provider === 'soundcloud' && soundcloudWidgetRef.current) {
      soundcloudWidgetRef.current.setVolume(0);
    }
    setVolume(0);
    setIsMuted(true);
  };

  const handleVolumeChange = (event) => {
    if (!supportsVolumeControl) {
      setPlayerNotice('Spotify no permite controlar volumen desde esta barra.');
      return;
    }

    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);
    if (nextVolume > 0) {
      lastNonZeroVolumeRef.current = nextVolume;
    }

    if (currentTrack.provider === 'youtube' && youtubePlayerRef.current) {
      youtubePlayerRef.current.setVolume(nextVolume);
      if (nextVolume === 0) {
        youtubePlayerRef.current.mute();
      } else {
        youtubePlayerRef.current.unMute();
      }
    } else if (currentTrack.provider === 'soundcloud' && soundcloudWidgetRef.current) {
      soundcloudWidgetRef.current.setVolume(nextVolume);
    }

    setIsMuted(nextVolume === 0);
  };

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    let disposed = false;

    const initYouTube = () => {
      if (disposed || !youtubeHostRef.current || youtubePlayerRef.current || !window.YT || !window.YT.Player) {
        return;
      }
      youtubePlayerRef.current = new window.YT.Player(youtubeHostRef.current, {
        videoId: TRACKS.find((track) => track.provider === 'youtube')?.videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            if (disposed) {
              return;
            }
            setYoutubeReady(true);
            event.target.setVolume(volume);
          },
          onStateChange: (event) => {
            if (!window.YT || currentTrackRef.current.provider !== 'youtube') {
              return;
            }
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setPlayerNotice(`Reproduciendo ${currentTrackRef.current.title}`);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              setPlayerNotice('Pausado');
            } else if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              setPlayerNotice('Finalizado');
              setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
              setPendingAutoplay(true);
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initYouTube();
    } else {
      const script = document.querySelector('script[data-yt-player-api="true"]') || document.createElement('script');
      if (!script.dataset.ytPlayerApi) {
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        script.dataset.ytPlayerApi = 'true';
        document.body.appendChild(script);
      }
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previousReady === 'function') {
          previousReady();
        }
        initYouTube();
      };
    }

    return () => {
      disposed = true;
    };
  }, [volume]);

  useEffect(() => {
    let disposed = false;

    const initSpotifyController = (IFrameAPI) => {
      if (disposed || !spotifyHostRef.current || spotifyControllerRef.current) {
        return;
      }
      const firstSpotifyTrack = TRACKS.find((track) => track.provider === 'spotify');
      if (!firstSpotifyTrack) {
        return;
      }
      IFrameAPI.createController(
        spotifyHostRef.current,
        {
          uri: firstSpotifyTrack.spotifyUri,
          width: '100%',
          height: 80,
        },
        (EmbedController) => {
          if (disposed) {
            return;
          }
          spotifyControllerRef.current = EmbedController;
          setSpotifyReady(true);
          if (typeof EmbedController.addListener === 'function') {
            EmbedController.addListener('playback_started', () => {
              if (currentTrackRef.current.provider !== 'spotify') {
                return;
              }
              setIsPlaying(true);
              setPlayerNotice(`Reproduciendo ${currentTrackRef.current.title}`);
            });
            EmbedController.addListener('playback_update', (event) => {
              if (currentTrackRef.current.provider !== 'spotify') {
                return;
              }
              const paused = Boolean(event?.data?.isPaused);
              setIsPlaying(!paused);
              setPlayerNotice(paused ? 'Pausado' : `Reproduciendo ${currentTrackRef.current.title}`);
            });
          }
        }
      );
    };

    if (window.SpotifyIframeApi) {
      initSpotifyController(window.SpotifyIframeApi);
    } else {
      const script = document.querySelector('script[data-spotify-iframe-api="true"]') || document.createElement('script');
      if (!script.dataset.spotifyIframeApi) {
        script.src = 'https://open.spotify.com/embed/iframe-api/v1';
        script.async = true;
        script.dataset.spotifyIframeApi = 'true';
        document.body.appendChild(script);
      }
      const previousReady = window.onSpotifyIframeApiReady;
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        window.SpotifyIframeApi = IFrameAPI;
        if (typeof previousReady === 'function') {
          previousReady(IFrameAPI);
        }
        initSpotifyController(IFrameAPI);
      };
    }

    return () => {
      disposed = true;
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    const bindSoundCloudWidget = () => {
      if (
        disposed ||
        !soundcloudIframeRef.current ||
        !window.SC ||
        !window.SC.Widget ||
        soundcloudWidgetRef.current
      ) {
        return;
      }
      const widget = window.SC.Widget(soundcloudIframeRef.current);
      soundcloudWidgetRef.current = widget;

      widget.bind(window.SC.Widget.Events.READY, () => {
        if (disposed) {
          return;
        }
        setSoundcloudReady(true);
        soundcloudApiReadyRef.current = true;
        widget.setVolume(volume);
      });
      widget.bind(window.SC.Widget.Events.PLAY, () => {
        if (currentTrackRef.current.provider !== 'soundcloud') {
          return;
        }
        setIsPlaying(true);
        setPlayerNotice(`Reproduciendo ${currentTrackRef.current.title}`);
      });
      widget.bind(window.SC.Widget.Events.PAUSE, () => {
        if (currentTrackRef.current.provider !== 'soundcloud') {
          return;
        }
        setIsPlaying(false);
        setPlayerNotice('Pausado');
      });
      widget.bind(window.SC.Widget.Events.FINISH, () => {
        if (currentTrackRef.current.provider !== 'soundcloud') {
          return;
        }
        setIsPlaying(false);
        setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
        setPendingAutoplay(true);
      });
    };

    if (window.SC && window.SC.Widget) {
      bindSoundCloudWidget();
    } else {
      const script = document.querySelector('script[data-soundcloud-widget-api="true"]') || document.createElement('script');
      if (!script.dataset.soundcloudWidgetApi) {
        script.src = 'https://w.soundcloud.com/player/api.js';
        script.async = true;
        script.dataset.soundcloudWidgetApi = 'true';
        script.onload = bindSoundCloudWidget;
        document.body.appendChild(script);
      } else {
        script.addEventListener('load', bindSoundCloudWidget, { once: true });
      }
    }

    return () => {
      disposed = true;
    };
  }, [volume]);

  useEffect(() => {
    setIsPlaying(false);
    setPlayerNotice(`Seleccionado ${currentTrack.title}`);
    setIsMuted(false);
  }, [currentTrackIndex, currentTrack.title]);

  useEffect(() => {
    if (!pendingAutoplay) {
      return;
    }
    const started = loadCurrentTrack(true);
    if (started) {
      setPendingAutoplay(false);
    }
  }, [pendingAutoplay, currentTrackIndex, youtubeReady, spotifyReady, soundcloudReady]);

  useEffect(() => {
    if (!supportsVolumeControl || !soundcloudApiReadyRef.current) {
      return;
    }
    if (currentTrack.provider === 'soundcloud' && soundcloudWidgetRef.current) {
      soundcloudWidgetRef.current.setVolume(volume);
    }
  }, [currentTrack.provider, supportsVolumeControl, volume]);

  useEffect(() => {
    return () => {
      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.destroy === 'function') {
        youtubePlayerRef.current.destroy();
        youtubePlayerRef.current = null;
      }
      if (spotifyControllerRef.current && typeof spotifyControllerRef.current.destroy === 'function') {
        spotifyControllerRef.current.destroy();
        spotifyControllerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      <GlitchStyles />
      <InteractiveCanvas />
      
      <div className="fixed top-0 left-0 w-full h-full crt-overlay z-50 pointer-events-none"></div>

      <svg className="hidden">
        <filter id="glitch-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <main className="relative z-10 p-6 md:p-12 pb-32">
        
        <header className="mb-24 mt-12 flex flex-col items-start">
          <p className="text-cyan-400 text-sm tracking-[0.3em] mb-4 uppercase">[ Inicializando Sistema ]</p>
          <h1 
            className="text-5xl md:text-8xl font-black tracking-tighter uppercase glitch-wrapper" 
            data-text="MUSSA_RECORDS"
          >
            MUSSA_RECORDS
          </h1>
          <h2 className="text-xl md:text-3xl text-gray-400 mt-2 tracking-widest">Producción Musical // Diseño Sonoro</h2>
        </header>

        <section className="mb-16">
          <h3 className="text-lg md:text-xl text-cyan-400 font-bold uppercase tracking-widest mb-6 flex items-center">
            <span className="animate-pulse mr-3 h-2 w-2 bg-red-500 border border-red-300"></span>
            [ Interceptando_Señales_Externas ]
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full relative">
            {TRACKS.map((track, index) => (
              <div key={track.id} className="border border-gray-900 p-1 bg-black transition-colors hover:border-cyan-900/50 group">
                <div className="relative">
                  <iframe
                    style={{ borderRadius: '0px' }}
                    src={track.previewSrc}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allowFullScreen
                    allow={track.allow}
                    loading="lazy"
                    className="opacity-75 group-hover:opacity-100 grayscale-[80%] group-hover:grayscale-0 transition-all duration-700 object-cover pointer-events-none"
                    title={`preview-${track.id}`}
                  ></iframe>
                  <div className="absolute inset-0 flex items-end justify-start p-2 bg-gradient-to-t from-black/65 to-transparent pointer-events-none">
                    <span className="text-[10px] text-cyan-300 uppercase tracking-wider">Preview bloqueado · usar barra inferior</span>
                  </div>
                </div>
                <div className="p-2 flex items-center justify-between gap-2 border-t border-gray-900">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider truncate">{track.source}</span>
                  <button
                    onClick={() => playTrackAtIndex(index)}
                    className="text-xs border border-cyan-900/60 px-2 py-1 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                  >
                    Cargar_en_Barra
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
            <h3 className="text-2xl text-magenta-500 font-bold uppercase tracking-widest">
              <span className="text-cyan-400 mr-2">&gt;</span> Archivos_Extraidos
            </h3>
            <span className="text-xs text-gray-600 uppercase">Total: {DISCOGRAPHY.length} Objetos</span>
          </div>

          <div className="grid grid-cols-12 gap-4 grid-dense">
            {DISCOGRAPHY.map((album, index) => (
              <div
                key={album.id}
                className={`${album.span} relative group cursor-pointer border border-gray-900 bg-gray-950 overflow-hidden hover-glitch flex flex-col`}
                onClick={() => playTrackAtIndex(index % TRACKS.length)}
              >
                <div className="flex-grow w-full min-h-[200px] bg-gray-900 relative">
                  <img
                    src={`https://picsum.photos/seed/${album.img}/800/600`}
                    alt={album.title}
                    className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-luminosity opacity-60 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>
                
                <div className="p-4 bg-black/80 backdrop-blur-sm border-t border-gray-800 absolute bottom-0 w-full">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs text-cyan-500 mb-1 block">OBJ_ID: {album.id}</span>
                      <h4 className="text-xl font-bold uppercase tracking-wider">{album.title}</h4>
                    </div>
                    <span className="text-sm text-gray-500 font-bold">{album.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 mb-24">
          <div className="relative border border-cyan-900/60 bg-black/80 p-8 md:p-10 overflow-hidden">
            <div className="absolute -top-28 -right-24 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-12 w-64 h-64 bg-fuchsia-500/10 blur-3xl rounded-full pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-gray-800 pb-6 mb-8">
                <div className="text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-[0.28em] mb-3">Unidad de Producción Avanzada</p>
                  <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-cyan-300">
                    BEAT MAKER // MANIATIC BEAT
                  </h3>
                  <p className="text-sm text-gray-400 mt-3 max-w-2xl">
                    Arquitectura sonora de alto rendimiento: diseño de beats, mezcla creativa y texturas
                    experimentales para artistas que buscan identidad propia.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center min-w-[240px]">
                  <div className="border border-gray-800 bg-black/70 p-3">
                    <p className="text-cyan-400 text-lg font-bold">120+</p>
                    <p className="text-[10px] text-gray-500 uppercase">Beats</p>
                  </div>
                  <div className="border border-gray-800 bg-black/70 p-3">
                    <p className="text-fuchsia-400 text-lg font-bold">5 años</p>
                    <p className="text-[10px] text-gray-500 uppercase">Experiencia</p>
                  </div>
                  <div className="border border-gray-800 bg-black/70 p-3">
                    <p className="text-emerald-400 text-lg font-bold">24h</p>
                    <p className="text-[10px] text-gray-500 uppercase">Respuesta</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-7 space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-left text-sm text-cyan-300 uppercase tracking-[0.2em]">Trabajos Destacados</h4>
                    <span className="text-[10px] text-gray-600 uppercase">Preview en la barra inferior</span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {MANIATIC_WORKS.map((work) => (
                      <article key={work.id} className="border border-gray-800 bg-black/60 p-4 text-left hover:border-cyan-500/50 transition-colors">
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.18em] mb-2">{work.id}</p>
                        <h5 className="text-base text-white font-bold uppercase leading-tight mb-2">{work.title}</h5>
                        <p className="text-xs text-gray-400 mb-3">{work.notes}</p>
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest mb-4">
                          <span className="border border-gray-700 px-2 py-1 text-gray-300">{work.style}</span>
                          <span className="border border-gray-700 px-2 py-1 text-cyan-300">{work.bpm} BPM</span>
                          <span className="border border-gray-700 px-2 py-1 text-fuchsia-300">{work.tone}</span>
                        </div>
                        <button
                          onClick={() => playTrackAtIndex(work.trackIndex)}
                          className="w-full border border-cyan-900/70 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-cyan-300 hover:border-cyan-400 hover:text-cyan-100 transition-colors"
                        >
                          Cargar Preview
                        </button>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="xl:col-span-5 border border-gray-800 bg-black/50 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="text-sm text-fuchsia-300 uppercase tracking-[0.2em] text-left">Beat Store</h4>
                    <span className="text-[10px] text-gray-600 uppercase">Licencias Digitales</span>
                  </div>
                  <div className="space-y-4">
                    {BEAT_STORE.map((beat) => (
                      <article key={beat.sku} className="border border-gray-800 p-4 text-left bg-black/60">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">{beat.sku}</p>
                            <h5 className="text-sm text-white font-bold uppercase tracking-wide">{beat.name}</h5>
                          </div>
                          <span className="text-[10px] border border-gray-700 px-2 py-1 text-gray-300 uppercase">{beat.bpm} BPM</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">{beat.mood} · {beat.format}</p>
                        <div className="grid grid-cols-2 gap-2 text-[11px] uppercase tracking-wider mb-3">
                          <div className="border border-gray-800 p-2">
                            <p className="text-gray-500 text-[10px]">Lease</p>
                            <p className="text-cyan-300 font-bold">{beat.lease}</p>
                          </div>
                          <div className="border border-gray-800 p-2">
                            <p className="text-gray-500 text-[10px]">Exclusive</p>
                            <p className="text-fuchsia-300 font-bold">{beat.exclusive}</p>
                          </div>
                        </div>
                        <a
                          href={`mailto:hola@mussarecords.com?subject=Compra%20Beat%20${encodeURIComponent(beat.name)}`}
                          className="inline-block w-full text-center border border-fuchsia-900/70 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-fuchsia-300 hover:border-fuchsia-400 hover:text-fuchsia-100 transition-colors"
                        >
                          Comprar Beat
                        </a>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 text-left">
                <div className="border border-gray-800 bg-black/60 p-4">
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.22em] mb-2">Contacto Directo</p>
                  <a
                    href="mailto:hola@mussarecords.com"
                    className="text-cyan-300 hover:text-cyan-100 transition-colors text-sm break-all"
                  >
                    hola@mussarecords.com
                  </a>
                </div>
                <div className="border border-gray-800 bg-black/60 p-4">
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.22em] mb-2">Instagram</p>
                  <a
                    href="https://www.instagram.com/maniaticbeat"
                    target="_blank"
                    rel="noreferrer"
                    className="text-fuchsia-300 hover:text-fuchsia-100 transition-colors text-sm"
                  >
                    @maniaticbeat
                  </a>
                </div>
                <div className="border border-gray-800 bg-black/60 p-4">
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.22em] mb-2">Formato de Pedido</p>
                  <p className="text-sm text-gray-300">Enviá referencia, BPM objetivo, tonalidad y fecha de entrega.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 mb-24">
          <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
            <h3 className="text-2xl text-cyan-400 font-bold uppercase tracking-widest">
              <span className="text-magenta-500 mr-2">&gt;</span> CONTACTO
            </h3>
            <span className="text-xs text-gray-600 uppercase">Canal_Abierto</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="border border-gray-900 bg-black/80 p-6">
              <p className="text-xs text-gray-500 uppercase tracking-[0.22em] mb-3">Transmisión Directa</p>
              <p className="text-sm text-gray-300 mb-4">
                Si querés producir, mezclar o diseñar sonido para tu proyecto, enviá un mensaje y coordinamos una sesión.
              </p>
              <a
                href="mailto:hola@mussarecords.com"
                className="inline-block border border-cyan-900/70 px-4 py-2 text-xs uppercase tracking-widest text-cyan-300 hover:border-cyan-400 hover:text-cyan-100 transition-colors"
              >
                hola@mussarecords.com
              </a>
            </div>

            <div className="border border-gray-900 bg-black/80 p-6">
              <p className="text-xs text-gray-500 uppercase tracking-[0.22em] mb-3">Redes // Plataformas</p>
              <div className="space-y-3 text-sm">
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="block border border-gray-800 px-3 py-2 text-gray-300 hover:border-magenta-500/70 hover:text-white transition-colors"
                >
                  INSTAGRAM
                </a>
                <a
                  href="https://soundcloud.com"
                  target="_blank"
                  rel="noreferrer"
                  className="block border border-gray-800 px-3 py-2 text-gray-300 hover:border-cyan-500/70 hover:text-white transition-colors"
                >
                  SOUNDCLOUD
                </a>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="block border border-gray-800 px-3 py-2 text-gray-300 hover:border-red-500/70 hover:text-white transition-colors"
                >
                  YOUTUBE
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-md border-t border-cyan-900/50 p-4 z-50 flex flex-col md:flex-row items-center justify-between shadow-[0_-10px_30px_rgba(0,255,255,0.05)]">
        
        <div className="w-full md:w-[38%] mb-4 md:mb-0">
          <div className="relative border border-cyan-900/50 bg-gradient-to-br from-cyan-950/20 via-black to-fuchsia-950/20 p-3 md:p-4 overflow-hidden">
            <div className="absolute -top-10 -left-6 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-6 w-32 h-32 bg-fuchsia-500/10 blur-2xl rounded-full pointer-events-none"></div>

            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-12 h-12 border border-cyan-700/60 bg-black flex items-center justify-center relative overflow-hidden shrink-0 shadow-[0_0_18px_rgba(34,211,238,0.18)]">
                    <Disc className={`w-6 h-6 text-cyan-300 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.18em]">Reproduciendo_Ahora</p>
                    <p className="text-sm font-bold text-white truncate">{currentTrack.title}</p>
                    <p className="text-[10px] text-gray-400 uppercase truncate">{playerNotice}</p>
                  </div>
                </div>
                <div className={`text-[10px] uppercase tracking-[0.16em] px-2 py-1 border ${isPlaying ? 'text-emerald-300 border-emerald-500/50' : 'text-gray-500 border-gray-700'}`}>
                  {isPlaying ? 'Live' : 'Standby'}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest text-gray-300">
                <span className="border border-gray-700 px-2 py-1">{currentTrack.source}</span>
                <span className="border border-cyan-900/60 px-2 py-1 text-cyan-300">Vol {volume}%</span>
                <span className="border border-fuchsia-900/60 px-2 py-1 text-fuchsia-300">{supportsVolumeControl ? 'Control Activo' : 'Control Limitado'}</span>
              </div>

              <div className="w-full h-24 border border-gray-800 bg-black relative overflow-hidden">
                <div className={`absolute inset-0 w-full h-full ${currentTrack.provider === 'youtube' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                  <div ref={youtubeHostRef} className="w-full h-full" />
                </div>
                <div className={`absolute inset-0 w-full h-full ${currentTrack.provider === 'spotify' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                  <div ref={spotifyHostRef} className="w-full h-full" />
                </div>
                <div className={`absolute inset-0 w-full h-full ${currentTrack.provider === 'soundcloud' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                  <iframe
                    ref={soundcloudIframeRef}
                    title="soundcloud-player"
                    src={SOUNDCLOUD_INITIAL_TRACK ? buildSoundCloudEmbedSrc(SOUNDCLOUD_INITIAL_TRACK.soundcloudUrl) : ''}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay"
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center w-full md:w-1/3 gap-6">
          <button onClick={handlePreviousTrack} className="text-gray-500 hover:text-cyan-400 transition-colors"><SkipBack size={20} /></button>
          <button 
            onClick={handlePlayPause}
            className="w-12 h-12 bg-white text-black flex items-center justify-center rounded-none hover:bg-cyan-400 hover:scale-105 transition-all"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={handleNextTrack} className="text-gray-500 hover:text-cyan-400 transition-colors"><SkipForward size={20} /></button>
        </div>

        <div className="flex items-center justify-end w-full md:w-1/3 mt-4 md:mt-0 gap-3">
          <div className="flex items-center gap-2">
            <button onClick={handleToggleMute} className={`transition-colors ${supportsVolumeControl ? 'text-gray-500 hover:text-cyan-400' : 'text-gray-700 cursor-not-allowed'}`}>
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              disabled={!supportsVolumeControl}
              className="w-20 accent-cyan-400 disabled:opacity-40"
              aria-label="Volumen del reproductor"
            />
          </div>
          <AudioVisualizer isPlaying={isPlaying} />
        </div>
      </div>
    </div>
  );
}