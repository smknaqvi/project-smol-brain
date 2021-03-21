import { Box } from '@material-ui/core';
import createPage from '../createPage';
import PartyPlayer from '../VideoPlayer/PartyPlayer';

function PartyPage() {
  return (
    <Box>
      <PartyPlayer />
    </Box>
  );
}

export default createPage(PartyPage);
