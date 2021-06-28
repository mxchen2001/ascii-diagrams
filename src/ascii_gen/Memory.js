import React from 'react';

export default function MemoryAscii(input) {
    // console.log(input)
    const memoryCell = input.split('\n')
    // console.log(memoryCell)
    memoryCell.shift()
    // console.log(memoryCell)


    let maxLength = {
        prefix : 5,
        content : 5,
        suffix : 5,
    }

    let formattedMemCell = []
    memoryCell.forEach((element, index) => {
        // console.log(element)
        let cellTokens = element.split(',')

        const prefix = cellTokens[0]
        const content = cellTokens[1]
        const suffix = cellTokens[2]
        
        if (element.indexOf('!break') !== -1) { 
            formattedMemCell.push(null)
            return; 
        }

        formattedMemCell.push([prefix, content, suffix])

        if (prefix !== undefined && prefix.length + 2 > maxLength.prefix) {
            maxLength.prefix = prefix.length + 2
        }
        if (content !== undefined && content.length + 2 > maxLength.content) {
            maxLength.content = content.length + 2
        }
        if (suffix !== undefined && suffix.length + 2 > maxLength.suffix) {
            maxLength.suffix = suffix.length + 2
        }
    });
    // console.log(formattedMemCell)

    let formattedMemCellString = []
    const splitPoint = ' '.repeat(maxLength.prefix) +  '+' + '-'.repeat(maxLength.content) + '+' + ' '.repeat(maxLength.suffix)
    const breakPoint = ' '.repeat(maxLength.prefix) +  '~ ' + '.'.repeat(maxLength.content - 2) + ' ~' + ' '.repeat(maxLength.suffix)
    formattedMemCellString.push(splitPoint)
    formattedMemCell.forEach(token => {
        if (token === null) {
            formattedMemCellString.push(breakPoint)
            formattedMemCellString.push(splitPoint)
            return;
        }
        if (token.includes(undefined)) {
            return;
        }

        const prefix = token[0]
        const content = token[1]
        const suffix = token[2]

        const contentLeftSpacing = Math.floor((maxLength.content - content.length) / 2)
        const contentRightSpacing = maxLength.content - content.length - contentLeftSpacing

        // console.log(contentLeftSpacing)
        // console.log(contentRightSpacing)

        const currentCell = ' '.repeat(maxLength.prefix - prefix.length - 1) +  prefix + ' |' + ' '.repeat(contentLeftSpacing) + content +  ' '.repeat(contentRightSpacing) + '| ' + suffix + ' '.repeat(maxLength.suffix - suffix.length)
        formattedMemCellString.push(currentCell)
        formattedMemCellString.push(splitPoint)
    });
    // formattedMemCellString.push(splitPoint)

    // console.log(formattedMemCellString)

    // console.log(maxLength)
    return '\n' + formattedMemCellString.join('\n');
}