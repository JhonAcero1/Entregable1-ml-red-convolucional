let model;

async function loadModel() {
  model = await tf.loadLayersModel('cats_dogs_tfjs/model.json');
  console.log("Modelo cargado");
}

async function predict() {
  const file = document.getElementById('image-upload').files[0];
  if (!file) {
    alert("Por favor, sube una imagen");
    return;
  }

  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = async () => {
    let tensor = tf.browser.fromPixels(img)
      .resizeNearestNeighbor([64, 64])
      .toFloat()
      .div(tf.scalar(255))
      .expandDims();

    const prediction = await model.predict(tensor).data();
    const probability = prediction[0];
    const percentage = (probability * 100).toFixed(2);

    document.getElementById('result').innerText =
      `Confianza: ${percentage}%\n` +
      `Predicción: ${probability > 0.5 ? "Perro 🐶" : "Gato 🐱"}`;
  };
}

loadModel();
