import React from 'react'

import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';

import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import FileCopyIcon from '@material-ui/icons/FileCopy';

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

import TableAscii from './ascii_gen/Table';

import {CopyToClipboard} from 'react-copy-to-clipboard';
import { SnackbarProvider, useSnackbar } from 'notistack';

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
    paddingLeft: '1em',
    paddingRight: '1em'
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

const diagramTypes =  [
                        { 
                        'name': "@table",
                        'function' : TableAscii 
                        }
                      ]

function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

function CopyWithSnack(props) {
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (msg, variant) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(msg, { variant });
  };

  return (
    <React.Fragment>
      <CopyToClipboard 
        text={props.renderedVal}
      >
        <IconButton
          onClick={handleClick('You have Successfully Copied', 'success')}
        >
          <FileCopyIcon />
        </IconButton>
      </CopyToClipboard>
    </React.Fragment>
  );
}

class App extends React.PureComponent {
  constructor(props) {
    super(props)

    this.onSourceChange = this.onSourceChange.bind(this)
    this.toggleTheme = this.toggleTheme.bind(this)
    this.onRenderAscci = this.onRenderAscci.bind(this)

    this.state = {
      value: localValue === null ? initialValue : localValue,
      renderedVal: "Ascii Diagrams displayed here",
      dark: localSettings === null? true : localSettingsObj["dark"],
      open: true,
      starter: false,
      copied: true,
      diagramType: null,
    }

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
    this.setState({
      value: evt.getValue(),
      diagramType: evt.firstLine()
    })
    localStorage.setItem("value", this.state.value);
  }

  onRenderAscci(evt, change) {

    let multipleKeysError = false
    let keywordLocError = true

    for(let i = 0; i < diagramTypes.length; i++) {
      console.log(diagramTypes[i]["name"])

      if (occurrences(this.state.value, diagramTypes[i]["name"], true) > 1) {
        multipleKeysError = true
      }
      if (this.state.value.indexOf("@table") === 0) {
        keywordLocError = false
      }
    }

    if (multipleKeysError) {
      this.setState({renderedVal: "You can only have 1 keyword"}, )
    } else if (keywordLocError) {
      this.setState({renderedVal: "Diagram Type must come first"}, )
    } else {
      this.setState({renderedVal: "Yay!! Correct"}, )
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <>
          <CssBaseline />
          <SnackbarProvider maxSnack={3}>
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

                {/* Render Button */}
                <IconButton 
                  color="inherit"
                  onClick={() => {
                    console.log("Render")
                    this.onRenderAscci()
                  }}>
                  <RefreshIcon />
                </IconButton>

              </Toolbar>
            </AppBar>
            <main className={clsx(classes.content, { [classes.contentShift]: this.state.open,})} style={{backgroundColor: this.state.dark ? '#2a2d41': '#ffffff'}}>
              <div className={classes.drawerHeader} />

              {/* Code Window */}
              <CodeMirror
                height='100vh'
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
                <Container 
                  style={{
                    minHeight:"80vh",height:"80%", paddingTop: "5vh"
                  }}
                >
                  <Container 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                  >
                    <Typography>
                      Copy to Clipboard
                    </Typography>
                    <CopyWithSnack renderedVal={this.state.renderedVal}/>
                  </Container >
                  {/* Render Window */}
                  <CodeMirror
                    value={this.state.renderedVal}
                    options={{
                      theme: this.state.dark? 'material-palenight' : 'solarized',
                      tabSize: 2,
                      keyMap: 'sublime',
                      mode: 'markdown',
                      readOnly: 'nocursor',
                      lineNumbers: false
                    }}
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
                {/* Example Options */}
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
          </SnackbarProvider>
      </>
    )
  }
}

export default withStyles(styles)(App);
