import React from 'react';

function LinkedListAsciiHelper(input) {
    const memoryCell = input.split('\n')
    let isReverse = memoryCell[0] === '@rll'
    if (memoryCell[0] === '@ll' || memoryCell[0] === '@rll' || memoryCell[0] === '') {
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
        const suffix = ''
        
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

    for (let i = 0; i < formattedMemCell.length; i++) {
        const token = formattedMemCell[i]
        if (token === null) {
            formattedMemCellString.push(breakPoint)
            break;
        }
        if (token.includes(undefined)) {
            if (!seenTitleCell) {
                if (token.join("").trim() === "") {
                    break;
                }
                formattedMemCellString.push(token.join("").trim())
                seenTitleCell = true
            }
            break;
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


        if (i < formattedMemCell.length - 1) {
            formattedMemCellString.push(splitPoint)
            let downArrow = ' '.repeat(maxLength.prefix + 1) + '|'

            if (isReverse) {
                downArrow += ' '.repeat(maxLength.content - 2) + '^' + ' '.repeat(contentLeftSpacing)
            }
            downArrow +=  '\n'
            downArrow += ' '.repeat(maxLength.prefix + 1) +  'V'
            if (isReverse) {
                downArrow += ' '.repeat(maxLength.content - 2) +  '|' + ' '.repeat(contentLeftSpacing)
            }
    
            formattedMemCellString.push(downArrow)
        }

    }
    formattedMemCellString.push(splitPoint)
    return formattedMemCellString
}

export default function LinkedListAscii(input) {
    let result = "\n"
    result += LinkedListAsciiHelper(input).join('\n') + '\n'
    return result
}