import React from 'react'

import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';

import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AddBoxIcon from '@material-ui/icons/AddBox';

import IOSSwitch from './component/Switch';

import {
  Container,
  Button,
  FormControlLabel,
  Typography,
  Drawer,
  AppBar,
  Toolbar,
  CssBaseline,
  IconButton,
  MenuItem,
  InputLabel,
  Grid,
  FormControl,
  Select,
  Switch
} from '@material-ui/core/';

import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/material-palenight.css';
import 'codemirror/theme/solarized.css';

import Editor from "@monaco-editor/react";

import TableAscii from './ascii_gen/Table';
import DirectoryAscii from './ascii_gen/Directory';
import MemoryAscii from './ascii_gen/Memory';
import StringAscii from './ascii_gen/String';
import BinaryTree from './ascii_gen/BinaryTree';

import occurrences from './helper';

import {CopyToClipboard} from 'react-copy-to-clipboard';
import { SnackbarProvider, useSnackbar } from 'notistack';

import { btreeExample, dirExample, dirsExample, heapExample, memExample, strExample } from './default_examples/Example';

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
  formControl: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    minWidth: '10vw',
  },
});

// const localValue = localStorage.getItem("value")
const localValue = null
const localSettings = localStorage.getItem("settings")
const localSettingsObj = localSettings === null ? null : JSON.parse(localStorage.getItem("settings"))


const initialValue = dirsExample

const diagramTypes =  [
                        { 
                        'name': "@table",
                        'function' : TableAscii 
                        },
                        { 
                        'name': "@dir",
                        'function' : DirectoryAscii 
                        },
                        { 
                        'name': "@mem",
                        'function' : MemoryAscii
                        },
                        { 
                        'name': "@str",
                        'function' : StringAscii
                        },
                        { 
                        'name': "@btree",
                        'function' : BinaryTree
                        },
                        { 
                        'name': "@heap",
                        'function' : BinaryTree
                        },
                      ]
const example = [
                  {
                    title: 'Directory',
                    exampleStr: dirExample,
                  },
                  {
                    title: 'Directory w/ Spacing',
                    exampleStr: dirsExample,
                  },
                  {
                    title: 'Memory',
                    exampleStr: memExample,
                  },
                  {
                    title: 'String',
                    exampleStr: strExample,
                  },
                  {
                    title: 'Binary Tree',
                    exampleStr: btreeExample,
                  },
                  {
                    title: 'Heap',
                    exampleStr: heapExample,
                  },
                ]


function CopyWithSnack(props) {
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (msg, variant) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(msg, { variant });
  };

  return (
      <CopyToClipboard 
        text={props.renderedVal}
      >

        <Button
          variant="contained"
          color="default"
          onClick={handleClick('You have Successfully Copied', 'success')}
          endIcon={<FileCopyIcon/>}
        >
          Copy to Clipboard
        </Button>
      </CopyToClipboard>
  );
}

function loopStyle(value, commentChar) {
  let stringArr = value.split('\n')
  let result = ""
  stringArr.forEach(string => {
    result += commentChar + ' ' + string + '\n'
  });
  return result
}

