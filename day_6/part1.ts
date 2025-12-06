const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile("input.txt");
//const data = await Deno.readFile("sampledata.txt");

const lines = decoder.decode(data).split("\n").filter((v) => v.length > 0);

const addMultiplyLine = lines.pop()!;

const numbers = lines.map(getNumbers);
const addMultiplyArr = getAddMultiply(addMultiplyLine);
const addMultiply = addMultiplyArr.flat();

function getNumbers(input: string) {
  const numPat = /\d+/g;
  const matches = input.match(numPat);
  if (matches) {
    return matches.map(Number);
  }
}

function getAddMultiply(input: string) {
  const addMultiPat = /(\*|\+)/g;
  return input.match(addMultiPat)!;
}

type Colnum = {
  col: number;
  num: number;
  operator: string;
};

const colNums: Colnum[] = [];
numbers.forEach((nums) => {
  if (!nums) throw Error("No nums");
  nums.forEach((num, col) => {
    colNums.push({
      col,
      num,
      operator: addMultiply[col],
    });
  });
});

const grouped = Object.groupBy(colNums, ({ col }) => {
  return col;
});

const arr = Object.entries(grouped).flat();

let total = 0;
arr.forEach((v) => {
  // Skip if is string and make typescript happy
  if (typeof v === "string" || !v) {
    return;
  }
  const op = v[0].operator;
  const result = v.reduce((acc, item) => {
    return op === "+" ? acc + item.num : acc * item.num;
  }, op === "+" ? 0 : 1);
  total += result;
});

console.log("Total: %d", total);
