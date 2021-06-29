import React from 'react';


function MemoryAsciiHelper(input) {
    const memoryCell = input.split('\n')
    if (memoryCell[0] === '@mem' || memoryCell[0] === '!start' || memoryCell[0] === '') {
        memoryCell.shift()
    }
    
    let maxLength = {
        prefix : 5,
        content : 5,
        suffix : 5,
    }
    
    let formattedMemCell = []
    memoryCell.forEach((element, index) => {
        let cellTokens = element.split(',')
        
        const prefix = cellTokens[0]
        const content = cellTokens[1]
        const suffix = cellTokens[2]
        
        if (element.indexOf('!break') !== -1) { 
            formattedMemCell.push(null)
            return; 
        }
    
        formattedMemCell.push([prefix, content, suffix])
    
        if (prefix === undefined || content === undefined || suffix === undefined) {
            return;
        }
    
        if (prefix !== undefined && prefix.trim().length + 2 > maxLength.prefix) {
            maxLength.prefix = prefix.length + 2
        }
        if (content !== undefined && content.trim().length + 2 > maxLength.content) {
            maxLength.content = content.length + 2
        }
        if (suffix !== undefined && suffix.trim().length + 2 > maxLength.suffix) {
            maxLength.suffix = suffix.length + 2
        }
    });

    let formattedMemCellString = []
    const splitPoint = ' '.repeat(maxLength.prefix) +  '+' + '-'.repeat(maxLength.content) + '+' + ' '.repeat(maxLength.suffix)
    const breakPoint = ' '.repeat(maxLength.prefix) +  '~ ' + '.'.repeat(maxLength.content - 2) + ' ~' + ' '.repeat(maxLength.suffix)
    
    let seenTitleCell = false
    formattedMemCell.forEach(token => {
        if (token === null) {
            formattedMemCellString.push(splitPoint)
            formattedMemCellString.push(breakPoint)
            return;
        }
        if (token.includes(undefined)) {
            if (!seenTitleCell) {
                if (token.join("").trim() === "") {
                    return
                }
                formattedMemCellString.push(token.join("").trim())
                seenTitleCell = true
            }
            return;
        }
        formattedMemCellString.push(splitPoint)
        const prefix = token[0].trim()
        const content = token[1].trim()
        const suffix = token[2].trim()
    
        const prefixSpacing = maxLength.prefix - prefix.length - 1 < 0 ? -1 * (maxLength.prefix - prefix.lengt - 1) : maxLength.prefix - prefix.length - 1
        const suffixSpacing = maxLength.suffix - suffix.length < 0 ? -1 * (maxLength.suffix - suffix.length) : maxLength.suffix - suffix.length
        const contentLeftSpacing = Math.floor((maxLength.content - content.length) / 2)
        const contentRightSpacing = maxLength.content - content.length - contentLeftSpacing

        const currentCell = ' '.repeat(prefixSpacing) +  prefix + ' |' + ' '.repeat(contentLeftSpacing) + content +  ' '.repeat(contentRightSpacing) + '| ' + suffix + ' '.repeat(suffixSpacing)
        formattedMemCellString.push(currentCell)
    });
    formattedMemCellString.push(splitPoint)
    return formattedMemCellString
}

export default function MemoryAscii(input) {
    const memoryBlocks = input.split("!start")
    let result = "\n"
    memoryBlocks.forEach(block => {
        result += MemoryAsciiHelper(block).join('\n') + '\n\n\n'
    });

    return result
}