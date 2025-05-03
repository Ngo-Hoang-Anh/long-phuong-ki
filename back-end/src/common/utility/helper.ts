import { ValidationError } from "class-validator"
import { isValidObjectId } from "mongoose"

export const convertValueErrorToArray = (errors: ValidationError[]) => {
    return errors.map(item => item.constraints ? Object.values(item.constraints) : null).flat(1)[0]
}
export const isObjectId = (id: string) => isValidObjectId(id);
const colToChar = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'
]
const rowConvert = [
    '9', '8', '7', '6', '5', '4', '3', '2', '1'
]
export const parseColRowToCharactor = (col: number, row: number) => {
    return `${colToChar[row]}${rowConvert[col]}`;
}

export const RotateType = {
    straight: '^',
    left: '<',
    right: '>',
    down: 'v'
}
export const funcCheckRotate = (rotate: number) => {
    rotate = (rotate % 360 + 360) % 360;
    switch (Math.abs((rotate / 180) % 2)) {
        case 1:
            return RotateType.straight;
        case 1.5:
            return RotateType.right;
        case 0:
            return RotateType.down;
        case 0.5:
            return RotateType.left;
        default:
            break;
    }
    return null
}