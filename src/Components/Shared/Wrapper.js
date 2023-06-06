import Header from "./Header";
import {Grid} from "@mui/material";
import {Component} from "react";

class Wrapper extends Component {
    render() {
        return (
            <Grid container spacing={2} sx={{background: 'lightgrey'}}>
                <Grid item xs={12}>
                    <Header/>
                    {this.props.children}
                </Grid>
            </Grid>
        );
    }
}
export default Wrapper;
