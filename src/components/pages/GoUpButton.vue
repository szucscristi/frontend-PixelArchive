<template>
    <button class="go-up" @click="$emit('go-up')" aria-label="Go Up">▲</button>
  </template>
  
  <script>
  export default {
    name: 'GoUpButton'
  };
  </script>
  
  <style scoped>
  .go-up {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    width: 3rem;
    height: 3rem;
    background-color: #444;
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.25rem;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    transition: background-color 0.2s;
  }
  .go-up:hover {
    background-color: #666;
  }
  </style>
  