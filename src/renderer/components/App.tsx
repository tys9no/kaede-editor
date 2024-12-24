import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

import Editor from './Editor';
import Preview from './Preview';


const App = () => {
  const [renderedHtml, setRenderedHtml] = useState<string>('');

  return (
    <div>
      <Box>
        <Grid container spacing={1}>
          <Grid size={6} overflow='auto' height='100vh'>
            <Editor setRenderedHtml={setRenderedHtml} />
          </Grid>
          <Grid size={6} overflow='auto' height='100vh'>
            <Preview renderedHtml={renderedHtml} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default App;
