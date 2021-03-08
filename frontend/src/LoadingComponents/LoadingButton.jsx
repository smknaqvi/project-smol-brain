import { Button, CircularProgress, Box } from '@material-ui/core';

const LoadingButton = (props) => {
  if (props.loading) {
    return (
      <Box alignSelf="center">
        <CircularProgress size={25} />
      </Box>
    );
  }

  const buttonProps = { ...props };
  delete buttonProps.loading;
  return <Button {...buttonProps}>Login</Button>;
};

export default LoadingButton;
