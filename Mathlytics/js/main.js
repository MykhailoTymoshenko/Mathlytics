document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tool-card h3').forEach(title => {
        title.style.fontFamily = 'Tahoma, Arial, sans-serif';
        title.style.color = '#b1704e'
    });

    const main = document.querySelector('main');
    const newP = document.createElement('p');
    newP.textContent = '«Математика — це не про обчислення. Це про розуміння.»';
    newP.style.textAlign = 'left';
    newP.style.color = '#005689';
    newP.style.fontWeight = 'bold';
    newP.style.margin = '100px 120px';
    main.appendChild(newP);
});

const footerText = document.querySelector('.footer-right p');
footerText.innerHTML += ` | ${new Date().toLocaleDateString('uk-UA')}`;

const hiddenText = document.createElement('div');
hiddenText.innerHTML = `
  <p style="display:none; margin-top:20px;" id="hidden-content">
    Mathlytics — це ваш помічник у математиці та статистиці. 
    Всі обчислення виконуються локально у браузері — ніяких серверів.
  </p>
  <button id="toggle-more" style="margin-top:10px;">Показати більше</button>
`;

const welcomeBlock = document.querySelector('.index-welcome');
if (welcomeBlock) {
    welcomeBlock.appendChild(hiddenText);
    document.getElementById('toggle-more').addEventListener('click', () => {
        const content = document.getElementById('hidden-content');
        const button  = document.getElementById('toggle-more');

        if (content.style.display === 'block') {
            content.style.display = 'none';
            button.textContent = 'Показати більше';
        } else {
            content.style.display = 'block';
            button.textContent = 'Показати менше';
        }
    });
}

document.querySelectorAll('.header-right a').forEach(link => {
    link.addEventListener('mouseenter', () => link.classList.add('hover'));
    link.addEventListener('mouseleave', () => link.classList.remove('hover'));
});

let fontSize = 16;
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        fontSize += 2;
        document.body.style.fontSize = fontSize + 'px';
    }
    if (e.key === 'ArrowDown' && fontSize > 10) {
        fontSize -= 2;
        document.body.style.fontSize = fontSize + 'px';
    }
});

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        let valid = true;

        document.querySelectorAll('.error').forEach(el => el.remove());

        if (name.length < 3) {
            showError('name', 'Ім’я має бути не менше 3 символів');
            valid = false;
        }
        if (!email.includes('@') || !email.includes('.')) {
            showError('email', 'Введіть коректний email');
            valid = false;
        }
        if (message.length < 10) {
            showError('message', 'Повідомлення має бути не менше 10 символів');
            valid = false;
        }

        if (valid) {
            alert('Форма успішно надіслана!');
            this.reset();
        }
    });
}

function showError(fieldId, text) {
    const field = document.getElementById(fieldId);
    const error = document.createElement('small');
    error.textContent = text;
    error.style.color = 'red';
    error.className = 'error';
    field.parentElement.appendChild(error);
}

 window.createStepsContainer = function (containerId = 'calculation-steps') {
    const resultsSection = document.querySelector('.matrix-results, .stats-results, .graphics-results, .graphics-extrema');
    if (!resultsSection) return null;

    let stepsContainer = document.getElementById(containerId);
    if (!stepsContainer) {
        stepsContainer = document.createElement('div');
        stepsContainer.id = containerId;
        stepsContainer.className = 'steps-container';
        stepsContainer.style.display = 'none';
        stepsContainer.style.marginTop = '20px';
        stepsContainer.style.padding = '15px';
        stepsContainer.style.backgroundColor = 'var(--background-light)';
        stepsContainer.style.borderRadius = '8px';
        stepsContainer.style.border = '1px solid var(--border-color)';
        stepsContainer.style.maxHeight = '300px';
        stepsContainer.style.overflowY = 'auto';

        const stepsHeader = document.createElement('h5');
        stepsHeader.textContent = 'Покрокові обчислення:';
        stepsHeader.style.marginTop = '0';
        stepsHeader.style.color = 'var(--primary-blue)';

        const stepsContent = document.createElement('div');
        stepsContent.id = 'steps-content';
        stepsContent.style.fontFamily = "'Fira Code', monospace";
        stepsContent.style.fontSize = '14px';
        stepsContent.style.whiteSpace = 'pre-wrap';
        stepsContent.style.lineHeight = '1.4';

        stepsContainer.appendChild(stepsHeader);
        stepsContainer.appendChild(stepsContent);

        const viewStepsBtn = resultsSection.querySelector('button');
        if (viewStepsBtn && viewStepsBtn.textContent.includes('кроки')) {
            const originalText = viewStepsBtn.textContent;

            viewStepsBtn.addEventListener('click', () => {
                if (stepsContainer.style.display === 'none') {
                    stepsContainer.style.display = 'block';
                    viewStepsBtn.textContent = originalText.replace('Переглянути', 'Приховати');
                } else {
                    stepsContainer.style.display = 'none';
                    viewStepsBtn.textContent = originalText;
                }
            });

            const textarea = resultsSection.querySelector('textarea');
            if (textarea) {
                textarea.parentNode.insertBefore(stepsContainer, textarea.nextSibling);
            }
        }
    }

    return stepsContainer;
}

