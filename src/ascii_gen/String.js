import React from 'react';


function StringAsciiHelper(string) {
    const length = string.length
    let result = ""
    for (let i = 0; i < string.length; i++) {
        let currentChar = '| ' + string[i] + ' '
        if (string[i] === ' ') {
            currentChar = '|\' \''
        }
        if (string[i] === '\\' && i < string.length - 1) {
            currentChar = '| \\'  + string[i + 1];
            i++;
        }
        result += currentChar
    }
    result += '| \\0|'
    let indices = ""
    for (let i = 0; i < (result.length / 4) - 1; i++) {
        if (i < 10) {
            indices += '  '
        } else if (i < 100){
            indices += ' '
        }
        indices += i + ' '
    }
    const bar = '+---'.repeat(result.length / 4) + '+'
    return indices + '\n' + bar + '\n' + result + '\n' + bar
}

export default function StringAscii(input) {
    let stringArr = input.split('\n')
    stringArr.shift()
    let output = "\n"
    stringArr.forEach(string => {
        output += StringAsciiHelper(string) + "\n\n\n"
    });
    return output;
}