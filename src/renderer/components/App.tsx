import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

import Ace from './Ace';
import Preview from './Preview';


const App = () => {
  const [markdownValue, setMarkdownValue] = useState<string>('');

  return (
    <div>
      <Box>
        <Grid container spacing={1}>
          <Grid size={6} overflow='auto' height='100vh'>
            <Ace setMarkdownValue={setMarkdownValue} />
          </Grid>
          <Grid size={6} overflow='auto' height='100vh'>
            <Preview markdownValue={markdownValue} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default App;