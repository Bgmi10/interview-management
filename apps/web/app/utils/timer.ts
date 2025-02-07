export function getTimeRemaining(endtime: number): number {
    const total = endtime - Date.now();
    return total > 0 ? Math.floor(total / 1000) : 0;
  }
  