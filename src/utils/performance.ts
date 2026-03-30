type PerfMetricName =
  | 'app_bootstrap_ms'
  | 'home_achievement_load_ms'
  | 'achievement_screen_load_ms';

const perfStore = new Map<PerfMetricName, number>();

export function markPerfStart(name: PerfMetricName): number {
  const start = Date.now();
  perfStore.set(name, start);
  return start;
}

export function markPerfEnd(name: PerfMetricName, startTime?: number): number {
  const start = startTime ?? perfStore.get(name) ?? Date.now();
  const duration = Date.now() - start;

  if (__DEV__) {
    console.log(`[perf] ${name}: ${duration}ms`);
  }
  return duration;
}

export function formatPerfMetric(name: PerfMetricName, value: number): string {
  return `${name},${value}`;
}

