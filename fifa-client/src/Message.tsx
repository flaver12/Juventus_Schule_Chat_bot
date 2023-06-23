import { Component, Switch } from "solid-js";

interface MessageProps {
    username: string;
    message: string;
}

const Message: Component<MessageProps> = (props) => {
    const color = props.username === 'FifaBot' ? 'text-bg-primary' : 'text-bg-secondary'

    const classes = `${color} card mb-3`
    return(
        <>
            <div class={classes}>
                <div class="card-header">
                    {props.username}
                </div>
                <div class="card-body">
                    <p class="card-text" innerHTML={props.message}></p>
                </div>
            </div>
        </>
    );
}

export default Message;
