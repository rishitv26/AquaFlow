/**
 * Converts a stream of raw bottle weights (grams) into discrete drink events.
 *
 * Algorithm:
 *  - Keep a rolling window of the last N readings.
 *  - "Stable" = max-min within the window <= stabilityToleranceG.
 *  - When a new stable weight is reached AND the bottle is on the scale
 *    (above bottlePresentThresholdG):
 *       delta = newStable - lastStable
 *       delta <= -minDrinkMl  -> drink event of abs(delta) mL
 *       delta >  0            -> ignore (refill / placed back heavier)
 *       update lastStable
 *  - While the bottle is off the scale, lastStable is NOT updated, so the
 *    "lift -> sip -> place back" sequence yields the correct delta when it
 *    re-stabilizes.
 */
export class HydrationTracker {
  constructor({
    minDrinkMl              = 5,    // ignore noise smaller than this
    stabilityWindow         = 6,    // ~6 samples ≈ 1.2 s at 5 Hz
    stabilityToleranceG     = 3,    // grams of allowed jitter to count as stable
    bottlePresentThresholdG = 30,   // below this we assume bottle is off the scale
    onDrink                 = () => {},
  } = {}) {
    this.minDrinkMl              = minDrinkMl;
    this.stabilityWindow         = stabilityWindow;
    this.stabilityToleranceG     = stabilityToleranceG;
    this.bottlePresentThresholdG = bottlePresentThresholdG;
    this.onDrink                 = onDrink;

    this.buf          = [];
    this.lastStableG  = null;
    this.lastDrinkAt  = 0;
  }

  reset() {
    this.buf = [];
    this.lastStableG = null;
  }

  /** Returns drink amount in mL if a drink was detected this push, else 0. */
  push(grams) {
    this.buf.push(grams);
    if (this.buf.length > this.stabilityWindow) this.buf.shift();
    if (this.buf.length < this.stabilityWindow) return 0;

    const min = Math.min(...this.buf);
    const max = Math.max(...this.buf);
    if (max - min > this.stabilityToleranceG) return 0;   // not stable

    const stable = Math.round(this.buf.reduce((a, b) => a + b, 0) / this.buf.length);

    // Bottle off the scale: hold baseline, wait for it to come back.
    if (stable < this.bottlePresentThresholdG) return 0;

    if (this.lastStableG == null) {                       // first baseline
      this.lastStableG = stable;
      return 0;
    }

    const delta = stable - this.lastStableG;
    this.lastStableG = stable;

    if (delta >= 0) return 0;                             // refill / no drink
    const drinkMl = -delta;
    if (drinkMl < this.minDrinkMl) return 0;              // noise

    this.lastDrinkAt = Date.now();
    this.onDrink(drinkMl);
    return drinkMl;
  }
}