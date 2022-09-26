import {
    createContext,
    ParentProps,
} from "solid-js";
import { createStore, reconcile } from "solid-js/store";

interface State {
    ui: {
        connected: boolean | null,
        tabs: Array<string>
    },
    database: Record<string, any>
}

interface Actions {
    updateConnection: (status: boolean) => void
    updateDatabase: (database: Record<string, any>) => void
    //UI
    openTab: (tab: string) => void
}

type Store = [State, Actions];

const initialState: State = {
    ui: {
        connected: null,
        tabs: []
    },
    database: {}
};

const initialStore: Store = [initialState, {} as Actions];
export const AppContext = createContext(initialStore);

export function AppProvider(props: ParentProps<{}>) {
    const [state, setState] = createStore(initialState);
    const store: Store = [
        state as State,
        {
            updateConnection: (status) => {
                setState('ui', 'connected', () => status);
            },
            updateDatabase: (database: Record<string, any>) => {
                setState('database', reconcile(database, { merge: true }))
            },
            openTab: (tab: string) => {
                setState('ui', 'tabs', (tabs) => [...tabs, tab])
            }
        }
    ];

    return (
        <AppContext.Provider value={store}>{props.children}</AppContext.Provider>
    );
}