document.addEventListener('DOMContentLoaded', (event) => {
    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');
    toggle.checked = false;
    if (window.localStorage.getItem('theme') !== 'dark') {
        root.style.setProperty('--primary', '#ffffff');
        root.style.setProperty('--secondary', '#000000');
        root.style.setProperty('--alternative', '#ddd');
        window.localStorage.setItem('theme', 'light');
        toggle.checked = false;
    } else {
        root.style.setProperty('--primary', '#121212');
        root.style.setProperty('--secondary', '#ddd');
        root.style.setProperty('--alternative', '#444444');
        window.localStorage.setItem('theme', 'dark');
        toggle.checked = true;
    }

    const data = document.getElementById('data-container').getAttribute("data-message")

    let index = 0;

    const panel = document.getElementById("panel");
    const table = document.getElementById('table')

    for (let i = 0; i < 3; i++) {
        const gameRow = document.createElement('tr');

        for (let j = 0; j < 3; j++) {
            const box = document.createElement('td');
            box.className = 'box';

            const boxTable = document.createElement('table');
            boxTable.className = 'box-table';

            for (let k = 0; k < 3; k++) {
                const row = document.createElement('tr');
                row.className = 'row';

                for (let l = 0; l < 3; l++) {
                    const cell = document.createElement('td');
                    cell.className = 'cell';

                    // Calculate correct index in the data array
                    const sectionRow = i;         // Section's row index
                    const sectionCol = j;         // Section's column index
                    const cellRow = k;            // Row within the section
                    const cellCol = l;            // Column within the section

                    const globalRow = sectionRow * 3 + cellRow; // Global row in Sudoku grid
                    const globalCol = sectionCol * 3 + cellCol; // Global column in Sudoku grid
                    const index = globalRow * 9 + globalCol;    // 1D index in data array

                    if (data[index] != '.') {
                        cell.classList.add('static');
                        cell.innerHTML = data[index];
                    } else {
                        cell.innerHTML = '';
                    }
                    row.appendChild(cell);
                }
                boxTable.appendChild(row);
            }
            box.appendChild(boxTable);
            gameRow.appendChild(box);
        }
        table.appendChild(gameRow);
    }

    let current = 0;

    Array.from(document.getElementsByClassName('cell')).forEach(
        function (e, i) {
            e.addEventListener('click', function (e) {

                if (e.target.classList.contains('static')) {
                    return;
                }

                if (current > 0) {
                    e.target.classList.add('filled');
                    e.target.innerText = current;
                    e.target.classList.add('hover');
                } else {
                    e.target.classList.remove('filled');
                    e.target.classList.remove('hover');

                    e.target.innerText = ''
                }
            })
        }
    )


    const toggleTheme = () => {
        const isDarkTheme = window.localStorage.getItem('theme') == 'dark';

        if (isDarkTheme) {
            root.style.setProperty('--primary', '#ffffff');
            root.style.setProperty('--secondary', '#000000');
            root.style.setProperty('--alternative', '#ddd');
            window.localStorage.setItem('theme', 'light');
        } else {
            root.style.setProperty('--primary', '#121212');
            root.style.setProperty('--secondary', '#ddd');
            root.style.setProperty('--alternative', '#444444');
            window.localStorage.setItem('theme', 'dark');
        }
    };

    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    for (let i = 0; i < 10; i++) {
        const btn = document.createElement('div')
        btn.innerHTML = i > 0 ? `${i}` : '×'
        btn.id = `btn-${i}`
        btn.className = i > 0 ? 'btn' : 'btn-active'
        panel.appendChild(btn)
        btn.addEventListener('click', handleClick)
    }

    function handleClick(event) {
        const value = event.target.innerText
        document.getElementById(`btn-${current}`).className = 'btn'

        Array.from(document.getElementsByClassName('cell')).forEach(
            function (e) {
                e.classList.remove('hover');
            }
        )

        if (isNaN(value)) {
            current = 0;
        } else {
            current = Number(value)

            Array.from(document.getElementsByClassName('cell')).forEach(
                function (e) {
                    if (e.innerText == current) {
                        e.classList.add('hover');
                    }
                }
            )
        }

        document.getElementById(`btn-${current}`).className = 'btn-active'
        event.target.className = 'btn-active'

    }
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
        }
    });
});
