import React from 'react'

import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';

import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AddBoxIcon from '@material-ui/icons/AddBox';
import EditIcon from '@material-ui/icons/Edit';
import NoteIcon from '@material-ui/icons/Note';

import IOSSwitch from './component/Switch';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import {
  Container,
  Button,
  Card,
  CardActions,
  CardContent,
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
import 'codemirror/theme/material.css';
import 'codemirror/theme/eclipse.css';
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

import Fade from './component/Fade.js';

import { grey } from '@material-ui/core/colors';


const drawerWidth = "40%";
const starterWidth = 240;

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    background: '#2d2e44',
    zIndex: theme.zIndex.drawer + 1,
    // marginLeft: theme.spacing(7),
    marginLeft: theme.spacing(7) + 1,
    width: `calc(100% - ${theme.spacing(7) + 1}px)`,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(9) + 1,
      width: `calc(100% - ${theme.spacing(9) + 1}px)`,
    },
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    background: '#2d2e44',
    zIndex: theme.zIndex.drawer + 1,
    marginLeft: starterWidth,
    width: `calc(100% - ${starterWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  title: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '0.3em',
    paddingBottom: '0.3em',
    color: '#636e72'
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
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
    justifyContent: 'flex-end',
  },
  content: {
    height: '100vh',
    width: '100vw',
    flexWrap: 'wrap',
    overflow: 'auto',
    flexGrow: 1,
  },
  cardContainer: {
    zIndex: 10,
    paddingTop: '3vh',
  },
  cardContainerBack: {
    zIndex: 1,
    paddingBottom: '0vh',
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
  starterOpen: {
    backgroundColor: '#2d2e46',
    width: starterWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  starterClose: {
    backgroundColor: '#2d2e46',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  toolbarLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(2),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  formControl: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    minWidth: '10vw',
  },
  renderButton: {
    display: 'flex',
    alignContent: 'stretch',
    justifyContent: 'center',
    paddingTop: '3.9em'
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

const FadeInCardLeft = (props) => {
  return (
    <Fade horizontal={true} length={40}>
      {props.children}
    </Fade>
  )
}

const FadeInCardRight = (props) => {
  return (
    <Fade down={true} horizontal={true} length={40}>
      {props.children}
    </Fade>
  )
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
      comments: true,
      commentStyle: 1,
      showCode: true,
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

  codeWindow(classes) {
    return (
      <Card variant="outlined" style={{width: '100%', borderRadius: 20, backgroundColor: '#1e1e1e'}}>
        <Editor
        overflow="hidden"
        height="40em"
        width="100%"
        defaultLanguage="plaintext"
        theme={this.state.dark? 'vs-dark' : 'vs'}
        defaultValue=""
        value={this.state.value}
        onChange={this.onSourceChange}
        />
      </Card>
    )
  }

  outputWindow(classes) {
    return (
        <Card variant="outlined" style={{width: '100%', borderRadius: 20, backgroundColor: '#1e1e1e'}}>
          <Editor
            value={this.state.comments ? applyComments(this.state.renderedVal, this.state.commentStyle) : this.state.renderedVal}
            height='40em'
            width='100%'
            theme={this.state.dark? 'vs-dark' : 'vs'}
            options={{
              tabSize: 2,
              keyMap: 'sublime',
              mode: 'plaintext',
              readOnly: 'nocursor',
              lineNumbers: false
            }}
          />
        </Card>
    )
  }


  render() {
    const { classes } = this.props;

    return (
      <>
        <div className={classes.root}>
          <CssBaseline />
          <SnackbarProvider maxSnack={3}>
            {/* Examples Tab */}
            <Drawer 
              anchor="left"
              variant="permanent" 
              open={this.state.starter} 
              className={clsx(classes.drawer, {
                [classes.starterOpen]: this.state.starter,
                [classes.starterClose]: !this.state.starter,
              })}
              classes={{
                paper: clsx({
                  [classes.starterOpen]: this.state.starter,
                  [classes.starterClose]: !this.state.starter,
                }),
              }}
            >

              <div className={classes.toolbar}>
                <IconButton onClick={() => {
                  this.setState({
                    starter: !this.state.starter
                  })
                }}>
                  {this.state.starter ? 
                    <CloseIcon style={{ color: grey[50] }}/> :
                    <MenuIcon style={{ color: grey[50] }}/>
                  }
                </IconButton>
              </div>
                {/* Example Options */}
                 {example.map((element) => (
                    <Container className={classes.toolbarLabel}>
                      <Typography style={{ color: grey[50] }}>
                          <IconButton 
                            onClick={() => {
                            this.setState({
                              value: element.exampleStr,
                              showCode: false
                            },
                            () => this.onRenderAscci()
                            )}}
                            style={{ paddingRight: '1em' }}
                          >
                            <AddBoxIcon style={{ color: grey[50] }}/>
                          </IconButton>

                          {element.title}
                      </Typography>
                    </Container>
                  ))}
            </Drawer>

            {/* Editor Window */}
            <main className={classes.content} style={{backgroundColor: this.state.dark ? '#2d3436': '#dfe6e9'}}>    
              <Container> 

                <Container className={classes.title}>
                  <Typography variant="h3" noWrap>
                    Ascii Diagrams
                  </Typography>
                  
                </Container>
                  <Tabs
                    value={this.state.showCode? 0 : 1}
                    onChange={(event, value) => {
                      this.setState({
                        showCode: value === 0 ? true : false
                      })
                    }}
                    variant="fullWidth"
                    indicatorColor="secondary"
                    textColor="secondary"
                    aria-label="icon tabs example"
                    style={{padding: '1em'}}
                  >
                    <Tab icon={<EditIcon />} label="Editor" />
                    <Tab icon={<NoteIcon />} label="Preview" />
                  </Tabs>
                <Container style={{paddingRight: '1em', paddingLeft: '1em'}}>
                  {this.state.showCode ? (
                      <FadeInCardLeft>
                        {this.codeWindow(classes)}
                      </FadeInCardLeft>
                    ) : 
                    (
                      <FadeInCardRight>
                        {this.outputWindow(classes)}
                      </FadeInCardRight>
                    )
                  }
                </Container>
                <Grid container style={{width: '100%'}}>
                  <Grid item xs={12} md={6} lg={6} style={{paddingTop: '2em', paddingRight: '1em', paddingLeft: '1em' }}>
                    <Card variant="outlined" style={{height: '11em', width: '100%', borderRadius: 20, backgroundColor: this.state.dark ? '#1e1e1e' : '#ffffff'}}>
                      <Container className={classes.renderButton}>
                        <Button variant="contained" color="primary" onClick={() => {
                          this.onRenderAscci()
                          this.setState({
                            showCode: false
                          })
                        }}>
                          Render
                        </Button>      
                        <IOSSwitch checked={this.state.dark} onClick={this.toggleTheme}/>  
                      </Container>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6} lg={6} style={{paddingTop: '2em', paddingRight: '1em', paddingLeft: '1em'}}>
                    <Card variant="outlined" style={{height: '11em', width: '100%', borderRadius: 20, backgroundColor: this.state.dark ? '#1e1e1e' : '#ffffff'}}>
                      <Container className={classes.renderButton}>
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
                        <CopyWithSnack renderedVal={this.state.comments ? applyComments(this.state.renderedVal, this.state.commentStyle) : this.state.renderedVal}/>
                      </Container>
                    </Card>
                  </Grid>
                </Grid>
              </Container>
            </main>

          </SnackbarProvider>
        </div>
      </>
    )
  }
}

export default withStyles(styles)(App);
