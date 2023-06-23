import { Component } from "solid-js";

interface InfoProps {
    title: string;
    message: string;
}

const Info: Component<InfoProps> = (props) => {
    return(
        <div class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{props.title}</h5>
            </div>
            <p class="mb-1">{props.message}</p>
        </div>
    );
}

export default Info;