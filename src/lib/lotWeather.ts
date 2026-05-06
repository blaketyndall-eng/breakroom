/**
 * Lot Weather — Real weather from Open-Meteo (free, no key) translated into Breakroom voice.
 * Falls back to deterministic generated fiction when fetch fails or location unavailable.
 *
 * Open-Meteo API: https://open-meteo.com/en/docs
 * No API key required. Rate limit: generous (600 req/min).
 */

export type LotConditions = {
  source: 'real' | 'generated';
  temperature_f: number;
  sky: string;
  lot_advisory: string;
  bad_decision_pressure: string;
  neon_visibility: string;
  hoodie_status: string;
  timestamp: string;
  location_label?: string;
};

// WMO weather codes → Breakroom sky descriptions
const WMO_SKY: Record<number, string> = {
  0: 'clear — everyone can see what you did',
  1: 'mostly clear — plausible deniability remains',
  2: 'partly cloudy — good for schemes',
  3: 'overcast — ideal for being forgotten',
  45: 'fog — the lot is hiding something',
  48: 'depositing rime fog — the lot is hiding something on purpose',
  51: 'light drizzle — windshield smear weather',
  53: 'drizzle — commitment unclear',
  55: 'dense drizzle — stay in the car',
  61: 'slight rain — hood up, keep moving',
  63: 'moderate rain — bad for paper receipts',
  65: 'heavy rain — the lot is closed emotionally',
  71: 'slight snow — pretty but suspicious',
  73: 'moderate snow — lot lines gone',
  75: 'heavy snow — nobody is coming',
  77: 'snow grains — decorative only',
  80: 'slight showers — on-and-off commitment',
  81: 'moderate showers — the sky cannot decide',
  82: 'violent showers — stay inside, file something',
  85: 'slight snow showers — festive and wrong',
  86: 'heavy snow showers — the lot gives up',
  95: 'thunderstorm — management is angry',
  96: 'thunderstorm with slight hail — management is very angry',
  99: 'thunderstorm with heavy hail — leave the building differently',
};

function getSkyDescription(code: number): string {
  return WMO_SKY[code] ?? 'conditions unknown — the sky declined to comment';
}

function getHoodieStatus(tempF: number): string {
  if (tempF < 40) return 'mandatory — no debate';
  if (tempF < 55) return 'recommended — arms have opinions';
  if (tempF < 68) return 'optional — depends on commitment level';
  if (tempF < 80) return 'unnecessary — hoodie would be a statement';
  return 'inadvisable — fabric is the enemy';
}

function getBadDecisionPressure(pressureHpa: number | null): string {
  if (pressureHpa === null) return 'unmeasured — proceed with caution anyway';
  if (pressureHpa < 1000) return 'low — bad decisions come easy tonight';
  if (pressureHpa < 1013) return 'moderate — the usual amount of poor judgment';
  if (pressureHpa < 1025) return 'rising — false sense of responsibility detected';
  return 'high — nobody is doing anything interesting';
}

function getNeonVisibility(weatherCode: number): string {
  if (weatherCode === 0 || weatherCode === 1) return 'excellent — signs readable from three lots over';
  if (weatherCode <= 3) return 'good — most letters still legible';
  if (weatherCode >= 45 && weatherCode <= 48) return 'poor — signs are rumors now';
  if (weatherCode >= 61 && weatherCode <= 65) return 'streaked — neon through wet glass';
  if (weatherCode >= 95) return 'flickering — storm interference or old wiring';
  return 'standard — adequate for navigation';
}

function getLotAdvisory(tempF: number, weatherCode: number): string {
  if (weatherCode >= 95) return 'LOT CLOSED BY WEATHER. OR MANAGEMENT. UNCLEAR.';
  if (weatherCode >= 71 && weatherCode <= 77) return 'Lot surface unreliable. Park at your own risk.';
  if (weatherCode >= 61 && weatherCode <= 65) return 'Puddles forming. Watch for reflections that look like something.';
  if (tempF > 95) return 'Asphalt soft. Do not stand in one place too long.';
  if (tempF < 25) return 'Engine block warmth recommended. The lot does not care about you.';
  if (weatherCode >= 45 && weatherCode <= 48) return 'Visibility compromised. Trust your instincts less than usual.';
  return 'Standard conditions. No advisory. Proceed.';
}