function applyComments(value, style) {
  switch (style) {
    case 1:
      
      return '/* \n' + value + '\n*/'
    case 2:
      
      return '""" \n' + value + '\n"""'
    case 3:
      
      return loopStyle(value, '//')
    case 4:
      
      return loopStyle(value, '#')
    case 5:
      
      return loopStyle(value, ';')
    default:
      return value
  }
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
      comments: false,
      commentStyle: 1
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
      value: evt,
      diagramType: evt.split('\n')[0]
    })
    localStorage.setItem("value", this.state.value);
  }

  onRenderAscci(evt, change) {

    let multipleKeysError = false
    let keywordLocError = true
    let diagramTypeIndex = -1
    
    let totalKeys = 0
    for(let i = 0; i < diagramTypes.length; i++) {
      // console.log(diagramTypes[i]["name"])
      
      if (occurrences(this.state.value, diagramTypes[i]["name"], true) === 1) {
        diagramTypeIndex = i
        totalKeys++
      }
      if (occurrences(this.state.value, diagramTypes[i]["name"], true) > 1) {
        multipleKeysError = true
      }
      if (this.state.value.indexOf(diagramTypes[i]["name"]) === 0) {
        keywordLocError = false
      }
    }

    if (totalKeys > 1) {
      multipleKeysError = true
    }

    if (multipleKeysError) {
      this.setState({renderedVal: "ERROR: You can only have 1 Diagram Type!!!"}, )
    } else if (keywordLocError) {
      this.setState({renderedVal: "ERROR: Diagram Type must be first argument!!!"}, )
    } else {
      this.setState({diagramType: diagramTypes[diagramTypeIndex]['name']}, )
      this.setState({renderedVal: diagramTypes[diagramTypeIndex]['function'](this.state.value)}, )
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <>
          <CssBaseline />
          <SnackbarProvider maxSnack={3}>
            {/* Navbar */}
            <AppBar
              position="fixed"
              style={{background: '#232932' }}
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
                  Ascii Diagrams
                </Typography>

                {/* Dark mode toggle */}
                <IOSSwitch checked={this.state.dark} onClick={this.toggleTheme}/>

                {/* Render Button */}
                <IconButton 
                  color="inherit"
                  onClick={() => {
                    // console.log("Render")
                    this.onRenderAscci()
                  }}>
                  <RefreshIcon />
                </IconButton>

              </Toolbar>
            </AppBar>
            
            {/* Editor Window */}
            <main className={clsx(classes.content, { [classes.contentShift]: this.state.open,})} style={{height:'100vh', overflow: 'hidden', backgroundColor: this.state.dark ? '#1e1e1e': '#ffffff'}}>
              <div className={classes.drawerHeader} style={{color: '#ffffff'}}>You discovered the easter egg!!!</div>
              <div>
                <Editor
                overflow="hidden"
                height="100vh"
                width="60%"
                defaultLanguage="plaintext"
                theme={this.state.dark? 'vs-dark' : 'vs'}
                defaultValue=""
                value={this.state.value}
                onChange={this.onSourceChange}
                />
              </div>
            </main>

            {/* Output Window */}
            <Drawer
              className={classes.drawer}
              variant="persistent"
              anchor="right"
              open={this.state.open}
              classes={{
                paper: classes.drawerPaper,
              }}
              style={{
                overflow: 'hidden'
              }}
            >
              <div style={{padding: '20px'}}>
                <Container style={{minHeight:"80vh",height:"80%"}}>
                  {/* Options Tab */}

                  <Grid container alignItems='center'>
                    <Grid item xs={12} md={6} lg={2} style={{display: 'flex', justifyContent:'center', paddingTop: '1vh', paddingBottom: '1vh'}}>
                      <Switch 
                        checked={this.state.comments}
                        onChange={() => {
                          this.setState({
                            comments: !this.state.comments
                          })
                        }}
                        color="primary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={5} style={{display: 'flex', justifyContent:'center', paddingTop: '1vh', paddingBottom: '1vh'}}>
                      <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Comment Style</InputLabel>
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={this.state.commentStyle}
                              onChange={(event) => {
                                this.setState({
                                  commentStyle : event.target.value
                                })
                              }}
                              label="Comment Style"
                            >
                              <MenuItem value={1}>/* */</MenuItem>
                              <MenuItem value={2}>''' '''</MenuItem>
                              <MenuItem value={3}>//</MenuItem>
                              <MenuItem value={4}>#</MenuItem>
                              <MenuItem value={5}>;</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={12} lg={5} style={{display: 'flex', justifyContent:'center', paddingTop: '1vh', paddingBottom: '1vh'}}>
                      <CopyWithSnack renderedVal={this.state.comments ? applyComments(this.state.renderedVal, this.state.commentStyle) : this.state.renderedVal}/>
                    </Grid>
                  </Grid>
                  {/* Render Window */}
                  <CodeMirror
                    value={this.state.comments ? applyComments(this.state.renderedVal, this.state.commentStyle) : this.state.renderedVal}
                    height='80vh'
                    options={{
                      theme: this.state.dark? 'material-palenight' : 'solarized',
                      tabSize: 2,
                      keyMap: 'sublime',
                      mode: 'plaintext',
                      readOnly: 'nocursor',
                      lineNumbers: false
                    }}
                  />
                </Container>
              </div>
            </Drawer>

            {/* Examples Tab */}
            <Drawer open={this.state.starter} classes={{ paper: classes.starterMenu}}>
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
                 {
                   example.map((element) => (
                    <Typography>
                      {element.title} Example
                        <IconButton 
                        onClick={() => {
                          this.setState({
                            value: element.exampleStr,
                            starter: false
                          })
                        }}>
                          <AddBoxIcon />
                        </IconButton>
                    </Typography>
                   ))
                 }
              </div>
            </Drawer>
          </SnackbarProvider>
      </>
    )
  }
}

export default withStyles(styles)(App);
