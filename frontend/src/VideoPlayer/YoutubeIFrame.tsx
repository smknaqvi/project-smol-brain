import { useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { debounce } from 'lodash';
import { LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

const useStyles = makeStyles(() => ({
  playerDiv: {
    border: '1px solid white',
    padding: '2px',
    borderRadius: '5px',
  },
}));

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
  const classes = useStyles();

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
    }, 3000),
    [handlePause]
  );

  const onReady = useCallback(() => {
    setIsReady(true);
  }, []);

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
    <div className={classes.playerDiv}>
      {!!url && !isReady && <LinearProgress />}
      <ReactPlayer
        ref={(player) => (playerRef.current = player)}
        url={url}
        playing={isPlaying}
        controls={hasControls}
        playbackRate={playbackRate}
        progressInterval={PROGRESS_INTERVAL}
        onReady={onReady}
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
