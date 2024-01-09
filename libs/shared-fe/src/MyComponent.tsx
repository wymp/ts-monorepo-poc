import React, { useState } from 'react';
import { MyThing, myThing } from '@monorepo/shared-types';

export const MyComponent = (p: { thing?: MyThing }) => {
  const [showThing, setShowThing] = useState(false);

  const thing = p.thing || myThing;

  return (
    <div>
      <p>
        My Component - {' '}
        <button onClick={() => setShowThing(!showThing)}>
          {showThing ? `Hide Thing` : `Show Thing`}
        </button>
      </p>
      {showThing && <p>Thing: {thing}</p>}
    </div>
  );
};
