import { For, Show, createSignal, onMount } from 'solid-js';
import type { Component } from 'solid-js';
import * as bootstrap from 'bootstrap';
import './style.scss';
import Message from './Message';
import { Socket, io } from "socket.io-client";
import Info from './Info';

interface Message {
  message: string;
  username: string;
}

const App: Component = () => {
  const [messages, setMessages] = createSignal<Message[]>([])
  const [ready, setReady] = createSignal(false);
  const [think, setThink] = createSignal(false);
  let socket: Socket;
  let inputBox: HTMLInputElement;

  const sendMessage = () => {
    console.log(inputBox.value);
    socket.emit('message', { sessionId: 'my-session-key', message: inputBox.value });
    setMessages((prev) => [...prev, { message: inputBox.value, username: 'You' }]);
    inputBox.value = '';
    inputBox.disabled = true;
    setThink(true);
  }

  onMount(async () => {
    socket = io('http://127.0.0.1:5000');
    socket.on('connect', () => {
      // Send session-id id to the server
      socket.emit('register-session', window.crypto.randomUUID());
    });

    socket.on('messages', (data) => {
      setThink(false);
      setMessages(data);
      inputBox.disabled = false;
    });

    socket.on('session-registered', () => {
      setReady(true);
    })
  });

  return (
    <>
      <div class='container'>
        <div class='row'>
          <h1 class='text-center'>Fifa 23 Transfer Bot</h1>
          <small class='text-center'>by flaver</small>
          <hr />
          <div class='infos mb-3'>
            <p class='h3 text-center'>Important information's about the project</p>
            <div class="list-group list-group-horizontal">
              <Info title={'Session'} message={`This bot has a basic session function. It will not remember the previous asked question. This is due to limited time`} />
              <Info title={'Data'} message={`This bot uses the default OpenAI dataset. It can happen that you will be given players that are now a different age, or there market value has changed.`} />
            </div>
          </div>
          <hr />
          <div class='content overflow-auto'>
            <For each={messages()}>{(message, i) =>
              <Message username={message.username} message={message.message} />
            }
            </For>
            <Show when={!ready()}>
              <div class='loader text-center'>
                <div class="spinner-grow text-primary ml-5" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-secondary ml-5" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-success ml-5" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-danger ml-5" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-warning ml-5" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-info ml-5" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-light ml-5" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-dark ml-5" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </Show>
          </div>
          <div class='fixed-bottom'>
            <form onsubmit={(e) => e.preventDefault()}>
              <input type="text" class='form-control mb-2' placeholder='What is the best com for 100000?' ref={inputBox} />
              <button class='btn btn-primary mt-2 mb-3' onclick={sendMessage}>Send</button>
              <Show when={think()}>
                <div class="spinner-border bot-spinner" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </Show>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
