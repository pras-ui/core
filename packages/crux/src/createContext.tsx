import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

type ScopeContext = Record<string, { id: string; value: any }>;
export type Scope = Record<string, { id: string; value: any }>;

// Return types
type ScopeProvider<T> = React.FC<{
  /**
   * The ID of the scope.
   */
  scopeId: string;
  /**
   * The value of the scope.
   */
  value: T;
  /**
   * The children to be rendered.
   */
  children: ReactNode;
}>;

type UseScope<T> = (scope?: Scope) => T & { __scopeId: string };
type CreateScope = (scope?: Scope) => Scope;

type ContextScopeReturn<T> = readonly [
  ScopeProvider<T>,
  UseScope<T>,
  CreateScope
];

/**
 * Creates a React context scope, which is a context that can be composed with
 * other scopes.
 *
 * @example
 * const [MyScopeProvider, useMyScope] = createContextScope('MyScope');
 *
 * function MyProvider({ children }) {
 *   return (
 *     <MyScopeProvider value="Hello World">
 *       {children}
 *     </MyScopeProvider>
 *   );
 * }
 *
 * function MyComponent() {
 *   const myScope = useMyScope();
 *   return <div>{myScope}</div>;
 * }
 *
 * @param {string} scopeName - The name of the scope.
 * @param {CreateScope[]} [pluginScopes=[]] - An array of functions that create
 * plugin scopes. These scopes will be merged into the base scope.
 * @returns {ContextScopeReturn<OwnValue>} - An array with three values:
 *   - `ScopeProvider`: A React component that provides the scope.
 *   - `useScope`: A hook that returns the value of the scope.
 *   - `createScope`: A function that creates a new scope by merging the base
 * scope with the plugin scopes.
 */
export function createContextScope<OwnValue>(
  scopeName: string,
  pluginScopes: CreateScope[] = []
): ContextScopeReturn<OwnValue> {
  const BaseContext = createContext<ScopeContext>({});
  BaseContext.displayName = `${scopeName}ScopeContext`;

  const Provider: ScopeProvider<OwnValue> = (props) => {
    const parentScopes = useContext(BaseContext);
    const { scopeId, children, value } = props;

    const thisScope = useMemo(() => {
      return {
        [scopeName]: { id: scopeId, value },
      };
    }, [scopeId, value]);

    const mergedScopes = useMemo(
      () => ({
        ...parentScopes,
        ...thisScope,
      }),
      [parentScopes, thisScope]
    );

    return (
      <BaseContext.Provider value={mergedScopes}>
        {children}
      </BaseContext.Provider>
    );
  };

  const useScope = (scope?: Scope): OwnValue & { __scopeId: string } => {
    const currentScope = useContext(BaseContext);
    const target = scope?.[scopeName] ?? currentScope[scopeName];

    if (!target) {
      throw new Error(
        `[${scopeName}] context is missing. Make sure you are using the Provider.`
      );
    }

    return { ...target.value, __scopeId: target.id };
  };

  const createScope: CreateScope = (scope: Scope = {}) => {
    const baseScope = {
      ...scope,
      [scopeName]: useContext(BaseContext)[scopeName],
    };

    // Merge all plugin scopes into the base scope
    const extendedScope = pluginScopes.reduce(
      (acc, createPluginScope) => ({
        ...acc,
        ...createPluginScope(scope),
      }),
      baseScope
    );

    return extendedScope;
  };

  return [React.memo(Provider), useScope, createScope] as const;
}
