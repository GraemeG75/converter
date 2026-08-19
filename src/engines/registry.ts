import type { CategoryDefinition, ConversionResult, UnitDefinition } from './types';
import { lengthCategory, areaCategory, volumeCategory } from './distance';
import { anglesCategory } from './angles';
import { temperatureCategory } from './temperatures';
import { coordinatesCategory, ddToDms, ddToDdm, ddToUtm, encodeGeohash, decodeGeohash } from './coordinates';
import { dataCategory, dataRateCategory } from './data';
import { speedCategory } from './speed';
import { massCategory, pressureCategory } from './massPressure';
import { energyCategory, powerCategory } from './energyPower';
import { timeCategory } from './timeEpoch';
import { colorCategory, parseColorInput } from './color';
import { numberBasesCategory, convertBase, getBaseRadix } from './numberBases';
import { typographyCategory } from './typography';
import { romanUnicodeCategory, intToRoman, romanToInt, charToUnicodeDetails } from './romanUnicode';
import { uuidCategory, parseAndFormatUUID, NIL_GUID } from './uuid';

// New Coding Engines
import { hashEncodingCategory, decodeToPlaintext, encodeFromPlaintext } from './hashEncoding';
import { cronScheduleCategory, parseCronExpression } from './cronSchedule';
import { cidrSubnetCategory, parseSubnetInput } from './cidrSubnet';
import { bitwiseFlagsCategory, parsePermissionInput } from './bitwiseFlags';
import { cssUnitsCategory, convertCssUnits } from './cssUnits';

export const ALL_CATEGORIES: CategoryDefinition[] = [
  lengthCategory,
  areaCategory,
  volumeCategory,
  anglesCategory,
  temperatureCategory,
  coordinatesCategory,
  dataCategory,
  dataRateCategory,
  speedCategory,
  massCategory,
  pressureCategory,
  energyCategory,
  powerCategory,
  timeCategory,
  colorCategory,
  numberBasesCategory,
  typographyCategory,
  romanUnicodeCategory,
  uuidCategory,
  hashEncodingCategory,
  cronScheduleCategory,
  cidrSubnetCategory,
  bitwiseFlagsCategory,
  cssUnitsCategory
];

export function getCategoryById(id: string): CategoryDefinition {
  return ALL_CATEGORIES.find(c => c.id === id) || lengthCategory;
}

export function performConversion(
  category: CategoryDefinition,
  fromUnitId: string,
  toUnitId: string,
  inputValue: string,
  precision: number,
  scientificNotation: boolean
): ConversionResult {
  const fromUnit = category.units.find(u => u.id === fromUnitId) || category.units[0];
  const toUnit = category.units.find(u => u.id === toUnitId) || category.units[1] || category.units[0];

  // Handle special non-linear / string custom categories
  if (category.id === 'coordinates') {
    return handleCoordinatesConversion(fromUnitId, toUnitId, inputValue, fromUnit, toUnit);
  }

  if (category.id === 'color') {
    return handleColorConversion(toUnitId, inputValue, fromUnit, toUnit);
  }

  if (category.id === 'number_bases') {
    return handleNumberBasesConversion(fromUnitId, toUnitId, inputValue, fromUnit, toUnit);
  }

  if (category.id === 'roman_unicode') {
    return handleRomanUnicodeConversion(fromUnitId, toUnitId, inputValue, fromUnit, toUnit);
  }

  if (category.id === 'uuid_guid') {
    return handleUuidConversion(toUnitId, inputValue, fromUnit, toUnit);
  }

  if (category.id === 'hash_encoding') {
    return handleHashEncodingConversion(fromUnitId, toUnitId, inputValue, fromUnit, toUnit);
  }

  if (category.id === 'cron_schedule') {
    return handleCronScheduleConversion(toUnitId, inputValue, fromUnit, toUnit);
  }

  if (category.id === 'cidr_subnet') {
    return handleCidrSubnetConversion(toUnitId, inputValue, fromUnit, toUnit);
  }

  if (category.id === 'bitwise_flags') {
    return handleBitwiseFlagsConversion(fromUnitId, toUnitId, inputValue, fromUnit, toUnit);
  }

  if (category.id === 'css_units') {
    return handleCssUnitsConversion(fromUnitId, toUnitId, inputValue, fromUnit, toUnit);
  }

  // Standard numeric conversions (Linear & Affine)
  const numInput = parseFloat(inputValue);
  if (isNaN(numInput)) {
    return {
      fromValue: inputValue,
      fromUnit,
      toValue: 'Invalid Number',
      toUnit,
      formattedOutput: 'Invalid Number',
      formulaDescription: 'Please enter a valid number'
    };
  }

  let baseVal: number;
  if (fromUnit.toBase) {
    baseVal = fromUnit.toBase(numInput);
  } else if (fromUnit.ratioToBase !== undefined) {
    baseVal = numInput * fromUnit.ratioToBase;
  } else {
    baseVal = numInput;
  }

  let finalVal: number;
  if (toUnit.fromBase) {
    finalVal = toUnit.fromBase(baseVal);
  } else if (toUnit.ratioToBase !== undefined && toUnit.ratioToBase !== 0) {
    finalVal = baseVal / toUnit.ratioToBase;
  } else {
    finalVal = baseVal;
  }

  const formatted = formatNumber(finalVal, precision, scientificNotation);
  const formulaStr = buildFormulaDescription(fromUnit, toUnit);

  return {
    fromValue: numInput,
    fromUnit,
    toValue: finalVal,
    toUnit,
    formattedOutput: `${formatted} ${toUnit.symbol}`,
    formulaDescription: formulaStr
  };
}

