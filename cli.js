import repl from 'repl';
import {Agent} from './index.js';

const test = async () => {
  const customEval = (cmd, context, filename, callback) => {
    cmd = cmd.replace(/\n+$/, '');
    const match = cmd.match(/^\/(\S+)\s*([\s\S]*)$/);
    if (match) {
      const [_, command, commandArgumentsString] = match;
      const commandArguments = commandArgumentsString.split(/\s+/);

      connection.send({
        type: 'broadcast',
        event: 'json',
        payload: {
          message: JSON.stringify({
            command,
            commandArguments,
          }, null, 2),
        },
      });
    } else {
      connection.send({
        type: 'broadcast',
        event: 'chat',
        payload: {
          message: cmd,
        },
      });
    }
    // callback(null, '');
  };

  const agent = new Agent();
  const connection = await agent.connect();

  // Run a repl with custom evaluation
  const r = repl.start({
    // prompt: '> ',
    prompt: '',
    eval: customEval
  });
  r.context.connection = connection;

  connection.addEventListener('chat', (e) => {
    console.log(e.data);
  });
  connection.addEventListener('json', (e) => {
    console.log(e.data);
  });
};

test();
