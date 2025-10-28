fetch('dictionary.txt')
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.text();
  })
  .then(text => {
    const lines = text.split('\n');

    if (lines.length > 0 && lines[lines.length - 1].trim() === '') {
      lines.pop();
    }

    const items = lines.map(line => {
      const parts = line.split(',');
      return {
        part1: parts[0] ? parts[0].trim() : '',
        part2: parts[1] ? parts[1].trim() : '',
        group: parts[2] ? parts[2].trim() : ''
      };
    });

    function capitalizeFirstLetter(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const grouped = items.reduce((acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    }, {});

    Object.keys(grouped).forEach(groupKey => {
      const container = document.createElement('div');

      const caption = document.createElement('button');
      caption.textContent = capitalizeFirstLetter(groupKey || '(No Group)');
      caption.classList.add('button');

      const table = document.createElement('table');
      table.classList.add('table')

      const tbody = document.createElement('tbody');

      grouped[groupKey].forEach(item => {
        const tr = document.createElement('tr');

        const td1 = document.createElement('td');
        td1.textContent = item.part1;
        tr.appendChild(td1);

        const td2 = document.createElement('td');
        td2.textContent = item.part2;
        tr.appendChild(td2);

        tbody.appendChild(tr);
      });

      table.appendChild(tbody);

      caption.addEventListener('click', () => {
        const isVisible = table.classList.toggle('show');
        caption.classList.toggle('active', isVisible);
      });

      container.appendChild(caption);
      container.appendChild(table);
      document.body.appendChild(container);
    });
  })
  .catch(error => {
    console.error('Error fetching the file:', error);
  });

