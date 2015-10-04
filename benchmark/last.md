#1: deep-close
  findup-sync x 5,797 ops/sec ±1.66% (90 runs sampled)
  findup x 22,972 ops/sec ±0.82% (92 runs sampled)
  lookup x 64,389 ops/sec ±0.75% (92 runs sampled)

#2: deep-far
  findup-sync x 2,165 ops/sec ±1.01% (92 runs sampled)
  findup x 8,250 ops/sec ±0.78% (96 runs sampled)
  lookup x 12,730 ops/sec ±0.93% (92 runs sampled)

#3: nested
  findup-sync x 21,603 ops/sec ±0.76% (93 runs sampled)
  findup x 103,427 ops/sec ±0.93% (95 runs sampled)
  lookup x 381,425 ops/sec ±0.91% (91 runs sampled)

#4: shallow
  findup-sync x 6,565 ops/sec ±0.66% (92 runs sampled)
  findup x 23,674 ops/sec ±0.89% (95 runs sampled)
  lookup x 57,029 ops/sec ±0.83% (93 runs sampled)
