
document.addEventListener('DOMContentLoaded', () => {
    const matricesRow = document.querySelector('.matrices-row');
    if (!matricesRow) return;

    let currentSize = 3;
    const MIN_SIZE = 2;
    const MAX_SIZE = 6;

    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'text-align:center; margin: 40px;';

    const decreaseBtn = document.createElement('button');
    decreaseBtn.textContent = 'Зменшити розмірність';
    decreaseBtn.className = 'matrix-size-btn decrease';
    decreaseBtn.style.cssText = 'margin-right:10px;';

    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = 'Збільшити розмірність';
    increaseBtn.className = 'matrix-size-btn increase';
    increaseBtn.style.cssText = 'margin-left:10px;';

    btnContainer.appendChild(decreaseBtn);
    btnContainer.appendChild(increaseBtn);
    matricesRow.before(btnContainer);

    const updateMatrices = () => {
        document.querySelectorAll('.matrix-table').forEach(table => {
            const inputs = table.querySelectorAll('input');
            const currentCount = inputs.length;
            const targetCount = currentSize * currentSize;

            table.style.gridTemplateColumns = `repeat(${currentSize}, 1fr)`;

            if (targetCount > currentCount) {
                for (let i = currentCount; i < targetCount; i++) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'matrix-input';
                    table.appendChild(input);
                }
            } else if (targetCount < currentCount) {
                for (let i = currentCount; i > targetCount; i--) {
                    table.removeChild(table.lastElementChild);
                }
            }
        });

        decreaseBtn.disabled = currentSize === MIN_SIZE;
        increaseBtn.disabled = currentSize === MAX_SIZE;
        setTimeout(stylePlaceholderZeros, 0);
    };

    decreaseBtn.addEventListener('click', () => {
        if (currentSize > MIN_SIZE) {
            currentSize--;
            updateMatrices();
        }
    });

    increaseBtn.addEventListener('click', () => {
        if (currentSize < MAX_SIZE) {
            currentSize++;
            updateMatrices();
        }
    });

    updateMatrices();
});

const stylePlaceholderZeros = () => {
    const inputs = document.querySelectorAll('.matrix-table input');
    inputs.forEach(input => {
        if (!input.placeholder) {
            input.placeholder = '0';
        }

        input.addEventListener('input', function() {
            if (this.value === '') {
                this.style.color = 'rgba(0, 0, 0, 0.3)';
                this.style.fontStyle = 'italic';
            } else {
                this.style.color = '';
                this.style.fontStyle = '';
            }
        });

        if (input.value === '') {
            input.style.color = 'rgba(0, 0, 0, 0.3)';
            input.style.fontStyle = 'italic';
        }

        input.addEventListener('focus', function() {
            if (this.value === '') {
                this.style.color = 'rgba(0, 0, 0, 0.5)';
            }
        });

        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.style.color = 'rgba(0, 0, 0, 0.3)';
                this.style.fontStyle = 'italic';
            }
        });
    });
};


