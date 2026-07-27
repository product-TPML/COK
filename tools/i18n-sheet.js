#!/usr/bin/env node
'use strict';

/**
 * i18n-sheet.js — editorial round-trip between i18n.json and i18n.csv
 *
 * Export:  node tools/i18n-sheet.js export
 * Import:  node tools/i18n-sheet.js import
 *
 * See --help for full CLI reference.
 *
 * Dependencies: Node.js built-ins only.
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Default paths (relative to repository root — one level above tools/)
// ---------------------------------------------------------------------------
const REPO = path.resolve(__dirname, '..');
const SITE = path.join(REPO, 'site');
const DEFAULT_JSON = path.join(SITE, 'i18n.json');
const DEFAULT_CSV = path.join(SITE, 'i18n.csv');
const DEFAULT_OUTPUT = path.join(SITE, 'i18n.updated.json');

// Root-level keys to skip (non-localized metadata that happens to match
// the {en,kn} leaf shape).
const SKIP_ROOT_KEYS = new Set(['languages']);

// ---------------------------------------------------------------------------
// Help
// ---------------------------------------------------------------------------
function printHelp() {
  process.stdout.write([
    '',
    'Usage:',
    '  node tools/i18n-sheet.js export [--json <path>] [--csv <path>]',
    '    Read i18n.json, write i18n.csv.',
    '',
    '  node tools/i18n-sheet.js import [--json <path>] [--csv <path>]',
    '                                  [--output <path>] [--in-place]',
    '    Read CSV and original JSON, deep-copy original, apply values,',
    '    write updated JSON. Validates placeholders and HTML tags.',
    '',
    'Options:',
    '  --json <path>     i18n.json input     (default: site/i18n.json)',
    '  --csv <path>      i18n.csv input/out  (default: site/i18n.csv)',
    '  --output <path>   JSON output         (default: site/i18n.updated.json)',
    '  --in-place        Write back to --json (overrides --output)',
    '  --help            Show this message',
    '',
  ].join('\n'));
}

// ---------------------------------------------------------------------------
// RFC 4180 CSV helpers
// ---------------------------------------------------------------------------

/** Escape a CSV field per RFC 4180. */
function csvEscape(value) {
  if (typeof value !== 'string') value = String(value);
  if (
    value.indexOf(',') !== -1 ||
    value.indexOf('"') !== -1 ||
    value.indexOf('\r') !== -1 ||
    value.indexOf('\n') !== -1
  ) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

/**
 * Parse an entire CSV string into rows of fields, handling RFC 4180
 * quoted fields that may span multiple lines, escaped quotes, and
 * CRLF / LF line endings.
 */
function csvParse(str) {
  const rows = [];
  let fields = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < str.length) {
    const ch = str[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < str.length && str[i + 1] === '"') {
          field += '"';
          i += 2;
        } else {
          inQuotes = false;
          i += 1;
        }
      } else {
        field += ch;
        i += 1;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i += 1;
      } else if (ch === ',') {
        fields.push(field);
        field = '';
        i += 1;
      } else if (ch === '\r') {
        // end of row
        fields.push(field);
        field = '';
        rows.push(fields);
        fields = [];
        i += 1;
        // skip LF if present
        if (i < str.length && str[i] === '\n') i += 1;
      } else if (ch === '\n') {
        fields.push(field);
        field = '';
        rows.push(fields);
        fields = [];
        i += 1;
      } else {
        field += ch;
        i += 1;
      }
    }
  }

  // Last row (no trailing newline)
  if (field !== '' || fields.length > 0) {
    fields.push(field);
    rows.push(fields);
  }

  return rows;
}

// ---------------------------------------------------------------------------
// JSON tree walker
// ---------------------------------------------------------------------------

/**
 * Recursively walk `obj` and collect every leaf object shaped
 * `{ en: string, kn: string }` into `leaves` as `{ key, en, kn }`.
 *
 * `prefix` is the dotted path so far. Array indices use zero-based numbers.
 * `skipRootKeys` — top-level object keys to skip entirely.
 */