function formatNumber(val: number, precision: number, scientific: boolean): string {
  if (!isFinite(val)) return String(val);
  if (scientific || (Math.abs(val) > 1e9 || (Math.abs(val) < 1e-6 && val !== 0))) {
    return val.toExponential(precision);
  }
  return Number(val.toFixed(precision)).toLocaleString('en-US', {
    maximumFractionDigits: precision
  });
}

function buildFormulaDescription(from: UnitDefinition, to: UnitDefinition): string {
  if (from.id === to.id) return `1 ${from.symbol} = 1 ${to.symbol}`;
  if (from.ratioToBase && to.ratioToBase) {
    const factor = from.ratioToBase / to.ratioToBase;
    return `1 ${from.symbol} = ${factor.toPrecision(6)} ${to.symbol}`;
  }
  return `Converts ${from.name} to ${to.name}`;
}

function handleCoordinatesConversion(fromId: string, toId: string, inputStr: string, fromUnit: UnitDefinition, toUnit: UnitDefinition): ConversionResult {
  let lat = 0, lng = 0;
  if (fromId === 'geohash') {
    const decoded = decodeGeohash(inputStr);
    lat = decoded.lat;
    lng = decoded.lng;
  } else {
    const parts = inputStr.split(',').map(s => parseFloat(s.trim()));
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      lat = parts[0];
      lng = parts[1];
    }
  }

  let outputStr = '';
  if (toId === 'dms') {
    outputStr = `${ddToDms(lat, true)}, ${ddToDms(lng, false)}`;
  } else if (toId === 'ddm') {
    outputStr = `${ddToDdm(lat, true)}, ${ddToDdm(lng, false)}`;
  } else if (toId === 'geohash') {
    outputStr = encodeGeohash(lat, lng);
  } else if (toId === 'utm') {
    outputStr = ddToUtm(lat, lng);
  } else {
    outputStr = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }

  return {
    fromValue: inputStr,
    fromUnit,
    toValue: outputStr,
    toUnit,
    formattedOutput: outputStr,
    formulaDescription: `Lat: ${lat.toFixed(4)}°, Lng: ${lng.toFixed(4)}°`
  };
}

