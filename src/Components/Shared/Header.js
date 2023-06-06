import {Component} from "react";
import {AppBar, Box, Button, IconButton, Toolbar, Typography} from "@mui/material";
import {Menu as MenuIcon} from "@mui/icons-material";
class Header extends Component{
    render() {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            MyCompany
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </Box>
        );
    }
}
export default Header;
