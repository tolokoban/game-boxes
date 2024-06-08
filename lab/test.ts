const PLUS = "+"
const TOP = 0
const RIGHT = 1
const BOTTOM = 2
const LEFT = 3

class Board {
    /**
     * First half is made of vertical lines, second half is made of horizontal ones.
     *
     * The lines fill the rows one after the other.
     */
    private readonly lines: Uint8Array

    private readonly lineInfluences1: number[]

    private readonly lineInfluences2: number[]

    /**
     * The indexes in this array follow this pattern:
     * ```
     * for (rows ...) {
     *   for (cols ...) {
     *     Top
     *     Right
     *     Bottom
     *     Left
     *   }
     * }
     * The possible values are:
     *  - 0: no line.
     *  - 1: Player one's line.
     *  - 2: Player two's line.
     * ```
     */
    private readonly boxes: Uint8Array

    constructor(public readonly rows: number, public readonly cols: number) {
        const verticalLinesLength = (cols + 1) * rows
        const horizontalLinesLength = cols * (rows + 1)
        this.lines = new Uint8Array(verticalLinesLength + horizontalLinesLength)
        this.boxes = new Uint8Array(cols * rows * 4)
        const influences1: number[] = []
        const influences2: number[] = []
        // Vertical
        for (let row = 0; row < rows; row++) {
            influences1.push((row * cols + 0) * 4 + LEFT)
            for (let col = 0; col < cols; col++) {
                influences1.push((row * cols + col) * 4 + RIGHT)
                influences2.push((row * cols + col) * 4 + LEFT)
            }
            influences2.push((row * cols + (cols - 1)) * 4 + RIGHT)
        }
        // Horizontal
        for (let row = 0; row < rows; row++) {
            influences1.push((row * cols + 0) * 4 + TOP)
            for (let col = 0; col < cols; col++) {
                influences1.push((row * cols + col) * 4 + BOTTOM)
                influences2.push((row * cols + col) * 4 + TOP)
            }
            influences2.push((row * cols + (cols - 1)) * 4 + BOTTOM)
        }
        this.lineInfluences1 = influences1
        this.lineInfluences2 = influences2
    }

    getLine(lineIndex: number): number {
        return this.lines[lineIndex]
    }

    setLine(lineIndex: number, player: number) {
        this.lines[lineIndex] = player
        const influence1 = this.lineInfluences1[lineIndex]
        const influence2 = this.lineInfluences2[lineIndex]
        this.boxes[influence1] = player
        this.boxes[influence2] = player
    }

    getTop(row: number, col: number): number {
        return this.boxes[(row * this.cols + col) * 4]
    }

    getRight(row: number, col: number): number {
        return this.boxes[(row * this.cols + col) * 4 + 1]
    }

    getBottom(row: number, col: number): number {
        return this.boxes[(row * this.cols + col) * 4 + 2]
    }

    getLeft(row: number, col: number): number {
        return this.boxes[(row * this.cols + col) * 4 + 3]
    }

    toString() {
        const lines: string[] = []
        for (let row = 0; row < this.rows; row++) {
            const line1: string[] = []
            const line2: string[] = [this.vertical(this.getLeft(row, 0))]
            for (let col = 0; col < this.cols; col++) {
                line1.push(this.horizontal(this.getTop(row, col)))
                line2.push(this.vertical(this.getRight(row, col)))
            }
            lines.push(`${PLUS}${line1.join(PLUS)}${PLUS}`, line2.join(" "))
        }
        const line3: string[] = []
        for (let col = 0; col < this.cols; col++) {
            line3.push(this.horizontal(this.getBottom(this.rows - 1, col)))
        }
        lines.push(`${PLUS}${line3.join(PLUS)}${PLUS}`)
        return lines.join("\n")
    }

    private horizontal(type: number) {
        switch (type) {
            case 1:
            case 2:
                return "-"
            default:
                return " "
        }
    }

    private vertical(type: number) {
        switch (type) {
            case 1:
            case 2:
                return "|"
            default:
                return " "
        }
    }
}

const board = new Board(3, 3)
console.log(board.toString())
for (let i = 12; i < 24; i++) {
    console.log("Index:", i)
    board.setLine(i, 1)
    console.log(board.toString())
}
