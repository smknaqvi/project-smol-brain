import createPage from '../createPage';
import Box from '@material-ui/core/Box';

function CreditsPage() {
  return (
    <Box display="flex" flexDirection="column" height="100%">
      Frontend
      <ul>
        <li>
          Assets
          <ul>
            <li>https://patternico.com/</li>
            <li>https://www.logomaker.com/</li>
          </ul>
        </li>
        <br />
        <li>
          Code Snippets
          <ul>
            <li>https://stackoverflow.com/a/62335120</li>
            <li>https://stackoverflow.com/q/40881616</li>
            <li>https://stackoverflow.com/a/49427475</li>
            <li>https://stackoverflow.com/a/59066345</li>
            <li>
              https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
            </li>
            <li>
              https://stackoverflow.com/questions/11039885/scrollintoview-causing-the-whole-page-to-move/11041376
            </li>
            <li>
              https://linguinecode.com/post/how-to-use-react-useref-with-typescript
            </li>
            <li>https://stackoverflow.com/a/55679953</li>
            <li>
              https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
            </li>
            <li>
              https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/sign-in/SignIn.js
            </li>
          </ul>
        </li>
        <br />
        <li>
          Tutorials / References
          <ul>
            <li>
              https://medium.com/@toricpope/transform-a-react-app-into-a-progressive-web-app-pwa-dea336bd96e6
            </li>
            <li>https://material-ui.com/getting-started/usage/</li>
            <li>
              https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/
            </li>
            <li>https://reactjs.org/docs/uncontrolled-components.html</li>
            <li>https://developer.mozilla.org/en-US/docs/Web/CSS/calc()</li>
          </ul>
        </li>
      </ul>
      Backend
      <ul>
        <li>
          Code Snippets
          <ul>
            <li>https://stackoverflow.com/a/62335120</li>
          </ul>
        </li>
        <br />
        <li>
          Tutorials / References
          <ul>
            <li>https://expressjs.com/en/5x/api.html</li>
            <li>https://socket.io/docs/v3/server-api/index.html</li>
            <li>https://mongoosejs.com/docs/guide.html</li>
            <li>https://github.com/NodeRedis/node-redis</li>
          </ul>
        </li>
      </ul>
      Thank you for visiting!
    </Box>
  );
}

export default createPage(CreditsPage);
