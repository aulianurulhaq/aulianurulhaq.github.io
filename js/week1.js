/**
 * Modul Interaktif Minggu 1: Sistem Bilangan & Konversi Biner Sentral
 * Mengimplementasikan mesin konversi dengan metode Biner sebagai titik temu sentral.
 */
// ==========================================
// 1. ENGINE KONVERSI BINER SENTRAL
// ==========================================
const BinaryCentralEngine = {
  // Validasi input berdasarkan basis
  validateInput(value, base) {
    const clean = String(value).trim().toUpperCase();
    if (!clean) return { valid: false, message: "Input tidak boleh kosong." };

    switch (base) {
      case "bin":
        if (!/^[01]+$/.test(clean))
          return {
            valid: false,
            message: "Biner hanya boleh berisi angka 0 dan 1.",
          };
        if (clean.length > 32)
          return {
            valid: false,
            message: "Maksimal panjang biner adalah 32 bit.",
          };
        return { valid: true, cleanValue: clean };
      case "oct":
        if (!/^[0-7]+$/.test(clean))
          return {
            valid: false,
            message: "Oktal hanya boleh berisi digit 0 sampai 7.",
          };
        if (parseInt(clean, 8) > 0xffffffff)
          return {
            valid: false,
            message: "Nilai oktal melebihi batas 32-bit.",
          };
        return { valid: true, cleanValue: clean };
      case "hex":
        if (!/^[0-9A-F]+$/.test(clean))
          return {
            valid: false,
            message: "Heksadesimal hanya boleh berisi 0-9 dan A-F.",
          };
        if (parseInt(clean, 16) > 0xffffffff)
          return {
            valid: false,
            message: "Nilai heksadesimal melebihi batas 32-bit.",
          };
        return { valid: true, cleanValue: clean };
      case "dec":
        if (!/^\d+$/.test(clean))
          return {
            valid: false,
            message: "Desimal harus berupa bilangan bulat positif.",
          };
        const num = BigInt(clean);
        if (num > 4294967295n)
          return {
            valid: false,
            message: "Maksimal nilai desimal adalah 4.294.967.295 (32-bit).",
          };
        return { valid: true, cleanValue: clean, num: Number(num) };
      default:
        return { valid: false, message: "Basis bilangan tidak valid." };
    }
  },

  // Konversi dari basis input ke BINER SENTRAL lengkap dengan langkahnya
  toCentralBinary(value, fromBase) {
    const valResult = this.validateInput(value, fromBase);
    if (!valResult.valid) {
      return { success: false, error: valResult.message };
    }

    const clean = valResult.cleanValue;
    const steps = [];
    let binaryStr = "";

    if (fromBase === "bin") {
      binaryStr = clean.replace(/^0+(?=\d)/, "") || "0";
      steps.push({
        type: "direct",
        title: "Sudah dalam Basis Biner",
        explanation: `Nilai input ${clean} sudah merupakan bilangan biner. Tidak memerlukan konversi pendahuluan.`,
      });
    } else if (fromBase === "dec") {
      let current = BigInt(clean);
      if (current === 0n) {
        binaryStr = "0";
        steps.push({
          quotient: "0",
          remainder: "0",
          expression: "0 / 2 = 0 sisa 0",
        });
      } else {
        const divSteps = [];
        while (current > 0n) {
          const next = current / 2n;
          const rem = current % 2n;
          divSteps.push({
            current: current.toString(),
            quotient: next.toString(),
            remainder: rem.toString(),
            expression: `${current} ÷ 2 = ${next} (Sisa ${rem})`,
          });
          current = next;
        }
        binaryStr = divSteps
          .map((s) => s.remainder)
          .reverse()
          .join("");
        steps.push({
          type: "division",
          title: "Metode Pembagian Bertingkat dengan 2",
          explanation:
            "Bagi bilangan desimal dengan 2 secara berulang. Catat setiap sisa pembagian (0 atau 1). Hasil biner dibaca dari sisa terakhir (MSB) ke sisa pertama (LSB).",
          rows: divSteps,
        });
      }
    } else if (fromBase === "oct") {
      const mapping = [];
      const octChars = clean.split("");
      for (const char of octChars) {
        const bin3 = parseInt(char, 8).toString(2).padStart(3, "0");
        mapping.push({ digit: char, bin: bin3, val: parseInt(char, 8) });
      }
      binaryStr =
        mapping
          .map((m) => m.bin)
          .join("")
          .replace(/^0+(?=\d)/, "") || "0";
      steps.push({
        type: "oct_expansion",
        title: "Ekspansi Setiap Digit Oktal ke 3-Bit Biner",
        explanation:
          "Karena 8 = 2³, setiap 1 digit oktal tepat ekuivalen dengan 3 bit biner (pembobotan 4-2-1).",
        mapping,
      });
    } else if (fromBase === "hex") {
      const mapping = [];
      const hexChars = clean.split("");
      for (const char of hexChars) {
        const decVal = parseInt(char, 16);
        const bin4 = decVal.toString(2).padStart(4, "0");
        mapping.push({ digit: char, dec: decVal, bin: bin4 });
      }
      binaryStr =
        mapping
          .map((m) => m.bin)
          .join("")
          .replace(/^0+(?=\d)/, "") || "0";
      steps.push({
        type: "hex_expansion",
        title: "Ekspansi Setiap Digit Heksadesimal ke 4-Bit Biner",
        explanation:
          "Karena 16 = 2⁴, setiap 1 digit heksadesimal tepat ekuivalen dengan 4 bit biner (pembobotan 8-4-2-1).",
        mapping,
      });
    }

    return {
      success: true,
      fromBase,
      inputValue: clean,
      centralBinary: binaryStr,
      steps,
    };
  },

  // Konversi dari BINER SENTRAL ke 3 basis lainnya
  fromCentralBinary(binaryStr) {
    const cleanBin = binaryStr.replace(/^0+(?=\d)/, "") || "0";

    // 1. Ke Heksadesimal (Kelompok 4 bit dari kanan)
    const hexGroupLen = 4;
    const hexRemainder = cleanBin.length % hexGroupLen;
    const hexPadded =
      hexRemainder === 0
        ? cleanBin
        : cleanBin.padStart(
            cleanBin.length + (hexGroupLen - hexRemainder),
            "0",
          );
    const hexGroups = [];
    let hexResult = "";

    for (let i = 0; i < hexPadded.length; i += hexGroupLen) {
      const chunk = hexPadded.slice(i, i + hexGroupLen);
      const decVal = parseInt(chunk, 2);
      const hexChar = decVal.toString(16).toUpperCase();
      hexResult += hexChar;
      hexGroups.push({
        chunk,
        bits: chunk
          .split("")
          .map((b, idx) => ({ bit: b, weight: [8, 4, 2, 1][idx] })),
        decVal,
        hexChar,
        calculation: `${chunk[0]}×8 + ${chunk[1]}×4 + ${chunk[2]}×2 + ${chunk[3]}×1 = ${decVal}`,
      });
    }

    // 2. Ke Oktal (Kelompok 3 bit dari kanan)
    const octGroupLen = 3;
    const octRemainder = cleanBin.length % octGroupLen;
    const octPadded =
      octRemainder === 0
        ? cleanBin
        : cleanBin.padStart(
            cleanBin.length + (octGroupLen - octRemainder),
            "0",
          );
    const octGroups = [];
    let octResult = "";

    for (let i = 0; i < octPadded.length; i += octGroupLen) {
      const chunk = octPadded.slice(i, i + octGroupLen);
      const decVal = parseInt(chunk, 2);
      const octChar = decVal.toString(8);
      octResult += octChar;
      octGroups.push({
        chunk,
        bits: chunk
          .split("")
          .map((b, idx) => ({ bit: b, weight: [4, 2, 1][idx] })),
        decVal,
        octChar,
        calculation: `${chunk[0]}×4 + ${chunk[1]}×2 + ${chunk[2]}×1 = ${decVal}`,
      });
    }

    // 3. Ke Desimal (Penjumlahan pembobotan posisi 2^n)
    const decTerms = [];
    let decSum = 0n;
    const binArr = cleanBin.split("").reverse(); // LSB di index 0

    binArr.forEach((bit, power) => {
      const bInt = BigInt(bit);
      const weight = 2n ** BigInt(power);
      const termVal = bInt * weight;
      decSum += termVal;
      decTerms.push({
        power,
        bit,
        weight: weight.toString(),
        termVal: termVal.toString(),
        isActive: bit === "1",
      });
    });

    return {
      centralBinary: cleanBin,
      toHex: {
        paddedBinary: hexPadded,
        padAdded: hexPadded.length - cleanBin.length,
        groups: hexGroups,
        result: hexResult.replace(/^0+(?=[1-9A-F])/, "") || "0",
      },
      toOct: {
        paddedBinary: octPadded,
        padAdded: octPadded.length - cleanBin.length,
        groups: octGroups,
        result: octResult.replace(/^0+(?=[1-7])/, "") || "0",
      },
      toDec: {
        terms: decTerms.reverse(), // kembalikan ke urutan MSB ke LSB untuk display
        activeTerms: decTerms.filter((t) => t.isActive),
        sumFormula:
          decTerms
            .filter((t) => t.isActive)
            .map((t) => t.weight)
            .join(" + ") || "0",
        result: decSum.toString(),
      },
    };
  },
};

