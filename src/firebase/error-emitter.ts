
import { EventEmitter } from 'events';

// This is a simple event emitter that can be used to broadcast errors
// from anywhere in the application.
// This is especially useful for handling errors that occur outside of
// React components, such as in utility functions or services.
export const errorEmitter = new EventEmitter();
