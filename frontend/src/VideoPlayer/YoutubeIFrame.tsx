import { useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { debounce } from 'lodash';
import { LinearProgress } from '@material-ui/core';

const PROGRESS_INTERVAL = 1000;
const hasControls = true;

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
        onProgress={onProgress}
        onPause={onPause}
        onBuffer={bufferPause}
        onBufferEnd={onBufferEnd}
        muted={true}
        height="360px"
        width="640px"
      />
    </div>
  );
}

export default YoutubeIFrame;
