export const difficulties = {
  easy: { range: 10, time: 30, name: 'Easy', multiplier: 1, basePoints: 10 },
  medium: { range: 50, time: 25, name: 'Medium', multiplier: 1.5, basePoints: 20 },
  hard: { range: 100, time: 20, name: 'Hard', multiplier: 2, basePoints: 30 }
};

export const operations = ['+', '-', '×', '÷'];

export const generateQuestion = (difficulty = 'easy') => {
  const range = difficulties[difficulty].range;
  const op = operations[Math.floor(Math.random() * operations.length)];
  let num1, num2, answer;

  switch (op) {
    case '+':
      num1 = Math.floor(Math.random() * range);
      num2 = Math.floor(Math.random() * range);
      answer = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * range);
      num2 = Math.floor(Math.random() * num1 + 1);
      answer = num1 - num2;
      break;
    case '×':
      num1 = Math.floor(Math.random() * Math.sqrt(range)) + 1;
      num2 = Math.floor(Math.random() * Math.sqrt(range)) + 1;
      answer = num1 * num2;
      break;
    case '÷':
      answer = Math.floor(Math.random() * Math.sqrt(range)) + 1;
      num2 = Math.floor(Math.random() * Math.sqrt(range)) + 1;
      num1 = answer * num2;
      break;
    default:
      num1 = 0;
      num2 = 0;
      answer = 0;
  }

  return { num1, num2, op, answer };
};