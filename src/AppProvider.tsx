import {
    createContext,
    ParentProps,
} from "solid-js";
import { createStore, reconcile } from "solid-js/store";

interface DatabaseData {
    tables?: Record<string, {
        rows: Array<Array<any>>,
        columns: Array<any>
    }>
}

interface State {
    ui?: {
        connected?: boolean,
        tabs: Array<string>,
        dataPanel?: {
            table: string,
            id: any,
            index: number
        }
    },
    database: DatabaseData
}

interface Actions {
    updateConnection: (status: boolean) => void
    updateDatabase: (database: DatabaseData) => void
    //UI
    openTab: (tab: string) => void
    openDataPanel: (table: string, id: any, index: number) => void
}

type Store = [State, Actions];

const initialState: State = {
    ui: {
        connected: undefined,
        tabs: [],
        dataPanel: undefined,
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
            updateDatabase: (database: DatabaseData) => {
                setState('database', reconcile(database, { merge: true }))
            },
            openTab: (tab: string) => {
                setState('ui', 'tabs', (tabs) => [...tabs, tab])
            },
            openDataPanel: (table, id, index) => {
                setState('ui', 'dataPanel', () => ({ table, id, index }))
            },
        }
    ];

    return (
        <AppContext.Provider value={store}>{props.children}</AppContext.Provider>
    );
}