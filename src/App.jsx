import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc, ExternalLink, ListMusic, Radio } from 'lucide-react';

const GlitchStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    @keyframes glitch-anim-1 {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(1px, -1px); }
    }
    @keyframes glitch-anim-2 {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(-1px, 1px); }
    }
    .glitch-wrapper::before {
      animation: glitch-anim-1 4s infinite linear;
    }
    .glitch-wrapper::after {
      animation: glitch-anim-2 5s infinite linear;
    }
  `,
    }}
  />
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

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 opacity-20 pointer-events-none" />;
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
  const [playerNotice, setPlayerNotice] = useState('Inicializando sistema inmersivo de reproducción...');
  const currentTrack = TRACKS[currentTrackIndex];
  const currentTrackLink = currentTrack.spotifyUrl || currentTrack.soundcloudUrl || (currentTrack.videoId ? `https://www.youtube.com/watch?v=${currentTrack.videoId}` : '');

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
      setPlayerNotice('Spotify no permite controlar volumen en este modo embed.');
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
    <div className="app-shell font-sans selection:bg-cyan-300 selection:text-slate-950">
      <GlitchStyles />
      <InteractiveCanvas />

      <div className="fixed inset-0 crt-overlay z-0 pointer-events-none" />

      <main className="page-shell">
        <header className="hero-shell">
          <div className="panel hero-copy">
            <p className="eyebrow">
              <Radio size={14} />
              Sistema de reproducción
            </p>
            <h1 className="glitch-wrapper" data-text="MUSSA_RECORDS">
              MUSSA_RECORDS
            </h1>
            <h2>Producción musical // diseño sonoro // identidad de alto contraste</h2>
            <p>
              Un sitio más limpio, inmersivo y orientado a conversión: el reproductor queda al centro
              de la experiencia y el resto del contenido acompaña con jerarquía visual clara.
            </p>
            <div className="hero-actions">
              <button className="button-primary" onClick={() => playTrackAtIndex(0)}>
                Escuchar ahora
              </button>
              <a className="button-secondary" href="mailto:hola@mussarecords.com">
                Contactar
              </a>
            </div>
          </div>

          <aside className="panel hero-insight">
            <div className="metric-grid">
              <div className="metric">
                <strong>{TRACKS.length}</strong>
                <span>fuentes activas</span>
              </div>
              <div className="metric">
                <strong>{DISCOGRAPHY.length}</strong>
                <span>archivos visuales</span>
              </div>
              <div className="metric">
                <strong>{MANIATIC_WORKS.length}</strong>
                <span>trabajos destacados</span>
              </div>
            </div>
            <div className="panel" style={{ padding: '1rem' }}>
              <p className="signal-note">Estado del sistema</p>
              <h3 style={{ fontSize: '1.25rem', marginTop: '0.35rem' }}>{isPlaying ? 'Emisión en vivo' : 'Modo standby'}</h3>
              <p style={{ marginTop: '0.45rem', color: 'var(--text)' }}>{playerNotice}</p>
            </div>
          </aside>
        </header>

        <section className="section-block">
          <div className="panel player-card">
            <div className="player-main">
              <div className="player-topline">
                <p className="eyebrow" style={{ marginBottom: 0 }}>
                  <Radio size={14} />
                  Immersive Player
                </p>
                <span className={`chip ${isPlaying ? 'chip--live' : 'chip--muted'}`}>{isPlaying ? 'Live' : 'Standby'}</span>
              </div>

              <div className="now-playing">
                <div className="disc-shell">
                  <Disc className={`${isPlaying ? 'animate-spin' : ''}`} size={34} style={{ animationDuration: '3s' }} />
                </div>
                <div>
                  <p className="track-kicker">Reproduciendo ahora</p>
                  <h3 className="track-title">{currentTrack.title}</h3>
                  <p className="track-copy">{playerNotice}</p>
                  <div className="track-meta">
                    <span className="chip">{currentTrack.source}</span>
                    <span className="chip">Vol {volume}%</span>
                    <span className="chip">{supportsVolumeControl ? 'Control activo' : 'Control limitado'}</span>
                  </div>
                </div>
              </div>

              <div className="transport">
                <button onClick={handlePreviousTrack} className="icon-button" aria-label="Pista anterior">
                  <SkipBack size={20} />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="icon-button icon-button--primary"
                  aria-label={isPlaying ? 'Pausar pista' : 'Reproducir pista'}
                >
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>
                <button onClick={handleNextTrack} className="icon-button" aria-label="Siguiente pista">
                  <SkipForward size={20} />
                </button>
                {currentTrackLink && (
                  <a href={currentTrackLink} target="_blank" rel="noreferrer" className="source-link">
                    Abrir fuente
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              <div className="volume-block">
                <button
                  onClick={handleToggleMute}
                  className={`icon-button ${supportsVolumeControl ? '' : 'opacity-50 cursor-not-allowed'}`}
                  aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  disabled={!supportsVolumeControl}
                  className="volume-slider"
                  aria-label="Volumen del reproductor"
                />
                <AudioVisualizer isPlaying={isPlaying} />
              </div>
            </div>

            <div className="player-stage">
              <div className="embed-frame">
                <div className="embed-label">
                  <span className="chip chip--live">{currentTrack.source}</span>
                  <span className="chip chip--muted">{currentTrack.provider}</span>
                </div>

                <div className={`${currentTrack.provider === 'youtube' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                  <div ref={youtubeHostRef} />
                </div>
                <div className={`${currentTrack.provider === 'spotify' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                  <div ref={spotifyHostRef} />
                </div>
                <div className={`${currentTrack.provider === 'soundcloud' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
                  <iframe
                    ref={soundcloudIframeRef}
                    title="soundcloud-player"
                    src={SOUNDCLOUD_INITIAL_TRACK ? buildSoundCloudEmbedSrc(SOUNDCLOUD_INITIAL_TRACK.soundcloudUrl) : ''}
                    frameBorder="0"
                    allow="autoplay"
                  />
                </div>
              </div>

              <div className="queue-panel">
                <p className="signal-note" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <ListMusic size={14} />
                  Queue inteligente
                </p>
                <div className="queue-grid">
                  {TRACKS.map((track, index) => (
                    <button
                      key={`${track.id}-queue`}
                      onClick={() => playTrackAtIndex(index)}
                      className={`queue-button ${currentTrackIndex === index ? 'is-active' : ''}`}
                    >
                      {track.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <h3>[ Interceptando señales externas ]</h3>
              <p className="section-note">Previews bloqueados para priorizar el módulo principal.</p>
            </div>
            <span className="section-note">Canales: {TRACKS.length}</span>
          </div>

          <div className="preview-grid">
            {TRACKS.map((track, index) => (
              <article key={track.id} className="preview-card group">
                <iframe
                  src={track.previewSrc}
                  frameBorder="0"
                  allowFullScreen
                  allow={track.allow}
                  loading="lazy"
                  title={`preview-${track.id}`}
                  className="pointer-events-none opacity-[0.85] grayscale"
                />
                <div className="preview-card__footer">
                  <span className="section-note truncate">{track.source}</span>
                  <button onClick={() => playTrackAtIndex(index)} className="preview-card__cta">
                    Reproducir
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <h3>Archivos extraídos</h3>
              <p className="section-note">Colección visual conectada al reproductor principal.</p>
            </div>
            <span className="section-note">Total: {DISCOGRAPHY.length}</span>
          </div>

          <div className="catalog-grid">
            {DISCOGRAPHY.map((album, index) => (
              <article
                key={album.id}
                className={`${album.span} album-card hover-glitch cursor-pointer`}
                onClick={() => playTrackAtIndex(index % TRACKS.length)}
              >
                <div className="album-card__media">
                  <img src={`https://picsum.photos/seed/${album.img}/800/600`} alt={album.title} />
                </div>
                <div className="album-card__meta">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'end' }}>
                    <div>
                      <p className="section-note">OBJ_ID: {album.id}</p>
                      <h4 style={{ fontSize: '1.2rem', marginTop: '0.25rem' }}>{album.title}</h4>
                    </div>
                    <span className="section-note">{album.year}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="panel" style={{ padding: '1.25rem' }}>
            <div className="section-heading" style={{ marginBottom: '1rem' }}>
              <div>
                <h3>Beat Maker // Maniatic Beat</h3>
                <p className="section-note">Diseño más editorial, con foco en lectura, jerarquía y conversión.</p>
              </div>
              <div className="metric-grid" style={{ minWidth: 'min(100%, 22rem)' }}>
                <div className="metric">
                  <strong>120+</strong>
                  <span>beats</span>
                </div>
                <div className="metric">
                  <strong>5 años</strong>
                  <span>experiencia</span>
                </div>
                <div className="metric">
                  <strong>24h</strong>
                  <span>respuesta</span>
                </div>
              </div>
            </div>

            <div className="production-grid">
              <div className="section-block">
                <div className="works-grid">
                  {MANIATIC_WORKS.map((work) => (
                    <article key={work.id} className="work-card">
                      <p className="section-note">{work.id}</p>
                      <h4 style={{ marginTop: '0.35rem', fontSize: '1rem' }}>{work.title}</h4>
                      <p style={{ marginTop: '0.6rem', color: 'var(--text)' }}>{work.notes}</p>
                      <div className="track-meta" style={{ marginTop: '0.8rem' }}>
                        <span className="chip">{work.style}</span>
                        <span className="chip">{work.bpm} BPM</span>
                        <span className="chip">{work.tone}</span>
                      </div>
                      <button onClick={() => playTrackAtIndex(work.trackIndex)} className="button-secondary" style={{ marginTop: '0.9rem', width: '100%' }}>
                        Cargar preview
                      </button>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="store-list">
                {BEAT_STORE.map((beat) => (
                  <article key={beat.sku} className="store-card">
                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '1rem' }}>
                      <div>
                        <p className="section-note">{beat.sku}</p>
                        <h4 style={{ marginTop: '0.35rem', fontSize: '1rem' }}>{beat.name}</h4>
                      </div>
                      <span className="chip">{beat.bpm} BPM</span>
                    </div>
                    <p style={{ marginTop: '0.75rem', color: 'var(--text)' }}>{beat.mood} · {beat.format}</p>
                    <div className="metric-grid" style={{ marginTop: '0.9rem' }}>
                      <div className="metric">
                        <strong>{beat.lease}</strong>
                        <span>lease</span>
                      </div>
                      <div className="metric">
                        <strong>{beat.exclusive}</strong>
                        <span>exclusive</span>
                      </div>
                    </div>
                    <a
                      href={`mailto:hola@mussarecords.com?subject=Compra%20Beat%20${encodeURIComponent(beat.name)}`}
                      className="button-primary"
                      style={{ marginTop: '0.9rem', width: '100%' }}
                    >
                      Comprar beat
                    </a>
                  </article>
                ))}
              </aside>
            </div>

            <div className="contact-grid" style={{ marginTop: '1rem' }}>
              <div className="contact-card">
                <p className="section-note">Contacto directo</p>
                <a href="mailto:hola@mussarecords.com" className="button-secondary" style={{ marginTop: '0.8rem', width: '100%' }}>
                  hola@mussarecords.com
                </a>
              </div>
              <div className="contact-card">
                <p className="section-note">Instagram</p>
                <a
                  href="https://www.instagram.com/maniaticbeat"
                  target="_blank"
                  rel="noreferrer"
                  className="button-secondary"
                  style={{ marginTop: '0.8rem', width: '100%' }}
                >
                  @maniaticbeat
                </a>
              </div>
              <div className="contact-card">
                <p className="section-note">Formato de pedido</p>
                <p style={{ marginTop: '0.8rem', color: 'var(--text)' }}>Enviá referencia, BPM objetivo, tonalidad y fecha de entrega.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <h3>Contacto</h3>
              <p className="section-note">Canal abierto para producción, mezcla y diseño sonoro.</p>
            </div>
            <span className="section-note">Canal abierto</span>
          </div>

          <div className="contact-grid">
            <div className="contact-card">
              <p className="section-note">Transmisión directa</p>
              <p style={{ marginTop: '0.8rem', color: 'var(--text)' }}>
                Si querés producir, mezclar o diseñar sonido para tu proyecto, enviá un mensaje y coordinamos una sesión.
              </p>
              <a href="mailto:hola@mussarecords.com" className="button-primary" style={{ marginTop: '0.9rem' }}>
                hola@mussarecords.com
              </a>
            </div>
            <div className="contact-card">
              <p className="section-note">Redes // plataformas</p>
              <div style={{ display: 'grid', gap: '0.7rem', marginTop: '0.8rem' }}>
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="button-secondary">
                  Instagram
                </a>
                <a href="https://soundcloud.com" target="_blank" rel="noreferrer" className="button-secondary">
                  SoundCloud
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="button-secondary">
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}