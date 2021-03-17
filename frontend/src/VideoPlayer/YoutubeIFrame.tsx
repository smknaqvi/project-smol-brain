import { CircularProgress } from '@material-ui/core';
import { useCallback, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player/lazy';
import { debounce } from 'lodash';

const PROGRESS_INTERVAL = 1000;
const hasControls = true;
const isLoop = false;

interface YoutubeIFrameInterface {
  url: string;
  isPlaying: boolean;
  lastSeekTime: Array<number>;
  playbackRate: number;
  handlePlay: (timestamp: number) => void;
  handlePause: (timestamp: number) => void;
  handleProgress: (timestamp: number) => void;
}

function YoutubeIFrame({
  url,
  isPlaying,
  lastSeekTime,
  playbackRate,
  handlePlay,
  handlePause,
  handleProgress,
}: YoutubeIFrameInterface) {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    playerRef.current?.seekTo(...lastSeekTime, 'seconds');
  }, [lastSeekTime]);

  const bufferPause = useCallback(
    debounce(() => {
      handlePause(playerRef.current?.getCurrentTime());
    }, 500),
    [handlePause]
  );

  const onStart = useCallback(() => {
    playerRef.current?.seekTo(...lastSeekTime, 'seconds');
    console.log('onStart');
  }, [lastSeekTime]);

  const onPlay = useCallback(() => {
    if (!isPlaying) {
      handlePlay(playerRef.current?.getCurrentTime());
    }
  }, [isPlaying, handlePlay]);

  const onProgress = useCallback(
    ({
      played,
      playedSeconds,
      loaded,
      loadedSeconds,
    }: {
      played: number;
      playedSeconds: number;
      loaded: number;
      loadedSeconds: number;
    }) => {
      handleProgress(playedSeconds);
    },
    [handleProgress]
  );

  const onPause = useCallback(() => {
    if (isPlaying) {
      handlePause(playerRef.current?.getCurrentTime());
    }
  }, [isPlaying, handlePause]);

  const onBuffer = useCallback(() => {
    console.log('onBuffer');
    bufferPause();
  }, [bufferPause]);

  const onBufferEnd = useCallback(() => {
    bufferPause.cancel();
  }, [bufferPause]);

  return (
    <ReactPlayer
      ref={(player) => (playerRef.current = player)}
      url={url}
      playing={isPlaying}
      loop={isLoop}
      controls={hasControls}
      playbackRate={playbackRate}
      progressInterval={PROGRESS_INTERVAL}
      fallback={<CircularProgress />}
      onStart={onStart}
      onPlay={onPlay}
      onProgress={onProgress}
      onPause={onPause}
      onBuffer={onBuffer}
      onBufferEnd={onBufferEnd}
      muted={true}
    />
  );
}

export default YoutubeIFrame;
