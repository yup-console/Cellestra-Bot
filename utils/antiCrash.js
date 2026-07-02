/** @format
 *
 * Fuego By Painfuego
 * Version: 6.0.0-beta
 * © 2024 1sT-Services
 */

module.exports = (client) => {
  client.log(`Loaded Anti-Crash Error Handler (UR, UE)`, "ready");

  process.on("unhandledRejection", (...args) => {
    const errorString = `${args}`;
    
    // Ignore common voice-related errors that are handled elsewhere
    const ignoredErrors = [
      "Player is already destroyed",
      "Cannot read properties of null",
      "Request failed with status code 400",
      "WebSocket was closed before the connection was established",
      "Voice connection not established within 15 seconds"
    ];
    
    if (ignoredErrors.some(ignored => errorString.includes(ignored))) {
      return;
    }
    
    client.log(`unhandledRejection ${args}`, "warn");
    console.log(...args);
  });
  process.on("uncaughtException", (...args) => {
    client.log(`uncaughtException ${args}`, "warn");
    console.log(...args);
  });
};
