const form = document.getElementById("prediction-form");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const labelEl = document.getElementById("label");
const confidenceEl = document.getElementById("confidence");
const riskEl = document.getElementById("risk");
const timeEl = document.getElementById("time");
const probNoEl = document.getElementById("probNo");
const probYesEl = document.getElementById("probYes");

const riskClass = {
  Low: "var(--success)",
  Medium: "var(--warning)",
  High: "var(--danger)"
};

function formatPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Enviando datos...";
  resultEl.hidden = true;

  const data = Object.fromEntries(new FormData(form).entries());
  const payload = {
    age: Number(data.age),
    sex: Number(data.sex),
    chest: Number(data.chest),
    resting_blood_pressure: Number(data.resting_blood_pressure),
    serum_cholestoral: Number(data.serum_cholestoral),
    fasting_blood_sugar: Number(data.fasting_blood_sugar),
    resting_electrocardiographic_results: Number(data.resting_electrocardiographic_results),
    maximum_heart_rate_achieved: Number(data.maximum_heart_rate_achieved),
    exercise_induced_angina: Number(data.exercise_induced_angina),
    oldpeak: Number(data.oldpeak),
    slope: Number(data.slope),
    number_of_major_vessels: Number(data.number_of_major_vessels),
    thal: Number(data.thal)
  };

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail ?? "No se pudo obtener la predicción");
    }

    const result = await response.json();
    statusEl.textContent = "Predicción completada.";
    labelEl.textContent = result.prediction_label;
    confidenceEl.textContent = formatPercent(result.confidence);
    riskEl.textContent = result.risk_level;
    timeEl.textContent = `${result.inference_time_ms.toFixed(2)} ms`;
    probNoEl.textContent = formatPercent(result.probabilities.no_disease);
    probYesEl.textContent = formatPercent(result.probabilities.disease);

    labelEl.style.color = riskClass[result.risk_level] ?? "var(--accent)";
    resultEl.hidden = false;
  } catch (error) {
    statusEl.textContent = `Error: ${error.message}`;
  }
});
