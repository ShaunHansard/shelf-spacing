// Shelf Spacing Calculator (Middle shelves only)
(function(){
  const heightEl = document.getElementById('height');
  const thicknessEl = document.getElementById('thickness');
  const countEl = document.getElementById('count');
  const unitsEl = document.getElementById('units');
  const precisionEl = document.getElementById('precision');
  const calcBtn = document.getElementById('calcBtn');
  const resetBtn = document.getElementById('resetBtn');
  const copyBtn = document.getElementById('copyBtn');
  const pngBtn = document.getElementById('pngBtn');
  const resultsEl = document.getElementById('results');
  const unitLabels = document.querySelectorAll('.unit-label');

  function round(val, digits) {
    const p = Math.pow(10, digits);
    return Math.round((val + Number.EPSILON) * p) / p;
  }

  function toMM(val, units) {
    if (units === 'in') return val * 25.4;
    return val;
  }
  function fromMM(val, units) {
    if (units === 'in') return val / 25.4;
    return val;
  }

  function setUnitLabels(units) {
    unitLabels.forEach(el => { el.textContent = units; });
  }

  function calc() {
    const units = unitsEl.value;
    const d = parseInt(precisionEl.value, 10);
    const H_in = parseFloat(heightEl.value);
    const t_in = parseFloat(thicknessEl.value);
    const n = parseInt(countEl.value, 10);

    if (!isFinite(H_in) || !isFinite(t_in) || !isFinite(n) || n < 1) {
      resultsEl.innerHTML = '<p class="muted">Please enter a valid height, thickness, and shelf count.</p>';
      copyBtn.disabled = true;
      pngBtn.disabled = true;
      return;
    }

    // Convert to mm for math
    const H = toMM(H_in, units);
    const t = toMM(t_in, units);

    // g = (H - n*t) / (n+1)
    const g = (H - (n * t)) / (n + 1);
    if (!isFinite(g) || g <= 0) {
      resultsEl.innerHTML = '<p class="muted">These inputs do not produce a positive gap. Check your numbers.</p>';
      copyBtn.disabled = true;
      pngBtn.disabled = true;
      return;
    }

    const bottoms = [];
    const centres = [];
    for (let i = 1; i <= n; i++) {
      const bottom = g * i + t * (i - 1);
      const centre = g * i + t * (i - 0.5);
      bottoms.push(bottom);
      centres.push(centre);
    }

    // Convert back to chosen units and round
    const g_u = round(fromMM(g, units), d);
    const bottoms_u = bottoms.map(v => round(fromMM(v, units), d));
    const centres_u = centres.map(v => round(fromMM(v, units), d));

    // Render results
    const unit = units;
    let html = '';
    html += `<p><strong>Equal gap (top, bottom, between shelves):</strong> ${g_u} ${unit}</p>`;
    html += '<table><thead><tr><th>Shelf</th><th>Bottom from base</th><th>Centre line</th></tr></thead><tbody>';
    bottoms_u.forEach((b, idx) => {
      html += `<tr><td>${idx+1}</td><td>${b} ${unit}</td><td>${centres_u[idx]} ${unit}</td></tr>`;
    });
    html += '</tbody></table>';
    resultsEl.innerHTML = html;

    // Enable buttons and attach handlers
    copyBtn.disabled = false;
    pngBtn.disabled = false;

    copyBtn.onclick = async () => {
      const summary = `Shelf Spacing (middle shelves only)
H=${round(H_in, d)} ${unit}, t=${round(t_in, d)} ${unit}, n=${n}
Gap g = ${g_u} ${unit}
` + bottoms_u.map((b, i) => `Shelf ${i+1}: bottom ${b} ${unit}, centre ${centres_u[i]} ${unit}`).join('\n');
      try {
        await navigator.clipboard.writeText(summary);
        copyBtn.textContent = 'Copied ✓';
        setTimeout(()=>copyBtn.textContent='Copy Summary', 1200);
      } catch(e) {
        alert('Copied text is shown below:\n\n' + summary);
      }
    };

    pngBtn.onclick = () => {
      // Create a simple drilling template as a canvas and download as PNG
      const canvas = document.createElement('canvas');
      const scale = 3; // for better resolution
      const width = 260 * scale;
      const height = 1400 * scale;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#000000';
      ctx.font = `${14*scale}px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial`;
      ctx.fillText('Shelf Drilling Template', 16*scale, 28*scale);

      // Draw baseline
      const marginTop = 56*scale;
      const marginLeft = 40*scale;
      const lineHeight = height - marginTop - 40*scale;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(marginLeft, marginTop);
      ctx.lineTo(marginLeft, marginTop + lineHeight);
      ctx.stroke();

      // Scale positions to the canvas height
      const H_vis = toMM(parseFloat(heightEl.value), units); // mm
      function yFor(mm) {
        return marginTop + lineHeight * (1 - (mm / H_vis));
      }

      ctx.font = `${12*scale}px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial`;
      ctx.fillText(`Internal height: ${round(H_in, d)} ${unit}`, 16*scale, 48*scale);
      ctx.fillText(`Gap: ${g_u} ${unit}`, 16*scale, 68*scale);

      // Plot centres
      centres.forEach((mm, i) => {
        const y = yFor(mm);
        ctx.beginPath();
        ctx.arc(marginLeft, y, 6*scale, 0, Math.PI*2);
        ctx.fill();
        ctx.fillText(`Shelf ${i+1}: ${round(fromMM(mm, units), d)} ${unit}`, (marginLeft+16*scale), y + 4*scale);
      });

      const link = document.createElement('a');
      link.download = 'shelf_drilling_template.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  }

  calcBtn.addEventListener('click', calc);
  resetBtn.addEventListener('click', () => {
    heightEl.value = '';
    thicknessEl.value = '';
    countEl.value = '';
    resultsEl.innerHTML = '<p class="muted">Enter values and tap <strong>Calculate</strong>.</p>';
    copyBtn.disabled = true;
    pngBtn.disabled = true;
  });
  unitsEl.addEventListener('change', () => {
    const u = unitsEl.value;
    setUnitLabels(u);
  });

  // Default unit labels
  setUnitLabels(unitsEl.value);
})();
