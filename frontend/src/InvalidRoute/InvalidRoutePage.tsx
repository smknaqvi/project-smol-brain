import { Box } from '@material-ui/core';
import Link from '@material-ui/core/Link';

function InvalidRoutePage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <h1>Oops!</h1>
      <h2>
        You've found a 404 page. Can we perhaps interest you in{' '}
        <Link href="/signup">Signing up</Link>,{' '}
        <Link href="/login">Logging in</Link>, or going to the{' '}
        <Link href="/">Home Page</Link>? It's all free!
      </h2>
      <h5>(Until we IPO, at least...)</h5>
    </Box>
  );
}
export default InvalidRoutePage;
