import React from 'react'

import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';

import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AddBoxIcon from '@material-ui/icons/AddBox';
import EditIcon from '@material-ui/icons/Edit';
import NoteIcon from '@material-ui/icons/Note';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';

import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import MemoryIcon from '@material-ui/icons/Memory';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ChangeHistoryTwoToneIcon from '@material-ui/icons/ChangeHistoryTwoTone';
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import ArrowDownwardRoundedIcon from '@material-ui/icons/ArrowDownwardRounded';
import SwapVertRoundedIcon from '@material-ui/icons/SwapVertRounded';

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
import LinkedListAscii from './ascii_gen/LinkedList';

import occurrences from './helper';

import {CopyToClipboard} from 'react-copy-to-clipboard';
import { SnackbarProvider, useSnackbar } from 'notistack';

import { btreeExample, dirExample, dirsExample, heapExample, llExample, memExample, rllExample, strExample } from './default_examples/Example';

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
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontWeight: 'bold',
    color: '#636e72'
  },
  tabs: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
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
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  toolbarIcon: {
    paddingLeft: '1.2em'
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
  },
  mainPadding: {
    paddingRight: '2em', 
    paddingLeft: '2em'
  },
  optionsCards : {
    paddingTop: '2em'
  },
  inputLabel: {
    color: "#636e72",
    "&.Mui-focused": {
      color: "#357af7",
    },

    '&:before': {
      borderColor: '#636e72',
    },
    '&:after': {
        borderColor: '#357af7',
    }
  },
  selectIcon: {
    fill: "#636e72",
    '&:after': {
      fill: '#357af7',
    }
  },
});

const localValue = localStorage.getItem("ascii_value")
const localSettings = localStorage.getItem("ascii_settings")
const localSettingsObj = localSettings === null ? null : JSON.parse(localStorage.getItem("ascii_settings"))


const initialValue = ``

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
                        { 
                        'name': "@ll",
                        'function' : LinkedListAscii
                        },
                        { 
                        'name': "@rll",
                        'function' : LinkedListAscii
                        },
                      ]
