import { _client, _endpoint, _model } from "../ai";

export const generateNote = async (
    topic: Readonly<string>,
    description: Readonly<string>,
  ) => {
    return new Promise<string>((resolve) => {
      //     __
      //   /    \
      //  | STOP |
      //   \ __ /
      //     ||     Do not change the content of the message!
      //     ||     Because a small change can cause the application to crash.
      //     ||     AI queries must be structured.
      //     ||     ~ Michał
      //   ~~~~~~~
  
      const params = {
        model: _model,
        messages: [
          {
            role: "user",
            content: `Please provide an in-depth mid length overview of ${topic}: ${description}. Do not include introduction and topic.`,
          }
        ],
      };
      try {
        _client.post(_endpoint, params).then((response) => {
          
          resolve(response.data["choices"][0]["message"]["content"] as string);
        });
      } catch (err) {
        // reject(err);
        //TODO: add not matching response error
        //TODO: navigate to error screen
      }
    });
  };
  