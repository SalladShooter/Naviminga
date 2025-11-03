fetch('dictionary.txt')
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.text();
  })
  .then(text => {
    const lines = text.split('\n').filter(line => line.trim() !== '');

    const items = lines.map(line => {
      const parts = line.split(',');
      return {
        part1: parts[0] ? parts[0].trim() : '',
        part2: parts[1] ? parts[1].trim() : '',
        group: parts[2] ? parts[2].trim() : ''
      };
    });

    const dictionaryDiv = document.querySelector('.dictionary');
    dictionaryDiv.innerHTML = `
      <div class="searchCont">
        <label for="search">Search Word</label>
        <input type="text" id="search" class="search" name="search" autocomplete="off" />
      </div>
    `;

    const tableContainer = document.createElement('div');

    const table = document.createElement('table');
    table.classList.add('table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Naviminga', 'English', 'Group'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    items.forEach(item => {
      const tr = document.createElement('tr');

      const td1 = document.createElement('td');
      td1.textContent = item.part1;
      tr.appendChild(td1);

      const td2 = document.createElement('td');
      td2.textContent = item.part2;
      tr.appendChild(td2);

      const td3 = document.createElement('td');
      td3.textContent = item.group;
      tr.appendChild(td3);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    dictionaryDiv.appendChild(tableContainer);

    const searchInput = document.getElementById('search');

    function resetHighlights() {
      Array.from(tbody.rows).forEach(row => {
        row.style.display = '';
        Array.from(row.cells).forEach(td => {
          td.innerHTML = td.textContent;
        });
      });
    }

    function highlightText(text, query) {
      if (!query) return text;
      const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    }

    function escapeRegExp(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();

      if (!query) {
        resetHighlights();
        return;
      }

      let firstMatchRow = null;

      Array.from(tbody.rows).forEach(row => {
        let showRow = false;

        Array.from(row.cells).forEach(td => {
          const text = td.textContent.toLowerCase();
          if (text.includes(query)) {
            td.innerHTML = highlightText(td.textContent, query);
            showRow = true;
          } else {
            td.innerHTML = td.textContent;
          }
        });

        if (showRow) {
          row.style.display = '';
          if (!firstMatchRow) firstMatchRow = row;
        } else {
          row.style.display = 'none';
        }
      });

      if (firstMatchRow) {
        firstMatchRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  })
  .catch(error => {
    console.error('Error fetching the file:', error);
  });

