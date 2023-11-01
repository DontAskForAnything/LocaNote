import { _client, _endpoint, _model } from "../ai";

export const generateNote = async (
  topic: Readonly<string>,
  description: Readonly<string>,
) => {
  return new Promise<string>((resolve) => {
    const params = {
      model: _model,
      messages: [
        {
          role: "user",
          content: `Please provide an in-depth mid length overview of ${topic}: ${description}. Do not include introduction and topic. Return this in markdown format.`,
        },
      ],
    };
    try {
      _client.post(_endpoint, params).then((response) => {
        const lines =
          response.data["choices"][0]["message"]["content"].split("\n");

        function removeStarsFromDashLines(line: string) {
          if (/^[^\S\r\n]*-/.test(line)) {
            console.log(line);
            return line.replace(/\*\*/g, "");
          }
          return line;
        }

        const modifiedText = lines.map(removeStarsFromDashLines).join("\n");

        resolve(modifiedText as string);
      });
    } catch (err) {
      console.log(err);
      // reject(err);
      //TODO: add not matching response error
      //TODO: navigate to error screen
    }
  });
};