// ==========================================
// 1B. ENGINE KONVERSI MULTI-BASIS UNIVERSAL
// ==========================================
const UniversalConversionEngine = {
  validate(value, base) {
    const clean = String(value).trim().toUpperCase();
    if (!clean) return { valid: false, message: "Input tidak boleh kosong." };

    switch (base) {
      case "dec":
        if (!/^\d+$/.test(clean))
          return {
            valid: false,
            message: "Desimal hanya boleh berisi digit 0-9.",
          };
        const dNum = BigInt(clean);
        if (dNum > 4294967295n)
          return {
            valid: false,
            message: "Maksimal desimal adalah 4.294.967.295 (32-bit).",
          };
        return { valid: true, cleanValue: clean, bigInt: dNum };

      case "bin":
        if (!/^[01]+$/.test(clean))
          return {
            valid: false,
            message: "Biner hanya boleh berisi digit 0 dan 1.",
          };
        if (clean.length > 32)
          return {
            valid: false,
            message: "Maksimal panjang biner adalah 32 bit.",
          };
        return { valid: true, cleanValue: clean, bigInt: BigInt("0b" + clean) };

      case "oct":
        if (!/^[0-7]+$/.test(clean))
          return {
            valid: false,
            message: "Oktal hanya boleh berisi digit 0 sampai 7.",
          };
        const oDec = BigInt("0o" + clean);
        if (oDec > 4294967295n)
          return {
            valid: false,
            message: "Nilai oktal melebihi batas 32-bit.",
          };
        return { valid: true, cleanValue: clean, bigInt: oDec };

      case "hex":
        if (!/^[0-9A-F]+$/.test(clean))
          return {
            valid: false,
            message: "Heksadesimal hanya boleh berisi digit 0-9 dan huruf A-F.",
          };
        const hDec = BigInt("0x" + clean);
        if (hDec > 4294967295n)
          return {
            valid: false,
            message: "Nilai heksadesimal melebihi batas 32-bit.",
          };
        return { valid: true, cleanValue: clean, bigInt: hDec };

      default:
        return { valid: false, message: "Basis bilangan tidak valid." };
    }
  },

  getDivisionSteps(decBigInt, radix) {
    let current = decBigInt;
    const rBig = BigInt(radix);
    if (current === 0n) {
      return [
        {
          current: "0",
          quotient: "0",
          remainder: "0",
          hexDigit: "0",
          expression: `0 ÷ ${radix} = 0 (Sisa 0)`,
        },
      ];
    }
    const steps = [];
    while (current > 0n) {
      const next = current / rBig;
      const rem = current % rBig;
      const remNum = Number(rem);
      let hexChar = remNum.toString(16).toUpperCase();
      let expr = `${current} ÷ ${radix} = ${next} (Sisa ${remNum})`;
      if (radix === 16 && remNum >= 10) {
        expr += ` &rarr; Simbol Heksa: <strong>${hexChar}</strong>`;
      }
      steps.push({
        current: current.toString(),
        quotient: next.toString(),
        remainder: remNum.toString(),
        hexDigit: hexChar,
        expression: expr,
      });
      current = next;
    }
    return steps;
  },

  getWeightSteps(cleanStr, radix) {
    const chars = cleanStr.split("").reverse();
    const terms = [];
    let sum = 0n;
    const rBig = BigInt(radix);

    chars.forEach((char, power) => {
      let digitVal = radix === 16 ? parseInt(char, 16) : parseInt(char, radix);
      let weight = rBig ** BigInt(power);
      let termVal = BigInt(digitVal) * weight;
      sum += termVal;
      let formula = `${char} × ${radix}<sup>${power}</sup>`;
      if (radix === 16 && digitVal >= 10) {
        formula = `${char} (${digitVal}) × ${radix}<sup>${power}</sup>`;
      }
      terms.push({
        char,
        digitVal,
        power,
        weight: weight.toString(),
        termVal: termVal.toString(),
        formula: `${formula} = ${digitVal} × ${weight} = <strong>${termVal}</strong>`,
      });
    });

    return {
      terms: terms.reverse(),
      sum: sum.toString(),
      sumFormula:
        terms.map((t) => t.termVal).join(" + ") + ` = <strong>${sum}</strong>`,
    };
  },

  getExpansionSteps(cleanStr, fromBase) {
    const bitsPerDigit = fromBase === "oct" ? 3 : 4;
    const chars = cleanStr.split("");
    const mappings = [];
    chars.forEach((char) => {
      const val = parseInt(char, fromBase === "oct" ? 8 : 16);
      const bin = val.toString(2).padStart(bitsPerDigit, "0");
      mappings.push({
        digit: char,
        val,
        bin,
      });
    });
    const combinedBin =
      mappings
        .map((m) => m.bin)
        .join("")
        .replace(/^0+(?=\d)/, "") || "0";
    return {
      bitsPerDigit,
      mappings,
      combinedBin,
    };
  },

  getGroupingSteps(binStr, toBase) {
    const cleanBin = binStr.replace(/^0+(?=\d)/, "") || "0";
    const groupLen = toBase === "oct" ? 3 : 4;
    const rem = cleanBin.length % groupLen;
    const padNeeded = rem === 0 ? 0 : groupLen - rem;
    const padded = cleanBin.padStart(cleanBin.length + padNeeded, "0");
    const groups = [];
    let result = "";

    for (let i = 0; i < padded.length; i += groupLen) {
      const chunk = padded.slice(i, i + groupLen);
      const val = parseInt(chunk, 2);
      const char =
        toBase === "oct" ? val.toString(8) : val.toString(16).toUpperCase();
      result += char;

      const weights = toBase === "oct" ? [4, 2, 1] : [8, 4, 2, 1];
      const calc =
        chunk
          .split("")
          .map((b, idx) => `${b}×${weights[idx]}`)
          .join(" + ") + ` = ${val}`;

      groups.push({
        chunk,
        val,
        char,
        calc,
      });
    }

    return {
      groupLen,
      cleanBin,
      padded,
      padNeeded,
      groups,
      result: result.replace(/^0+(?=[1-9A-F])/i, "") || "0",
    };
  },

  convertAll(value, fromBase) {
    const valRes = this.validate(value, fromBase);
    if (!valRes.valid) return { success: false, error: valRes.message };

    const decBig = valRes.bigInt;
    const decStr = decBig.toString();
    const binStr = decBig.toString(2);
    const octStr = decBig.toString(8);
    const hexStr = decBig.toString(16).toUpperCase();

    const results = {
      success: true,
      fromBase,
      inputValue: valRes.cleanValue,
      dec: decStr,
      bin: binStr,
      oct: octStr,
      hex: hexStr,
      steps: {},
    };

    if (fromBase === "dec") {
      results.steps.toBin = {
        title: "Desimal ke Biner (Metode Pembagian Bertingkat dengan 2)",
        radix: 2,
        rows: this.getDivisionSteps(decBig, 2),
        result: binStr,
      };
      results.steps.toOct = {
        title: "Desimal ke Oktal (Metode Pembagian Bertingkat dengan 8)",
        radix: 8,
        rows: this.getDivisionSteps(decBig, 8),
        result: octStr,
        altBinary: this.getGroupingSteps(binStr, "oct"),
      };
      results.steps.toHex = {
        title:
          "Desimal ke Heksadesimal (Metode Pembagian Bertingkat dengan 16)",
        radix: 16,
        rows: this.getDivisionSteps(decBig, 16),
        result: hexStr,
        altBinary: this.getGroupingSteps(binStr, "hex"),
      };
    } else if (fromBase === "bin") {
      results.steps.toDec = {
        title: "Biner ke Desimal (Metode Pembobotan Posisi Pangkat 2)",
        weightData: this.getWeightSteps(valRes.cleanValue, 2),
        result: decStr,
      };
      results.steps.toOct = {
        title: "Biner ke Oktal (Pengelompokan 3-Bit dari Kanan)",
        groupData: this.getGroupingSteps(valRes.cleanValue, "oct"),
        result: octStr,
      };
      results.steps.toHex = {
        title: "Biner ke Heksadesimal (Pengelompokan 4-Bit dari Kanan)",
        groupData: this.getGroupingSteps(valRes.cleanValue, "hex"),
        result: hexStr,
      };
    } else if (fromBase === "oct") {
      results.steps.toBin = {
        title: "Oktal ke Biner (Ekspansi 3-Bit per Digit)",
        expansionData: this.getExpansionSteps(valRes.cleanValue, "oct"),
        result: binStr,
      };
      results.steps.toDec = {
        title: "Oktal ke Desimal (Metode Pembobotan Posisi Pangkat 8)",
        weightData: this.getWeightSteps(valRes.cleanValue, 8),
        result: decStr,
      };
      results.steps.toHex = {
        title: "Oktal ke Heksadesimal (Jembatan Biner: 3-Bit &rarr; 4-Bit)",
        stepA: this.getExpansionSteps(valRes.cleanValue, "oct"),
        stepB: this.getGroupingSteps(binStr, "hex"),
        result: hexStr,
      };
    } else if (fromBase === "hex") {
      results.steps.toBin = {
        title: "Heksadesimal ke Biner (Ekspansi 4-Bit per Digit)",
        expansionData: this.getExpansionSteps(valRes.cleanValue, "hex"),
        result: binStr,
      };
      results.steps.toDec = {
        title: "Heksadesimal ke Desimal (Metode Pembobotan Posisi Pangkat 16)",
        weightData: this.getWeightSteps(valRes.cleanValue, 16),
        result: decStr,
      };
      results.steps.toOct = {
        title: "Heksadesimal ke Oktal (Jembatan Biner: 4-Bit &rarr; 3-Bit)",
        stepA: this.getExpansionSteps(valRes.cleanValue, "hex"),
        stepB: this.getGroupingSteps(binStr, "oct"),
        result: octStr,
      };
    }

    return results;
  },
};

