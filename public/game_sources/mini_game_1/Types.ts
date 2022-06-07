export type squareParams = {
  colorName: string,
  bgColor: string,
  isCorrect: boolean,
  handleClick: (isCorrect: boolean) => any
}

export type colorNameTypes = "red" | "blue" | "green" | "yellow";