// ============================================================================
// mockData.ts
// Database di paesi e capitali reali, suddiviso per livello di difficoltà.
// Ogni livello contiene un pool sufficientemente ampio (10+ voci) da
// permettere la generazione dinamica di domande e distrattori senza ripetere
// sempre le stesse combinazioni.
// ============================================================================

import type { CountryData, Difficulty } from './types';

export const COUNTRIES: CountryData[] = [
  // ---------------------------------------------------------------------
  // FACILE — capitali tra le più note e studiate a scuola.
  // ---------------------------------------------------------------------
  { id: 'it', country: 'Italia', capital: 'Roma', difficulty: 'facile', flagCode: 'IT' },
  { id: 'fr', country: 'Francia', capital: 'Parigi', difficulty: 'facile', flagCode: 'FR' },
  { id: 'de', country: 'Germania', capital: 'Berlino', difficulty: 'facile', flagCode: 'DE' },
  { id: 'es', country: 'Spagna', capital: 'Madrid', difficulty: 'facile', flagCode: 'ES' },
  { id: 'gb', country: 'Regno Unito', capital: 'Londra', difficulty: 'facile', flagCode: 'GB' },
  { id: 'us', country: 'Stati Uniti', capital: 'Washington', difficulty: 'facile', flagCode: 'US' },
  { id: 'ru', country: 'Russia', capital: 'Mosca', difficulty: 'facile', flagCode: 'RU' },
  { id: 'cn', country: 'Cina', capital: 'Pechino', difficulty: 'facile', flagCode: 'CN' },
  { id: 'jp', country: 'Giappone', capital: 'Tokyo', difficulty: 'facile', flagCode: 'JP' },
  { id: 'ca', country: 'Canada', capital: 'Ottawa', difficulty: 'facile', flagCode: 'CA' },
  { id: 'eg', country: 'Egitto', capital: 'Il Cairo', difficulty: 'facile', flagCode: 'EG' },
  { id: 'gr', country: 'Grecia', capital: 'Atene', difficulty: 'facile', flagCode: 'GR' },

  // ---------------------------------------------------------------------
  // MEDIO — note ma meno scontate, richiedono un po' di attenzione.
  // ---------------------------------------------------------------------
  { id: 'au', country: 'Australia', capital: 'Canberra', difficulty: 'medio', flagCode: 'AU' },
  { id: 'br', country: 'Brasile', capital: 'Brasilia', difficulty: 'medio', flagCode: 'BR' },
  { id: 'pt', country: 'Portogallo', capital: 'Lisbona', difficulty: 'medio', flagCode: 'PT' },
  { id: 'tr', country: 'Turchia', capital: 'Ankara', difficulty: 'medio', flagCode: 'TR' },
  { id: 'za', country: 'Sudafrica', capital: 'Pretoria', difficulty: 'medio', flagCode: 'ZA' },
  { id: 'ar', country: 'Argentina', capital: 'Buenos Aires', difficulty: 'medio', flagCode: 'AR' },
  { id: 'mx', country: 'Messico', capital: 'Città del Messico', difficulty: 'medio', flagCode: 'MX' },
  { id: 'no', country: 'Norvegia', capital: 'Oslo', difficulty: 'medio', flagCode: 'NO' },
  { id: 'se', country: 'Svezia', capital: 'Stoccolma', difficulty: 'medio', flagCode: 'SE' },
  { id: 'pl', country: 'Polonia', capital: 'Varsavia', difficulty: 'medio', flagCode: 'PL' },
  { id: 'nl', country: 'Paesi Bassi', capital: 'Amsterdam', difficulty: 'medio', flagCode: 'NL' },
  { id: 'vn', country: 'Vietnam', capital: 'Hanoi', difficulty: 'medio', flagCode: 'VN' },

  // ---------------------------------------------------------------------
  // AVANZATO — capitali "trabocchetto", spesso confuse con altre città.
  // ---------------------------------------------------------------------
  { id: 'kz', country: 'Kazakistan', capital: 'Astana', difficulty: 'avanzato', flagCode: 'KZ' },
  { id: 'mm', country: 'Myanmar', capital: 'Naypyidaw', difficulty: 'avanzato', flagCode: 'MM' },
  { id: 'ci', country: "Costa d'Avorio", capital: 'Yamoussoukro', difficulty: 'avanzato', flagCode: 'CI' },
  { id: 'bo', country: 'Bolivia', capital: 'Sucre', difficulty: 'avanzato', flagCode: 'BO' },
  { id: 'lk', country: 'Sri Lanka', capital: 'Sri Jayawardenepura Kotte', difficulty: 'avanzato', flagCode: 'LK' },
  { id: 'pw', country: 'Palau', capital: 'Ngerulmud', difficulty: 'avanzato', flagCode: 'PW' },
  { id: 'sz', country: 'Eswatini', capital: 'Mbabane', difficulty: 'avanzato', flagCode: 'SZ' },
  { id: 'bt', country: 'Bhutan', capital: 'Thimphu', difficulty: 'avanzato', flagCode: 'BT' },
  { id: 'bf', country: 'Burkina Faso', capital: 'Ouagadougou', difficulty: 'avanzato', flagCode: 'BF' },
  { id: 'li', country: 'Liechtenstein', capital: 'Vaduz', difficulty: 'avanzato', flagCode: 'LI' },
  { id: 'sr', country: 'Suriname', capital: 'Paramaribo', difficulty: 'avanzato', flagCode: 'SR' },
  { id: 'kg', country: 'Kirghizistan', capital: 'Bishkek', difficulty: 'avanzato', flagCode: 'KG' },
];

/** Restituisce tutte le voci appartenenti a un dato livello di difficoltà. */
export function getCountriesByDifficulty(difficulty: Difficulty): CountryData[] {
  return COUNTRIES.filter((c) => c.difficulty === difficulty);
}
