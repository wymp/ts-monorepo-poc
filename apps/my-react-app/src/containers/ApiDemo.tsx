import React from 'react';
import Select from 'react-select';
import { useDeps } from '../deps';

enum DATA_OPTS {
  MY_MICROSERVICE = 'my-microservice',
  OTHER_MICROSERVICE = 'other-microservice',
}
const opts = Object.values(DATA_OPTS).map((v) => ({ value: v, label: v }));
type Opts = (typeof opts)[number];

export const ApiDemo = () => {
  const { apiClient } = useDeps();
  const [data, setData] = React.useState<unknown | null>(null);
  const [dataSrc, setDataSrc] = React.useState<DATA_OPTS>(DATA_OPTS.MY_MICROSERVICE);

  const changeDataSrc = React.useCallback(
    (newValue: Opts | null) => {
      if (newValue && newValue.value !== dataSrc) {
        setDataSrc(newValue.value);
      }
    },
    [dataSrc, setDataSrc],
  );

  const refreshData = React.useCallback(async () => {
    try {
      const res = await apiClient.get(dataSrc === DATA_OPTS.MY_MICROSERVICE ? '/' : '/proxy');
      setData(res);
    } catch (e) {
      console.error(e);
      setData(e.message);
    }
  }, [apiClient, dataSrc, setData]);

  const selectedOpt = opts.find((o) => o.value === dataSrc) || null;

  return (
    <div className="api-demo">
      <h3>API Demo</h3>
      <p>
        <Select value={selectedOpt} options={opts} onChange={changeDataSrc} />
      </p>
      <div>
        <button onClick={refreshData}>{data ? '(Re)' : ''}Fetch Data</button>
        <pre style={{ textAlign: 'left' }}>{data ? JSON.stringify(data, null, 2) : '(Awaiting fetch)'}</pre>
      </div>
    </div>
  );
};