document.addEventListener('DOMContentLoaded', () => {
    const tables = document.querySelectorAll('.matrix-table');
    if (tables.length === 0) return;

    const readMatrix = (table) => {
        const inputs = table.querySelectorAll('input');
        const size = Math.sqrt(inputs.length);
        const matrix = [];

        for (let i = 0; i < size; i++) {
            matrix[i] = [];
            for (let j = 0; j < size; j++) {
                const val = inputs[i * size + j].value.trim();
                matrix[i][j] = val === '' ? 0 : parseFloat(val) || 0;
            }
        }
        return math.matrix(matrix);
    };

    const getResultsTextarea = () => {
        return document.querySelector('.matrix-results textarea');
    };
    const formatMatrix = (matrix, precision = 4) => {
        if (!matrix || typeof matrix === 'number') {
            return matrix !== undefined ? matrix.toString() : 'Помилка';
        }

        try {
            const size = math.size(matrix);
            if (size.length === 1 || size[0] === 1 || size[1] === 1) {
                return math.format(matrix, {precision: precision});
            }

            const array = matrix.toArray();
            return array.map(row =>
                row.map(val =>
                    typeof val === 'number' ? val.toFixed(precision) : val
                ).join('\t')
            ).join('\n');
        } catch (e) {
            return matrix.toString();
        }
    };

    document.querySelectorAll('.matrix-operations button').forEach(btn => {
        btn.addEventListener('click', () => {
            const op = btn.textContent;
            const tables = document.querySelectorAll('.matrix-table');

            if (tables.length < 2) {
                getResultsTextarea().value = 'Потрібно дві матриці для операції';
                return;
            }

            const A = readMatrix(tables[0]);
            const B = readMatrix(tables[1]);
            let result;

            // clearSteps();
            // createStepsContainer();

            try {
                switch (op) {
                    case '+':
                        result = `A + B = \n${formatMatrix(math.add(A, B))}`;
                        break;
                    case '−':
                        result = `A - B = \n${formatMatrix(math.subtract(A, B))}`;
                        break;
                    case '×':
                        result = `A × B = \n${formatMatrix(math.multiply(A, B))}`;
                        break;
                    default:
                        result = 'Невідома операція';
                }
            } catch (e) {
                result = 'Помилка: ' + e.message;
            }

            getResultsTextarea().value = result;
        });
    });

    document.querySelectorAll('.matrix-actions').forEach((actionContainer, index) => {
        actionContainer.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.textContent;
                const tables = document.querySelectorAll('.matrix-table');
                const matrixIndex = index;

                if (matrixIndex >= tables.length) {
                    getResultsTextarea().value = 'Матриця не знайдена';
                    return;
                }

                const matrix = readMatrix(tables[matrixIndex]);
                const matrixName = matrixIndex === 0 ? 'A' : 'B';
                let result = '';

                // clearSteps();
                // createStepsContainer();

                function calculateEigen2x2(matrix, name) {
                    const a = matrix[0][0];
                    const b = matrix[0][1];
                    const c = matrix[1][0];
                    const d = matrix[1][1];

                    const trace = a + d;
                    const det = a * d - b * c;
                    const discriminant = trace * trace - 4 * det;

                    let result = `Власні значення матриці ${name} (2x2):\n`;

                    if (discriminant >= 0) {
                        const sqrtDisc = Math.sqrt(discriminant);
                        const lambda1 = (trace + sqrtDisc) / 2;
                        const lambda2 = (trace - sqrtDisc) / 2;

                        result += `λ₁ = ${lambda1.toFixed(6)}\n`;
                        result += `λ₂ = ${lambda2.toFixed(6)}\n\n`;
                        result += `Власні вектори:\n`;

                        if (Math.abs(b) > 1e-10) {
                            result += `v₁ = [1, ${((lambda1 - a)/b).toFixed(6)}]ᵀ\n`;
                        } else if (Math.abs(lambda1 - d) > 1e-10 && Math.abs(c) > 1e-10) {
                            result += `v₁ = [${((lambda1 - d)/c).toFixed(6)}, 1]ᵀ\n`;
                        } else {
                            result += `v₁ = [1, 0]ᵀ (особливий випадок)\n`;
                        }

                        if (Math.abs(b) > 1e-10) {
                            result += `v₂ = [1, ${((lambda2 - a)/b).toFixed(6)}]ᵀ\n`;
                        } else if (Math.abs(lambda2 - d) > 1e-10 && Math.abs(c) > 1e-10) {
                            result += `v₂ = [${((lambda2 - d)/c).toFixed(6)}, 1]ᵀ\n`;
                        } else {
                            result += `v₂ = [0, 1]ᵀ (особливий випадок)\n`;
                        }
                    } else {
                        const real = trace / 2;
                        const imag = Math.sqrt(-discriminant) / 2;
                        result += `Комплексні власні значення:\n`;
                        result += `λ₁ = ${real.toFixed(6)} + ${imag.toFixed(6)}i\n`;
                        result += `λ₂ = ${real.toFixed(6)} - ${imag.toFixed(6)}i\n`;
                        result += `\nДля комплексних власних значень вектори теж комплексні.`;
                    }

                    return result;
                }

                function calculateEigen3x3(matrix, name) {
                    let result = `Власні значення матриці ${name} (3x3) - метод потужностей:\n`;

                    let x = [1, 1, 1];
                    let prevLambda = 0;
                    let iterations = 0;

                    for (let iter = 0; iter < 50; iter++) {
                        let Ax = [0, 0, 0];
                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < 3; j++) {
                                Ax[i] += matrix[i][j] * x[j];
                            }
                        }

                        let maxAbs = 0;
                        let maxIndex = 0;
                        for (let i = 0; i < 3; i++) {
                            if (Math.abs(Ax[i]) > maxAbs) {
                                maxAbs = Math.abs(Ax[i]);
                                maxIndex = i;
                            }
                        }

                        if (maxAbs < 1e-10) break;

                        const lambda = Ax[maxIndex] / x[maxIndex];
                        x = Ax.map(val => val / maxAbs);

                        if (Math.abs(lambda - prevLambda) < 1e-6 && iter > 5) {
                            result += `λ_max ≈ ${lambda.toFixed(6)}\n`;
                            result += `Власний вектор: [${x.map(v => v.toFixed(6)).join(', ')}]\n`;
                            iterations = iter + 1;
                            break;
                        }

                        prevLambda = lambda;
                    }

                    result += `(Збіг за ${iterations || 50} ітерацій)\n`;
                    result += `\nДля точних значень всіх трьох власних чисел\n`;
                    result += `потрібні складніші алгоритми (наприклад, QR-алгоритм).`;

                    return result;
                }

                function isSymmetric(matrix) {
                    const n = matrix.length;
                    for (let i = 0; i < n; i++) {
                        for (let j = 0; j < n; j++) {
                            if (Math.abs(matrix[i][j] - matrix[j][i]) > 1e-10) {
                                return false;
                            }
                        }
                    }
                    return true;
                }

                function jacobiMethod(matrix, maxIterations = 20) {
                    const n = matrix.length;
                    let A = matrix.map(row => [...row]);
                    let result = '';

                    for (let iter = 0; iter < maxIterations; iter++) {
                        let maxVal = 0;
                        let p = 0, q = 0;

                        for (let i = 0; i < n; i++) {
                            for (let j = i + 1; j < n; j++) {
                                if (Math.abs(A[i][j]) > maxVal) {
                                    maxVal = Math.abs(A[i][j]);
                                    p = i;
                                    q = j;
                                }
                            }
                        }

                        if (maxVal < 1e-10) break;

                        const tau = (A[q][q] - A[p][p]) / (2 * A[p][q]);
                        const t = Math.abs(tau) > 1e10 ?
                            1 / (2 * tau) :
                            (tau >= 0 ? 1 / (tau + Math.sqrt(1 + tau * tau)) : -1 / (-tau + Math.sqrt(1 + tau * tau)));

                        const c = 1 / Math.sqrt(1 + t * t);
                        const s = t * c;

                        for (let i = 0; i < n; i++) {
                            if (i !== p && i !== q) {
                                const temp1 = A[i][p];
                                const temp2 = A[i][q];
                                A[i][p] = c * temp1 - s * temp2;
                                A[i][q] = s * temp1 + c * temp2;
                                A[p][i] = A[i][p];
                                A[q][i] = A[i][q];
                            }
                        }

                        const temp1 = A[p][p];
                        const temp2 = A[q][q];
                        const temp3 = A[p][q];

                        A[p][p] = c * c * temp1 - 2 * c * s * temp3 + s * s * temp2;
                        A[q][q] = s * s * temp1 + 2 * c * s * temp3 + c * c * temp2;
                        A[p][q] = A[q][p] = 0;
                    }

                    result += 'Наближені власні значення (метод Якобі):\n';
                    for (let i = 0; i < n; i++) {
                        result += `λ${i+1} ≈ ${A[i][i].toFixed(6)}\n`;
                    }

                    return result;
                }

                try {
                    switch (action) {
                        case 'Визначник':
                            const det = math.det(matrix);
                            result = `det(${matrixName}) = ${det.toFixed(4)}`;
                            break;

                        case 'Обернена матриця':
                            const detValue = math.det(matrix);
                            if (detValue === 0) {
                                result = 'Матриця вироджена (визначник = 0)';
                            } else {
                                const invMatrix = math.inv(matrix);
                                result = `${matrixName}^(-1) =\n${formatMatrix(invMatrix)}`;
                            }
                            break;

                        case 'Ранг':
                            const matrixArray = matrix.toArray();
                            const rows = matrixArray.length;
                            const cols = matrixArray[0].length;
                            let rank = 0;

                            const tempMatrix = matrixArray.map(row => [...row]);

                            for (let r = 0; r < rows; r++) {
                                let pivotRow = -1;
                                for (let i = r; i < rows; i++) {
                                    if (Math.abs(tempMatrix[i][r]) > 1e-10) {
                                        pivotRow = i;
                                        break;
                                    }
                                }

                                if (pivotRow !== -1) {
                                    rank++;

                                    if (pivotRow !== r) {
                                        [tempMatrix[r], tempMatrix[pivotRow]] = [tempMatrix[pivotRow], tempMatrix[r]];
                                    }

                                    const pivot = tempMatrix[r][r];
                                    for (let j = r; j < cols; j++) {
                                        tempMatrix[r][j] /= pivot;
                                    }

                                    for (let i = r + 1; i < rows; i++) {
                                        const factor = tempMatrix[i][r];
                                        for (let j = r; j < cols; j++) {
                                            tempMatrix[i][j] -= factor * tempMatrix[r][j];
                                        }
                                    }
                                }
                            }

                            result = `rank(${matrixName}) = ${rank}`;
                            break;

                        case 'Власні числа / вектори':
                            try {
                                const matrixArray = matrix.toArray();
                                const size = matrixArray.length;

                                if (matrixArray[0].length !== size) {
                                    result = 'Матриця повинна бути квадратною!';
                                    break;
                                }

                                if (size === 2) {
                                    result = calculateEigen2x2(matrixArray, matrixName);
                                } else if (size === 3) {
                                    result = calculateEigen3x3(matrixArray, matrixName);
                                } else {
                                    result = `Для матриць ${size}x${size} рекомендуємо використовувати спеціалізоване ПЗ.\n`;
                                    result += `Можна спробувати наближені методи для симетричних матриць:\n`;

                                    if (isSymmetric(matrixArray)) {
                                        result += `\nМатриця симетрична. Спробуємо метод Якобі:\n`;
                                        const jacobiResult = jacobiMethod(matrixArray, 10);
                                        result += jacobiResult;
                                    } else {
                                        result += `\nМатриця не симетрична. Для несиметричних матриць обчислення складніші.`;
                                    }
                                }
                            } catch (error) {
                                result = `Помилка обчислення: ${error.message}`;
                            }
                            break;

                        default:
                            result = 'Невідома дія';
                    }
                } catch (e) {
                    result = `Помилка: ${e.message}`;
                }

                getResultsTextarea().value = result;
            });
        });
    });


    const addClearButton = () => {
        const resultsSection = document.querySelector('.matrix-results');
        if (!resultsSection) return;

        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Очистити всі матриці';
        clearBtn.style.marginLeft = '10px';
        clearBtn.style.background = '#dc3545';

        clearBtn.addEventListener('click', () => {
            document.querySelectorAll('.matrix-table input').forEach(input => {
                input.value = '';
                input.style.color = 'rgba(0, 0, 0, 0.3)';
                input.style.fontStyle = 'italic';
            });
            getResultsTextarea().value = '';
        });

        const existingBtn = resultsSection.querySelector('button');
        if (existingBtn) {
            existingBtn.parentNode.insertBefore(clearBtn, existingBtn.nextSibling);
        }
    };

    addClearButton();

    // function formatMatrixForSteps(matrix) {
    //     if (!Array.isArray(matrix)) {
    //         matrix = matrix.toArray();
    //     }
    //     return matrix.map(row =>
    //         row.map(val => typeof val === 'number' ? val.toFixed(2) : val).join('\t')
    //     ).join('\n');
    // }
    //
    // function addMatrixAdditionSteps(A, B) {
    //     const aArray = A.toArray();
    //     const bArray = B.toArray();
    //     const size = aArray.length;
    //
    //     addStep(`Додавання матриць ${size}x${size}:`, true);
    //     addStep(`Матриця A:`);
    //     addStep(formatMatrixForSteps(aArray));
    //     addStep(`Матриця B:`);
    //     addStep(formatMatrixForSteps(bArray));
    //
    //     addStep(`Крок 1: Додаємо відповідні елементи:`, true);
    //     for (let i = 0; i < size; i++) {
    //         let rowSteps = [];
    //         for (let j = 0; j < size; j++) {
    //             rowSteps.push(`${aArray[i][j]} + ${bArray[i][j]} = ${(aArray[i][j] + bArray[i][j]).toFixed(2)}`);
    //         }
    //         addStep(`Рядок ${i+1}: ${rowSteps.join(', ')}`);
    //     }
    //
    //     addStep(`Результат додавання:`, true);
    // }
    //
    // const resultsSection = document.querySelector('.matrix-results');
    // if (resultsSection) {
    //     const viewStepsBtn = resultsSection.querySelector('button');
    //     if (viewStepsBtn && viewStepsBtn.textContent.includes('кроки')) {
    //         viewStepsBtn.addEventListener('click', function() {
    //             const stepsContainer = document.getElementById('calculation-steps');
    //             if (!stepsContainer) return;
    //
    //             if (stepsContainer.style.display === 'none') {
    //                 stepsContainer.style.display = 'block';
    //                 this.textContent = 'Приховати кроки обчислень';
    //             } else {
    //                 stepsContainer.style.display = 'none';
    //                 this.textContent = 'Переглянути кроки обчислень';
    //             }
    //         });
    //     }
    // }

    document.querySelector('.matrix-results button').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Покрокові обчислення будуть доступні у майбутньому');
    });
});