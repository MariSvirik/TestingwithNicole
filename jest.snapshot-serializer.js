// Custom snapshot serializer to normalize non-deterministic PatternFly Progress component IDs
// This ensures snapshots are consistent across test runs

module.exports = {
  test: (val) => {
    // Check if this is a DocumentFragment or string containing PatternFly IDs
    if (typeof val === 'string') {
      return val.includes('id="pf-');
    }
    // For DocumentFragment, we'll serialize it as a string first
    if (val && typeof val.toString === 'function') {
      return val.toString().includes('id="pf-');
    }
    return false;
  },
  print: (val, serialize) => {
    // Convert to string if needed
    const str = typeof val === 'string' ? val : serialize(val);
    // Normalize all PatternFly Progress component IDs
    return str.replace(/id="pf-\d+[^"]*"/g, 'id="pf-normalized-id"');
  },
};

