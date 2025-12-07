const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile("input.txt");
//const data = await Deno.readFile("sampledata.txt");

const decoded = decoder.decode(data);
const lines = decoded.split("\n").filter(Boolean);

let beam = new Set([lines[0].indexOf("S")]);
let splitCnt = 0;

for (const line of lines) {
  const nextBeam = new Set<number>();

  for (const b of beam) {
    if (line[b] === "^") {
      splitCnt++;

      if (b - 1 >= 0) nextBeam.add(b - 1);
      if (b + 1 < line.length) nextBeam.add(b + 1);
    } else {
      nextBeam.add(b);
    }
  }

  beam = nextBeam;
}

console.log("Splits:", splitCnt);
