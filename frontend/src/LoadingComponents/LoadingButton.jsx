import { Button, CircularProgress, withStyles } from '@material-ui/core';

const FixedCircularProgress = withStyles(() => ({
  root: {
    position: 'absolute',
    marginLeft: '50%',
    marginRight: '50%',
    opacity: '0.5',
  },
}))(CircularProgress);

const LoadingButton = ({ loading, children, ...props }) => {
  return (
    <Button disabled={loading} {...props}>
      {loading && <FixedCircularProgress size={25} />}
      {children}
    </Button>
  );
};

export default LoadingButton;
