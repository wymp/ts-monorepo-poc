import { MyThing, myThing } from '@monorepo/shared-types';
import { MyComponent } from '@monorepo/shared-fe';
import { useEffect, useState } from 'react';
import type { Config, Deps } from './types';
import './App.css';
import { assembleDeps, DepsContext } from './deps';
import { Logos } from './containers/Logos';
import { Counter } from './containers/Counter';
import { ApiDemo } from './containers/ApiDemo';

const thing: MyThing = myThing;

function App(p: { config: Config }) {
  // We might have to wait for our dependencies to load - here's how we'd do that
  const [deps, setDeps] = useState<Deps | null>(null);
  useEffect(() => {
    assembleDeps(p.config).then(setDeps);
  }, [p.config]);

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
