import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const name = req.body.name || '';
  if (name.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid name",
      }
    });
    return;
  }
  const company = req.body.company || '';
  if (company.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid company",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(name, company),
      temperature: 0.6,
      max_tokens: 2000,
    });
    const substrings = (completion.data.choices[0].text.split('\n')).filter((str) => str != '');
    console.log(substrings);
    res.status(200).json({ result: substrings });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(name, company) {
  const capitalizedname =
    name[0].toUpperCase() + name.slice(1).toLowerCase();
  return `My Name is ${capitalizedname}. Write me a cold email, no longer than 300 words, that I would send to a software
  company called ${company} for an internship position in web development. Rich Media is a digital agency that creates software
  products like webpages, apps and videos for clients such as banks and insurance companies. I am a first year student at the 
  univeristy of waterloo studying computer science and I have web development experience at team hackathons and personal side projects
  using a tech stack with various html, css, and various javascript libraries like react, node, express. Try to go for 3 body paragraphs, and don't start
  every single sentence with "I am". don't go beyond the skills listed before. `;
}
