import { ChessType, RotateType } from "@/common/constants/Enum";

const funcCheckRotate = (rotate) => {
  rotate = ((rotate % 360) + 360) % 360;
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
  return null;
};

// const isOccupied = (startRow, startCol, endRow, endCol, rotateStr, chessBoard) => {
//     if (rotateStr === RotateType.straight) {
//         for (let i = startRow - 1; i > endRow; i--) {
//             const element = chessBoard[i][startCol];
//             if (element?.teamType) {
//                 return true;
//             }
//         }
//         return false;
//     }
//     if (rotateStr === RotateType.right) {
//         for (let i = startCol + 1; i < endCol; i++) {
//             const element = chessBoard[startRow][i];
//             if (element?.teamType) {
//                 return true;
//             }
//         }
//         return false;
//     }
//     if (rotateStr === RotateType.down) {
//         for (let i = startRow + 1; i < endRow; i++) {
//             const element = chessBoard[i][startCol];
//             console.log('ele', element)
//             if (element?.teamType) {
//                 return true
//             }
//         }
//         return false;
//     }
//     if (rotateStr === RotateType.left) {
//         for (let i = startCol - 1; i > endCol; i--) {
//             const element = chessBoard[startRow][i];
//             if (element?.teamType) {
//                 return true;
//             }
//         }
//         return false;
//     }
// }
const recommendMoveBinh = (startRow, startCol, rotateStr) => {
  if (rotateStr === RotateType.straight) {
    return startRow - 1 >= 0 ? [{ col: startCol, row: startRow - 1 }] : [];
  }
  if (rotateStr === RotateType.right) {
    return startCol + 1 < 9 ? [{ col: startCol + 1, row: startRow }] : [];
  }
  if (rotateStr === RotateType.down) {
    return startRow + 1 >= 0 ? [{ col: startCol, row: startRow + 1 }] : [];
  }
  if (rotateStr === RotateType.left) {
    return startCol - 1 >= 0 ? [{ col: startCol - 1, row: startRow }] : [];
  }
};
const recommendMoveXa = (startRow, startCol, rotateStr, chessboard) => {
  if (rotateStr === RotateType.straight) {
    if (startRow - 1 < 0) return [];
    const res = [];
    for (let i = startRow - 1; i >= 0; i--) {
      const element = chessboard[i][startCol];
      if (element?.teamType) {
        res.push({ row: i, col: startCol });
        break;
      }
      res.push({ row: i, col: startCol });
    }
    return res;
  }
  if (rotateStr === RotateType.right) {
    if (startCol + 1 >= 9) return [];
    const res = [];
    for (let i = startCol + 1; i < 9; i++) {
      const element = chessboard[startRow][i];
      if (element?.teamType) {
        res.push({ row: startRow, col: i });
        break;
      }
      res.push({ col: i, row: startRow });
    }
    return res;
  }
  if (rotateStr === RotateType.left) {
    if (startCol - 1 < 0) return [];
    const res = [];
    for (let i = startCol - 1; i >= 0; i--) {
      const element = chessboard[startRow][i];
      if (element?.teamType) {
        res.push({ row: startRow, col: i });
        break;
      }
      res.push({ col: i, row: startRow });
    }
    return res;
  }
  if (rotateStr === RotateType.down) {
    if (startRow + 1 >= 9) return [];
    const res = [];
    for (let i = startRow + 1; i < 9; i++) {
      const element = chessboard[i][startCol];
      if (element?.teamType) {
        res.push({ row: i, col: startCol });
        break;
      }
      res.push({ row: i, col: startCol });
    }
    return res;
  }
};
const recommendMoveKi = (startRow, startCol, rotateStr) => {
  if (rotateStr === RotateType.straight) {
    const res = [];
    startRow - 2 >= 0 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow - 2, col: startCol + 1 }); // right straight
    startRow - 2 >= 0 &&
      startCol - 1 < 9 &&
      res.push({ row: startRow - 2, col: startCol - 1 }); // left straight
    startRow + 2 < 9 && res.push({ row: startRow + 2, col: startCol }); // down center
    startRow + 2 < 9 &&
      startCol - 2 >= 0 &&
      res.push({ row: startRow + 2, col: startCol - 2 }); // down left
    startRow + 2 < 9 &&
      startCol + 2 < 9 &&
      res.push({ row: startRow + 2, col: startCol + 2 }); // down right
    return res;
  }
  if (rotateStr === RotateType.right) {
    const res = [];
    startCol + 2 < 9 &&
      startRow + 1 < 9 &&
      res.push({ row: startRow + 1, col: startCol + 2 }); // right right
    startCol + 2 < 9 &&
      startRow - 1 >= 0 &&
      res.push({ row: startRow - 1, col: startCol + 2 }); // left right
    startCol - 2 >= 0 && res.push({ row: startRow, col: startCol - 2 }); // down center
    startCol - 2 >= 0 &&
      startRow - 2 >= 0 &&
      res.push({ row: startRow - 2, col: startCol - 2 }); // down left
    startCol - 2 >= 0 &&
      startRow + 2 < 9 &&
      res.push({ row: startRow + 2, col: startCol - 2 }); // down right
    return res;
  }
  if (rotateStr === RotateType.down) {
    const res = [];
    startRow - 2 >= 0 && res.push({ row: startRow - 2, col: startCol }); //center
    startRow - 2 >= 0 &&
      startCol + 2 < 9 &&
      res.push({ row: startRow - 2, col: startCol + 2 }); // right
    startRow - 2 >= 0 &&
      startCol - 2 >= 0 &&
      res.push({ row: startRow - 2, col: startCol - 2 }); // left
    startRow + 2 < 9 &&
      startCol - 1 >= 0 &&
      res.push({ row: startRow + 2, col: startCol - 1 }); // left
    startRow + 2 < 9 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow + 2, col: startCol + 1 }); // right
    return res;
  }
  if (rotateStr === RotateType.left) {
    const res = [];
    startCol - 2 >= 0 &&
      startRow + 1 < 9 &&
      res.push({ row: startRow + 1, col: startCol - 2 }); // right right
    startCol - 2 >= 0 &&
      startRow - 1 >= 0 &&
      res.push({ row: startRow - 1, col: startCol - 2 }); // left right
    startCol + 2 < 9 && res.push({ row: startRow, col: startCol + 2 }); // down center
    startCol + 2 < 9 &&
      startRow - 2 >= 0 &&
      res.push({ row: startRow - 2, col: startCol + 2 }); // down left
    startCol + 2 < 9 &&
      startRow + 2 < 9 &&
      res.push({ row: startRow + 2, col: startCol + 2 }); // down right
    return res;
  }
};
const recommendMoveSi = (startRow, startCol, rotateStr) => {
  if (rotateStr === RotateType.straight) {
    const res = [];
    startRow - 1 >= 0 && res.push({ row: startRow - 1, col: startCol }); // center straight
    startRow - 1 >= 0 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow - 1, col: startCol + 1 }); // right
    startRow - 1 >= 0 &&
      startCol - 1 < 9 &&
      res.push({ row: startRow - 1, col: startCol - 1 }); // left straight
    startRow + 1 < 9 &&
      startCol - 1 >= 0 &&
      res.push({ row: startRow + 1, col: startCol - 1 }); // down left
    startRow + 1 < 9 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow + 1, col: startCol + 1 }); // down right
    return res;
  }
  if (rotateStr === RotateType.right) {
    const res = [];
    startCol + 1 < 9 && res.push({ row: startRow, col: startCol + 1 }); // center straight
    startRow + 1 < 9 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow + 1, col: startCol + 1 }); // right
    startRow - 1 >= 0 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow - 1, col: startCol + 1 }); // left straight
    startRow - 1 >= 0 &&
      startCol - 1 >= 0 &&
      res.push({ row: startRow - 1, col: startCol - 1 }); // down left
    startRow + 1 < 9 &&
      startCol - 1 < 9 &&
      res.push({ row: startRow + 1, col: startCol - 1 }); // down right
    return res;
  }
  if (rotateStr === RotateType.down) {
    const res = [];
    startRow + 1 < 9 && res.push({ row: startRow + 1, col: startCol }); // center straight
    startRow + 1 < 9 &&
      startCol - 1 >= 0 &&
      res.push({ row: startRow + 1, col: startCol - 1 }); // right
    startRow + 1 < 9 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow + 1, col: startCol + 1 }); // left straight
    startRow - 1 >= 0 &&
      startCol - 1 >= 0 &&
      res.push({ row: startRow - 1, col: startCol - 1 }); // down left
    startRow - 1 >= 0 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow - 1, col: startCol + 1 }); // down right
    return res;
  }
  if (rotateStr === RotateType.left) {
    const res = [];
    startCol - 1 >= 0 && res.push({ row: startRow, col: startCol - 1 }); // center straight
    startRow - 1 >= 0 &&
      startCol - 1 >= 0 &&
      res.push({ row: startRow - 1, col: startCol - 1 }); // right
    startRow + 1 < 9 &&
      startCol - 1 >= 0 &&
      res.push({ row: startRow + 1, col: startCol - 1 }); // left straight
    startRow - 1 >= 0 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow - 1, col: startCol + 1 }); // down left
    startRow + 1 < 9 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow + 1, col: startCol + 1 }); // down right
    return res;
  }
};
const recommendMoveTuong = (startRow, startCol, rotateStr) => {
  if (rotateStr === RotateType.straight) {
    const res = [];
    startRow - 1 >= 0 && res.push({ row: startRow - 1, col: startCol }); // center
    startRow - 1 >= 0 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow - 1, col: startCol + 1 }); // center right
    startRow - 1 >= 0 &&
      startCol - 1 < 9 &&
      res.push({ row: startRow - 1, col: startCol - 1 }); // center left
    startCol - 1 >= 0 && res.push({ row: startRow, col: startCol - 1 }); // right
    startCol + 1 < 9 && res.push({ row: startRow, col: startCol + 1 }); // left
    startRow + 1 < 9 && res.push({ row: startRow + 1, col: startCol }); // down
    return res;
  }
  if (rotateStr === RotateType.right) {
    const res = [];
    startCol + 1 < 9 && res.push({ row: startRow, col: startCol + 1 }); // center
    startRow + 1 < 9 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow + 1, col: startCol + 1 }); //center right
    startRow - 1 >= 0 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow - 1, col: startCol + 1 }); //ceneter left
    startRow - 1 >= 0 && res.push({ row: startRow - 1, col: startCol }); //  left
    startRow + 1 < 9 && res.push({ row: startRow + 1, col: startCol }); //  right
    startCol - 1 >= 0 && res.push({ row: startRow, col: startCol - 1 }); // down
    return res;
  }
  if (rotateStr === RotateType.down) {
    const res = [];
    startRow + 1 < 9 && res.push({ row: startRow + 1, col: startCol }); // center
    startRow + 1 < 9 &&
      startCol - 1 >= 0 &&
      res.push({ row: startRow + 1, col: startCol - 1 }); // center right
    startRow + 1 < 9 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow + 1, col: startCol + 1 }); // center left
    startCol - 1 >= 0 && res.push({ row: startRow, col: startCol - 1 }); //  right
    startCol + 1 >= 0 && res.push({ row: startRow, col: startCol + 1 }); //  left
    startRow - 1 >= 0 && res.push({ row: startRow - 1, col: startCol }); // down
    return res;
  }
  if (rotateStr === RotateType.left) {
    const res = [];
    startCol - 1 >= 0 && res.push({ row: startRow, col: startCol - 1 }); // center
    startRow - 1 >= 0 &&
      startCol - 1 >= 0 &&
      res.push({ row: startRow - 1, col: startCol - 1 }); //  center right
    startRow + 1 < 9 &&
      startCol - 1 >= 0 &&
      res.push({ row: startRow + 1, col: startCol - 1 }); // center left
    startRow - 1 >= 0 && res.push({ row: startRow - 1, col: startCol }); // right
    startRow + 1 < 9 && res.push({ row: startRow + 1, col: startCol }); // left
    startCol + 1 >= 0 && res.push({ row: startRow, col: startCol + 1 }); // down
    return res;
  }
};
const recommendMoveVuong = (startRow, startCol, rotateStr) => {
  const res = [];
  if (rotateStr === RotateType.straight) {
    startRow - 1 >= 0 && res.push({ row: startRow - 1, col: startCol }); // center
    startRow - 1 >= 0 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow - 1, col: startCol + 1 }); // center right
    startRow - 1 >= 0 &&
      startCol - 1 >= 0 &&
      res.push({ row: startRow - 1, col: startCol - 1 }); // center left
    startCol - 1 >= 0 && res.push({ row: startRow, col: startCol - 1 }); // left
    startCol + 1 < 9 && res.push({ row: startRow, col: startCol + 1 }); // right
    startRow + 1 < 9 && res.push({ row: startRow + 1, col: startCol }); // down
    startRow + 1 < 9 &&
      startCol - 1 >= 0 &&
      res.push({ row: startRow + 1, col: startCol - 1 }); // down left
    startRow + 1 < 9 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow + 1, col: startCol + 1 }); // down right
  }
  if (rotateStr === RotateType.right) {
    startCol + 1 < 9 && res.push({ row: startRow, col: startCol + 1 }); // center
    startRow + 1 < 9 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow + 1, col: startCol + 1 }); // center right
    startRow - 1 >= 0 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow - 1, col: startCol + 1 }); // center left
    startRow - 1 >= 0 && res.push({ row: startRow - 1, col: startCol }); // left
    startRow + 1 < 9 && res.push({ row: startRow + 1, col: startCol }); // right
    startCol - 1 >= 0 && res.push({ row: startRow, col: startCol - 1 }); // down
    startCol - 1 >= 0 &&
      startRow - 1 >= 0 &&
      res.push({ row: startRow - 1, col: startCol - 1 }); // down left
    startCol - 1 >= 0 &&
      startRow + 1 < 9 &&
      res.push({ row: startRow + 1, col: startCol - 1 }); // down right
  }
  if (rotateStr === RotateType.down) {
    startRow + 1 < 9 && res.push({ row: startRow + 1, col: startCol }); // center
    startRow + 1 < 9 &&
      startCol - 1 >= 0 &&
      res.push({ row: startRow + 1, col: startCol - 1 }); // center left
    startRow + 1 < 9 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow + 1, col: startCol + 1 }); // center right
    startCol - 1 >= 0 && res.push({ row: startRow, col: startCol - 1 }); // left
    startCol + 1 < 9 && res.push({ row: startRow, col: startCol + 1 }); // right
    startRow - 1 >= 0 && res.push({ row: startRow - 1, col: startCol }); // up
    startRow - 1 >= 0 &&
      startCol - 1 >= 0 &&
      res.push({ row: startRow - 1, col: startCol - 1 }); // up left
    startRow - 1 >= 0 &&
      startCol + 1 < 9 &&
      res.push({ row: startRow - 1, col: startCol + 1 }); // up right
  }
  if (rotateStr === RotateType.left) {
    startCol - 1 >= 0 && res.push({ row: startRow, col: startCol - 1 }); // center
    startRow - 1 >= 0 &&
      startCol - 1 >= 0 &&
      res.push({ row: startRow - 1, col: startCol - 1 }); // center left
    startRow + 1 < 9 &&
      startCol - 1 >= 0 &&
      res.push({ row: startRow + 1, col: startCol - 1 }); // center right
    startRow - 1 >= 0 && res.push({ row: startRow - 1, col: startCol }); // up
    startRow + 1 < 9 && res.push({ row: startRow + 1, col: startCol }); // down
    startCol + 1 < 9 && res.push({ row: startRow, col: startCol + 1 }); // right
    startCol + 1 < 9 &&
      startRow - 1 >= 0 &&
      res.push({ row: startRow - 1, col: startCol + 1 }); // up right
    startCol + 1 < 9 &&
      startRow + 1 < 9 &&
      res.push({ row: startRow + 1, col: startCol + 1 }); // down right
  }
  return res;
};
const recommendMoveLong = (startRow, startCol, chessboard, rotateStr) => {
  const res = [];
  if (rotateStr === RotateType.straight) {
    for (let i = startRow - 1; i >= 0; i--) {
      // straight
      const element = chessboard[i][startCol];
      if (element?.teamType) {
        res.push({ row: i, col: startCol });
        break;
      }
      res.push({ row: i, col: startCol });
    }
  }
  if (rotateStr === RotateType.right) {
    for (let i = startCol + 1; i < 9; i++) {
      // right
      const element = chessboard[startRow][i];
      if (element?.teamType) {
        res.push({ row: startRow, col: i });
        break;
      }
      res.push({ col: i, row: startRow });
    }
  }
  if (rotateStr === RotateType.down) {
    for (let i = startRow + 1; i < 9; i++) {
      // down
      const element = chessboard[i][startCol];
      if (element?.teamType) {
        res.push({ row: i, col: startCol });
        break;
      }
      res.push({ row: i, col: startCol });
    }
  }
  if (rotateStr === RotateType.left) {
    for (let i = startCol - 1; i >= 0; i--) {
      // left
      const element = chessboard[startRow][i];
      if (element?.teamType) {
        res.push({ row: startRow, col: i });
        break;
      }
      res.push({ col: i, row: startRow });
    }
  }
  return res;
};
const recommendMovePhuong = (startRow, startCol, chessboard, rotateStr) => {
  const res = [];
  if (rotateStr === RotateType.straight) {
    for (let i = 1; i < 9; i++) {
      //straight left
      if (startRow - i < 0 || startCol - i < 0) break;
      const element = chessboard[startRow - i][startCol - i];
      if (element?.teamType) {
        res.push({ row: startRow - i, col: startCol - i });
        break;
      }
      res.push({ row: startRow - i, col: startCol - i });
    }
    for (let i = 1; i < 9; i++) {
      //straight right
      if (startRow - i < 0 || startCol + i >= 9) break;
      const element = chessboard[startRow - i][startCol + i];
      if (element?.teamType) {
        res.push({ row: startRow - i, col: startCol + i });
        break;
      }
      res.push({ row: startRow - i, col: startCol + i });
    }
  }
  if (rotateStr === RotateType.right) {
    for (let i = 1; i < 9; i++) {
      //right up
      if (startRow - i < 0 || startCol + i >= 9) break;
      const element = chessboard[startRow - i][startCol + i];
      if (element?.teamType) {
        res.push({ row: startRow - i, col: startCol + i });
        break;
      }
      res.push({ row: startRow - i, col: startCol + i });
    }
    for (let i = 1; i < 9; i++) {
      //right down
      if (startRow + i >= 9 || startCol + i >= 9) break;
      const element = chessboard[startRow + i][startCol + i];
      if (element?.teamType) {
        res.push({ row: startRow + i, col: startCol + i });
        break;
      }
      res.push({ row: startRow + i, col: startCol + i });
    }
  }
  if (rotateStr === RotateType.down) {
    for (let i = 1; i < 9; i++) {
      //down left
      if (startRow + i >= 9 || startCol - i < 0) break;
      const element = chessboard[startRow + i][startCol - i];
      if (element?.teamType) {
        res.push({ row: startRow + i, col: startCol - i });
        break;
      }
      res.push({ row: startRow + i, col: startCol - i });
    }
    for (let i = 1; i < 9; i++) {
      //down right
      if (startRow + i >= 9 || startCol + i >= 9) break;
      const element = chessboard[startRow + i][startCol + i];
      if (element?.teamType) {
        res.push({ row: startRow + i, col: startCol + i });
        break;
      }
      res.push({ row: startRow + i, col: startCol + i });
    }
  }
  if (rotateStr === RotateType.left) {
    for (let i = 1; i < 9; i++) {
      //left up
      if (startRow - i < 0 || startCol - i < 0) break;
      const element = chessboard[startRow - i][startCol - i];
      if (element?.teamType) {
        res.push({ row: startRow - i, col: startCol - i });
        break;
      }
      res.push({ row: startRow - i, col: startCol - i });
    }
    for (let i = 1; i < 9; i++) {
      //left down
      if (startRow + i >= 9 || startCol - i < 0) break;
      const element = chessboard[startRow + i][startCol - i];
      if (element?.teamType) {
        res.push({ row: startRow + i, col: startCol - i });
        break;
      }
      res.push({ row: startRow + i, col: startCol - i });
    }
  }
  return res;
};
export const recommendMove = (startRow, startCol, objChess, chessboard) => {
  let { rotate, type } = objChess;
  switch (type) {
    case ChessType.Binh:
      return recommendMoveBinh(startRow, startCol, funcCheckRotate(rotate));
    case ChessType.Xa:
      return recommendMoveXa(
        startRow,
        startCol,
        funcCheckRotate(rotate),
        chessboard
      );
    case ChessType.Ki:
      return recommendMoveKi(startRow, startCol, funcCheckRotate(rotate));
    case ChessType.Si:
      return recommendMoveSi(startRow, startCol, funcCheckRotate(rotate));
    case ChessType.Tuong:
      return recommendMoveTuong(startRow, startCol, funcCheckRotate(rotate));
    case ChessType.Vuong:
      return recommendMoveVuong(startRow, startCol, funcCheckRotate(rotate));
    case ChessType.Long:
      return recommendMoveLong(
        startRow,
        startCol,
        chessboard,
        funcCheckRotate(rotate)
      );
    case ChessType.Phuong:
      return recommendMovePhuong(
        startRow,
        startCol,
        chessboard,
        funcCheckRotate(rotate)
      );
    default:
      break;
  }
  return [];
};
export const checkMate = (turn, chess) => {
  let vuong;
  chess.forEach((item) => {
    if (!vuong)
      vuong = item.find(
        (chess) => chess?.type === "V" && chess?.teamType === turn
      );
  });
  if (vuong) {
    let possibleMoves = recommendMoveVuong(
      vuong.position.row,
      vuong.position.col,
      funcCheckRotate(vuong.rotate)
    ).filter((item) => {
      if (
        chess[item.row][item.col] === null ||
        !chess[item.row][item.col].teamType
      )
        return true;
      if (chess[item.row][item.col].teamType !== turn) return true;
      return false;
    });
    possibleMoves.push({ row: vuong.position.row, col: vuong.position.col });
    let impossibleMove = {};
    let move = {};
    let arrCheckMate = [];
    let lengthChess = chess.length;
    for (let row = 0; row < lengthChess; row++) {
      const cols = chess[row];
      let lengthCols = cols.length;
      for (let col = 0; col < lengthCols; col++) {
        const piece = cols[col];
        if (piece && piece.position && piece.teamType === turn) {
          recommendMove(
            piece.position.row,
            piece.position.col,
            piece,
            chess
          ).forEach((item) => {
            let srtPosition = `${item.row}${item.col}`;
            if (move[srtPosition]) {
              move[srtPosition] += 1;
            } else {
              move[srtPosition] = 1;
            }
          });
        }
        if (piece && piece.position && piece.teamType !== turn) {
          recommendMove(
            piece.position.row,
            piece.position.col,
            piece,
            chess
          ).forEach((item) => {
            let srtPosition = `${item.row}${item.col}`;
            if (
              item.row === vuong.position.row &&
              item.col === vuong.position.col
            ) {
              arrCheckMate.push(`${piece.position.row}${piece.position.col}`);
            }
            if (impossibleMove[srtPosition]) {
              impossibleMove[srtPosition] += 1;
            } else {
              impossibleMove[srtPosition] = 1;
            }
          });
        }
      }
    }
    let isNotRoute = possibleMoves.filter(
      (item) => impossibleMove[`${item.row}${item.col}`] === undefined
    );
    let isCheckMate = arrCheckMate.filter((item) => move[item] === undefined);
    if (isNotRoute.length === 0 && isCheckMate.length > 0) {
      if (arrCheckMate.length >= 2) {
        return true;
      }
      for (let index = 0; index < isCheckMate.length; index++) {
        const [row, col] = isCheckMate[index];
        let piece = chess[row][col];
        if (
          piece.type === ChessType.Long ||
          piece.type === ChessType.Xa ||
          piece.type === ChessType.Phuong
        ) {
          const isCanBlock = recommendMove(
            piece.position.row,
            piece.position.col,
            piece,
            chess
          )
            .filter(
              (item) =>
                item.row === vuong.position.row ||
                item.col === vuong.position.col
            )
            .find((item) => move[`${item.row}${item.col}`]);
          if (isCanBlock) {
            return false;
          }
        }
      }
      return true;
    } else {
      if (isNotRoute.length === 0) return true; //hết đường
      // console.log('chiếu chưa hết')
      return false;
    }
  } else {
    return false;
  }
};
export const checkRedZone = (turn, chess) => {
  let vuong;
  // let vuongReverse;
  chess.forEach((item) => {
    if (!vuong)
      vuong = item.find(
        (chess) => chess?.type === "V" && chess?.teamType !== turn
      );
  });
  if (vuong) {
    let impossibleMove = [];
    for (let row = 0; row < chess.length; row++) {
      const cols = chess[row];
      for (let col = 0; col < cols.length; col++) {
        const piece = cols[col];
        if (piece && piece.teamType === turn) {
          recommendMove(
            piece.position.row,
            piece.position.col,
            piece,
            chess
          ).forEach((item) => impossibleMove.push(item));
        }
      }
    }
    for (let index = 0; index < impossibleMove.length; index++) {
      const coorPossible = impossibleMove[index];
      if (
        coorPossible.row === vuong.position.row &&
        coorPossible.col === vuong.position.col
      ) {
        return true;
      }
    }
  }
  return false;
};
export const checkIsSameType = ({
  col: endCol,
  row: endRow,
  chessboard,
  piece,
}) => {
  let lengthBoard = chessboard.length;
  for (let row = 0; row < lengthBoard; row++) {
    const cols = chessboard[row];
    for (let col = 0; col < cols.length; col++) {
      const _piece = cols[col];
      if (
        _piece?.teamType &&
        _piece.teamType === piece.teamType &&
        _piece.type === piece.type &&
        (_piece.position.row !== piece.position.row ||
          _piece.position.col !== piece.position.col)
      ) {
        let obj = recommendMove(
          _piece.position.row,
          _piece.position.col,
          _piece,
          chessboard
        ).find((item) => item.col === endCol && item.row === endRow);
        if (obj) {
          return true;
        }
      }
    }
  }
  return false;
};

export const isValidMove = (endRow, endCol, objChess, validMove) => {
  return validMove.findIndex(
    ({ row, col }) => row === endRow && col === endCol
  ) !== -1
    ? true
    : false;
};
