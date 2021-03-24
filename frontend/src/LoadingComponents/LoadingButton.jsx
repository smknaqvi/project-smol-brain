import { Button, CircularProgress, Box } from '@material-ui/core';

const LoadingButton = ({ loading, ...props }) => {
  if (loading) {
    return (
      <Box alignSelf="center">
        <CircularProgress size={25} />
      </Box>
    );
  }

  //const buttonProps = { ...props };
  return <Button {...props}></Button>;
};

export default LoadingButton;
