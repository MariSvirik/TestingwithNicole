// Mock Date.now() to return a fixed timestamp for deterministic ID generation
// This ensures PatternFly Progress component IDs are consistent across test runs
const FIXED_TIMESTAMP = 1765888987892; // Fixed timestamp for consistent snapshots

// Mock Date.now() before any imports
jest.spyOn(Date, 'now').mockReturnValue(FIXED_TIMESTAMP);

// Also mock performance.now() if available (PatternFly might use this for IDs)
if (typeof global.performance !== 'undefined' && global.performance.now) {
  jest.spyOn(global.performance, 'now').mockReturnValue(FIXED_TIMESTAMP);
}
