import React from 'react'

// import remarkGfm from 'remark-gfm'
// import remarkSlug from 'remark-slug'
// import remarkToc from 'remark-toc'
// import rehypeHighlight from 'rehype-highlight'
// import rehypeRaw from 'rehype-raw'

// import remarkMath from 'remark-math'
// import rehypeKatex from 'rehype-katex'
// import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you

import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';

import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';

import IOSSwitch from './component/Switch';

import {
  Container,
  Checkbox,
  FormControlLabel,
  Typography,
  Drawer,
  AppBar,
  Toolbar,
  CssBaseline,
  IconButton,
} from '@material-ui/core/';

import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/material-palenight.css';
import 'codemirror/theme/solarized.css';

const drawerWidth = "40%";

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(${100 - parseFloat(drawerWidth)}%)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerPaperFull: {
    width: '100%',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  content: {
    minHeight:"100vh",
    height:"100%",
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: "-" + drawerWidth,
  },
  contentShift: {
    minHeight:"100vh",
    height:"100%",
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  starterMenu: {
    width: '30%',
    flexShrink: 0,
  },
  starterHeader: {
    display: 'flex',
    alignItems: 'right',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
});

// const localValue = localStorage.getItem("value")
const localValue = null
const localSettings = localStorage.getItem("settings")
const localSettingsObj = localSettings === null ? null : JSON.parse(localStorage.getItem("settings"))


const initialValue = "Hello World"

class App extends React.PureComponent {
  constructor(props) {
    super(props)

    this.onSourceChange = this.onSourceChange.bind(this)
    this.toggleTheme = this.toggleTheme.bind(this)

    this.state = {
      value: localValue === null ? initialValue : localValue,
      dark: localSettings === null? true : localSettingsObj["dark"],
      open: true,
      starter: false,
    }

    console.log(localSettings)
  }

  toggleTheme() {
    const toggledState = !this.state.dark
    this.setState({
      dark: toggledState
    })
    localStorage.setItem("settings", JSON.stringify({"gfm": this.state.gfm, "raw": this.state.raw, "math": this.state.math, "dark": toggledState}));
  }
  
  // Editor Windows Changes
  onSourceChange(evt, change) {
    this.setState({value: evt.getValue()}, )
    localStorage.setItem("value", this.state.value);
  }

  render() {
    const { classes } = this.props;

    return (
      <>
          <CssBaseline />
          <AppBar
            position="fixed"
            style={{ background: '#232932' }}
            className={clsx(classes.appBar, {
              [classes.appBarShift]: this.state.open,
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={() => {
                  this.setState({
                    starter: true
                  })
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap className={classes.title}>
                Markdown Slides
              </Typography>

              {/* Dark mode toggle */}
              <IOSSwitch checked={this.state.dark} onClick={this.toggleTheme}/>

            </Toolbar>
          </AppBar>
        <main className={clsx(classes.content, { [classes.contentShift]: this.state.open,})} style={{backgroundColor: this.state.dark ? '#2a2d41': '#ffffff'}}>
            <div className={classes.drawerHeader} />

            {/* Code Window */}
            <CodeMirror
              value={this.state.value}
              options={{
                theme: this.state.dark? 'material-palenight' : 'solarized',
                tabSize: 2,
                keyMap: 'sublime',
                mode: 'markdown',
              }}
              onChange={this.onSourceChange}
            />
          </main>

          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={this.state.open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              OUTPUT
            </div>
            <div style={{padding: '20px'}}>
              {/* Render Window */}
              <Container style={{minHeight:"80vh",height:"80%", paddingTop: "5vh"}}>
                <CodeMirror
                  value={this.state.value}
                  options={{
                    theme: this.state.dark? 'material-palenight' : 'solarized',
                    tabSize: 2,
                    keyMap: 'sublime',
                    mode: 'markdown',
                    readOnly: 'nocursor'
                  }}
                  onChange={this.onSourceChange}
                />
              </Container>
            </div>

          </Drawer>
          <Drawer
            open={this.state.starter}
            classes={{
              paper: classes.starterMenu,
            }}
          >
            <div className={classes.starterHeader}>
              <IconButton 
                onClick={() => {
                  this.setState({
                    starter: false
                  })
                }}>
                <CloseIcon />
              </IconButton>
            </div>
            <div style={{padding: '20px'}}>
              {/* Render Window */}
                HELLO
                <IconButton 
                onClick={() => {
                  this.setState({
                    starter: false
                  })
                }}>
                <CloseIcon />
              </IconButton>
            </div>
          </Drawer>
      </>
    )
  }
}

export default withStyles(styles)(App);