function walkJson(obj, prefix, leaves, skipRootKeys) {
  if (obj === null || obj === undefined) return;

  // --- Leaf detection: plain object with exactly en+kn string keys ---
  if (isLocalizedLeaf(obj)) {
    leaves.push({ key: prefix, en: obj.en, kn: obj.kn });
    return;
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      walkJson(obj[i], prefix + '.' + i, leaves, null);
    }
    return;
  }

  if (typeof obj === 'object' && obj !== null) {
    const keys = Object.keys(obj);
    let filtered = keys;
    // At root level only, apply skipRootKeys
    if (skipRootKeys && prefix === '') {
      filtered = keys.filter((k) => !skipRootKeys.has(k));
    }
    for (const k of filtered) {
      const childPrefix = prefix ? prefix + '.' + k : k;
      walkJson(obj[k], childPrefix, leaves, null);
    }
  }
}

/** Does `v` look like `{ en: string, kn: string }`? */
function isLocalizedLeaf(v) {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return false;
  const ks = Object.keys(v);
  return (
    ks.length === 2 &&
    Object.prototype.hasOwnProperty.call(v, 'en') &&
    Object.prototype.hasOwnProperty.call(v, 'kn') &&
    typeof v.en === 'string' &&
    typeof v.kn === 'string'
  );
}

// ---------------------------------------------------------------------------
// Token / HTML helpers
// ---------------------------------------------------------------------------

/** Extract {placeholder} names and their counts (multiset). */
function extractPlaceholders(str) {
  const map = Object.create(null);
  const re = /\{(\w+)\}/g;
  let m;
  while ((m = re.exec(str)) !== null) {
    const name = m[1];
    map[name] = (map[name] || 0) + 1;
  }
  return map;
}

/** Extract HTML open/close tag full text in order. */
function extractHtmlTags(str) {
  const tags = [];
  const re = /<\/?[a-zA-Z][\w:.-]*(?:\s[^>]*)?>/g;
  let m;
  while ((m = re.exec(str)) !== null) {
    tags.push(m[0]);
  }
  return tags;
}

/** Multiset comparison using count maps. */
function multisetsEqual(a, b) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const k of aKeys) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}

