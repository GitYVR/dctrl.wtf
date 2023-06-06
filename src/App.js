import { Grid, Link, Typography } from "@mui/material";

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
        <center>
        <iframe src="https://calendar.google.com/calendar/embed?src=dctrlyvr%40gmail.com&ctz=America%2FVancouver" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>
        </center>
      </Grid>
    </Grid>
  );
}

export default App;
