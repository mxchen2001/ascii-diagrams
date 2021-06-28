export const dirExample = 
`@dir
root
    dir1
        file1
    dir2
        file2
        dir3
            file3
root2
    file4
    file5
`

export const memExample = 
`@mem
0x3000,.ORIG, <- start of userspace
!break
0x4000, 0x1234 , <- stack pointer
,,
!break
,,
!break
0xFFFF,, <- end of memory
`