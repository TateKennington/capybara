import { invoke } from '@tauri-apps/api';
import { Component, useContext } from 'solid-js';
import { AppContext } from '../AppProvider';

const connect = async (url: string): Promise<void> => invoke("connect", { url })

const ConnectView: Component = () => {
    const [{ }, { updateConnection }] = useContext(AppContext);
    return <div onClick={async () => {
        console.log(updateConnection);
        await connect("postgres://test:testtest1234@localhost/test");
        updateConnection(true);

    }}>Connect</div>;
};

export default ConnectView;