function handleColorConversion(toId: string, inputStr: string, fromUnit: UnitDefinition, toUnit: UnitDefinition): ConversionResult {
  const parsed = parseColorInput(inputStr);
  if (!parsed) {
    return {
      fromValue: inputStr,
      fromUnit,
      toValue: 'Invalid Color',
      toUnit,
      formattedOutput: 'Invalid Color Format',
      formulaDescription: 'Supported: #HEX, rgb(r,g,b), hsl(h,s,l), Int'
    };
  }

  let out = '';
  switch (toId) {
    case 'hex': out = parsed.hex; break;
    case 'rgb': out = `rgb(${parsed.rgb.r}, ${parsed.rgb.g}, ${parsed.rgb.b})`; break;
    case 'hsl': out = `hsl(${parsed.hsl.h}, ${parsed.hsl.s}%, ${parsed.hsl.l}%)`; break;
    case 'hsv': out = `hsv(${parsed.hsv.h}, ${parsed.hsv.s}%, ${parsed.hsv.v}%)`; break;
    case 'cmyk': out = `cmyk(${parsed.cmyk.c}%, ${parsed.cmyk.m}%, ${parsed.cmyk.y}%, ${parsed.cmyk.k}%)`; break;
    case 'int': out = String(parsed.intVal); break;
  }

  return {
    fromValue: inputStr,
    fromUnit,
    toValue: out,
    toUnit,
    formattedOutput: out,
    formulaDescription: `HEX: ${parsed.hex} | RGB: ${parsed.rgb.r},${parsed.rgb.g},${parsed.rgb.b}`
  };
}

function handleNumberBasesConversion(fromId: string, toId: string, inputStr: string, fromUnit: UnitDefinition, toUnit: UnitDefinition): ConversionResult {
  const fromRadix = getBaseRadix(fromId);
  const toRadix = getBaseRadix(toId);
  const result = convertBase(inputStr, fromRadix, toRadix);

  return {
    fromValue: inputStr,
    fromUnit,
    toValue: result,
    toUnit,
    formattedOutput: result,
    formulaDescription: `Base ${fromRadix} ➔ Base ${toRadix}`
  };
}

function handleRomanUnicodeConversion(fromId: string, toId: string, inputStr: string, fromUnit: UnitDefinition, toUnit: UnitDefinition): ConversionResult {
  let out = '';
  let detail = '';

  if (fromId === 'roman') {
    const num = romanToInt(inputStr);
    out = toId === 'roman' ? inputStr : String(num);
    detail = `Roman ${inputStr} = ${num}`;
  } else if (fromId === 'int_num') {
    const num = parseInt(inputStr, 10);
    if (!isNaN(num)) {
      if (toId === 'roman') out = intToRoman(num);
      else if (toId === 'char') out = String.fromCharCode(num);
      else out = 'U+' + num.toString(16).toUpperCase().padStart(4, '0');
    }
  } else if (fromId === 'char') {
    const info = charToUnicodeDetails(inputStr);
    if (toId === 'roman') out = intToRoman(info.dec);
    else if (toId === 'int_num') out = String(info.dec);
    else if (toId === 'unicode_hex') out = info.hex;
    else out = info.char;
    detail = `Char '${info.char}' -> Code ${info.dec} (${info.hex})`;
  } else {
    out = inputStr;
  }

  return {
    fromValue: inputStr,
    fromUnit,
    toValue: out,
    toUnit,
    formattedOutput: out,
    formulaDescription: detail || `${fromUnit.name} ➔ ${toUnit.name}`
  };
}

function handleUuidConversion(toId: string, inputStr: string, fromUnit: UnitDefinition, toUnit: UnitDefinition): ConversionResult {
  const parsed = parseAndFormatUUID(inputStr);
  let out = parsed.normalized;

  if (toId === 'uuid_nohyphens') out = parsed.noHyphens;
  else if (toId === 'uuid_braces') out = parsed.braces;
  else if (toId === 'uuid_nil') out = NIL_GUID;

  let detail = `${parsed.version} | ${parsed.variant}`;
  if (parsed.timestamp) detail += ` | Timestamp: ${parsed.timestamp}`;

  return {
    fromValue: inputStr,
    fromUnit,
    toValue: out,
    toUnit,
    formattedOutput: out,
    formulaDescription: detail
  };
}

