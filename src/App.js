import { Grid, Link, Typography } from "@mui/material";
import Calender from "./Calendar";
import { Link as RouterLink } from 'react-router-dom';

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
      <Grid item xs={3} style={{ minWidth:"100%" }} alignItems={"center"} justifyContent={"center"}>
        <div style={{ marginTop: "15vh", marginBottom: "15vh" }}>
          <img style={{ width: "420px", maxWidth: "50%" }} src={"/DCTRL_logo.png"} alt="Dctrl Logo"/>
          <Typography variant="h4">DCTRL</Typography>
          <Typography variant="subtitle1">
            436 W Pender Street, Vancouver, BC
          <br />
          <br />
          <Link href="https://x.com/dctrlvan">@dctrlvan</Link>
          <br />
          <Link href="https://discord.gg/7rjEfhtsxe">Discord</Link>
          <br />
          <Link href="https://yvrsidewalk.com">Sidewalk</Link>
          <br />
          <Link href="https://yvrbepsi.com">Drink Machine</Link>
          <br />
          <Link href="https://door3.dctrl.wtf">Door Access</Link>
          <br />
          <RouterLink to="/fob-management">
            <button type="button">
              Fob Management
            </button>
          </RouterLink>
          </Typography>
        </div>
        <Calender />
      </Grid>
    </Grid>
  );
}

export default App;
