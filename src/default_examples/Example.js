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

export const dirsExample = 
`@dirs
root
    bin
        bash
        cat
        chmod
        cp
        echo
    dev
        hda
        sda
        st0
    etc
    user
        bin
            my_executable
        include
        lib
            string.h
        local
    home
        michael
            Documents
                nuclear_launch_codes.txt
            Downloads
            Music
`

export const memExample = 
`@mem
PROGRAM:
0x3000,.ORIG, <- start of userspace
!break
0x4000, 0x1234 , <- stack pointer
,,
!break
0xFE00,0x9000, -> Pointer
!break
0xFFFF,, <- end of memory
0x10000,, <- segmented memory

!start
STRING:
0x9000,'H', <- [0xFE00]
,'E',
,'L',
,'L',
,'0',
,'\\0',
`

export const strExample = 
`@str
Hello World
Special \n Characters
Multiple   Spaces

^^^ Empty String ^^^
`

export const btreeExample = 
`@btree
root
    a
        c
            w
                s
                t
            x
                q
                r
        d   
            y
                h
                i
            z
                j
                k
    b
        e
            1
                m
                n
            2
                o
                p
        f
            g
                3
                4
            h
                5
                6
`

export const heapExample = 
`@btree
1
    2
        4
            8
            9
        5   
            10
    3
        6
            11
            12
        7
            13
`

export const llExample = 
`@ll
0x3000,head
0x3010,10
0x3020,20
0x3030,30
,null`

export const rllExample = 
`@rll
0x3000,head
0x3010,10
0x3020,20
0x3030,30
,tail`