/** Array shallow equality. */
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Deep-copy helper (fast path via JSON round-trip)
// ---------------------------------------------------------------------------
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
function doExport(jsonPath, csvPath) {
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(raw);

  const leaves = [];
  walkJson(data, '', leaves, SKIP_ROOT_KEYS);

  const lines = ['key,en,kn'];
  for (const leaf of leaves) {
    lines.push(
      csvEscape(leaf.key) + ',' +
      csvEscape(leaf.en) + ',' +
      csvEscape(leaf.kn)
    );
  }

  fs.writeFileSync(csvPath, lines.join('\r\n') + '\r\n', 'utf8');
  console.log('Exported ' + leaves.length + ' rows to ' + csvPath);
}

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------
function doImport(jsonPath, csvPath, outputPath) {
  const rawJson = fs.readFileSync(jsonPath, 'utf8');
  const original = JSON.parse(rawJson);

  // --- Gather source leaves for reference ---
  const sourceLeaves = [];
  walkJson(original, '', sourceLeaves, SKIP_ROOT_KEYS);
  const sourceKeys = new Set(sourceLeaves.map((l) => l.key));

  // --- Parse and validate CSV ---
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const rows = csvParse(csvContent);

  if (rows.length === 0) die('CSV is empty');

  // Header
  const header = rows[0];
  if (
    header.length !== 3 ||
    header[0] !== 'key' ||
    header[1] !== 'en' ||
    header[2] !== 'kn'
  ) {
    die('CSV header must be exactly "key,en,kn" — got: ' + JSON.stringify(header));
  }

  const csvLeaves = [];     // { key, en, kn }
  const csvKeys = new Set();
  const errors = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.length !== 3) {
      errors.push('Row ' + (r + 1) + ': expected 3 columns, got ' + row.length);
      continue;
    }

    const key = row[0].trim();
    const en = row[1];   // preserve original whitespace from CSV value
    const kn = row[2];

    if (!key) {
      errors.push('Row ' + (r + 1) + ': empty key');
      continue;
    }

    if (csvKeys.has(key)) {
      errors.push('Duplicate key in CSV: "' + key + '" (row ' + (r + 1) + ')');
    }
    csvKeys.add(key);

    if (!sourceKeys.has(key)) {
      errors.push('Unknown key in CSV: "' + key + '" (row ' + (r + 1) + ')');
    }

    csvLeaves.push({ key, en, kn });
  }

  // Check for missing keys
  for (const leaf of sourceLeaves) {
    if (!csvKeys.has(leaf.key)) {
      errors.push('Missing localized key in CSV: "' + leaf.key + '"');
    }
  }

  // Validate placeholders and HTML tags (only for known keys)
  for (const leaf of csvLeaves) {
    if (!sourceKeys.has(leaf.key)) continue;

    // Placeholder multiset
    const enPH = extractPlaceholders(leaf.en);
    const knPH = extractPlaceholders(leaf.kn);
    if (!multisetsEqual(enPH, knPH)) {
      errors.push(
        'Placeholder mismatch for "' + leaf.key + '": ' +
        'en=' + placeholderSummary(enPH) + '  kn=' + placeholderSummary(knPH)
      );
    }

    // HTML tag signatures
    const enTags = extractHtmlTags(leaf.en);
    const knTags = extractHtmlTags(leaf.kn);
    if (!arraysEqual(enTags, knTags)) {
      errors.push(
        'HTML tag mismatch for "' + leaf.key + '": ' +
        'en=' + JSON.stringify(enTags) + '  kn=' + JSON.stringify(knTags)
      );
    }
  }

  if (errors.length > 0) {
    process.stderr.write('Validation errors:\n');
    for (const err of errors) {
      process.stderr.write('  ' + err + '\n');
    }
    process.exit(1);
  }

  // --- Deep-copy original and overlay CSV values ---
  const updated = deepCopy(original);

  for (const leaf of csvLeaves) {
    const parts = leaf.key.split('.');
    let node = updated;
    for (let i = 0; i < parts.length - 1; i++) {
      node = node[parts[i]];
    }
    const last = parts[parts.length - 1];
    // Preserve the { en, kn } container object, just overwrite the strings
    node[last] = { en: leaf.en, kn: leaf.kn };
  }

  const output = JSON.stringify(updated, null, 2) + '\n';
  fs.writeFileSync(outputPath, output, 'utf8');
  console.log('Imported ' + csvLeaves.length + ' rows to ' + outputPath);
}

// ---------------------------------------------------------------------------
// Misc helpers
// ---------------------------------------------------------------------------

function die(msg) {
  process.stderr.write('Error: ' + msg + '\n');
  process.exit(1);
}

function placeholderSummary(map) {
  const items = Object.keys(map).sort();
  if (items.length === 0) return '(none)';
  return '{' + items.map((k) => k + (map[k] > 1 ? '×' + map[k] : '')).join(', ') + '}';
}

// ---------------------------------------------------------------------------
// CLI dispatcher
// ---------------------------------------------------------------------------
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    printHelp();
    return;
  }

  const cmd = args[0];
  const opts = args.slice(1);

  let jsonPath = DEFAULT_JSON;
  let csvPath = DEFAULT_CSV;
  let outputPath = DEFAULT_OUTPUT;
  let inPlace = false;

  for (let i = 0; i < opts.length; i++) {
    switch (opts[i]) {
      case '--json':
        jsonPath = opts[++i];
        break;
      case '--csv':
        csvPath = opts[++i];
        break;
      case '--output':
        outputPath = opts[++i];
        break;
      case '--in-place':
        inPlace = true;
        break;
      default:
        process.stderr.write('Unknown option: ' + opts[i] + '\n');
        printHelp();
        process.exit(1);
    }
  }

  if (inPlace) outputPath = jsonPath;

  switch (cmd) {
    case 'export':
      doExport(jsonPath, csvPath);
      break;
    case 'import':
      doImport(jsonPath, csvPath, outputPath);
      break;
    default:
      process.stderr.write('Unknown command: ' + cmd + '\n');
      printHelp();
      process.exit(1);
  }
}

main();
