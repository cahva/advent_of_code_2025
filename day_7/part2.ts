const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile("input.txt");
//const data = await Deno.readFile("sampledata.txt");

const decoded = decoder.decode(data);
const lines = decoded.split("\n").filter(Boolean);

// Fuuuuck my brain hurts
// timelines and shiiiit

const startingCol = lines[0].indexOf("S");

// Length of cols and rows(for col, it's the same for all rows so lets take the fist)
const [rowCount, colCount] = [lines.length, lines[0].length];

// I feel recursive is the way to go
function countTimelines(row: number, col: number, visited = new Map()): number {
  // Out of bounds checks
  if (col < 0 || col > colCount - 1) return 0;
  if (row >= rowCount) return 1;

  const key = row * colCount + col;

  // Get from cache if it's there
  if (visited.has(key)) {
    return visited.get(key);
  }

  const countedRes = lines[row][col] === "^"
    ? countTimelines(row + 1, col - 1, visited) +
      countTimelines(row + 1, col + 1, visited)
    : countTimelines(row + 1, col, visited);

  visited.set(key, countedRes);
  return countedRes;
}

const totalTimelines = countTimelines(0, startingCol);
console.log("Timeline count", totalTimelines);
