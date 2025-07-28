function diffObjects(before = {}, after = {}) {
  const changes = {};
  for (const key in after) {
    const beforeVal = JSON.stringify(before[key]);
    const afterVal = JSON.stringify(after[key]);
    if (beforeVal !== afterVal) {
      changes[key] = {
        from: before[key] ?? null,
        to: after[key]
      };
    }
  }
  return changes;
}

module.exports = diffObjects;