/**
 * Fetch real weather from Open-Meteo. No API key needed.
 * Returns null if fetch fails (network error, bad response, etc).
 */
async function fetchRealWeather(lat: number, lon: number): Promise<LotConditions | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,surface_pressure&temperature_unit=fahrenheit&timezone=auto`;
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return null;

    const data = await response.json();
    const current = data?.current;
    if (!current) return null;

    const tempF = Math.round(current.temperature_2m ?? 65);
    const weatherCode = current.weather_code ?? 0;
    const pressure = current.surface_pressure ?? null;

    return {
      source: 'real',
      temperature_f: tempF,
      sky: getSkyDescription(weatherCode),
      lot_advisory: getLotAdvisory(tempF, weatherCode),
      bad_decision_pressure: getBadDecisionPressure(pressure),
      neon_visibility: getNeonVisibility(weatherCode),
      hoodie_status: getHoodieStatus(tempF),
      timestamp: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Generate deterministic fiction weather based on time of day.
 * Used when real weather is unavailable (no location, network down, SSR).
 */
function generateFictionWeather(): LotConditions {
  const hour = new Date().getHours();
  const isLateNight = hour >= 22 || hour < 5;
  const isEvening = hour >= 17 && hour < 22;

  // Deterministic but varied based on day-of-year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const seed = dayOfYear % 7;

  const temps = [58, 63, 71, 47, 82, 55, 68];
  const tempF = temps[seed];

  const skies = [
    'overcast — good for schemes',
    'clear — everyone can see what you did',
    'partly cloudy — plausible deniability remains',
    'fog — the lot is hiding something',
    'mostly clear — stars visible if you look up which you will not',
    'haze — the kind that smells like decisions',
    'clear — suspiciously so',
  ];

  const advisories = isLateNight
    ? [
        'Lot mostly empty. Stragglers present. Mind your business.',
        'One working light remains. It chose the wrong spot.',
        'After-hours rules apply. The lot does not explain them.',
      ]
    : isEvening
      ? [
          'Lot filling up. Park where the lines suggest.',
          'Sunset hitting windshields. Temporary blindness possible.',
          'Evening shift arriving. Be patient or be somewhere else.',
        ]
      : [
          'Standard daytime conditions. Nothing to report.',
          'The lot is awake and indifferent.',
          'Normal operations. The lot remembers nothing from last night.',
        ];

  return {
    source: 'generated',
    temperature_f: tempF,
    sky: skies[seed],
    lot_advisory: advisories[seed % advisories.length],
    bad_decision_pressure: isLateNight ? 'elevated — the hour contributes' : 'moderate — the usual amount of poor judgment',
    neon_visibility: isLateNight ? 'excellent — signs readable from three lots over' : 'n/a — daylight makes neon irrelevant',
    hoodie_status: getHoodieStatus(tempF),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get lot conditions. Attempts real weather if coordinates provided.
 * Always returns a result (real or generated).
 */
export async function getLotConditions(coords?: { lat: number; lon: number }): Promise<LotConditions> {
  if (coords) {
    const real = await fetchRealWeather(coords.lat, coords.lon);
    if (real) {
      real.location_label = `${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)}`;
      return real;
    }
  }
  return generateFictionWeather();
}

/**
 * Format lot conditions for display as a text block.
 */
export function formatLotConditions(conditions: LotConditions): string {
  const sourceTag = conditions.source === 'real' ? '(REAL)' : '(GENERATED)';
  return [
    `LOT CONDITIONS ${sourceTag}`,
    `Temperature: ${conditions.temperature_f}F — ${conditions.hoodie_status}`,
    `Sky: ${conditions.sky}`,
    `Bad Decision Pressure: ${conditions.bad_decision_pressure}`,
    `Neon Visibility: ${conditions.neon_visibility}`,
    `Advisory: ${conditions.lot_advisory}`,
  ].join('\n');
}
