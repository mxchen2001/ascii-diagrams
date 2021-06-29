import React from 'react';
import occurrences from '../helper'

let maxWordSize = 1
let isRoot = true
let rootName = ""

function BinaryTreeHelper(input) {
    input = input.replace(/    /g, "\t");
    if (input === "") {
        return null
    }
    
    
    var tokens = input.split("\n");
    if (tokens[0] === "@btree" || tokens[0] === "@heap") {
        tokens.shift()
    }

    if (occurrences(input, '\t', false) === 0) {
        let leafNodes = []
        for (let i = 0; i < tokens.length; i++) {
            leafNodes.push({root: tokens[i], children: null})
            maxWordSize = tokens[i].trim().length > maxWordSize ? tokens[i].trim().length : maxWordSize
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

    if (isRoot) {
        isRoot = false
        rootName = rootDirectoriesNames[0]
    }

    let current = []
    for (let i = 0; i < rootDirectories.length - 1 && i < 2; i++) {
        let children = tokens.slice(rootDirectories[i] + 1, rootDirectories[i + 1])
        for (let i = 0; i < children.length; i++) {
            children[i] = children[i].substring(1)    
        }
        current.push({root: rootDirectoriesNames[i], children: BinaryTreeHelper(children.join('\n'))});
        if (rootDirectoriesNames[i] !== rootName)
            maxWordSize = rootDirectoriesNames[i].trim().length > maxWordSize ? rootDirectoriesNames[i].trim().length : maxWordSize
    }

    return current
}


function BinaryTreeDepth(tree, depthCount) {
    if (tree === undefined || tree === null || tree.children === null) {
        return depthCount + 1
    }

    const leftDepth = BinaryTreeDepth(tree.children[0], depthCount + 1)
    const rightDepth = BinaryTreeDepth(tree.children[1], depthCount + 1)

    return leftDepth > rightDepth ? leftDepth : rightDepth
}

function BinaryTreeParser(tree, levelArr, currentLevel, hIndexArr) {
    if (tree === undefined || tree === null || tree.children === null) {
        levelArr[currentLevel][hIndexArr[currentLevel].width++] = tree.root
        const depthLimit = hIndexArr.length
        let currentIndex = hIndexArr[currentLevel].width
        for (let i = currentLevel + 1; i < depthLimit; i++) {
            hIndexArr[i].width = currentIndex * 2
            currentIndex *= 2
        }
        return
    }
    
    levelArr[currentLevel][hIndexArr[currentLevel].width++] = tree.root
    
    BinaryTreeParser(tree.children[0], levelArr, currentLevel + 1, hIndexArr)
    BinaryTreeParser(tree.children[1], levelArr, currentLevel + 1, hIndexArr)
    
    hIndexArr[currentLevel + 1].width = hIndexArr[currentLevel].width * 2

    return
}

function BinaryTreeToString(levelArr, maxDepth) {
    let resultArr = []
    for (let i = 0; i < maxDepth; i++) {
        const startWidth = maxDepth - i - 2 >= 0 ? 5 * Math.pow(2, maxDepth - i - 2) + ((maxWordSize - 1) * (Math.floor(Math.pow(2, maxDepth - i) / 4))): 2 + maxWordSize - 1
        const paddingWidth = maxDepth - i - 1 >= 0 ? (5 * Math.pow(2, maxDepth - i - 1)) - maxWordSize : 2 + maxWordSize - 1
        let curLevel = ' '.repeat(startWidth + maxWordSize)
        const actualPadding = ' '.repeat(paddingWidth + ((maxWordSize - 1) * (Math.floor(Math.pow(2, maxDepth - i) / 2))))
        for (let j = 0; j < levelArr[i].length; j++) {
            curLevel += levelArr[i][j].trim() + actualPadding
        }
        resultArr.push(curLevel)
    }
    return resultArr.join('\n')
}

export default function BinaryTree(input) {
    maxWordSize = 1
    isRoot = true
    rootName = ""

    let tree = BinaryTreeHelper(input)

    const depth = BinaryTreeDepth(tree[0], 0)
    let levelArr = []
    let hIndexArr = []
    for (let i = 0; i < depth; i++) {
        const currWidth = Math.pow(2, i)
        levelArr.push([])

        /* Setup Array in the Shape of empty tree */
        for (let j = 0; j < currWidth; j++) {
            levelArr[i].push(' ')
        }
        
        /* Setup depth and width metadata */
        hIndexArr.push( 
            {
                limit : currWidth,
                width : 0
            }
        )
    }


    BinaryTreeParser(tree[0], levelArr, 0, hIndexArr)
    
    return "Not Perfect, user adjustment needed:\n" + BinaryTreeToString(levelArr, depth)
}