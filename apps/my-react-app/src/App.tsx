import { MyThing, myThing } from '@monorepo/shared-types';
import { MyComponent } from '@monorepo/shared-fe';
import type { Config } from './types';
import './App.css';
import { assembleDeps, DepsContext } from './deps';
import { Logos } from './containers/Logos';
import { Counter } from './containers/Counter';
import { ApiDemo } from './containers/ApiDemo';

const thing: MyThing = myThing;

function App(p: { config: Config }) {

  const deps = assembleDeps(p.config);

  if (!deps) {
    return <div>Loading...</div>;
  }

  return (
    <DepsContext.Provider value={deps}>
      <Logos />
      <h1>Vite + React</h1>
      <Counter />
      <MyComponent thing={thing} />
      <ApiDemo />
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </DepsContext.Provider>
  );
}

export default App;
