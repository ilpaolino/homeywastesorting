function loadScriptsSequentially(scripts, callback) {
  let index = 0;
  function loadNext() {
    if (index < scripts.length) {
      const script = document.createElement('script');
      script.src = scripts[index];
      script.onload = function() {
        console.log(scripts[index] + " caricato correttamente.");
        index++;
        loadNext();
      };
      script.onerror = function() {
        console.error("Errore nel caricamento di " + scripts[index]);
        index++;
        loadNext();
      };
      document.body.appendChild(script);
    } else {
      callback();
    }
  }
  loadNext();
}
