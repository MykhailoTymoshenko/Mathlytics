document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('functionCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const functionInput = document.getElementById('functionInput');
    const xStartInput = document.getElementById('xStart');
    const xEndInput = document.getElementById('xEnd');
    const extremumResults = document.getElementById('extremumResults');

    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }

    window.addEventListener('load', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function parseFunction(funcStr) {
        let jsFunc = funcStr
            .replace(/\^/g, '**')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/log\(/g, 'Math.log(')
            .replace(/exp\(/g, 'Math.exp(')
            .replace(/abs\(/g, 'Math.abs(')
            .replace(/pi/g, 'Math.PI')
            .replace(/e/g, 'Math.E');

        return (x) => {
            try {
                const expression = jsFunc.replace(/x/g, `(${x})`);
                return eval(expression);
            } catch (e) {
                console.error('Помилка обчислення:', e);
                return NaN;
            }
        };
    }

    let currentSettings = null;

    function calculatePlotSettings(xStart, xEnd, f) {
        let yMin = Infinity;
        let yMax = -Infinity;
        const samplePoints = 500;
        const step = (xEnd - xStart) / samplePoints;

        for (let x = xStart; x <= xEnd; x += step) {
            const y = f(x);
            if (!isNaN(y) && Math.abs(y) < 1e10) {
                yMin = Math.min(yMin, y);
                yMax = Math.max(yMax, y);
            }
        }

        if (yMin === Infinity || yMax === -Infinity) {
            return null;
        }

        const yRange = yMax - yMin;
        const yPadding = yRange * 0.1;
        yMin -= yPadding;
        yMax += yPadding;

        if (Math.abs(yMax - yMin) < 0.001) {
            yMin -= 1;
            yMax += 1;
        }

        const padding = 60;
        const plotWidth = canvas.width - 2 * padding;
        const plotHeight = canvas.height - 2 * padding;
        const xScale = plotWidth / (xEnd - xStart);
        const yScale = plotHeight / (yMax - yMin);

        return {
            xStart, xEnd, yMin, yMax,
            padding,
            xScale,
            yScale,
            plotWidth,
            plotHeight,
            getXPixel: function (x) {
                return this.padding + (x - this.xStart) * this.xScale;
            },
            getYPixel: function (y) {
                return canvas.height - this.padding - (y - this.yMin) * this.yScale;
            }
        };
    }

    function calculateGridStep(range, pixels, minStepPixels = 40) {
        const approxStep = range / (pixels / minStepPixels);
        const magnitude = Math.pow(10, Math.floor(Math.log10(approxStep)));
        const fraction = approxStep / magnitude;

        let step;
        if (fraction <= 1.5) step = magnitude;
        else if (fraction <= 3) step = 2 * magnitude;
        else if (fraction <= 7) step = 5 * magnitude;
        else step = 10 * magnitude;

        return Math.max(step, magnitude);
    }

    function drawGrid() {
        if (!currentSettings) return;

        const s = currentSettings;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const xGridStep = calculateGridStep(s.xEnd - s.xStart, s.plotWidth, 50);
        const yGridStep = calculateGridStep(s.yMax - s.yMin, s.plotHeight, 40);

        const firstXGrid = Math.ceil(s.xStart / xGridStep) * xGridStep;
        for (let x = firstXGrid; x <= s.xEnd; x += xGridStep) {
            const xPixel = s.getXPixel(x);

            ctx.beginPath();
            ctx.moveTo(xPixel, s.padding);
            ctx.lineTo(xPixel, canvas.height - s.padding);
            ctx.stroke();

            if (xPixel - s.padding > 30) {
                ctx.fillText(x.toFixed(xGridStep < 1 ? 2 : 1),
                    xPixel, canvas.height - s.padding + 20);
            }
        }

        const firstYGrid = Math.ceil(s.yMin / yGridStep) * yGridStep;
        for (let y = firstYGrid; y <= s.yMax; y += yGridStep) {
            const yPixel = s.getYPixel(y);

            ctx.beginPath();
            ctx.moveTo(s.padding, yPixel);
            ctx.lineTo(canvas.width - s.padding, yPixel);
            ctx.stroke();

            if (canvas.height - s.padding - yPixel > 15) {
                ctx.textAlign = 'right';
                ctx.fillText(y.toFixed(yGridStep < 1 ? 2 : 1),
                    s.padding - 10, yPixel);
                ctx.textAlign = 'center';
            }
        }
    }

    function drawAxes() {
        if (!currentSettings) return;

        const s = currentSettings;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;

        const xAxisY = s.getYPixel(0);
        if (xAxisY >= s.padding && xAxisY <= canvas.height - s.padding) {
            ctx.beginPath();
            ctx.moveTo(s.padding, xAxisY);
            ctx.lineTo(canvas.width - s.padding, xAxisY);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(canvas.width - s.padding, xAxisY);
            ctx.lineTo(canvas.width - s.padding - 10, xAxisY - 5);
            ctx.lineTo(canvas.width - s.padding - 10, xAxisY + 5);
            ctx.fill();
        }

        const yAxisX = s.getXPixel(0);
        if (yAxisX >= s.padding && yAxisX <= canvas.width - s.padding) {
            ctx.beginPath();
            ctx.moveTo(yAxisX, s.padding);
            ctx.lineTo(yAxisX, canvas.height - s.padding);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(yAxisX, s.padding);
            ctx.lineTo(yAxisX - 5, s.padding + 10);
            ctx.lineTo(yAxisX + 5, s.padding + 10);
            ctx.fill();
        }

        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('x', canvas.width - 15, xAxisY - 10);
        ctx.fillText('y', yAxisX + 10, 15);
    }

    function plotGraph() {
        const funcStr = functionInput.value.trim();
        if (!funcStr) {
            alert('Введіть функцію!');
            return;
        }

        const xStart = parseFloat(xStartInput.value) || -10;
        const xEnd = parseFloat(xEndInput.value) || 10;

        if (xStart >= xEnd) {
            alert('Початок інтервалу має бути меншим за кінець!');
            return;
        }

        const f = parseFunction(funcStr);

        currentSettings = calculatePlotSettings(xStart, xEnd, f);
        if (!currentSettings) {
            alert('Не вдалося обчислити функцію на заданому інтервалі!');
            drawNoDataMessage();
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawGrid();
        drawAxes();

        ctx.strokeStyle = '#005689';
        ctx.lineWidth = 3;
        ctx.beginPath();

        const s = currentSettings;
        const step = (xEnd - xStart) / 500;
        let firstPoint = true;

        for (let x = xStart; x <= xEnd; x += step) {
            const y = f(x);
            if (!isNaN(y) && Math.abs(y) < 1e10) {
                const xPixel = s.getXPixel(x);
                const yPixel = s.getYPixel(y);

                if (yPixel >= -100 && yPixel <= canvas.height + 100) {
                    if (firstPoint) {
                        ctx.moveTo(xPixel, yPixel);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(xPixel, yPixel);
                    }
                } else {
                    firstPoint = true;
                }
            } else {
                firstPoint = true;
            }
        }

        ctx.stroke();

        ctx.fillStyle = '#005689';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`f(x) = ${funcStr}`, canvas.width / 2, 30);
    }

    function findExtrema() {
        const funcStr = functionInput.value.trim();
        if (!funcStr) {
            alert('Введіть функцію!');
            return;
        }

        plotGraph();

        if (!currentSettings) return;

        const xStart = parseFloat(xStartInput.value) || -10;
        const xEnd = parseFloat(xEndInput.value) || 10;
        const f = parseFunction(funcStr);

        const step = (xEnd - xStart) / 1000;
        const points = [];

        for (let x = xStart; x <= xEnd; x += step) {
            const y = f(x);
            if (!isNaN(y)) {
                points.push({x, y});
            }
        }

        const extrema = [];

        for (let i = 1; i < points.length - 1; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const next = points[i + 1];

            if (curr.y > prev.y && curr.y > next.y) {
                extrema.push({
                    type: 'max',
                    x: curr.x,
                    y: curr.y
                });
            }

            if (curr.y < prev.y && curr.y < next.y) {
                extrema.push({
                    type: 'min',
                    x: curr.x,
                    y: curr.y
                });
            }
        }

        const uniqueExtrema = [];
        const tolerance = (xEnd - xStart) * 0.01;

        extrema.forEach(ex => {
            const isDuplicate = uniqueExtrema.some(u =>
                Math.abs(u.x - ex.x) < tolerance && u.type === ex.type
            );
            if (!isDuplicate) {
                uniqueExtrema.push(ex);
            }
        });

        uniqueExtrema.sort((a, b) => a.x - b.x);

        let resultText = '';
        if (uniqueExtrema.length === 0) {
            resultText = 'Екстремуми не знайдено на заданому інтервалі.';
        } else {
            resultText = `Знайдено екстремумів: ${uniqueExtrema.length}\n\n`;

            uniqueExtrema.forEach((ex, index) => {
                resultText += `${index + 1}. ${ex.type === 'max' ? 'Максимум' : 'Мінімум'}\n`;
                resultText += `   x = ${ex.x.toFixed(4)}\n`;
                resultText += `   f(x) = ${ex.y.toFixed(4)}\n\n`;
            });
        }

        extremumResults.value = resultText;

        if (uniqueExtrema.length > 0) {
            const s = currentSettings;

            uniqueExtrema.forEach(ex => {
                const xPixel = s.getXPixel(ex.x);
                const yPixel = s.getYPixel(ex.y);

                if (xPixel >= s.padding && xPixel <= canvas.width - s.padding &&
                    yPixel >= s.padding && yPixel <= canvas.height - s.padding) {

                    ctx.fillStyle = ex.type === 'max' ? '#dc3545' : '#0c9d6d';
                    ctx.beginPath();
                    ctx.arc(xPixel, yPixel, 8, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    ctx.fillStyle = ex.type === 'max' ? '#dc3545' : '#0c9d6d';
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'bottom';

                    const label = `${ex.type === 'max' ? 'max' : 'min'} (${ex.x.toFixed(2)}, ${ex.y.toFixed(2)})`;
                    const textWidth = ctx.measureText(label).width;

                    let labelX = xPixel + 10;
                    let labelY = yPixel - 10;

                    if (labelX + textWidth > canvas.width - 10) {
                        labelX = xPixel - textWidth - 10;
                    }
                    if (labelY < 20) {
                        labelY = yPixel + 20;
                    }

                    ctx.fillText(label, labelX, labelY);
                }
            });
        }
    }

    function drawNoDataMessage() {
        ctx.fillStyle = '#f9f9ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#999';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Графік з\'явиться тут після введення функції',
            canvas.width / 2, canvas.height / 2);
    }

    document.querySelector('.graphics-actions button:nth-child(1)').addEventListener('click', plotGraph);
    document.querySelector('.graphics-actions button:nth-child(2)').addEventListener('click', findExtrema);

    document.querySelector('.graphics-extrema button').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Покрокові обчислення для графіків будуть доступні у наступній версії!');
    });

    const addClearButton = () => {
        const resultsSection = document.querySelector('.graphics-extrema');
        if (!resultsSection) return;

        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Очистити все';
        clearBtn.style.cssText = `
            margin-left: 10px;
            background: #dc3545;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
        `;

        clearBtn.addEventListener('click', () => {
            functionInput.value = '';
            xStartInput.value = '';
            xEndInput.value = '';
            extremumResults.value = '';
            currentSettings = null;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawNoDataMessage();
        });

        const existingBtn = resultsSection.querySelector('button');
        if (existingBtn) {
            existingBtn.parentNode.insertBefore(clearBtn, existingBtn.nextSibling);
        }
    };

    addClearButton();
});