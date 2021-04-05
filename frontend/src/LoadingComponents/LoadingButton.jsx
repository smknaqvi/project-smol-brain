import { Button, CircularProgress, Box } from '@material-ui/core';

const LoadingButton = ({ loading, children, ...props }) => {
  if (loading) {
    return (
      <Box alignSelf="center">
        <CircularProgress size={25} />
      </Box>
    );
  }
  return <Button {...props}>{children}</Button>;
};

export default LoadingButton;
