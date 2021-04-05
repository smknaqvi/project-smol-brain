import { useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { debounce } from 'lodash';
import { LinearProgress } from '@material-ui/core';

const PROGRESS_INTERVAL = 1000;
const hasControls = true;

interface YoutubeIFrameInterface {
  url: string;
  isPlaying: boolean;
  lastSeekTime: [number];
  playbackRate: number;
  handlePlay: (timestamp: number) => void;
  handlePause: (timestamp: number) => void;
}

function YoutubeIFrame({
  url,
  isPlaying,
  lastSeekTime,
  playbackRate,
  handlePlay,
  handlePause,
}: YoutubeIFrameInterface) {
  const playerRef = useRef<ReactPlayer | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    playerRef.current?.seekTo(...lastSeekTime, 'seconds');
  }, [lastSeekTime]);

  useEffect(() => {
    setIsReady(false);
  }, [url]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const bufferPause = useCallback(
    debounce(() => {
      playerRef.current?.getCurrentTime() &&
        handlePause(playerRef.current?.getCurrentTime());
    }, 1000),
    [handlePause]
  );

  const onReady = useCallback(() => {
    setIsReady(true);
  }, []);

  const onStart = useCallback(() => {
    playerRef.current?.seekTo(...lastSeekTime, 'seconds');
  }, [lastSeekTime]);

  const onPlay = useCallback(() => {
    if (!isPlaying) {
      playerRef.current?.getCurrentTime() &&
        handlePlay(playerRef.current?.getCurrentTime());
    }
  }, [isPlaying, handlePlay]);

  const onPause = useCallback(() => {
    if (isPlaying) {
      playerRef.current?.getCurrentTime() &&
        handlePause(playerRef.current?.getCurrentTime());
    }
  }, [isPlaying, handlePause]);

  const onBufferEnd = useCallback(() => {
    bufferPause.cancel();
  }, [bufferPause]);

  return (
    <div>
      {!!url && !isReady && <LinearProgress />}
      <ReactPlayer
        ref={(player) => (playerRef.current = player)}
        url={url}
        playing={isPlaying}
        controls={hasControls}
        playbackRate={playbackRate}
        progressInterval={PROGRESS_INTERVAL}
        onReady={onReady}
        onStart={onStart}
        onPlay={onPlay}
        onPause={onPause}
        onBuffer={bufferPause}
        onBufferEnd={onBufferEnd}
        muted={true}
        height="53.5vmin"
        width="95vmin"
      />
    </div>
  );
}

export default YoutubeIFrame;
