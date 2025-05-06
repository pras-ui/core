import * as React from "react";

type StateFlowConfig = {
  [key: string]: { [key: string]: string };
};

type UseStateFlowReturn = [string, (action: string) => void];

export function useStateFlow(
  initialState: string,
  config: StateFlowConfig
): UseStateFlowReturn {
  // Reducer to handle state transitions
  const stateReducer = (state: string, actionType: string) => {
    const nextState = config[state]?.[actionType];
    if (!nextState) return state;
    return nextState;
  };

  // Use reducer to manage state transitions
  const [state, dispatch] = React.useReducer(stateReducer, initialState);

  // Dispatch helper
  const send = React.useCallback(
    (actionType: string) => {
      dispatch(actionType);
    },
    [dispatch]
  );

  return [state, send];
}
