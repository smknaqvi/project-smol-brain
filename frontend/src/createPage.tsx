import { Box } from '@material-ui/core';
import React from 'react';

function createPage(WrappedComponent: React.ComponentType) {
  return (props: any) => {
    return (
      <Box height="100%">
        <WrappedComponent {...props} />
      </Box>
    );
  };
}

export default createPage;
