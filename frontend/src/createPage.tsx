import { Box } from '@material-ui/core';
import React from 'react';

function createPage(WrappedComponent: React.ComponentType) {
  return (props: any) => {
    return (
      <Box height="100%" padding="10px" margin="10px">
        <WrappedComponent {...props} />
      </Box>
    );
  };
}

export default createPage;
