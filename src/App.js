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
      <Grid item xs={3} style={{ minWidth:"100%" }} alignItems={"center"} justifyContent={"center"}>
        <div style={{ marginTop: "15vh", marginBottom: "15vh" }}>
          <img style={{ width: "420px" }} src={"/DCTRL_logo.png"} alt="Dctrl Logo"/>
          <Typography variant="h4">Dctrl</Typography>
          <Typography variant="subtitle1">
            435 W Pender Street, Vancouver, BC
          </Typography>
          <br />
          <Link href="https://discord.gg/7rjEfhtsxe">Discord</Link>
          <br />
          <Link href="https://yvrsidewalk.com%22%3Esidewalk">Sidewalk</Link>
          <br />
          <Link href="https://yvrbepsi.com%22%3Ebepsi/">Drink Machine</Link>
          <br />
          <Link href="https://door3.dctrl.wtf%22%3Edoor/">Door Access</Link>
        </div>
        <br />
        <br />
        <Calender />
      </Grid>
    </Grid>
  );
}

export default App;
