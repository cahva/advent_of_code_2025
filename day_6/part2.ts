const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile("input.txt");
//const data = await Deno.readFile("sampledata.txt");

type Colnum = {
  col: number;
  num: number;
  operator: string;
};

type Numbabumba = {
  pos: number;
  val: string;
};

const decodedData = decoder.decode(data);

const lines = decodedData.split("\n").filter(Boolean);
const operators = getAddMultiply(lines.pop()!);

function getAddMultiply(input: string) {
  const addMultiPat = /(\*|\+)/g;
  return input.match(addMultiPat)!;
}
const colNums: Colnum[] = [];
const numbabumba: Numbabumba[] = [];

lines.forEach((row) => {
  for (let i = row.length - 1; i > -1; i -= 1) {
    numbabumba.push({ pos: i, val: row[i] });
  }
});
const grouped = Object.groupBy(numbabumba, ({ pos }) => {
  return pos;
});

const arr = Object.entries(grouped).flat();

let colNr = 0;
arr.forEach((v) => {
  // Skip if is string
  if (typeof v === "string") {
    return;
  }

  const combined = v.reduce((acc, cur) => {
    return acc + cur.val;
  }, "");

  if (!Number(combined)) {
    colNr += 1;
    return;
  }

  colNums.push({
    col: colNr,
    num: Number(combined),
    operator: operators[colNr],
  });
});

const groupedCols = Object.groupBy(colNums, ({ col }) => {
  return col;
});

const colsArr = Object.entries(groupedCols).flat();
let total = 0;
colsArr.forEach((v) => {
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
