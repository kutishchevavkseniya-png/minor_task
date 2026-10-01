// Все обработчики запускаются после загрузки HTML-разметки.
document.addEventListener("DOMContentLoaded", function () {
    setupPassportButtons();
    setupAlgorithm();
});

function setupPassportButtons() {
    const latinButton = document.getElementById("to-latin");
    const russianButton = document.getElementById("to-russian");
    const surname = document.getElementById("passport-surname");
    const firstName = document.getElementById("passport-name");

    if (!latinButton || !russianButton || !surname || !firstName) {
        return;
    }

    latinButton.addEventListener("click", function () {
        surname.textContent = "Kutishcheva";
        firstName.textContent = "Kseniya";
    });

    russianButton.addEventListener("click", function () {
        surname.textContent = "Кутищева";
        firstName.textContent = "Ксения";
    });
}

function setupAlgorithm() {
    const form = document.getElementById("algorithm-form");
    const calculateButton = document.getElementById("calculate-button");
    const submitButton = document.getElementById("send-result");
    const resultBox = document.getElementById("algorithm-result");
    const resultField = document.getElementById("result-field");

    if (!form || !calculateButton || !submitButton || !resultBox || !resultField) {
        return;
    }

    const numberFields = ["a", "b", "c", "d"].map(function (id) {
        return document.getElementById(id);
    });

    function resetResult() {
        resultBox.textContent = "Изменены исходные данные. Нажмите «Вычислить».";
        resultBox.className = "result";
        resultField.value = "";
        submitButton.disabled = true;
    }

    function calculateResult() {
        const values = numberFields.map(function (field) {
            return Number(field.value);
        });

        const fieldsAreValid = numberFields.every(function (field, index) {
            return field.value.trim() !== "" && Number.isFinite(values[index]) && values[index] > 0;
        });

        if (!fieldsAreValid) {
            resultBox.textContent = "Ошибка: заполните все поля положительными конечными числами больше нуля.";
            resultBox.className = "result error";
            resultField.value = "";
            submitButton.disabled = true;
            return false;
        }

        const a = values[0];
        const b = values[1];
        const c = values[2];
        const d = values[3];
        const fitsWithoutRotation = a <= c && b <= d;
        const fitsAfterRotation = b <= c && a <= d;
        let message;

        if (fitsWithoutRotation) {
            message = "Прямоугольник помещается без поворота.";
        } else if (fitsAfterRotation) {
            message = "Прямоугольник помещается после поворота на 90°.";
        } else {
            message = "Прямоугольник не помещается.";
        }

        resultBox.textContent = message;
        resultBox.className = "result success";
        resultField.value = message;
        submitButton.disabled = false;
        return true;
    }

    numberFields.forEach(function (field) {
        field.addEventListener("input", resetResult);
    });

    calculateButton.addEventListener("click", calculateResult);

    // Перед отправкой результат вычисляется ещё раз, поэтому устаревшее значение не уйдёт на сервер.
    form.addEventListener("submit", function (event) {
        if (!calculateResult()) {
            event.preventDefault();
        }
    });
}
