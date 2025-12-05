function addClearSamplesButton() {
    const resultsSection = document.querySelector('.stats-results');
    if (!resultsSection) return;

    if (document.getElementById('clear-samples-btn')) return;

    const clearBtn = document.createElement('button');
    clearBtn.id = 'clear-samples-btn';
    clearBtn.textContent = 'Очистити вибірки';
    clearBtn.style.marginLeft = '10px';
    clearBtn.style.background = '#dc3545';

    const existingBtn = resultsSection.querySelector('button');
    if (existingBtn) {
        existingBtn.parentNode.insertBefore(clearBtn, existingBtn.nextSibling);
    }

    clearBtn.addEventListener('click', clearSamplesHandler);
}

function clearSamplesHandler() {
    const confirmClear = confirm('Очистити всі вибірки та результати?');
    if (!confirmClear) return;

    document.getElementById('input-x').value = '';
    document.getElementById('input-y').value = '';

    const resultsTextarea = document.getElementById('results');
    if (resultsTextarea) {
        resultsTextarea.value = '';
    }

    document.querySelectorAll('#input-x, #input-y').forEach(textarea => {
        textarea.style.borderColor = '';
    });

    const tempMsg = 'Вибірки очищено.';
    if (resultsTextarea) {
        resultsTextarea.value = tempMsg;
        setTimeout(() => {
            if (resultsTextarea.value === tempMsg) {
                resultsTextarea.value = '';
            }
        }, 1500);
    }
}

addClearSamplesButton();

function parseSample(text) {
    return text.split(/[,;\s]+/)
        .map(x => parseFloat(x.trim()))
        .filter(x => !isNaN(x));
}

function mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function median(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
}

function mode(arr) {
    const freq = {};
    arr.forEach(x => freq[x] = (freq[x] || 0) + 1);
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.keys(freq).filter(x => freq[x] === maxFreq);
    return modes.length === arr.length ? "Немає моди (усі значення різні)"
        : modes.map(Number).join(", ");
}

function variance(arr) {
    const m = mean(arr);
    return arr.reduce((sum, x) => sum + Math.pow(x - m, 2), 0) / arr.length;
}

function stdDev(arr) {
    return Math.sqrt(variance(arr));
}

function coeffVariation(arr) {
    return (stdDev(arr) / mean(arr)) * 100;
}

function correlation(xArr, yArr) {
    if (xArr.length !== yArr.length) return "Розміри вибірок не співпадають";
    const n = xArr.length;
    const meanX = mean(xArr);
    const meanY = mean(yArr);

    let sumXY = 0, sumX2 = 0, sumY2 = 0;
    for (let i = 0; i < n; i++) {
        const devX = xArr[i] - meanX;
        const devY = yArr[i] - meanY;
        sumXY += devX * devY;
        sumX2 += devX * devX;
        sumY2 += devY * devY;
    }

    return sumXY / Math.sqrt(sumX2 * sumY2);
}

function linearRegression(xArr, yArr) {
    if (xArr.length !== yArr.length) return "Розміри вибірок не співпадають";
    const n = xArr.length;
    const meanX = mean(xArr);
    const meanY = mean(yArr);

    let numerator = 0, denominator = 0;
    for (let i = 0; i < n; i++) {
        numerator += (xArr[i] - meanX) * (yArr[i] - meanY);
        denominator += (xArr[i] - meanX) ** 2;
    }

    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;

    return { slope, intercept };
}
document.addEventListener('DOMContentLoaded', () => {
    const resultsTextarea = document.getElementById('results');

    function updateResults(text) {
        resultsTextarea.value = text + '\n' + resultsTextarea.value;
    }

    document.querySelectorAll('.sample-actions button[data-action]').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            const sampleContainer = this.closest('.sample-plus-actions');
            const textarea = sampleContainer.querySelector('textarea');
            const sampleName = sampleContainer.querySelector('h3').textContent;

            const values = parseSample(textarea.value);
            if (values.length === 0) {
                updateResults(`${sampleName}: Немає даних`);
                return;
            }

            let result;
            switch(action) {
                case 'mean':
                    result = `Середнє ${sampleName}: ${mean(values).toFixed(4)}`;
                    break;
                case 'median':
                    result = `Медіана ${sampleName}: ${median(values).toFixed(4)}`;
                    break;
                case 'mode':
                    result = `Мода ${sampleName}: ${mode(values)}`;
                    break;
                case 'variance':
                    result = `Дисперсія ${sampleName}: ${variance(values).toFixed(4)}`;
                    break;
                case 'stddev':
                    result = `Ст. відхилення ${sampleName}: ${stdDev(values).toFixed(4)}`;
                    break;
                case 'cv':
                    result = `Коеф. варіації ${sampleName}: ${coeffVariation(values).toFixed(2)}%`;
                    break;
            }

            updateResults(result);
        });
    });

    document.querySelectorAll('.calc-all').forEach(btn => {
        btn.addEventListener('click', function() {
            const sampleContainer = this.closest('.sample-plus-actions');
            const textarea = sampleContainer.querySelector('textarea');
            const sampleName = sampleContainer.querySelector('h3').textContent;

            const values = parseSample(textarea.value);
            if (values.length === 0) {
                updateResults(`${sampleName}: Немає даних`);
                return;
            }

            let results = `=== ${sampleName} ===\n`;
            results += `Дані: ${values.join(', ')}\n`;
            results += `Кількість: ${values.length}\n`;
            results += `Середнє: ${mean(values).toFixed(4)}\n`;
            results += `Медіана: ${median(values).toFixed(4)}\n`;
            results += `Мода: ${mode(values)}\n`;
            results += `Дисперсія: ${variance(values).toFixed(4)}\n`;
            results += `Ст. відхилення: ${stdDev(values).toFixed(4)}\n`;
            results += `Коеф. варіації: ${coeffVariation(values).toFixed(2)}%\n`;

            updateResults(results);
        });
    });

    document.getElementById('calc-correlation').addEventListener('click', () => {
        const xValues = parseSample(document.getElementById('input-x').value);
        const yValues = parseSample(document.getElementById('input-y').value);

        if (xValues.length === 0 || yValues.length === 0) {
            updateResults('Помилка: Одна або обидві вибірки порожні');
            return;
        }

        if (xValues.length !== yValues.length) {
            updateResults('Помилка: Розміри вибірок не співпадають');
            return;
        }

        const corr = correlation(xValues, yValues);
        updateResults(`Коефіцієнт кореляції Пірсона: ${corr.toFixed(4)}`);
    });

    document.getElementById('calc-regression').addEventListener('click', () => {
        const xValues = parseSample(document.getElementById('input-x').value);
        const yValues = parseSample(document.getElementById('input-y').value);

        if (xValues.length === 0 || yValues.length === 0) {
            updateResults('Помилка: Одна або обидві вибірки порожні');
            return;
        }

        if (xValues.length !== yValues.length) {
            updateResults('Помилка: Розміри вибірок не співпадають');
            return;
        }

        const reg = linearRegression(xValues, yValues);
        updateResults(`Лінійна регресія: y = ${reg.slope.toFixed(4)}x + ${reg.intercept.toFixed(4)}`);
    });

    document.querySelector('.stats-results button').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Покрокові обчислення статистики будуть доступні у наступній версії!');
    });

    document.querySelectorAll('#input-x, #input-y').forEach(textarea => {
        textarea.addEventListener('input', function() {
            const value = this.value;
            if (value.includes('abc')) {
                this.style.borderColor = 'red';
            } else {
                this.style.borderColor = '';
            }
        });
    });
});