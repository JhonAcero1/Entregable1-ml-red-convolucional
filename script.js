const modeloURL = 'modelo_web/model.json';

async function cargarModelo() {
  const modelo = await tf.loadLayersModel(modeloURL);
  return modelo;
}

document.getElementById('imageUpload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = async function () {
    const img = new Image();
    img.src = reader.result;
    img.onload = async function () {
      const tensor = tf.browser.fromPixels(img)
        .resizeNearestNeighbor([100, 100])
        .toFloat()
        .div(tf.scalar(255))
        .expandDims();

      const modelo = await cargarModelo();
      const pred = modelo.predict(tensor);
      const data = await pred.data();
      const index = data.indexOf(Math.max(...data));
      const clases = [/* nombres en orden como en entrenamiento */];

      document.getElementById('resultado').innerText = "Fruta: " + clases[index];
    };
  };
  reader.readAsDataURL(file);
});
