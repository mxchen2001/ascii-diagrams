import occurrences from '../helper'

let spacing = false;

function DirectoryAsciiHelper(input) {
    input = input.replace(/    /g, "\t");
    if (input === "") {
        return null
    }
    
    
    var tokens = input.split("\n");
    if (tokens[0] === "@dirs") {
        spacing = true
        tokens.shift()
    }
    if (tokens[0] === "@dir") {
        tokens.shift()
    }

    if (occurrences(input, '\t', false) === 0) {
        let leafNodes = []
        for (let i = 0; i < tokens.length; i++) {
            leafNodes.push({root: tokens[i], children: null})
        }
        return leafNodes
    }

    let rootDirectories = []
    let rootDirectoriesNames = []

    for (let i = 0; i < tokens.length; i++) {
        let substring = tokens[i]
        const tabCount = occurrences(substring, '\t', false)
        if (tabCount === 0) {
            rootDirectories.push(i)
            rootDirectoriesNames.push(tokens[i])
        } 
        
    }

    rootDirectories.push(tokens.length)

    let current = []
    for (let i = 0; i < rootDirectories.length - 1; i++) {
        let children = tokens.slice(rootDirectories[i] + 1, rootDirectories[i + 1])
        for (let i = 0; i < children.length; i++) {
            children[i] = children[i].substring(1)    
        }
        current.push({root: rootDirectoriesNames[i], children: DirectoryAsciiHelper(children.join('\n'))});
    }

    return current
}


function DirectoryAsciiString(directoryTree, resultArr, level, prevString) {
    if (directoryTree === null) {
        return
    }

    const numRoot = directoryTree.length
    for (let i = 0; i < numRoot; i++) {
        if (spacing) {
            resultArr.push(prevString + '|')
        }
        resultArr.push(prevString + '|__' + directoryTree[i].root)
        let indent;
        if (i === numRoot - 1) {
            indent = prevString + '   '            
        } else {
            indent = prevString + '|  '
        }
        DirectoryAsciiString(directoryTree[i].children, resultArr, level + 1, indent)
    }
}





export default function DirectoryAscii(input) {
    spacing = false;
    const directoryTree = DirectoryAsciiHelper(input)
    directoryTree.pop()
    let resultArr = []
    DirectoryAsciiString(directoryTree, resultArr, 0, '')
    const output = resultArr.join("\n")
    return ".\n" + output
}
