import { Grid, Link, Typography } from "@mui/material";
import Calender from "./Calendar";
function App() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh", textAlign: "center" }}
    >
      <Grid item xs={3}>
        <Typography variant="h4">dctrl</Typography>
        <Typography variant="subtitle1">
          435 w pender st, vancouver, bc
        </Typography>
        <br />
        <Link href="https://discord.gg/7rjEfhtsxe">discord</Link>
        <br />
        <Calender />
      </Grid>
    </Grid>
  );
}

export default App;
