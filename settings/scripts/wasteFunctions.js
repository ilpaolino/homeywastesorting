(function(global) {
  // Crea (o recupera) il namespace wasteSortingApp
  global.wasteSortingApp = global.wasteSortingApp || {};

  // Factory che crea e restituisce il modulo per la gestione dei tipi di rifiuto.
  // Riceve l'oggetto Homey come parametro.
  function createWasteFunctions(Homey) {
    let wasteTypes = [];

    function loadWasteTypes(callback) {
      Homey.get('wasteTypes', function(err, types) {
        if (err || !types) {
          types = [];
        }
        wasteTypes = types;
        if (callback) callback(wasteTypes);
      });
    }

    function saveWasteTypes(callback) {
      Homey.set('wasteTypes', wasteTypes, function(err) {
        if (err) {
          Homey.alert(err);
        } else {
          Homey.alert(Homey.__('app.settings_saved'));
          if (callback) callback();
        }
      });
    }

    function renderWasteTypes() {
      const container = document.getElementById('waste-list');
      const inputFieldNew = document.getElementById('new-waste-input');
      const addBtn = document.getElementById('add-waste-btn');
      container.innerHTML = '';
      wasteTypes.forEach(function(item, index) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'waste-item';
        itemDiv.setAttribute('data-index', index);

        const labelSpan = document.createElement('span');
        labelSpan.className = 'waste-label';
        labelSpan.textContent = item.label;
        itemDiv.appendChild(labelSpan);

        // Bottone per modificare il tipo di rifiuto
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-waste-btn';
        editBtn.title = Homey.__('app.waste_edit');
        // Qui puoi sostituire il testo con un'icona (ad es. pencilSvg) se disponibile
        editBtn.innerHTML = iconEdit;
        itemDiv.appendChild(editBtn);

        // Bottone per eliminare il tipo di rifiuto
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-waste-btn';
        deleteBtn.title = Homey.__('app.waste_delete');
        deleteBtn.innerHTML = iconTrash;
        itemDiv.appendChild(deleteBtn);

        container.appendChild(itemDiv);

        // Gestione evento: modifica
        editBtn.addEventListener('click', function() {
          if (!itemDiv.querySelector('input')) {
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.className = 'homey-form-input';
            inputField.value = item.label;
            itemDiv.replaceChild(inputField, labelSpan);
            editBtn.innerHTML = iconCheck;
            editBtn.classList.add('confirm-homey-style');
          } else {
            const inputField = itemDiv.querySelector('input');
            const newLabel = inputField.value.trim();
            if (newLabel !== '') {
              wasteTypes[index].label = newLabel;
              saveWasteTypes(renderWasteTypes);
              editBtn.classList.remove('confirm-homey-style')
            } else {
              Homey.alert(Homey.__('app.waste_input_can_not_be_empty'));
            }
          }
        });

        // Gestione evento: elimina
        deleteBtn.addEventListener('click', function() {
          wasteTypes.splice(index, 1);
          saveWasteTypes(renderWasteTypes);
        });
      });

      // Gestione evento: aggiungi
      addBtn.addEventListener('click', function() {
        const newLabel = inputFieldNew.value.trim();
        if (newLabel !== '') {
          wasteTypes.push({ label: newLabel });
          saveWasteTypes(renderWasteTypes);
          inputFieldNew.value = '';
        } else {
          Homey.alert(Homey.__('app.waste_input_can_not_be_empty'));
        }
      });
    }

    return {
      load: loadWasteTypes,
      save: saveWasteTypes,
      render: renderWasteTypes
    };
  }

  // Esponi la factory nel namespace wasteSortingApp
  global.wasteSortingApp.createWasteFunctions = createWasteFunctions;
})(window);