window.clearSteps = function clearSteps() {
    const stepsContent = document.getElementById('steps-content');
    if (stepsContent) {
        stepsContent.innerHTML = '';
    }
    const stepsContainer = document.getElementById('calculation-steps');
    if (stepsContainer) {
        stepsContainer.style.display = 'none';
    }
}

window.addStep = function(step, isImportant = false) {
    const stepsContent = document.getElementById('steps-content');
    if (!stepsContent) return;

    const stepElement = document.createElement('div');
    stepElement.style.marginBottom = '8px';
    stepElement.style.padding = '5px 0';
    stepElement.style.borderBottom = '1px dashed rgba(0,86,137,0.1)';

    if (isImportant) {
        stepElement.style.fontWeight = 'bold';
        stepElement.style.color = 'var(--primary-blue)';
        stepElement.style.backgroundColor = 'rgba(213, 238, 255, 0.3)';
        stepElement.style.padding = '8px 10px';
        stepElement.style.borderRadius = '4px';
        stepElement.style.borderLeft = '3px solid var(--accent-green)';
    }

    stepElement.textContent = step;
    stepsContent.appendChild(stepElement);

    stepsContent.scrollTop = stepsContent.scrollHeight;
}

window.addFormulaStep = function(formula, result, explanation = '') {
    const stepsContent = document.getElementById('steps-content');
    if (!stepsContent) return;

    const stepElement = document.createElement('div');
    stepElement.style.marginBottom = '10px';
    stepElement.style.padding = '8px 12px';
    stepElement.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    stepElement.style.borderRadius = '6px';
    stepElement.style.border = '1px solid var(--border-color)';
    stepElement.style.fontFamily = "'Fira Code', monospace";

    stepElement.innerHTML = `
        <div style="color: #005689; font-weight: bold;">${formula}</div>
        <div style="color: #0c9d6d; margin: 3px 0;">= ${result}</div>
        ${explanation ? `<div style="color: #666; font-size: 13px; font-style: italic;">${explanation}</div>` : ''}
    `;

    stepsContent.appendChild(stepElement);
    stepsContent.scrollTop = stepsContent.scrollHeight;
}

window.addStepSeparator = function (label = '') {
    const stepsContent = document.getElementById('steps-content');
    if (!stepsContent) return;

    const separator = document.createElement('div');
    separator.style.margin = '15px 0';
    separator.style.padding = '5px 0';
    separator.style.borderTop = '2px solid var(--primary-blue)';
    separator.style.borderBottom = '2px solid var(--primary-blue)';
    separator.style.textAlign = 'center';
    separator.style.fontWeight = 'bold';
    separator.style.color = 'var(--primary-blue)';
    separator.style.backgroundColor = 'rgba(0, 86, 137, 0.05)';

    if (label) {
        separator.textContent = `━━━ ${label} ━━━`;
    } else {
        separator.textContent = '━━━━━━━━━━━━━━━━━━━━';
    }

    stepsContent.appendChild(separator);
    stepsContent.scrollTop = stepsContent.scrollHeight;
}