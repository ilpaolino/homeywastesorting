(function(global) {
  // Crea (o recupera) il namespace wasteSortingApp
  global.wasteSortingApp = global.wasteSortingApp || {};

  // Factory che crea il modulo per la gestione delle cadenze di ritiro.
  // Riceve l'oggetto Homey come parametro.
  function createScheduleFunctions(Homey) {
    let schedules = [];

    function loadSchedules(callback) {
      Homey.get('pickupSchedules', function(err, savedSchedules) {
        if (err || !savedSchedules) {
          savedSchedules = [];
        }
        schedules = savedSchedules;
        if (callback) callback(schedules);
      });
    }

    function saveSchedules(callback) {
      Homey.set('pickupSchedules', schedules, function(err) {
        if (err) {
          Homey.alert(err);
        } else {
          Homey.alert(Homey.__('app.settings_saved'));
          if (callback) callback();
        }
      });
    }

    function renderSchedules() {
      const container = document.getElementById('schedule-list');
      container.innerHTML = '';
      schedules.forEach(function(item, index) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'schedule-item';
        itemDiv.setAttribute('data-index', index);

        if (item.editing) {
          // Modalità modifica: qui potresti creare campi input/select e bottoni di conferma/annulla
          const editingText = document.createElement('span');
          editingText.textContent = "Modalità modifica non implementata";
          itemDiv.appendChild(editingText);
        } else {
          const summary = document.createElement('span');
          summary.className = 'schedule-summary';
          // Componi il riepilogo usando le traduzioni di Homey
          let summaryText = Homey.__('days.' + item.day) + ' - ' +
            Homey.__('frequency.' + item.frequency) +
            ' - Settimana: ' + item.startWeek +
            ' - Giorno: ' + item.dayOfMonth;
          summary.textContent = summaryText;
          itemDiv.appendChild(summary);

          // Bottone per modificare
          const editBtn = document.createElement('button');
          editBtn.className = 'edit-schedule-btn';
          editBtn.title = 'Modifica';
          editBtn.innerHTML = pencilSvg; // Assicurati che pencilSvg sia definito globalmente
          itemDiv.appendChild(editBtn);

          // Bottone per eliminare
          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'delete-schedule-btn';
          deleteBtn.title = 'Elimina';
          deleteBtn.innerHTML = trashSvg; // Assicurati che trashSvg sia definito globalmente
          itemDiv.appendChild(deleteBtn);

          // Gestione evento modifica: attiva la modalità di editing
          editBtn.addEventListener('click', function() {
            schedules[index].editing = true;
            renderSchedules();
          });

          // Gestione evento elimina: rimuove la cadenza e salva
          deleteBtn.addEventListener('click', function() {
            schedules.splice(index, 1);
            saveSchedules(renderSchedules);
          });
        }
        container.appendChild(itemDiv);
      });
    }

    return {
      load: loadSchedules,
      save: saveSchedules,
      render: renderSchedules
    };
  }

  // Esponi la factory nel namespace wasteSortingApp
  global.wasteSortingApp.createScheduleFunctions = createScheduleFunctions;
})(window);