// ==========================================
// 2. KONTROLER SUBMENU MINGGU 1
// ==========================================
const Week1Controller = {
  activeSubmenu: "w1-konsep",
  universalMode: "dec",
  currentSwitchBits: [0, 0, 1, 0, 1, 0, 1, 0], // Default 8-bit = 42
  quizState: {
    question: null,
    step1Done: false,
    score: 0,
    totalAttempted: 0,
    streak: 0,
  },

  init(containerEl, submenuId = "w1-konsep") {
    this.container = containerEl;
    this.activeSubmenu = submenuId;
    this.render();
  },

  render() {
    if (!this.container) return;

    let contentHtml = "";
    switch (this.activeSubmenu) {
      case "w1-konsep":
        contentHtml = this.getConceptTemplate();
        break;
      case "w1-universal":
        contentHtml = this.getUniversalConverterTemplate();
        break;
      case "w1-simulator":
        contentHtml = this.getSimulatorTemplate();
        break;
      case "w1-visualizer":
        contentHtml = this.getVisualizerTemplate();
        break;
      case "w1-switcher":
        contentHtml = this.getSwitcherTemplate();
        break;
      case "w1-kuis":
        contentHtml = this.getQuizTemplate();
        break;
      default:
        contentHtml = this.getConceptTemplate();
    }

    this.container.innerHTML = contentHtml;
    this.attachEvents();
  },

  // -------------------------------------------------------------
  // TEMPLATE SUBMENU 1: KONSEP & TEORI BINER SENTRAL
  // -------------------------------------------------------------
  getConceptTemplate() {
    return `
      <div class="topic-content animate-fade-in">
        <div class="topic-header">
          <div class="topic-meta">
            <span class="badge badge-accent"><i class="fas fa-book-open"></i> Submateri 1</span>
            <span class="badge badge-outline">Fondasi Digital</span>
          </div>
          <h2 class="topic-title">Konsep & Teori "Biner Sentral"</h2>
          <p class="topic-subtitle">
            Mengapa sistem biner menjadi pusat konversi dan bagaimana hubungan eksponensial basis memudahkan komputasi digital.
          </p>
        </div>

        <!-- Callout Inti Metode Biner Sentral -->
        <div class="callout callout-info">
          <div class="callout-icon"><i class="fas fa-bullseye"></i></div>
          <div class="callout-body">
            <h4>Prinsip Inti Metode Biner Sentral:</h4>
            <p>
              Alih-alih menghafal 12 rumus konversi langsung antar basis yang rumit (misal Oktal ke Heksa atau sebaliknya),
              kita menggunakan <strong>Sistem Biner sebagai Hub/Jembatan Utama</strong>. Semua bilangan dikonversi terlebih dahulu
              menjadi Biner, kemudian didistribusikan ke basis tujuan:
            </p>
            <ul class="styled-list">
              <li><strong>Ke Heksadesimal:</strong> Kelompokkan biner per <strong>4 bit</strong> dari kanan (karena 16 = 2<sup>4</sup>).</li>
              <li><strong>Ke Oktal:</strong> Kelompokkan biner per <strong>3 bit</strong> dari kanan (karena 8 = 2<sup>3</sup>).</li>
              <li><strong>Ke Desimal:</strong> Jumlahkan bobot posisi pangkat dua (&sum; b<sub>i</sub> &times; 2<sup>i</sup>) untuk setiap bit bernilai 1.</li>
            </ul>
          </div>
        </div>

        <!-- Diagram Arsitektur Biner Sentral -->
        <div class="central-diagram-card card">
          <h3 class="card-title"><i class="fas fa-project-diagram"></i> Diagram Alur Biner Sentral</h3>
          <div class="diagram-visual">
            <div class="diag-node diag-dec">
              <span class="node-badge">Basis 10</span>
              <strong>DESIMAL</strong>
              <small>Simbol: 0 - 9</small>
            </div>

            <div class="diag-node diag-oct">
              <span class="node-badge">Basis 8</span>
              <strong>OKTAL</strong>
              <small>Simbol: 0 - 7</small>
            </div>

            <div class="diag-node diag-center">
              <div class="hub-pulse"></div>
              <span class="node-badge node-badge-hub">HUB SENTRAL</span>
              <strong>SISTEM BINER (Basis 2)</strong>
              <small>Simbol: 0 dan 1</small>
              <div class="hub-rules">
                <span><i class="fas fa-layer-group"></i> 4-Bit &rarr; Heksa</span>
                <span><i class="fas fa-th-large"></i> 3-Bit &rarr; Oktal</span>
                <span><i class="fas fa-plus-circle"></i> Bobot 2<sup>n</sup> &rarr; Desimal</span>
              </div>
            </div>

            <div class="diag-node diag-hex">
              <span class="node-badge">Basis 16</span>
              <strong>HEKSADESIMAL</strong>
              <small>Simbol: 0-9, A-F</small>
            </div>
          </div>
        </div>

        <!-- 4 Pilar Karakteristik Sistem Bilangan -->
        <div class="grid-4-cols mt-4">
          <div class="card base-card">
            <div class="base-header">
              <span class="base-radix">r = 10</span>
              <h4>Desimal</h4>
            </div>
            <p class="base-desc">Sistem bilangan basis 10 yang digunakan manusia sehari-hari.</p>
            <div class="base-elements">Simbol: <code>0, 1, 2, 3, 4, 5, 6, 7, 8, 9</code></div>
            <div class="base-rule">
              <strong>Cara ke Biner:</strong> Pembagian berulang dengan 2 & catat sisa bagi.
            </div>
          </div>

          <div class="card base-card highlight-card">
            <div class="base-header">
              <span class="base-radix">r = 2</span>
              <h4>Biner (Sentral)</h4>
            </div>
            <p class="base-desc">Bahasa alami sirkuit digital dan saklar transistor (ON/OFF).</p>
            <div class="base-elements">Simbol: <code>0, 1</code></div>
            <div class="base-rule">
              <strong>Fungsi:</strong> Menjadi jembatan penerjemah ke semua sistem basis lainnya.
            </div>
          </div>

          <div class="card base-card">
            <div class="base-header">
              <span class="base-radix">r = 8</span>
              <h4>Oktal</h4>
            </div>
            <p class="base-desc">Meringkas 3 digit biner menjadi 1 digit agar mudah dibaca manusia.</p>
            <div class="base-elements">Simbol: <code>0, 1, 2, 3, 4, 5, 6, 7</code></div>
            <div class="base-rule">
              <strong>Kunci:</strong> $2^3 = 8$. Selalu berpasangan dengan kelipatan 3 bit.
            </div>
          </div>

          <div class="card base-card">
            <div class="base-header">
              <span class="base-radix">r = 16</span>
              <h4>Heksadesimal</h4>
            </div>
            <p class="base-desc">Meringkas 4 digit biner (1 nibble). Sangat luas dipakai di memori komputer & kode warna.</p>
            <div class="base-elements">Simbol: <code>0-9, A, B, C, D, E, F</code></div>
            <div class="base-rule">
              <strong>Kunci:</strong> $2^4 = 16$. Nilai A=10, B=11, C=12, D=13, E=14, F=15.
            </div>
          </div>
        </div>

        <!-- Tabel Referensi Cepat Interaktif -->
        <div class="card mt-4">
          <div class="card-header-flex">
            <div>
              <h3 class="card-title"><i class="fas fa-table"></i> Tabel Padanan 0 - 15 (Hubungan 3-Bit & 4-Bit)</h3>
              <p class="card-desc">Tabel referensi konversi instan. Klik baris manapun untuk menyalin atau menguji.</p>
            </div>
            <span class="badge badge-info">16 Kombinasi Nibble</span>
          </div>

          <div class="table-responsive">
            <table class="conversion-table">
              <thead>
                <tr>
                  <th>Desimal (10)</th>
                  <th>Biner 4-Bit (2⁴)</th>
                  <th>Biner 3-Bit (2³)</th>
                  <th>Oktal (8)</th>
                  <th>Heksadesimal (16)</th>
                  <th>Keterangan Pembobotan</th>
                </tr>
              </thead>
              <tbody>
                ${this.generateReferenceTableRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  generateReferenceTableRows() {
    let rows = "";
    for (let i = 0; i <= 15; i++) {
      const bin4 = i.toString(2).padStart(4, "0");
      const bin3 = i < 8 ? i.toString(2).padStart(3, "0") : "-";
      const oct = i < 8 ? i.toString(8) : `${Math.floor(i / 8)}${i % 8}`;
      const hex = i.toString(16).toUpperCase();
      const isLetter = i >= 10;
      const weightDesc =
        bin4
          .split("")
          .map((b, idx) => (b === "1" ? [8, 4, 2, 1][idx] : null))
          .filter(Boolean)
          .join(" + ") || "0";

      rows += `
        <tr class="${isLetter ? "row-letter" : ""}">
          <td><strong class="num-dec">${i}</strong></td>
          <td><code class="code-bin">${bin4}</code></td>
          <td><code class="code-oct-bin">${bin3}</code></td>
          <td><strong class="num-oct">${oct}</strong></td>
          <td>
            <strong class="num-hex ${isLetter ? "hex-special" : ""}">${hex}</strong>
            ${isLetter ? `<small class="hex-alias">(${i})</small>` : ""}
          </td>
          <td class="text-muted"><small>${weightDesc} = ${i}</small></td>
        </tr>
      `;
    }
    return rows;
  },

  // -------------------------------------------------------------
  // TEMPLATE SUBMENU: KONVERSI SEMUA BILANGAN (MULTI-BASIS)
  // -------------------------------------------------------------
  getUniversalConverterTemplate() {
    return `
      <div class="topic-content animate-fade-in">
        <div class="topic-header">
          <div class="topic-meta">
            <span class="badge badge-accent"><i class="fas fa-arrows-rotate"></i> Konverter Lengkap</span>
            <span class="badge badge-outline">Multi-Basis Universal</span>
          </div>
          <h2 class="topic-title">Konversi Semua Basis Bilangan</h2>
          <p class="topic-subtitle">
            Konversikan bilangan secara bebas antara <strong>Desimal</strong>, <strong>Biner</strong>, <strong>Oktal</strong>, dan <strong>Heksadesimal</strong> dengan penjabaran langkah matematis serta simulator sinkronisasi 4 basis secara <em>real-time</em>.
          </p>
        </div>

        <!-- Mode Selector Tabs -->
        <div class="card universal-mode-card">
          <div class="universal-tabs-wrapper">
            <div class="universal-tabs" id="univ-mode-tabs">
              <button type="button" class="univ-tab-btn ${this.universalMode === "dec" ? "active" : ""}" data-mode="dec">
                <span class="tab-radix radix-dec">r=10</span>
                <span><i class="fas fa-hashtag"></i> Desimal &rarr; Semua</span>
              </button>
              <button type="button" class="univ-tab-btn ${this.universalMode === "bin" ? "active" : ""}" data-mode="bin">
                <span class="tab-radix radix-bin">r=2</span>
                <span><i class="fas fa-code"></i> Biner &rarr; Semua</span>
              </button>
              <button type="button" class="univ-tab-btn ${this.universalMode === "oct" ? "active" : ""}" data-mode="oct">
                <span class="tab-radix radix-oct">r=8</span>
                <span><i class="fas fa-layer-group"></i> Oktal &rarr; Semua</span>
              </button>
              <button type="button" class="univ-tab-btn ${this.universalMode === "hex" ? "active" : ""}" data-mode="hex">
                <span class="tab-radix radix-hex">r=16</span>
                <span><i class="fas fa-cube"></i> Heksadesimal &rarr; Semua</span>
              </button>
              <button type="button" class="univ-tab-btn tab-highlight ${this.universalMode === "sync" ? "active" : ""}" data-mode="sync">
                <span class="tab-radix radix-sync"><i class="fas fa-bolt"></i></span>
                <span>Sinkronisasi 4 Basis (Live)</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Container Mode Single Base (Dec / Bin / Oct / Hex) -->
        <div id="univ-single-base-panel" class="${this.universalMode === "sync" ? "hidden" : ""}">
          <div class="card univ-input-card mt-3">
            <div class="univ-input-header">
              <div class="univ-input-title-wrap">
                <span class="badge" id="univ-active-badge">Basis Desimal (10)</span>
                <h3 id="univ-input-heading" class="mt-1">Masukkan Bilangan Desimal</h3>
              </div>
              <div class="univ-input-limits">
                <small class="text-muted" id="univ-valid-chars">Karakter valid: <code>0-9</code></small>
              </div>
            </div>

            <div class="form-group mt-3">
              <div class="input-action-wrapper">
                <input
                  type="text"
                  id="univ-input-val"
                  class="text-input font-mono univ-main-input"
                  value="42"
                  placeholder="Ketik nilai..."
                  autocomplete="off"
                  spellcheck="false"
                >
                <button type="button" id="btn-run-univ" class="btn btn-primary">
                  <i class="fas fa-calculator"></i> Hitung Konversi
                </button>
                <button type="button" id="btn-clear-univ" class="btn btn-outline" title="Kosongkan">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div id="univ-input-error" class="input-error-msg hidden"></div>
            </div>

            <!-- Quick Presets -->
            <div class="preset-row mt-2" id="univ-preset-container">
              <!-- Rendered dynamically -->
            </div>
          </div>

          <!-- Dynamic Output Results -->
          <div id="univ-results-area" class="mt-4">
            <!-- Rendered by JS -->
          </div>
        </div>

        <!-- Container Mode Live 4-Way Sync -->
        <div id="univ-sync-panel" class="${this.universalMode === "sync" ? "" : "hidden"}">
          <div class="card sync-intro-card mt-3">
            <div class="sync-intro-header">
              <div>
                <span class="badge badge-accent"><i class="fas fa-bolt"></i> Real-Time Bidirectional</span>
                <h3 class="card-title mt-1">Matriks Sinkronisasi 4 Basis Bilangan</h3>
                <p class="card-desc">Ketik angka pada <strong>salah satu</strong> kotak input di bawah. Ketiga kotak lainnya akan otomatis terhitung dan diperbarui secara instan!</p>
              </div>
              <div class="sync-actions-top">
                <button type="button" id="btn-sync-rand" class="btn btn-sm btn-outline"><i class="fas fa-dice"></i> Nilai Acak</button>
                <button type="button" id="btn-sync-reset" class="btn btn-sm btn-outline"><i class="fas fa-undo"></i> Reset Semua</button>
              </div>
            </div>

            <!-- 4 Grid Cards -->
            <div class="grid-2-cols sync-boxes-grid mt-4">
              <!-- Desimal -->
              <div class="sync-box sync-box-dec" id="sync-card-dec">
                <div class="sync-box-header">
                  <div class="sync-box-info">
                    <span class="radix-pill radix-dec">r = 10</span>
                    <strong>DESIMAL</strong>
                  </div>
                  <button type="button" class="btn-copy-chip" data-target="sync-input-dec" title="Salin Desimal">
                    <i class="fas fa-copy"></i> Salin
                  </button>
                </div>
                <div class="sync-input-wrap">
                  <input type="text" id="sync-input-dec" class="sync-field font-mono" value="42" placeholder="0-9" autocomplete="off" spellcheck="false">
                </div>
                <div class="sync-box-footer">
                  <small class="text-muted">Simbol: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9</small>
                </div>
              </div>

              <!-- Biner -->
              <div class="sync-box sync-box-bin" id="sync-card-bin">
                <div class="sync-box-header">
                  <div class="sync-box-info">
                    <span class="radix-pill radix-bin">r = 2</span>
                    <strong>BINER</strong>
                  </div>
                  <button type="button" class="btn-copy-chip" data-target="sync-input-bin" title="Salin Biner">
                    <i class="fas fa-copy"></i> Salin
                  </button>
                </div>
                <div class="sync-input-wrap">
                  <input type="text" id="sync-input-bin" class="sync-field font-mono" value="101010" placeholder="0 atau 1" autocomplete="off" spellcheck="false">
                </div>
                <div class="sync-box-footer">
                  <small class="text-muted">Awalan Bahasa Pemrograman: <code class="code-prefix">0b101010</code></small>
                </div>
              </div>

              <!-- Oktal -->
              <div class="sync-box sync-box-oct" id="sync-card-oct">
                <div class="sync-box-header">
                  <div class="sync-box-info">
                    <span class="radix-pill radix-oct">r = 8</span>
                    <strong>OKTAL</strong>
                  </div>
                  <button type="button" class="btn-copy-chip" data-target="sync-input-oct" title="Salin Oktal">
                    <i class="fas fa-copy"></i> Salin
                  </button>
                </div>
                <div class="sync-input-wrap">
                  <input type="text" id="sync-input-oct" class="sync-field font-mono" value="52" placeholder="0-7" autocomplete="off" spellcheck="false">
                </div>
                <div class="sync-box-footer">
                  <small class="text-muted">Simbol: 0 sampai 7 | Awalan: <code class="code-prefix">0o52</code></small>
                </div>
              </div>

              <!-- Heksadesimal -->
              <div class="sync-box sync-box-hex" id="sync-card-hex">
                <div class="sync-box-header">
                  <div class="sync-box-info">
                    <span class="radix-pill radix-hex">r = 16</span>
                    <strong>HEKSADESIMAL</strong>
                  </div>
                  <button type="button" class="btn-copy-chip" data-target="sync-input-hex" title="Salin Heksa">
                    <i class="fas fa-copy"></i> Salin
                  </button>
                </div>
                <div class="sync-input-wrap">
                  <input type="text" id="sync-input-hex" class="sync-field font-mono" value="2A" placeholder="0-9, A-F" autocomplete="off" spellcheck="false">
                </div>
                <div class="sync-box-footer">
                  <small class="text-muted">A=10, B=11, C=12, D=13, E=14, F=15 | <code class="code-prefix">0x2A</code></small>
                </div>
              </div>
            </div>

            <!-- Live Telemetry Bar -->
            <div class="sync-telemetry card mt-4">
              <div class="sync-tele-header">
                <span class="tele-title"><i class="fas fa-microchip"></i> Telemetri Representasi Memori Digital</span>
                <span class="badge badge-info" id="tele-bits-badge">6 Bit • 1 Byte</span>
              </div>
              <div class="tele-bits-display mt-2" id="sync-tele-bits">
                <!-- Bit visualizer pills -->
              </div>
              <div class="sync-presets-quick mt-3">
                <span class="preset-label">Contoh Cepat:</span>
                <button type="button" class="btn-chip sync-preset-btn" data-val="15">15 (Nibble Maks)</button>
                <button type="button" class="btn-chip sync-preset-btn" data-val="42">42 (Standar)</button>
                <button type="button" class="btn-chip sync-preset-btn" data-val="127">127 (7-Bit ASCII)</button>
                <button type="button" class="btn-chip sync-preset-btn" data-val="255">255 (1 Byte Maks)</button>
                <button type="button" class="btn-chip sync-preset-btn" data-val="1024">1024 (1 KiB)</button>
                <button type="button" class="btn-chip sync-preset-btn" data-val="4095">4095 (12-Bit / 0xFFF)</button>
                <button type="button" class="btn-chip sync-preset-btn" data-val="65535">65535 (2 Byte Maks)</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderUniversalResults(results, fromBase) {
    const baseMeta = {
      dec: {
        name: "Desimal",
        radix: 10,
        symbol: "₁₀",
        color: "text-sky",
        badgeClass: "badge-dec",
        note: "Basis 10 (Sistem Manusia)",
      },
      bin: {
        name: "Biner",
        radix: 2,
        symbol: "₂",
        color: "text-cyan",
        badgeClass: "badge-bin",
        note: "Basis 2 (Sirkuit Digital)",
      },
      oct: {
        name: "Oktal",
        radix: 8,
        symbol: "₈",
        color: "text-amber",
        badgeClass: "badge-oct",
        note: "Basis 8 (Kelompok 3-Bit)",
      },
      hex: {
        name: "Heksadesimal",
        radix: 16,
        symbol: "₁₆",
        color: "text-magenta",
        badgeClass: "badge-hex",
        note: "Basis 16 (Kelompok 4-Bit)",
      },
    };

    const targetBases = ["dec", "bin", "oct", "hex"].filter(
      (b) => b !== fromBase,
    );

    // 1. Kartu Ringkasan Hasil (3 Target Cards)
    const cardsHtml = targetBases
      .map((tBase) => {
        const meta = baseMeta[tBase];
        const val = results[tBase];
        return `
        <div class="card conv-result-card card-${tBase} animate-slide-up">
          <div class="conv-card-header">
            <span class="badge ${meta.badgeClass}"><i class="fas fa-arrow-right"></i> Ke ${meta.name}</span>
            <span class="radix-pill radix-${tBase}">r = ${meta.radix}</span>
          </div>
          <div class="conv-card-body mt-2">
            <div class="final-result-box">
              <span class="final-label">Nilai Ekuivalen:</span>
              <span class="final-value ${meta.color} font-mono">${val}<sub>${meta.radix}</sub></span>
            </div>
            <p class="conv-desc mt-2"><small class="text-muted">${meta.note}</small></p>
          </div>
          <div class="conv-card-footer mt-3">
            <button type="button" class="btn btn-sm btn-outline btn-copy-univ w-100" data-copy-text="${val}">
              <i class="fas fa-copy"></i> Salin ${meta.name}
            </button>
          </div>
        </div>
      `;
      })
      .join("");

    // 2. Rincian Langkah Matematis per Target Base
    const stepKeys = {
      dec: ["toBin", "toOct", "toHex"],
      bin: ["toDec", "toOct", "toHex"],
      oct: ["toBin", "toDec", "toHex"],
      hex: ["toBin", "toDec", "toOct"],
    };

    const stepsHtml = stepKeys[fromBase]
      .map((k) => {
        const step = results.steps[k];
        if (!step) return "";
        const targetBaseKey = k.replace("to", "").toLowerCase();
        const tMeta = baseMeta[targetBaseKey];

        let detailHtml = "";
        if (step.method === "division") {
          detailHtml = this.renderDivisionTable(
            step.rows,
            step.radix,
            step.result,
          );
          if (step.altBinary) {
            detailHtml += `
            <div class="alt-method-box mt-4">
              <div class="alt-method-header">
                <span class="badge badge-info"><i class="fas fa-code-branch"></i> Cara Alternatif: Melalui Pengelompokan Biner</span>
              </div>
              <p class="text-muted mt-1"><small>Desimal &rarr; Biner &rarr; ${tMeta.name}:</small></p>
              ${this.renderGroupingGrid(step.altBinary, targetBaseKey, step.result)}
            </div>
          `;
          }
        } else if (step.method === "weight") {
          detailHtml = this.renderWeightTable(
            step.weightData,
            step.radix,
            step.result,
          );
        } else if (step.method === "expansion") {
          detailHtml = this.renderExpansionGrid(
            step.expansionData,
            step.expansionData.bitsPerDigit,
            step.result,
          );
        } else if (step.method === "grouping") {
          detailHtml = this.renderGroupingGrid(
            step.groupData,
            targetBaseKey,
            step.result,
          );
        } else if (step.method === "bridge") {
          detailHtml = this.renderBridgeSteps(
            step.stepA,
            step.stepB,
            step.result,
            fromBase,
            targetBaseKey,
          );
        }

        return `
        <div class="card derivation-card mb-4 animate-slide-up">
          <div class="derivation-header">
            <div class="derivation-title-wrap">
              <span class="badge ${tMeta.badgeClass}"><i class="fas fa-calculator"></i> Konversi ke ${tMeta.name}</span>
              <h4 class="derivation-title mt-1">${step.title}</h4>
            </div>
            <div class="derivation-result-pill">
              Hasil: <strong class="font-mono ${tMeta.color}">${step.result}<sub>${tMeta.radix}</sub></strong>
            </div>
          </div>
          <div class="derivation-body mt-3">
            ${detailHtml}
          </div>
        </div>
      `;
      })
      .join("");

    return `
      <!-- Ringkasan Kartu 3 Basis Tujuan -->
      <div class="card mb-4">
        <div class="card-header-flex">
          <div>
            <h3 class="card-title"><i class="fas fa-layer-group"></i> Hasil Konversi Semua Basis</h3>
            <p class="card-desc">Nilai input <strong class="font-mono text-cyan">${results.inputValue}<sub>${baseMeta[fromBase].radix}</sub></strong> (${baseMeta[fromBase].name}) dalam 3 sistem bilangan lainnya:</p>
          </div>
          <span class="badge badge-accent">Selesai Dihitung</span>
        </div>

        <div class="grid-3-cards mt-3">
          ${cardsHtml}
        </div>
      </div>

      <!-- Langkah Matematis Lengkap -->
      <div class="derivation-section mt-4">
        <div class="section-header-wrap mb-3">
          <h3 class="section-title"><i class="fas fa-list-check"></i> Langkah & Pembuktian Matematis Detail</h3>
          <p class="section-desc text-muted">Pelajari metode konversi langkah-demi-langkah dari ${baseMeta[fromBase].name} ke masing-masing sistem basis:</p>
        </div>

        ${stepsHtml}
      </div>
    `;
  },

  renderDivisionTable(rows, radix, targetResult) {
    return `
      <div class="table-responsive mt-2">
        <table class="division-table">
          <thead>
            <tr>
              <th>Operasi Pembagian</th>
              <th>Hasil Bagi</th>
              <th>Sisa Bagi</th>
              <th>Digit Ekuivalen</th>
              <th>Urutan Digit</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (r, i) => `
              <tr>
                <td><code>${r.current} ÷ ${radix}</code></td>
                <td><strong>${r.quotient}</strong></td>
                <td><span class="badge ${r.remainder !== "0" ? "badge-accent" : "badge-dim"}">${r.remainder}</span></td>
                <td><strong class="font-mono text-cyan">${r.hexDigit}</strong></td>
                <td><small class="text-muted">${i === rows.length - 1 ? "↑ MSB (Paling Kiri)" : i === 0 ? "LSB (Paling Kanan)" : "↑"}</small></td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <div class="result-highlight-pill mt-3">
        <i class="fas fa-arrow-up text-cyan"></i> Baca digit dari <strong>bawah (MSB) ke atas (LSB)</strong>:
        <strong class="font-mono text-cyan ms-1">${targetResult}</strong><sub>${radix}</sub>
      </div>
    `;
  },

  renderWeightTable(weightData, radix, targetResult) {
    return `
      <div class="table-responsive mt-2">
        <table class="division-table">
          <thead>
            <tr>
              <th>Digit Asal (d)</th>
              <th>Posisi (n)</th>
              <th>Bobot Posisi (${radix}ⁿ)</th>
              <th>Perhitungan Suku (d × ${radix}ⁿ)</th>
              <th>Nilai Suku</th>
            </tr>
          </thead>
          <tbody>
            ${weightData.terms
              .map(
                (t) => `
              <tr>
                <td><strong class="font-mono text-cyan">${t.char}${radix === 16 && t.digitVal >= 10 ? ` <small class="text-muted">(${t.digitVal})</small>` : ""}</strong></td>
                <td><span class="badge badge-dim">${t.power}</span></td>
                <td><code>${radix}<sup>${t.power}</sup> = ${t.weight}</code></td>
                <td>${t.formula}</td>
                <td><strong>${t.termVal}</strong></td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <div class="result-highlight-pill mt-3">
        <strong>Jumlahkan Seluruh Nilai Suku:</strong><br>
        <span class="font-mono">${weightData.sumFormula}</span><sub>10</sub>
      </div>
    `;
  },

  renderExpansionGrid(expansionData, bitsPerDigit, targetResult) {
    return `
      <p class="step-note mt-2">
        Karena ${bitsPerDigit === 3 ? "8 = 2³" : "16 = 2⁴"}, setiap 1 digit asal langsung diekspansikan menjadi <strong>${bitsPerDigit} digit biner</strong>:
      </p>
      <div class="expansion-grid mt-3">
        ${expansionData.mappings
          .map(
            (m) => `
          <div class="expansion-card ${bitsPerDigit === 3 ? "exp-oct" : "exp-hex"}">
            <div class="exp-src">${m.digit}<sub>${bitsPerDigit === 3 ? "8" : "16"}</sub></div>
            <div class="exp-arrow"><i class="fas fa-arrow-down"></i></div>
            <div class="exp-target font-mono">${m.bin}₂</div>
            <small class="exp-desc">${bitsPerDigit === 3 ? `(Bobot 4-2-1: ${m.val})` : `(${m.digit} = ${m.val}₁₀)`}</small>
          </div>
        `,
          )
          .join("")}
      </div>
      <div class="result-highlight-pill mt-3">
        Gabungkan semua bit dari kiri ke kanan: <strong class="font-mono text-cyan">${targetResult}</strong>₂
      </div>
    `;
  },

  renderGroupingGrid(groupData, toBase, targetResult) {
    const isOct = toBase === "oct";
    const radix = isOct ? 8 : 16;
    return `
      <p class="conv-desc mt-2">
        Biner dikelompokkan per <strong>${groupData.groupLen} bit</strong> mulai dari <em>kanan ke kiri</em>.
        ${groupData.padNeeded > 0 ? `<br><span class="text-warning"><i class="fas fa-info-circle"></i> Ditambahkan <strong>${groupData.padNeeded} bit nol (leading zero)</strong> di paling kiri agar kelompok bit lengkap.</span>` : ""}
      </p>
      <div class="grouping-boxes mt-3">
        ${groupData.groups
          .map(
            (g) => `
          <div class="group-box ${isOct ? "group-oct" : "group-hex"}">
            <div class="group-binary font-mono">${g.chunk}</div>
            <div class="group-weights">${isOct ? "4 2 1" : "8 4 2 1"}</div>
            <div class="group-calc"><small>${g.calc}</small></div>
            <div class="group-result-digit font-mono">${g.char}</div>
          </div>
        `,
          )
          .join("")}
      </div>
      <div class="result-highlight-pill mt-3">
        Gabungkan digit hasil: <strong class="font-mono ${isOct ? "text-amber" : "text-magenta"}">${targetResult}</strong><sub>${radix}</sub>
      </div>
    `;
  },

  renderBridgeSteps(stepA, stepB, targetResult, fromBase, toBase) {
    const fromRadix = fromBase === "oct" ? 8 : 16;
    const toRadix = toBase === "hex" ? 16 : 8;
    return `
      <div class="bridge-flow mt-2">
        <div class="sub-stage-box mb-3">
          <div class="sub-stage-header">
            <span class="badge badge-accent">Tahap 1</span>
            <strong>Ekspansi Digit Asal (${fromRadix}) ke Biner</strong>
          </div>
          ${this.renderExpansionGrid(stepA, stepA.bitsPerDigit, stepA.combinedBin)}
        </div>

        <div class="bridge-arrow-wrap text-center my-3">
          <span class="badge badge-info"><i class="fas fa-exchange-alt"></i> Jembatan Biner Sentral: <code class="font-mono text-cyan">${stepA.combinedBin}₂</code></span>
        </div>

        <div class="sub-stage-box mt-3">
          <div class="sub-stage-header">
            <span class="badge badge-accent">Tahap 2</span>
            <strong>Kelompokkan Ulang Bit Biner ke Basis Tujuan (${toRadix})</strong>
          </div>
          ${this.renderGroupingGrid(stepB, toBase, targetResult)}
        </div>
      </div>
    `;
  },

  // -------------------------------------------------------------
  // TEMPLATE SUBMENU 2: SIMULATOR KONVERSI SENTRAL
  // -------------------------------------------------------------
  getSimulatorTemplate() {
    return `
      <div class="topic-content animate-fade-in">
        <div class="topic-header">
          <div class="topic-meta">
            <span class="badge badge-accent"><i class="fas fa-cpu"></i> Submateri 2</span>
            <span class="badge badge-outline">Simulator Interaktif</span>
          </div>
          <h2 class="topic-title">Simulator Konversi Biner Sentral</h2>
          <p class="topic-subtitle">
            Masukkan bilangan dari basis apapun, lihat proses visual pembentukan Biner Sentral, serta pengelompokan 4-bit (Heksa), 3-bit (Oktal), dan pembobotan (Desimal).
          </p>
        </div>

        <!-- Input Box Panel -->
        <div class="card simulator-input-card">
          <div class="sim-controls">
            <div class="form-group">
              <label class="form-label"><i class="fas fa-exchange-alt"></i> Pilih Basis Input Asal:</label>
              <div class="radio-pill-group" id="sim-base-selector">
                <button type="button" class="radio-pill active" data-base="dec">
                  <span class="pill-badge">10</span> Desimal
                </button>
                <button type="button" class="radio-pill" data-base="bin">
                  <span class="pill-badge">2</span> Biner
                </button>
                <button type="button" class="radio-pill" data-base="oct">
                  <span class="pill-badge">8</span> Oktal
                </button>
                <button type="button" class="radio-pill" data-base="hex">
                  <span class="pill-badge">16</span> Heksadesimal
                </button>
              </div>
            </div>

            <div class="form-group mt-3">
              <label class="form-label" for="sim-input-val">
                <span id="sim-input-label">Masukkan Nilai Desimal (0-9):</span>
              </label>
              <div class="input-action-wrapper">
                <input
                  type="text"
                  id="sim-input-val"
                  class="text-input"
                  value="42"
                  placeholder="Contoh: 42"
                  autocomplete="off"
                  spellcheck="false"
                >
                <button type="button" id="btn-run-sim" class="btn btn-primary">
                  <i class="fas fa-play"></i> Konversi via Biner Sentral
                </button>
              </div>
              <div id="sim-input-error" class="input-error-msg hidden"></div>
            </div>

            <!-- Quick Presets -->
            <div class="preset-row">
              <span class="preset-label">Contoh Cepat:</span>
              <button type="button" class="btn-chip" data-val="42" data-base="dec">42 (Desimal)</button>
              <button type="button" class="btn-chip" data-val="125" data-base="dec">125 (Desimal)</button>
              <button type="button" class="btn-chip" data-val="255" data-base="dec">255 (Byte Maks)</button>
              <button type="button" class="btn-chip" data-val="75" data-base="oct">75 (Oktal)</button>
              <button type="button" class="btn-chip" data-val="2F" data-base="hex">2F (Heksa)</button>
              <button type="button" class="btn-chip" data-val="101101" data-base="bin">101101 (Biner)</button>
            </div>
          </div>
        </div>

        <!-- Live Results Container -->
        <div id="sim-results-area" class="mt-4">
          <!-- Diisi secara dinamis oleh JavaScript -->
        </div>
      </div>
    `;
  },

  // -------------------------------------------------------------
  // TEMPLATE SUBMENU 3: VISUALISATOR PENGELOMPOKAN BIT
  // -------------------------------------------------------------
  getVisualizerTemplate() {
    return `
      <div class="topic-content animate-fade-in">
        <div class="topic-header">
          <div class="topic-meta">
            <span class="badge badge-accent"><i class="fas fa-layers"></i> Submateri 3</span>
            <span class="badge badge-outline">Visualisator Pengelompokan</span>
          </div>
          <h2 class="topic-title">Visualisator Pengelompokan Bit (3-Bit & 4-Bit)</h2>
          <p class="topic-subtitle">
            Pelajari secara visual mengapa dan bagaimana biner dikelompokkan dari kanan ke kiri, serta pentingnya penambahan *leading zeros* (nol penyeimbang) di sebelah kiri.
          </p>
        </div>

        <!-- Interactive Playground -->
        <div class="card">
          <div class="form-group">
            <label class="form-label" for="vis-bin-input">Ketik Deretan Bit Biner Bebas (atau pilih panjang acak):</label>
            <div class="input-action-wrapper">
              <input
                type="text"
                id="vis-bin-input"
                class="text-input font-mono"
                value="11010110"
                placeholder="Ketik angka 0 dan 1..."
              >
              <button type="button" id="btn-vis-rand-8" class="btn btn-outline">Acak 8-Bit</button>
              <button type="button" id="btn-vis-rand-11" class="btn btn-outline">Acak 11-Bit (Uji Nol Tambahan)</button>
              <button type="button" id="btn-vis-rand-16" class="btn btn-outline">Acak 16-Bit</button>
            </div>
          </div>

          <!-- View Mode Selector -->
          <div class="view-mode-tabs mt-4">
            <button type="button" class="tab-btn active" data-mode="both">
              <i class="fas fa-columns"></i> Tampilkan Keduanya (3-Bit & 4-Bit)
            </button>
            <button type="button" class="tab-btn" data-mode="hex">
              <i class="fas fa-th-large"></i> Fokus 4-Bit (Heksadesimal)
            </button>
            <button type="button" class="tab-btn" data-mode="oct">
              <i class="fas fa-layer-group"></i> Fokus 3-Bit (Oktal)
            </button>
          </div>
        </div>

        <!-- Output Visualizer Area -->
        <div id="vis-display-area" class="mt-4"></div>
      </div>
    `;
  },

  // -------------------------------------------------------------
  // TEMPLATE SUBMENU 4: SAKLAR BIT (PLAYGROUND)
  // -------------------------------------------------------------
  getSwitcherTemplate() {
    return `
      <div class="topic-content animate-fade-in">
        <div class="topic-header">
          <div class="topic-meta">
            <span class="badge badge-accent"><i class="fas fa-sliders"></i> Submateri 4</span>
            <span class="badge badge-outline">Playground Digital</span>
          </div>
          <h2 class="topic-title">Playground Saklar Bit Interaktif</h2>
          <p class="topic-subtitle">
            Klik tombol saklar bit di bawah untuk mengubah status (0 atau 1). Amati perubahan nilai langsung pada keempat sistem bilangan secara *real-time*!
          </p>
        </div>

        <!-- Switchboard Card -->
        <div class="card switchboard-card">
          <div class="switchboard-toolbar">
            <div class="toolbar-info">
              <span class="badge badge-info" id="sw-bits-label">8-Bit Switchboard (Byte)</span>
              <small class="text-muted">Klik saklar untuk toggle logika 1 / 0</small>
            </div>
            <div class="toolbar-actions">
              <button type="button" id="btn-sw-clear" class="btn btn-sm btn-outline"><i class="fas fa-undo"></i> Reset Semua (0)</button>
              <button type="button" id="btn-sw-all" class="btn btn-sm btn-outline"><i class="fas fa-check-double"></i> Set Semua (1)</button>
              <button type="button" id="btn-sw-invert" class="btn btn-sm btn-outline"><i class="fas fa-retweet"></i> Invert (NOT)</button>
              <button type="button" id="btn-sw-random" class="btn btn-sm btn-outline"><i class="fas fa-dice"></i> Nilai Acak</button>
            </div>
          </div>

          <!-- The Physical Switches Grid -->
          <div class="switches-grid" id="switches-container">
            <!-- Rendered by JS -->
          </div>
        </div>

        <!-- Live Telemetry HUD -->
        <div class="grid-4-cols mt-4">
          <div class="hud-card hud-bin">
            <span class="hud-label">BINER SENTRAL</span>
            <div class="hud-value font-mono" id="hud-val-bin">0010 1010</div>
            <small class="hud-sub" id="hud-sub-bin">8 bit terdefinisi</small>
          </div>

          <div class="hud-card hud-hex">
            <span class="hud-label">HEKSADESIMAL (Kelompok 4-Bit)</span>
            <div class="hud-value font-mono" id="hud-val-hex">2A</div>
            <small class="hud-sub" id="hud-sub-hex">[0010] = 2, [1010] = A</small>
          </div>

          <div class="hud-card hud-oct">
            <span class="hud-label">OKTAL (Kelompok 3-Bit)</span>
            <div class="hud-value font-mono" id="hud-val-oct">052</div>
            <small class="hud-sub" id="hud-sub-oct">[000] [101] [010]</small>
          </div>

          <div class="hud-card hud-dec">
            <span class="hud-label">DESIMAL (Bobot Pangkat 2)</span>
            <div class="hud-value font-mono" id="hud-val-dec">42</div>
            <small class="hud-sub" id="hud-sub-dec">32 + 8 + 2 = 42</small>
          </div>
        </div>

        <!-- Interactive Weight Breakdown -->
        <div class="card mt-4" id="switcher-breakdown-card">
          <!-- Rendered live -->
        </div>
      </div>
    `;
  },

  // -------------------------------------------------------------
  // TEMPLATE SUBMENU 5: KUIS & LATIHAN INTERAKTIF
  // -------------------------------------------------------------
  getQuizTemplate() {
    return `
      <div class="topic-content animate-fade-in">
        <div class="topic-header">
          <div class="topic-meta">
            <span class="badge badge-accent"><i class="fas fa-check-circle"></i> Submateri 5</span>
            <span class="badge badge-outline">Uji Kompetensi</span>
          </div>
          <h2 class="topic-title">Latihan & Kuis Konversi Biner Sentral</h2>
          <p class="topic-subtitle">
            Uji pemahaman Anda dengan soal acak. Kuis ini memverifikasi dua langkah utama: <strong>(1) Mengonversi ke Biner Sentral</strong>, lalu <strong>(2) Menemukan Jawaban Akhir</strong>.
          </p>
        </div>

        <!-- Quiz Stats Header -->
        <div class="quiz-stats-bar card">
          <div class="stat-item">
            <span class="stat-label">Skor Anda</span>
            <span class="stat-num text-success" id="quiz-score-val">0</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Soal Diselesaikan</span>
            <span class="stat-num" id="quiz-total-val">0</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Streak Beruntun</span>
            <span class="stat-num text-warning" id="quiz-streak-val">🔥 0</span>
          </div>
          <div class="stat-action">
            <button type="button" id="btn-new-question" class="btn btn-outline btn-sm">
              <i class="fas fa-sync-alt"></i> Buat Soal Baru
            </button>
          </div>
        </div>

        <!-- Quiz Question Box -->
        <div class="card quiz-card mt-4" id="quiz-card-container">
          <!-- Rendered by JS -->
        </div>
      </div>
    `;
  },

  // ==========================================
  // 3. EVENT LISTENERS & WIDGET LOGIC
  // ==========================================
  attachEvents() {
    if (this.activeSubmenu === "w1-universal") {
      this.initUniversalConverter();
    } else if (this.activeSubmenu === "w1-simulator") {
      this.initSimulator();
    } else if (this.activeSubmenu === "w1-visualizer") {
      this.initVisualizer();
    } else if (this.activeSubmenu === "w1-switcher") {
      this.initSwitcher();
    } else if (this.activeSubmenu === "w1-kuis") {
      this.initQuiz();
    }
  },

  // ------------------------------------------
  // LOGIKA KONVERTER MULTI-BASIS UNIVERSAL
  // ------------------------------------------
  initUniversalConverter() {
    let activeMode = this.universalMode || "dec";
    const modeTabs = document.querySelectorAll("#univ-mode-tabs .univ-tab-btn");
    const singlePanel = document.getElementById("univ-single-base-panel");
    const syncPanel = document.getElementById("univ-sync-panel");
    const inputVal = document.getElementById("univ-input-val");
    const inputHeading = document.getElementById("univ-input-heading");
    const activeBadge = document.getElementById("univ-active-badge");
    const validChars = document.getElementById("univ-valid-chars");
    const errorEl = document.getElementById("univ-input-error");
    const runBtn = document.getElementById("btn-run-univ");
    const clearBtn = document.getElementById("btn-clear-univ");
    const resultsArea = document.getElementById("univ-results-area");
    const presetContainer = document.getElementById("univ-preset-container");

    const modeConfig = {
      dec: {
        name: "Desimal",
        radix: "10",
        heading: "Masukkan Bilangan Desimal (Basis 10):",
        chars: "Karakter valid: <code>0-9</code> (0 sampai 4.294.967.295)",
        placeholder: "Contoh: 42, 255, 1024",
        defaultVal: "42",
        presets: ["42", "75", "125", "255", "1024", "4095"],
      },
      bin: {
        name: "Biner",
        radix: "2",
        heading: "Masukkan Deretan Bit Biner (Basis 2):",
        chars:
          "Karakter valid: <code>0</code> dan <code>1</code> (Maks 32-bit)",
        placeholder: "Contoh: 101010, 11111111",
        defaultVal: "101010",
        presets: ["101010", "111101", "11111111", "100000000", "11010110"],
      },
      oct: {
        name: "Oktal",
        radix: "8",
        heading: "Masukkan Bilangan Oktal (Basis 8):",
        chars:
          "Karakter valid: <code>0-7</code> (Digit 8 & 9 tidak diperbolehkan)",
        placeholder: "Contoh: 52, 77, 377",
        defaultVal: "52",
        presets: ["52", "75", "175", "377", "2000", "7777"],
      },
      hex: {
        name: "Heksadesimal",
        radix: "16",
        heading: "Masukkan Bilangan Heksadesimal (Basis 16):",
        chars:
          "Karakter valid: <code>0-9</code> dan <code>A-F</code> (Huruf kapital/kecil)",
        placeholder: "Contoh: 2A, FF, 1A3",
        defaultVal: "2A",
        presets: ["2A", "4B", "7F", "FF", "1A3", "3E8", "FFFF"],
      },
    };

    const renderPresets = (mode) => {
      if (!presetContainer || mode === "sync") return;
      const cfg = modeConfig[mode];
      presetContainer.innerHTML = `
        <span class="preset-label">Contoh Cepat:</span>
        ${cfg.presets
          .map(
            (p) => `
          <button type="button" class="btn-chip univ-preset-btn" data-val="${p}">${p}</button>
        `,
          )
          .join("")}
      `;
      presetContainer.querySelectorAll(".univ-preset-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          inputVal.value = btn.dataset.val;
          executeCalculation();
        });
      });
    };

    const switchMode = (mode) => {
      activeMode = mode;
      this.universalMode = mode;
      modeTabs.forEach((tab) =>
        tab.classList.toggle("active", tab.dataset.mode === mode),
      );

      if (mode === "sync") {
        if (singlePanel) singlePanel.classList.add("hidden");
        if (syncPanel) syncPanel.classList.remove("hidden");
        this.initSyncGrid();
      } else {
        if (syncPanel) syncPanel.classList.add("hidden");
        if (singlePanel) singlePanel.classList.remove("hidden");
        const cfg = modeConfig[mode];
        if (activeBadge)
          activeBadge.textContent = `Basis ${cfg.name} (${cfg.radix})`;
        if (inputHeading) inputHeading.textContent = cfg.heading;
        if (validChars) validChars.innerHTML = cfg.chars;
        if (inputVal) {
          inputVal.placeholder = cfg.placeholder;
          inputVal.value = cfg.defaultVal;
        }
        if (errorEl) errorEl.classList.add("hidden");
        renderPresets(mode);
        executeCalculation();
      }
    };

    modeTabs.forEach((tab) => {
      tab.addEventListener("click", () => switchMode(tab.dataset.mode));
    });

    const executeCalculation = () => {
      if (activeMode === "sync" || !inputVal) return;
      const rawVal = inputVal.value.trim();
      if (errorEl) errorEl.classList.add("hidden");

      if (!rawVal) {
        if (errorEl) {
          errorEl.textContent = "Mohon masukkan nilai terlebih dahulu.";
          errorEl.classList.remove("hidden");
        }
        return;
      }

      const res = UniversalConversionEngine.convertAll(rawVal, activeMode);
      if (!res.success) {
        if (errorEl) {
          errorEl.textContent = res.error;
          errorEl.classList.remove("hidden");
        }
        return;
      }

      if (resultsArea) {
        resultsArea.innerHTML = this.renderUniversalResults(res, activeMode);
        this.setupCopyButtons();
      }
    };

    if (runBtn) runBtn.addEventListener("click", executeCalculation);
    if (clearBtn && inputVal) {
      clearBtn.addEventListener("click", () => {
        inputVal.value = "";
        inputVal.focus();
        if (errorEl) errorEl.classList.add("hidden");
      });
    }
    if (inputVal) {
      inputVal.addEventListener("keypress", (e) => {
        if (e.key === "Enter") executeCalculation();
      });
      inputVal.addEventListener("input", () => {
        if (errorEl) errorEl.classList.add("hidden");
      });
    }

    switchMode(activeMode);
  },

  initSyncGrid() {
    const inputDec = document.getElementById("sync-input-dec");
    const inputBin = document.getElementById("sync-input-bin");
    const inputOct = document.getElementById("sync-input-oct");
    const inputHex = document.getElementById("sync-input-hex");
    const teleBadge = document.getElementById("tele-bits-badge");
    const teleBits = document.getElementById("sync-tele-bits");
    const resetBtn = document.getElementById("btn-sync-reset");
    const randBtn = document.getElementById("btn-sync-rand");

    if (!inputDec || !inputBin || !inputOct || !inputHex) return;

    let isUpdating = false;

    const updateAllFromBigInt = (bigIntVal, sourceInputId) => {
      if (isUpdating) return;
      isUpdating = true;

      try {
        if (bigIntVal === null) {
          if (sourceInputId !== "sync-input-dec") inputDec.value = "";
          if (sourceInputId !== "sync-input-bin") inputBin.value = "";
          if (sourceInputId !== "sync-input-oct") inputOct.value = "";
          if (sourceInputId !== "sync-input-hex") inputHex.value = "";
          if (teleBadge) teleBadge.textContent = "0 Bit • 0 Byte";
          if (teleBits) teleBits.innerHTML = "";
          return;
        }

        const decStr = bigIntVal.toString();
        const binStr = bigIntVal.toString(2);
        const octStr = bigIntVal.toString(8);
        const hexStr = bigIntVal.toString(16).toUpperCase();

        if (sourceInputId !== "sync-input-dec") inputDec.value = decStr;
        if (sourceInputId !== "sync-input-bin") inputBin.value = binStr;
        if (sourceInputId !== "sync-input-oct") inputOct.value = octStr;
        if (sourceInputId !== "sync-input-hex") inputHex.value = hexStr;

        const bitLen = binStr.length;
        const bytes = Math.ceil(bitLen / 8) || 1;
        if (teleBadge) {
          teleBadge.textContent = `${bitLen} Bit • ${bytes} Byte (${bytes * 8}-bit slot)`;
        }

        if (teleBits) {
          const paddedLen = Math.max(8, Math.ceil(bitLen / 8) * 8);
          const paddedBin = binStr.padStart(paddedLen, "0");
          teleBits.innerHTML = paddedBin
            .split("")
            .map(
              (b, idx) => `
            <div class="tele-bit ${b === "1" ? "bit-active" : "bit-inactive"}" title="Bit ${paddedLen - 1 - idx}: ${b}">
              <span class="bit-char">${b}</span>
              <span class="bit-pos">${paddedLen - 1 - idx}</span>
            </div>
          `,
            )
            .join("");
        }
      } finally {
        isUpdating = false;
      }
    };

    inputDec.addEventListener("input", () => {
      const val = inputDec.value.trim();
      if (!val) {
        updateAllFromBigInt(null, "sync-input-dec");
        return;
      }
      if (/^\d+$/.test(val)) {
        try {
          const b = BigInt(val);
          if (b <= 4294967295n) updateAllFromBigInt(b, "sync-input-dec");
        } catch (e) {}
      }
    });

    inputBin.addEventListener("input", () => {
      const val = inputBin.value.trim();
      if (!val) {
        updateAllFromBigInt(null, "sync-input-bin");
        return;
      }
      if (/^[01]+$/.test(val)) {
        try {
          const b = BigInt("0b" + val);
          if (b <= 4294967295n) updateAllFromBigInt(b, "sync-input-bin");
        } catch (e) {}
      }
    });

    inputOct.addEventListener("input", () => {
      const val = inputOct.value.trim();
      if (!val) {
        updateAllFromBigInt(null, "sync-input-oct");
        return;
      }
      if (/^[0-7]+$/.test(val)) {
        try {
          const b = BigInt("0o" + val);
          if (b <= 4294967295n) updateAllFromBigInt(b, "sync-input-oct");
        } catch (e) {}
      }
    });

    inputHex.addEventListener("input", () => {
      const val = inputHex.value.trim();
      if (!val) {
        updateAllFromBigInt(null, "sync-input-hex");
        return;
      }
      if (/^[0-9A-Fa-f]+$/.test(val)) {
        try {
          const b = BigInt("0x" + val);
          if (b <= 4294967295n) updateAllFromBigInt(b, "sync-input-hex");
        } catch (e) {}
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        updateAllFromBigInt(0n, null);
      });
    }

    if (randBtn) {
      randBtn.addEventListener("click", () => {
        const rand = BigInt(Math.floor(Math.random() * 1024) + 1);
        updateAllFromBigInt(rand, null);
      });
    }

    document.querySelectorAll(".sync-preset-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = BigInt(btn.dataset.val);
        updateAllFromBigInt(val, null);
      });
    });

    this.setupCopyButtons();

    const initialDec = inputDec.value.trim();
    if (initialDec && /^\d+$/.test(initialDec)) {
      updateAllFromBigInt(BigInt(initialDec), null);
    }
  },

  setupCopyButtons() {
    document
      .querySelectorAll(".btn-copy-chip, .btn-copy-univ")
      .forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const textToCopy =
            btn.dataset.copyText ||
            (btn.dataset.target
              ? document.getElementById(btn.dataset.target)?.value
              : "");
          if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
              const originalHtml = btn.innerHTML;
              btn.innerHTML = `<i class="fas fa-check text-success"></i> Disalin!`;
              setTimeout(() => {
                btn.innerHTML = originalHtml;
              }, 1800);
            });
          }
        };
      });
  },

  // ------------------------------------------
  // LOGIKA SIMULATOR
  // ------------------------------------------
  initSimulator() {
    let currentBase = "dec";
    const selectorPills = document.querySelectorAll(
      "#sim-base-selector .radio-pill",
    );
    const inputEl = document.getElementById("sim-input-val");
    const inputLabel = document.getElementById("sim-input-label");
    const errorEl = document.getElementById("sim-input-error");
    const runBtn = document.getElementById("btn-run-sim");
    const resultsArea = document.getElementById("sim-results-area");

    const baseLabels = {
      dec: "Masukkan Nilai Desimal (0-9):",
      bin: "Masukkan Deretan Biner (0 atau 1):",
      oct: "Masukkan Nilai Oktal (0-7):",
      hex: "Masukkan Nilai Heksadesimal (0-9, A-F):",
    };

    const basePlaceholders = {
      dec: "Contoh: 42",
      bin: "Contoh: 101010",
      oct: "Contoh: 52",
      hex: "Contoh: 2A",
    };

    const updateBase = (base) => {
      currentBase = base;
      selectorPills.forEach((p) =>
        p.classList.toggle("active", p.dataset.base === base),
      );
      inputLabel.textContent = baseLabels[base];
      inputEl.placeholder = basePlaceholders[base];
      errorEl.classList.add("hidden");
    };

    selectorPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        updateBase(pill.dataset.base);
      });
    });

    // Preset chips
    document.querySelectorAll(".preset-row .btn-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        updateBase(chip.dataset.base);
        inputEl.value = chip.dataset.val;
        executeSimulation();
      });
    });

    const executeSimulation = () => {
      const val = inputEl.value.trim();
      errorEl.classList.add("hidden");

      if (!val) {
        errorEl.textContent = "Mohon isi nilai terlebih dahulu.";
        errorEl.classList.remove("hidden");
        return;
      }

      // 1. Konversi ke Biner Sentral
      const toBinRes = BinaryCentralEngine.toCentralBinary(val, currentBase);
      if (!toBinRes.success) {
        errorEl.textContent = toBinRes.error;
        errorEl.classList.remove("hidden");
        return;
      }

      // 2. Konversi dari Biner Sentral ke 3 sistem lainnya
      const fromBinRes = BinaryCentralEngine.fromCentralBinary(
        toBinRes.centralBinary,
      );

      // Render Hasil Lengkap
      resultsArea.innerHTML = this.renderSimulatorResults(toBinRes, fromBinRes);
      resultsArea.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    runBtn.addEventListener("click", executeSimulation);
    inputEl.addEventListener("keypress", (e) => {
      if (e.key === "Enter") executeSimulation();
    });

    // Run default simulation
    executeSimulation();
  },

  renderSimulatorResults(toBin, fromBin) {
    let step1Html = "";

    if (toBin.fromBase === "bin") {
      step1Html = `
        <div class="step-box">
          <p class="step-note"><i class="fas fa-check-circle text-success"></i> Nilai input sudah berada dalam format Biner murni: <code>${toBin.centralBinary}</code></p>
        </div>
      `;
    } else if (toBin.fromBase === "dec") {
      const rows = toBin.steps[0].rows;
      step1Html = `
        <div class="step-box">
          <p class="step-note"><strong>Metode Pembagian Bertingkat 2:</strong> Bagi secara berulang dengan 2 sampai hasil bagi = 0. Baca sisa bagi dari bawah (MSB) ke atas (LSB).</p>
          <div class="division-table-wrapper">
            <table class="division-table">
              <thead>
                <tr>
                  <th>Operasi Pembagian</th>
                  <th>Hasil Bagi</th>
                  <th>Sisa Pembagian</th>
                  <th>Urutan Bit</th>
                </tr>
              </thead>
              <tbody>
                ${rows
                  .map(
                    (r, i) => `
                  <tr>
                    <td><code>${r.current} ÷ 2</code></td>
                    <td><strong>${r.quotient}</strong></td>
                    <td><span class="badge ${r.remainder === "1" ? "badge-accent" : "badge-dim"}">${r.remainder}</span></td>
                    <td><small class="text-muted">${i === rows.length - 1 ? "↑ MSB (Bit Paling Kiri)" : i === 0 ? "LSB (Bit Paling Kanan)" : "↑"}</small></td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          <div class="result-highlight-pill mt-2">
            Hasil Biner Sentral: <strong class="font-mono text-cyan">${toBin.centralBinary}</strong>₂
          </div>
        </div>
      `;
    } else if (toBin.fromBase === "oct") {
      const mapping = toBin.steps[0].mapping;
      step1Html = `
        <div class="step-box">
          <p class="step-note"><strong>Ekspansi Langsung 3-Bit:</strong> Setiap 1 digit oktal diubah menjadi tepat 3 digit biner (bobot 4-2-1):</p>
          <div class="expansion-grid">
            ${mapping
              .map(
                (m) => `
              <div class="expansion-card exp-oct">
                <div class="exp-src">${m.digit}₈</div>
                <div class="exp-arrow"><i class="fas fa-arrow-down"></i></div>
                <div class="exp-target">${m.bin}₂</div>
                <small class="exp-desc">(Nilai: ${m.val})</small>
              </div>
            `,
              )
              .join("")}
          </div>
          <div class="result-highlight-pill mt-3">
            Gabungkan semua bit: <strong class="font-mono text-cyan">${toBin.centralBinary}</strong>₂
          </div>
        </div>
      `;
    } else if (toBin.fromBase === "hex") {
      const mapping = toBin.steps[0].mapping;
      step1Html = `
        <div class="step-box">
          <p class="step-note"><strong>Ekspansi Langsung 4-Bit:</strong> Setiap 1 digit heksadesimal diubah menjadi tepat 4 digit biner (bobot 8-4-2-1):</p>
          <div class="expansion-grid">
            ${mapping
              .map(
                (m) => `
              <div class="expansion-card exp-hex">
                <div class="exp-src">${m.digit}₁₆</div>
                <div class="exp-arrow"><i class="fas fa-arrow-down"></i></div>
                <div class="exp-target">${m.bin}₂</div>
                <small class="exp-desc">(${m.digit} = ${m.dec}₁₀)</small>
              </div>
            `,
              )
              .join("")}
          </div>
          <div class="result-highlight-pill mt-3">
            Gabungkan semua bit: <strong class="font-mono text-cyan">${toBin.centralBinary}</strong>₂
          </div>
        </div>
      `;
    }

    return `
      <!-- TAHAP 1: Menuju Biner Sentral -->
      <div class="card stage-card mb-4 animate-slide-up">
        <div class="stage-header">
          <div class="stage-badge"><i class="fas fa-arrow-right"></i> TAHAP 1</div>
          <h3 class="stage-title">Konversi Nilai Input ke BINER SENTRAL</h3>
        </div>
        ${step1Html}
      </div>

      <!-- TAHAP SENTRAL: HUB BINER -->
      <div class="card hub-centerpiece mb-4 animate-scale-up">
        <div class="hub-header">
          <span class="hub-badge"><i class="fas fa-atom"></i> PUSAT HUB BINER SENTRAL</span>
          <h4>Nilai Biner Ekuivalen:</h4>
        </div>
        <div class="hub-binary-display">
          ${toBin.centralBinary
            .split("")
            .map(
              (b, idx) => `
            <div class="bit-cell ${b === "1" ? "bit-on" : "bit-off"}">
              <span class="bit-val">${b}</span>
              <span class="bit-idx">2<sup>${toBin.centralBinary.length - 1 - idx}</sup></span>
            </div>
          `,
            )
            .join("")}
        </div>
        <div class="hub-footer">
          <span>Panjang Bit: <strong>${toBin.centralBinary.length} bit</strong></span>
          <button type="button" class="btn btn-sm btn-outline" onclick="navigator.clipboard.writeText('${toBin.centralBinary}')">
            <i class="fas fa-copy"></i> Salin Biner
          </button>
        </div>
      </div>

      <!-- TAHAP 2: Distribusi ke 3 Sistem Lainnya -->
      <div class="stage-header mt-4">
        <div class="stage-badge stage-badge-dist"><i class="fas fa-network-wired"></i> TAHAP 2</div>
        <h3 class="stage-title">Distribusi dari Biner Sentral ke 3 Sistem Bilangan Lain</h3>
      </div>

      <div class="grid-3-cards mt-3">
        <!-- 1. Ke Heksadesimal (4 Bit) -->
        <div class="card conv-result-card card-hex animate-slide-up" style="animation-delay: 0.1s">
          <div class="conv-card-header">
            <span class="badge badge-hex"><i class="fas fa-th-large"></i> Kelompokkan 4-Bit</span>
            <h4>Ke Heksadesimal (Basis 16)</h4>
          </div>
          <p class="conv-desc">
            Biner dibagi per 4 bit dari kanan.
            ${fromBin.toHex.padAdded > 0 ? `<br><span class="text-warning"><i class="fas fa-info-circle"></i> Ditambah ${fromBin.toHex.padAdded} nol di kiri agar pas 4-bit.</span>` : ""}
          </p>

          <div class="grouping-boxes">
            ${fromBin.toHex.groups
              .map(
                (g) => `
              <div class="group-box group-hex">
                <div class="group-binary font-mono">${g.chunk}</div>
                <div class="group-weights">8 4 2 1</div>
                <div class="group-calc"><small>${g.calculation}</small></div>
                <div class="group-result-digit font-mono">${g.hexChar}</div>
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="final-result-box mt-3">
            <span class="final-label">Hasil Heksadesimal:</span>
            <span class="final-value text-magenta">${fromBin.toHex.result}₁₆</span>
          </div>
        </div>

        <!-- 2. Ke Oktal (3 Bit) -->
        <div class="card conv-result-card card-oct animate-slide-up" style="animation-delay: 0.2s">
          <div class="conv-card-header">
            <span class="badge badge-oct"><i class="fas fa-layer-group"></i> Kelompokkan 3-Bit</span>
            <h4>Ke Oktal (Basis 8)</h4>
          </div>
          <p class="conv-desc">
            Biner dibagi per 3 bit dari kanan.
            ${fromBin.toOct.padAdded > 0 ? `<br><span class="text-warning"><i class="fas fa-info-circle"></i> Ditambah ${fromBin.toOct.padAdded} nol di kiri agar pas 3-bit.</span>` : ""}
          </p>

          <div class="grouping-boxes">
            ${fromBin.toOct.groups
              .map(
                (g) => `
              <div class="group-box group-oct">
                <div class="group-binary font-mono">${g.chunk}</div>
                <div class="group-weights">4 2 1</div>
                <div class="group-calc"><small>${g.calculation}</small></div>
                <div class="group-result-digit font-mono">${g.octChar}</div>
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="final-result-box mt-3">
            <span class="final-label">Hasil Oktal:</span>
            <span class="final-value text-amber">${fromBin.toOct.result}₈</span>
          </div>
        </div>

        <!-- 3. Ke Desimal (Bobot Pangkat 2) -->
        <div class="card conv-result-card card-dec animate-slide-up" style="animation-delay: 0.3s">
          <div class="conv-card-header">
            <span class="badge badge-dec"><i class="fas fa-plus-circle"></i> Pembobotan Posisi</span>
            <h4>Ke Desimal (Basis 10)</h4>
          </div>
          <p class="conv-desc">Jumlahkan nilai 2<sup>n</sup> dari setiap bit biner yang bernilai 1.</p>

          <div class="weight-breakdown-list">
            ${fromBin.toDec.terms
              .slice(0, 8)
              .map(
                (t) => `
              <div class="weight-row ${t.isActive ? "active-weight" : "inactive-weight"}">
                <span class="w-bit">${t.bit}</span>
                <span class="w-op">×</span>
                <span class="w-pow">2<sup>${t.power}</sup> (${t.weight})</span>
                <span class="w-eq">=</span>
                <span class="w-val">${t.termVal}</span>
              </div>
            `,
              )
              .join("")}
            ${fromBin.toDec.terms.length > 8 ? `<div class="text-muted text-center"><small>+ ${fromBin.toDec.terms.length - 8} suku lainnya...</small></div>` : ""}
          </div>

          <div class="final-result-box mt-3">
            <span class="final-label">Penjumlahan Suku:</span>
            <small class="sum-text font-mono">${fromBin.toDec.sumFormula}</small>
            <div class="final-value text-cyan mt-1">${fromBin.toDec.result}₁₀</div>
          </div>
        </div>
      </div>
    `;
  },

  // ------------------------------------------
  // LOGIKA VISUALISATOR PENGELOMPOKAN
  // ------------------------------------------
  initVisualizer() {
    const inputEl = document.getElementById("vis-bin-input");
    const displayArea = document.getElementById("vis-display-area");
    let currentMode = "both";

    const updateDisplay = () => {
      let binStr = inputEl.value.replace(/[^01]/g, "");
      if (!binStr) binStr = "0";

      const conv = BinaryCentralEngine.fromCentralBinary(binStr);

      let html = "";

      if (currentMode === "both" || currentMode === "hex") {
        html += `
          <div class="card visualizer-panel mb-4 animate-slide-up">
            <div class="card-header-flex">
              <div>
                <span class="badge badge-hex"><i class="fas fa-th-large"></i> Aturan 4-Bit Heksadesimal (2<sup>4</sup> = 16)</span>
                <h3 class="card-title mt-1">Pengelompokan 4-Bit (Nibble) & Pembobotan 8-4-2-1</h3>
              </div>
              <span class="badge badge-outline">Hasil: <strong>${conv.toHex.result}₁₆</strong></span>
            </div>

            <p class="text-muted mt-2">
              Biner asli memiliki panjang <strong>${binStr.length} bit</strong>.
              ${conv.toHex.padAdded > 0 ? `Karena ${binStr.length} bukan kelipatan 4, ditambahkan <strong>${conv.toHex.padAdded} bit 0 (warna abu-abu garis putus-putus)</strong> di sebelah kiri (MSB).` : `Panjang bit pas kelipatan 4, tidak perlu nol penyeimbang.`}
            </p>

            <div class="visual-nibbles-container mt-3">
              ${conv.toHex.groups
                .map(
                  (g, grpIdx) => `
                <div class="visual-group-card v-hex">
                  <div class="v-group-label">Kelompok ${conv.toHex.groups.length - grpIdx}</div>
                  <div class="v-bits-row">
                    ${g.chunk
                      .split("")
                      .map((b, bIdx) => {
                        const isPadding =
                          grpIdx === 0 && bIdx < conv.toHex.padAdded;
                        return `
                        <div class="v-bit-item ${isPadding ? "v-padding-bit" : b === "1" ? "v-bit-1" : "v-bit-0"}">
                          <span class="v-bit-num">${b}</span>
                          <span class="v-bit-weight">${[8, 4, 2, 1][bIdx]}</span>
                          ${isPadding ? '<span class="v-pad-tag">pad</span>' : ""}
                        </div>
                      `;
                      })
                      .join("")}
                  </div>
                  <div class="v-bracket"><i class="fas fa-chevron-down"></i></div>
                  <div class="v-digit-output font-mono">${g.hexChar}</div>
                  <small class="text-muted">${g.calculation}</small>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        `;
      }

      if (currentMode === "both" || currentMode === "oct") {
        html += `
          <div class="card visualizer-panel animate-slide-up">
            <div class="card-header-flex">
              <div>
                <span class="badge badge-oct"><i class="fas fa-layer-group"></i> Aturan 3-Bit Oktal (2<sup>3</sup> = 8)</span>
                <h3 class="card-title mt-1">Pengelompokan 3-Bit (Triplet) & Pembobotan 4-2-1</h3>
              </div>
              <span class="badge badge-outline">Hasil: <strong>${conv.toOct.result}₈</strong></span>
            </div>

            <p class="text-muted mt-2">
              Biner asli memiliki panjang <strong>${binStr.length} bit</strong>.
              ${conv.toOct.padAdded > 0 ? `Karena ${binStr.length} bukan kelipatan 3, ditambahkan <strong>${conv.toOct.padAdded} bit 0 (warna abu-abu garis putus-putus)</strong> di sebelah kiri (MSB).` : `Panjang bit pas kelipatan 3, tidak perlu nol penyeimbang.`}
            </p>

            <div class="visual-nibbles-container mt-3">
              ${conv.toOct.groups
                .map(
                  (g, grpIdx) => `
                <div class="visual-group-card v-oct">
                  <div class="v-group-label">Kelompok ${conv.toOct.groups.length - grpIdx}</div>
                  <div class="v-bits-row">
                    ${g.chunk
                      .split("")
                      .map((b, bIdx) => {
                        const isPadding =
                          grpIdx === 0 && bIdx < conv.toOct.padAdded;
                        return `
                        <div class="v-bit-item ${isPadding ? "v-padding-bit" : b === "1" ? "v-bit-1" : "v-bit-0"}">
                          <span class="v-bit-num">${b}</span>
                          <span class="v-bit-weight">${[4, 2, 1][bIdx]}</span>
                          ${isPadding ? '<span class="v-pad-tag">pad</span>' : ""}
                        </div>
                      `;
                      })
                      .join("")}
                  </div>
                  <div class="v-bracket"><i class="fas fa-chevron-down"></i></div>
                  <div class="v-digit-output font-mono">${g.octChar}</div>
                  <small class="text-muted">${g.calculation}</small>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        `;
      }

      displayArea.innerHTML = html;
    };

    // Mode tabs
    document.querySelectorAll(".view-mode-tabs .tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".view-mode-tabs .tab-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentMode = btn.dataset.mode;
        updateDisplay();
      });
    });

    // Random preset generators
    const generateRandomBin = (len) => {
      let s = "1";
      for (let i = 1; i < len; i++) s += Math.random() > 0.5 ? "1" : "0";
      return s;
    };

    document.getElementById("btn-vis-rand-8").addEventListener("click", () => {
      inputEl.value = generateRandomBin(8);
      updateDisplay();
    });
    document.getElementById("btn-vis-rand-11").addEventListener("click", () => {
      inputEl.value = generateRandomBin(11);
      updateDisplay();
    });
    document.getElementById("btn-vis-rand-16").addEventListener("click", () => {
      inputEl.value = generateRandomBin(16);
      updateDisplay();
    });

    inputEl.addEventListener("input", updateDisplay);
    updateDisplay();
  },

  // ------------------------------------------
  // LOGIKA SAKLAR BIT (PLAYGROUND)
  // ------------------------------------------
  initSwitcher() {
    const switchesContainer = document.getElementById("switches-container");
    const hudBin = document.getElementById("hud-val-bin");
    const hudHex = document.getElementById("hud-val-hex");
    const hudOct = document.getElementById("hud-val-oct");
    const hudDec = document.getElementById("hud-val-dec");
    const hudSubBin = document.getElementById("hud-sub-bin");
    const hudSubHex = document.getElementById("hud-sub-hex");
    const hudSubOct = document.getElementById("hud-sub-oct");
    const hudSubDec = document.getElementById("hud-sub-dec");
    const breakdownCard = document.getElementById("switcher-breakdown-card");

    const updateSwitcherUI = () => {
      // 1. Render switches
      switchesContainer.innerHTML = this.currentSwitchBits
        .map((bit, idx) => {
          const power = this.currentSwitchBits.length - 1 - idx;
          const weight = 2 ** power;
          const isOn = bit === 1;

          return `
          <div class="digital-switch ${isOn ? "switch-on" : "switch-off"}" data-index="${idx}">
            <div class="switch-led"></div>
            <div class="switch-weight">2<sup>${power}</sup></div>
            <div class="switch-weight-dec">${weight}</div>
            <button type="button" class="switch-toggle-btn">
              <span class="switch-state-val">${bit}</span>
            </button>
            <span class="switch-bit-name">Bit ${power}</span>
          </div>
        `;
        })
        .join("");

      // 2. Hitung nilai
      const binStr = this.currentSwitchBits.join("");
      const conv = BinaryCentralEngine.fromCentralBinary(binStr);

      // 3. Update HUD
      hudBin.textContent = `${binStr.slice(0, 4)} ${binStr.slice(4)}`;
      hudSubBin.textContent = `${this.currentSwitchBits.filter((b) => b === 1).length} bit ON (Logika 1)`;

      hudHex.textContent = conv.toHex.result;
      hudSubHex.textContent = conv.toHex.groups
        .map((g) => `[${g.chunk}]=${g.hexChar}`)
        .join(" ");

      hudOct.textContent = conv.toOct.result;
      hudSubOct.textContent = conv.toOct.groups
        .map((g) => `[${g.chunk}]=${g.octChar}`)
        .join(" ");

      hudDec.textContent = conv.toDec.result;
      hudSubDec.textContent = `${conv.toDec.sumFormula} = ${conv.toDec.result}`;

      // 4. Update Breakdown Card
      breakdownCard.innerHTML = `
        <h4 class="card-title"><i class="fas fa-chart-pie"></i> Rincian Pembobotan Posisi Aktif</h4>
        <div class="active-bits-strip mt-3">
          ${this.currentSwitchBits
            .map((b, idx) => {
              const pow = this.currentSwitchBits.length - 1 - idx;
              const w = 2 ** pow;
              return `
              <div class="strip-item ${b === 1 ? "strip-active" : "strip-inactive"}">
                <span class="strip-val">${b}</span>
                <small class="strip-w">${b === 1 ? `+${w}` : "0"}</small>
              </div>
            `;
            })
            .join("")}
        </div>
        <div class="equation-box mt-3 font-mono">
          Desimal = (${this.currentSwitchBits
            .map((b, idx) => {
              const pow = this.currentSwitchBits.length - 1 - idx;
              return b === 1 ? `1×2<sup>${pow}</sup>` : `0`;
            })
            .join(
              " + ",
            )}) = <span class="text-cyan font-bold">${conv.toDec.result}₁₀</span>
        </div>
      `;

      // Event listener per switch
      document.querySelectorAll(".digital-switch").forEach((sw) => {
        sw.addEventListener("click", () => {
          const i = parseInt(sw.dataset.index);
          this.currentSwitchBits[i] = this.currentSwitchBits[i] === 1 ? 0 : 1;
          updateSwitcherUI();
        });
      });
    };

    // Actions
    document.getElementById("btn-sw-clear").addEventListener("click", () => {
      this.currentSwitchBits = [0, 0, 0, 0, 0, 0, 0, 0];
      updateSwitcherUI();
    });

    document.getElementById("btn-sw-all").addEventListener("click", () => {
      this.currentSwitchBits = [1, 1, 1, 1, 1, 1, 1, 1];
      updateSwitcherUI();
    });

    document.getElementById("btn-sw-invert").addEventListener("click", () => {
      this.currentSwitchBits = this.currentSwitchBits.map((b) =>
        b === 1 ? 0 : 1,
      );
      updateSwitcherUI();
    });

    document.getElementById("btn-sw-random").addEventListener("click", () => {
      this.currentSwitchBits = Array.from({ length: 8 }, () =>
        Math.random() > 0.5 ? 1 : 0,
      );
      updateSwitcherUI();
    });

    updateSwitcherUI();
  },

  // ------------------------------------------
  // LOGIKA KUIS & LATIHAN INTERAKTIF
  // ------------------------------------------
  initQuiz() {
    this.generateNewQuizQuestion();
  },

  generateNewQuizQuestion() {
    const types = [
      "dec-to-hex",
      "oct-to-hex",
      "hex-to-oct",
      "dec-to-oct",
      "bin-to-hex",
    ];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    const val = Math.floor(Math.random() * 200) + 10; // Nilai 10 - 210

    let question = {};
    const binStr = val.toString(2);
    const conv = BinaryCentralEngine.fromCentralBinary(binStr);

    switch (chosenType) {
      case "dec-to-hex":
        question = {
          fromBase: "dec",
          fromName: "Desimal",
          toBase: "hex",
          toName: "Heksadesimal",
          valStr: val.toString(10),
          correctBin: binStr,
          correctAnswer: conv.toHex.result,
          hintStep1: `Bagi ${val} dengan 2 bertingkat atau gunakan pembobotan pangkat 2.`,
          hintStep2:
            "Kelompokkan biner menjadi 4-bit dari kanan (8-4-2-1) dan ubah ke simbol 0-9 atau A-F.",
        };
        break;
      case "oct-to-hex":
        question = {
          fromBase: "oct",
          fromName: "Oktal",
          toBase: "hex",
          toName: "Heksadesimal",
          valStr: val.toString(8),
          correctBin: binStr,
          correctAnswer: conv.toHex.result,
          hintStep1:
            "Ubah setiap digit oktal menjadi tepat 3 bit biner (4-2-1).",
          hintStep2:
            "Kelompokkan ulang biner tadi menjadi 4 bit dari kanan untuk ke heksadesimal.",
        };
        break;
      case "hex-to-oct":
        question = {
          fromBase: "hex",
          fromName: "Heksadesimal",
          toBase: "oct",
          toName: "Oktal",
          valStr: conv.toHex.result,
          correctBin: binStr,
          correctAnswer: conv.toOct.result,
          hintStep1:
            "Ubah setiap digit heksadesimal menjadi tepat 4 bit biner (8-4-2-1).",
          hintStep2:
            "Kelompokkan ulang biner tadi menjadi 3 bit dari kanan untuk ke oktal.",
        };
        break;
      case "dec-to-oct":
        question = {
          fromBase: "dec",
          fromName: "Desimal",
          toBase: "oct",
          toName: "Oktal",
          valStr: val.toString(10),
          correctBin: binStr,
          correctAnswer: conv.toOct.result,
          hintStep1: `Ubah desimal ${val} ke biner terlebih dahulu.`,
          hintStep2:
            "Kelompokkan biner menjadi 3 bit dari kanan untuk membaca angka oktal.",
        };
        break;
      default:
        question = {
          fromBase: "bin",
          fromName: "Biner",
          toBase: "hex",
          toName: "Heksadesimal",
          valStr: binStr,
          correctBin: binStr,
          correctAnswer: conv.toHex.result,
          hintStep1: "Nilai sudah biner. Salin deretan biner.",
          hintStep2: "Kelompokkan per 4-bit dari kanan.",
        };
    }

    this.quizState.question = question;
    this.quizState.step1Done = false;
    this.renderQuizCard();
  },

  renderQuizCard() {
    const q = this.quizState.question;
    const cardEl = document.getElementById("quiz-card-container");
    if (!cardEl) return;

    cardEl.innerHTML = `
      <div class="quiz-question-header">
        <div class="q-type-badge">Konversi ${q.fromName} &rarr; ${q.toName}</div>
        <div class="q-source-val">
          Konversikan bilangan berikut: <br>
          <span class="q-highlight font-mono">${q.valStr}</span>
          <small class="q-base-sub">(${q.fromName.toLowerCase()})</small>
        </div>
      </div>

      <div class="quiz-steps-container mt-4">
        <!-- LANGKAH 1: BINER SENTRAL -->
        <div class="q-step-box" id="q-step1-box">
          <div class="q-step-title">
            <span class="q-step-num">1</span>
            <strong>Langkah 1: Konversikan dahulu ke BINER SENTRAL</strong>
          </div>
          <p class="text-muted"><small>${q.hintStep1}</small></p>
          <div class="q-input-row mt-2">
            <input
              type="text"
              id="q-ans-bin"
              class="text-input font-mono"
              placeholder="Ketik biner perantara (contoh: 101011)..."
              autocomplete="off"
            >
            <button type="button" id="btn-check-step1" class="btn btn-primary btn-sm">
              <i class="fas fa-check"></i> Periksa Biner
            </button>
          </div>
          <div id="q-feedback-step1" class="quiz-feedback hidden"></div>
        </div>

        <!-- LANGKAH 2: JAWABAN AKHIR -->
        <div class="q-step-box q-step-disabled" id="q-step2-box">
          <div class="q-step-title">
            <span class="q-step-num">2</span>
            <strong>Langkah 2: Temukan Jawaban Akhir dalam ${q.toName}</strong>
          </div>
          <p class="text-muted"><small>${q.hintStep2}</small></p>
          <div class="q-input-row mt-2">
            <input
              type="text"
              id="q-ans-final"
              class="text-input font-mono"
              placeholder="Ketik hasil akhir dalam ${q.toName.toLowerCase()}..."
              disabled
              autocomplete="off"
            >
            <button type="button" id="btn-check-step2" class="btn btn-primary btn-sm" disabled>
              <i class="fas fa-paper-plane"></i> Submit Jawaban
            </button>
          </div>
          <div id="q-feedback-step2" class="quiz-feedback hidden"></div>
        </div>
      </div>

      <!-- Pembahasan Lengkap Accordion -->
      <div id="quiz-explanation-box" class="quiz-explanation hidden mt-4">
        <!-- Rendered after answer -->
      </div>
    `;

    // Pasang handler kuis
    const btnStep1 = document.getElementById("btn-check-step1");
    const inputStep1 = document.getElementById("q-ans-bin");
    const fbStep1 = document.getElementById("q-feedback-step1");

    const step2Box = document.getElementById("q-step2-box");
    const btnStep2 = document.getElementById("btn-check-step2");
    const inputStep2 = document.getElementById("q-ans-final");
    const fbStep2 = document.getElementById("q-feedback-step2");

    btnStep1.addEventListener("click", () => {
      const userBin = inputStep1.value.trim().replace(/^0+(?=\d)/, "");
      const targetBin = q.correctBin.replace(/^0+(?=\d)/, "");

      if (!userBin) {
        fbStep1.className = "quiz-feedback fb-error";
        fbStep1.innerHTML = "Harap masukkan nilai biner terlebih dahulu.";
        return;
      }

      if (userBin === targetBin) {
        fbStep1.className = "quiz-feedback fb-success";
        fbStep1.innerHTML = `<i class="fas fa-check-circle"></i> <strong>Bagus sekali!</strong> Biner sentral Anda tepat: <code>${userBin}₂</code>. Sekarang lanjutkan ke Langkah 2.`;
        inputStep1.disabled = true;
        btnStep1.disabled = true;

        // Buka langkah 2
        step2Box.classList.remove("q-step-disabled");
        inputStep2.disabled = false;
        btnStep2.disabled = false;
        inputStep2.focus();
      } else {
        fbStep1.className = "quiz-feedback fb-error";
        fbStep1.innerHTML = `<i class="fas fa-times-circle"></i> Biner belum tepat. Petunjuk: ${q.hintStep1}`;
      }
    });

    btnStep2.addEventListener("click", () => {
      const userAns = inputStep2.value
        .trim()
        .toUpperCase()
        .replace(/^0+(?=\w)/, "");
      const targetAns = q.correctAnswer.toUpperCase().replace(/^0+(?=\w)/, "");

      this.quizState.totalAttempted++;

      if (userAns === targetAns) {
        this.quizState.score += 10;
        this.quizState.streak++;
        fbStep2.className = "quiz-feedback fb-success";
        fbStep2.innerHTML = `🎉 <strong>Luar Biasa! Jawaban Anda Benar!</strong> (${userAns})`;
        inputStep2.disabled = true;
        btnStep2.disabled = true;
      } else {
        this.quizState.streak = 0;
        fbStep2.className = "quiz-feedback fb-error";
        fbStep2.innerHTML = `<i class="fas fa-times-circle"></i> Jawaban belum tepat. Jawaban yang benar adalah <strong>${targetAns}</strong>.`;
      }

      this.updateQuizStats();
      this.showQuizExplanation();
    });

    document
      .getElementById("btn-new-question")
      .addEventListener("click", () => {
        this.generateNewQuizQuestion();
      });
  },

  updateQuizStats() {
    document.getElementById("quiz-score-val").textContent =
      this.quizState.score;
    document.getElementById("quiz-total-val").textContent =
      this.quizState.totalAttempted;
    document.getElementById("quiz-streak-val").textContent =
      `🔥 ${this.quizState.streak}`;
  },

  showQuizExplanation() {
    const q = this.quizState.question;
    const expBox = document.getElementById("quiz-explanation-box");
    if (!expBox) return;

    const toBin = BinaryCentralEngine.toCentralBinary(q.valStr, q.fromBase);
    const fromBin = BinaryCentralEngine.fromCentralBinary(q.correctBin);

    expBox.classList.remove("hidden");
    expBox.innerHTML = `
      <div class="card callout-success">
        <h4><i class="fas fa-lightbulb"></i> Pembahasan Lengkap Metode Biner Sentral:</h4>
        <ol class="styled-list mt-2">
          <li>
            <strong>Input Awal:</strong> ${q.valStr} (${q.fromName})
          </li>
          <li>
            <strong>Menuju Biner Sentral:</strong> Diperoleh <code>${q.correctBin}₂</code>.
          </li>
          <li>
            <strong>Distribusi ke ${q.toName}:</strong>
            ${q.toBase === "hex" ? `Biner dikelompokkan 4-bit: <code>${fromBin.toHex.groups.map((g) => `[${g.chunk}]`).join(" ")}</code> &rArr; <strong>${fromBin.toHex.result}₁₆</strong>` : ""}
            ${q.toBase === "oct" ? `Biner dikelompokkan 3-bit: <code>${fromBin.toOct.groups.map((g) => `[${g.chunk}]`).join(" ")}</code> &rArr; <strong>${fromBin.toOct.result}₈</strong>` : ""}
            ${q.toBase === "dec" ? `Penjumlahan bobot aktif: ${fromBin.toDec.sumFormula} &rArr; <strong>${fromBin.toDec.result}₁₀</strong>` : ""}
          </li>
        </ol>
      </div>
    `;
  },
};