function handleHashEncodingConversion(fromId: string, toId: string, inputStr: string, fromUnit: UnitDefinition, toUnit: UnitDefinition): ConversionResult {
  const plainText = decodeToPlaintext(inputStr, fromId);
  const encoded = encodeFromPlaintext(plainText, toId);

  return {
    fromValue: inputStr,
    fromUnit,
    toValue: encoded,
    toUnit,
    formattedOutput: encoded,
    formulaDescription: `${fromUnit.name} ➔ Plaintext ➔ ${toUnit.name}`
  };
}

function handleCronScheduleConversion(toId: string, inputStr: string, fromUnit: UnitDefinition, toUnit: UnitDefinition): ConversionResult {
  const cronInfo = parseCronExpression(inputStr);
  let output = cronInfo.humanText;

  if (toId === 'cron_quartz') {
    output = cronInfo.quartz;
  } else if (toId === 'next_trigger_iso') {
    output = cronInfo.nextTriggers.length > 0 ? cronInfo.nextTriggers[0].toISOString() : 'No trigger found';
  } else if (toId === 'next_trigger_epoch') {
    output = cronInfo.nextTriggers.length > 0 ? String(Math.floor(cronInfo.nextTriggers[0].getTime() / 1000)) : '0';
  } else if (toId === 'interval_seconds') {
    output = `${cronInfo.intervalSec} seconds`;
  }

  return {
    fromValue: inputStr,
    fromUnit,
    toValue: output,
    toUnit,
    formattedOutput: output,
    formulaDescription: cronInfo.humanText
  };
}

function handleCidrSubnetConversion(toId: string, inputStr: string, fromUnit: UnitDefinition, toUnit: UnitDefinition): ConversionResult {
  const subnet = parseSubnetInput(inputStr);
  if (!subnet) {
    return {
      fromValue: inputStr,
      fromUnit,
      toValue: 'Invalid Subnet IP / CIDR',
      toUnit,
      formattedOutput: 'Invalid Subnet IP / CIDR',
      formulaDescription: 'Please enter a valid IPv4 address or CIDR notation (e.g. 192.168.1.1/24)'
    };
  }

  let out = subnet.subnetMaskStr;
  if (toId === 'wildcard_mask') out = subnet.wildcardMaskStr;
  else if (toId === 'network_address') out = subnet.networkStr;
  else if (toId === 'broadcast_address') out = subnet.broadcastStr;
  else if (toId === 'usable_range') out = subnet.usableRangeStr;
  else if (toId === 'total_hosts') out = `${subnet.usableHosts} hosts (${subnet.totalHosts} total IPs)`;
  else if (toId === 'binary_ip') out = subnet.binaryIpStr;
  else if (toId === 'cidr_prefix') out = `${subnet.ipStr}/${subnet.prefixLen}`;

  return {
    fromValue: inputStr,
    fromUnit,
    toValue: out,
    toUnit,
    formattedOutput: out,
    formulaDescription: `IP: ${subnet.ipStr} | Subnet /${subnet.prefixLen} | NetID: ${subnet.networkStr}`
  };
}

function handleBitwiseFlagsConversion(fromId: string, toId: string, inputStr: string, fromUnit: UnitDefinition, toUnit: UnitDefinition): ConversionResult {
  const perm = parsePermissionInput(inputStr, fromId);
  let out = perm.symbolic;

  if (toId === 'file_mode_octal') out = perm.octal;
  else if (toId === 'chmod_command') out = perm.chmodCmd;
  else if (toId === 'enum_mask') out = perm.enumStr;
  else if (toId === 'integer_val') out = String(perm.intVal);
  else if (toId === 'binary_flags') out = perm.binaryStr;

  return {
    fromValue: inputStr,
    fromUnit,
    toValue: out,
    toUnit,
    formattedOutput: out,
    formulaDescription: `Octal: ${perm.octal} | Symbolic: ${perm.symbolic} | Int: ${perm.intVal}`
  };
}

function handleCssUnitsConversion(fromId: string, toId: string, inputStr: string, fromUnit: UnitDefinition, toUnit: UnitDefinition): ConversionResult {
  const result = convertCssUnits(inputStr, fromId, toId, 16);

  return {
    fromValue: inputStr,
    fromUnit,
    toValue: result,
    toUnit,
    formattedOutput: result,
    formulaDescription: `Base 16px font-size ratio standard`
  };
}
