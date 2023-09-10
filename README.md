# php-webrtc-signaling-server

PHP *WebRTC Signaling Server* based on a simple shared message box script.

The box should be as simple as [Pantry](https://getpantry.cloud/) or [JSONBIN.io](https://jsonbin.io/).

The idea is based on [webrtc-php](https://github.com/nielsbaloe/webrtc-php).

## NOTE

THIS IS A WORK IN PROGRESS.

Currently only the message box is implemented.
This is sufficent to act as a Signaling Server.
But an implementation that uses this Box as a Signaling Server to establish a WebRTC connection will follow.

## The Problem

All the tutorials on WebRTC skip the part on how to setup a signaling server.

There are many webhosting providers that have PHP enabled.
There should be a simple script that takes care of this job.

## The Solution

This script provides a simple message box.
Two parties may exchange messages by sharing a link to a box.
This box is used to negotiate/setup the WebRTC Connection.

## Functionality

The goal is to be as simple as possible.

1. Alice creates a box and sends the URL to her box to Bob (via Mail, Instant Messanger, etc.).
2. Bob creates a box and stores the URL to his box in Alices box.
3. Alice is informed (polls) that she has a message in her Box.
4. Now Alice and Bob can put messages into each others Boxes.

## Implementation

### Concept

* A "box" is the php session.
* Instead of a cookie, the URL contains the session id.
* To keep things simple, clients poll for messages.

### API

There are two parameters:

1. `box` - the id of the box (session id)
2. `msg` - a message to be stored in the box

Using these there are three actions:

1. no parameter - create a new box
    * answers with a `created` response-type and the box id as `data`.
    * exits
2. `box` and `msg` - store a new message in the box.
   * answers wit an `ack` response-type and the amount of messages in the box.
     * Should be >= 1.
   * exits
3. `box` only - retrieve all messages from the box and clear it
   * answers with a `msgs` response-type and with all messages as an array.
   * exits