const example = [
                  {
                    title: 'Directory',
                    exampleStr: dirExample,
                    icon: FolderIcon
                  },
                  {
                    title: 'Directory w/ Spacing',
                    exampleStr: dirsExample,
                    icon: FolderOpenIcon
                  },
                  {
                    title: 'Memory',
                    exampleStr: memExample,
                    icon: MemoryIcon
                  },
                  {
                    title: 'String',
                    exampleStr: strExample,
                    icon: TextFieldsIcon
                  },
                  {
                    title: 'Binary Tree',
                    exampleStr: btreeExample,
                    icon: ChangeHistoryTwoToneIcon
                  },
                  {
                    title: 'Heap',
                    exampleStr: heapExample,
                    icon: ChangeHistoryIcon
                  },
                  {
                    title: 'Linked List',
                    exampleStr: llExample,
                    icon: ArrowDownwardRoundedIcon
                  },
                  {
                    title: 'Double LL',
                    exampleStr: rllExample,
                    icon: SwapVertRoundedIcon
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
          onClick={handleClick('You have Successfully Copied', 'success')}
          endIcon={<FileCopyIcon/>}
          style={{borderRadius: 20, backgroundColor: '#357af7', color: '#ffffff'}}
        >
          <Typography variant="h9">
            Copy to Clipboard
          </Typography>
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
    case '1':
      return '/* \n' + value + '\n*/'
    case '2':
      return '""" \n' + value + '\n"""'
    case '3':
      return loopStyle(value, '//')
    case '4':
      return loopStyle(value, '#')
    case '5':
      return loopStyle(value, ';')
    default:
      console.log('hello')
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
    this.onRenderAscii = this.onRenderAscii.bind(this)

    this.state = {
      value: localValue === null ? initialValue : localValue,
      renderedVal: "Ascii Diagrams displayed here",
      dark: localSettings === null? true : localSettingsObj["dark"],
      open: true,
      starter: false,
      copied: true,
      diagramType: null,
      comments: true,
      commentStyle: '1',
      windowOption: localSettings === null? 2 : localSettingsObj["tab"],
    }

  }

  toggleTheme() {
    const toggledState = !this.state.dark
    this.setState({
      dark: toggledState
    })
    localStorage.setItem("ascii_settings", JSON.stringify({"tab": this.state.windowOption, "dark": toggledState}));
  }
  
  // Editor Windows Changes
  onSourceChange(evt, change) {
    this.setState({
      value: evt,
      diagramType: evt.split('\n')[0]
    })
    localStorage.setItem("ascii_value", evt);
  }

  onRenderAscii(evt, change) {

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
        height="43em"
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

  outputWindow(classes, value) {
    return (
        <Card variant="outlined" style={{width: '100%', borderRadius: 20, backgroundColor: '#1e1e1e'}}>
          <Editor
            value={value}
            height='43em'
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
                          {element.title}
                      </Typography>
                      <IconButton 
                        onClick={() => {
                          this.setState({
                            value: element.exampleStr,
                            // windowOption: false
                          },
                          () => this.onRenderAscii())
                          localStorage.setItem("ascii_value", element.exampleStr);
                        }}
                        
                        className={classes.toolbarIcon}
                      >
                        <element.icon style={{ color: grey[50] }}/>
                      </IconButton>
                    </Container>
                  ))}
            </Drawer>

            {/* Editor Window */}
            <main className={classes.content} style={{backgroundColor: this.state.dark ? '#2d3436': '#dfe6e9'}}>    
              <Container className={classes.mainPadding}>
                <Grid container spacing={0} align="center" justify="center" direction="row">
                  <Grid item xs={12} md={6} lg={6} xl={6} className={classes.title}>
                    <Typography variant="h2" noWrap>
                      Ascii Diagrams
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} xl={6} className={classes.tabs}>
                    <Tabs
                      value={this.state.windowOption}
                      onChange={(event, value) => {
                        this.setState({
                          windowOption: value
                        })
                        this.onRenderAscii()
                        localStorage.setItem("ascii_settings", JSON.stringify({"tab": value, "dark": this.state.dark}));
                      }}
                      variant="scrollable"
                      indicatorColor="primary"
                      textColor="inherit"
                      aria-label="icon tabs example"
                      style={{padding: '1em'}}
                    >
                      <Tab icon={<EditIcon />} label="Editor" />
                      <Tab icon={<NoteIcon />} label="Preview" />
                      <Tab icon={<ImportContactsIcon />} label="Side-View" />
                    </Tabs>
                  </Grid>
                </Grid>
                
                {this.state.windowOption === 0 ? (
                    <FadeInCardLeft>
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={12} lg={12} xl={12}>
                          {this.codeWindow(classes)}
                        </Grid>
                      </Grid>
                    </FadeInCardLeft>
                  ) : 
                  this.state.windowOption === 1?
                  (
                    <FadeInCardRight>
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={12} lg={12} xl={12}>
                          {console.log(this.state.commentStyle)}
                          {this.outputWindow(classes, this.state.comments ? applyComments(this.state.renderedVal, this.state.commentStyle) : this.state.renderedVal)}
                        </Grid>
                      </Grid>
                    </FadeInCardRight>
                  ) :
                  (
                    <Fade down={true}>
                      <Grid container spacing={4}>
                        <Grid item xs={6} md={6} lg={6} xl={6}>
                          {this.codeWindow(classes)}
                        </Grid>
                        <Grid item xs={6} md={6} lg={6} xl={6}>
                          {this.outputWindow(classes, this.state.comments ? applyComments(this.state.renderedVal, this.state.commentStyle) : this.state.renderedVal)}
                        </Grid>
                      </Grid>
                    </Fade>
                  )
                }
                <Grid container className={classes.optionsCards} justify="center" spacing={4}>
                  <Grid item xs={12} md={6} lg={6}>
                    <Card variant="outlined" style={{height: '11em', width: '100%', borderRadius: 20, backgroundColor: this.state.dark ? '#1e1e1e' : '#ffffff'}}>
                      <CardContent>
                        <Container className={classes.renderButton}>
                          <IOSSwitch checked={this.state.dark} onClick={this.toggleTheme}/>
                          <Typography variant="h7" className={classes.title}>
                            Dark Mode
                          </Typography>
                        </Container>
                      </CardContent>
                      <CardContent>
                        <Container className={classes.renderButton}>
                          <IOSSwitch 
                            checked={this.state.comments}
                            onChange={() => {
                              this.setState({
                                comments: !this.state.comments
                              })
                              console.log(this.state.comments ? applyComments(this.state.renderedVal, this.state.commentStyle) : this.state.renderedVal)
                            }}
                          />
                          <Typography variant="h7" className={classes.title}>
                            Add Comments
                          </Typography>
                        </Container>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6} lg={6}>
                    <Card variant="outlined" style={{height: '11em', width: '100%', borderRadius: 20, backgroundColor: this.state.dark ? '#1e1e1e' : '#ffffff'}}>
                      <CardContent>
                        <Container className={classes.renderButton}>
                          <CopyWithSnack renderedVal={this.state.comments ? applyComments(this.state.renderedVal, this.state.commentStyle) : this.state.renderedVal}/>
                        </Container>
                      </CardContent>
                      <CardContent>
                        <Container className={classes.renderButton}>
                          <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="age-native-simple" className={classes.inputLabel}>Comment Style</InputLabel>
                            <Select
                              native
                              value={this.state.commentStyle}
                              onChange={(event) => {
                                this.setState({
                                  commentStyle : event.target.value
                                })
                              }}
                              inputProps={{
                                classes: {
                                  icon: classes.selectIcon,
                                },
                              }}
                              label="Comment Style"
                              className={classes.inputLabel}
                            >
                              <option value={1}>/* */</option>
                              <option value={2}>''' '''</option>
                              <option value={3}>//</option>
                              <option value={4}>#</option>
                              <option value={5}>;</option>
                            </Select>
                          </FormControl>
                        </Container>
                      </CardContent>
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
