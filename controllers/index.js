function confidenceLevel(probablity, sample) {
  if (probablity >= 0.7 && sample >= 100) return true;
  return false;
}

export async function simpleGet(req, res) {
  try {
    const { name } = req.query;
    const api = process.env.GENDERIZE_API;
    const key = process.env.API_KEY;

    const onlyLetters = /^[A-Za-z]+$/;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Empty Query parameter 'name' ",
      });
    }

    if (!onlyLetters.test(name)) {
      return res.status(402).json({
        status: "error",
        message: "Query parameter 'name' should contain only valid numbers",
      });
    }

    const entity = await fetch(`${api}/get?name=${name}&key=${key}`);

    if (!entity.ok) {
      return res.status(400).json({
        status: "error",
        message: `Network Error`,
      });
    }

    const response = await entity.json();

    if (response.gender == "unknown") {
      return res.status(400).json({
        status: "error",
        message: `Name ${name} not found`,
      });
    }

    const probability = (response.accuracy / 100).toFixed(2);

    const now = new Date();

    return res.status(200).json({
      status: "success",
      data: {
        name: response.name,
        gender: response.gender,
        probability: probability,
        sampleSize: response.samples,
        is_confident: confidenceLevel(probability, response.samples),
        processed_at: now.toISOString(),
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: `Request Failed: ${err}`,
    });
  }
}
