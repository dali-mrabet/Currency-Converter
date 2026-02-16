import { useState, useEffect } from 'react';

interface ConversionRecord {
  id: number;
  realRate: number;
  overrideRate: number | null;
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  timestamp: Date;
}

function App() {
  // state for the exchange rate
  const [currentRate, setCurrentRate] = useState(1.1);
  const [overrideRate, setOverrideRate] = useState('');
  const [isOverrideActive, setIsOverrideActive] = useState(false);
  
  // which currency are we inputting? EUR or USD
  const [inputIsEur, setInputIsEur] = useState(true);
  const [amount, setAmount] = useState('');
  
  const [history, setHistory] = useState<ConversionRecord[]>([]);

  // update the rate every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRate(prev => {
        const change = (Math.random() - 0.5) * 0.1;
        return Math.max(0.5, prev + change);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // auto-deactivate override if rate differs by 2%
  useEffect(() => {
    if (isOverrideActive && overrideRate) {
      const override = parseFloat(overrideRate);
      const diff = Math.abs(currentRate - override) / currentRate;
      
      if (diff >= 0.02) {
        setIsOverrideActive(false);
      }
    }
  }, [currentRate, overrideRate, isOverrideActive]);

  const getActiveRate = () => {
    if (isOverrideActive && overrideRate) {
      return parseFloat(overrideRate);
    }
    return currentRate;
  };

  const calculateConversion = () => {
    if (!amount || isNaN(parseFloat(amount))) return 0;
    
    const inputAmount = parseFloat(amount);
    const rate = getActiveRate();
    
    // simple conversion logic
    if (inputIsEur) {
      return inputAmount * rate;
    } else {
      return inputAmount / rate;
    }
  };

  const handleCurrencySwitch = () => {
    // swap currencies and use the converted amount as new input
    const converted = calculateConversion();
    setAmount(converted.toFixed(2));
    setInputIsEur(!inputIsEur);
  };

  const handleConvert = () => {
    if (!amount || isNaN(parseFloat(amount))) return;

    const inputAmount = parseFloat(amount);
    const outputAmount = calculateConversion();

    const record: ConversionRecord = {
      id: Date.now(),
      realRate: currentRate,
      overrideRate: isOverrideActive ? parseFloat(overrideRate) : null,
      fromAmount: inputAmount,
      fromCurrency: inputIsEur ? 'EUR' : 'USD',
      toAmount: outputAmount,
      toCurrency: inputIsEur ? 'USD' : 'EUR',
      timestamp: new Date()
    };

    setHistory(prev => [record, ...prev].slice(0, 5));
  };

  const toggleOverride = () => {
    setIsOverrideActive(!isOverrideActive);
  };

  return (
    <div className="app-container">
      <h1>Currency Converter</h1>
      <p className="subtitle">Real-time EUR/USD exchange rates</p>

      {/* rate display */}
      <div className="card">
        <div className="rate-display">
          <div>
            <div className="rate-label">Current Exchange Rate</div>
            <div className="rate-value">
              1 EUR = {currentRate.toFixed(4)} USD
            </div>
          </div>
          {isOverrideActive && (
            <span className="badge badge-warning">
              Override Active: {overrideRate}
            </span>
          )}
        </div>
      </div>

      {/* conversion form */}
      <div className="card">
        <div className="input-group">
          <label>Amount to Convert</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Enter amount in ${inputIsEur ? 'EUR' : 'USD'}`}
            step="0.01"
          />
        </div>

        <div className="currency-switch">
          <span>Converting: {inputIsEur ? 'EUR → USD' : 'USD → EUR'}</span>
          <button className="switch-btn" onClick={handleCurrencySwitch}>
            Switch Currency
          </button>
        </div>

        {amount && !isNaN(parseFloat(amount)) && (
          <div className="result-display">
            <div className="rate-label">Converted Amount</div>
            <div className="result-value">
              {calculateConversion().toFixed(2)} {inputIsEur ? 'USD' : 'EUR'}
            </div>
          </div>
        )}

        <button 
          className="switch-btn" 
          onClick={handleConvert}
          style={{ marginTop: '16px', width: '100%' }}
        >
          Add to History
        </button>
      </div>

      {/* manual override section */}
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Manual Rate Override</h3>
        <div className="override-controls">
          <div className="input-group">
            <label>Custom Exchange Rate</label>
            <input
              type="number"
              value={overrideRate}
              onChange={(e) => setOverrideRate(e.target.value)}
              placeholder="Enter custom rate"
              step="0.0001"
            />
          </div>
          <button
            className={`toggle-btn ${isOverrideActive ? 'active' : 'inactive'}`}
            onClick={toggleOverride}
            disabled={!overrideRate}
          >
            {isOverrideActive ? 'Deactivate' : 'Activate'} Override
          </button>
        </div>
        <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Override will auto-deactivate if real rate differs by 2% or more
        </p>
      </div>

      {/* history table */}
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Conversion History</h3>
        {history.length === 0 ? (
          <div className="empty-state">
            No conversions yet. Enter an amount and click "Add to History" to start.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Real Rate</th>
                <th>Override</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record.id}>
                  <td>{record.realRate.toFixed(4)}</td>
                  <td>{record.overrideRate ? record.overrideRate.toFixed(4) : '-'}</td>
                  <td>
                    {record.fromAmount.toFixed(2)} {record.fromCurrency}
                  </td>
                  <td>
                    {record.toAmount.toFixed(2)} {record.toCurrency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
