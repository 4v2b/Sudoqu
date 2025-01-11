document.addEventListener('DOMContentLoaded', (event) => {
    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');
    toggle.checked = false;
    if (window.localStorage.getItem('theme') !== 'dark') {
        root.style.setProperty('--primary', '#ffffff');
        root.style.setProperty('--secondary', '#000000');
        root.style.setProperty('--alternative', '#ddd');
        root.style.setProperty('--error', '#DE3163');
        root.style.setProperty('--success', '#99F762');
        window.localStorage.setItem('theme', 'light');
        toggle.checked = false;
    } else {
        root.style.setProperty('--primary', '#121212');
        root.style.setProperty('--secondary', '#ddd');
        root.style.setProperty('--alternative', '#444444');
        root.style.setProperty('--error', '#640023');
        root.style.setProperty('--success', '#00796B');
        window.localStorage.setItem('theme', 'dark');
        toggle.checked = true;
    }

    const data = document.getElementById('data-container').getAttribute("data-message")
    const sol = document.getElementById('solve')

    if (document.getElementById('data-container1').getAttribute("data-message") == '') {
        showDialog("Oops. The puzzle doesn't have any solution")
        sol.style.backgroundColor = 'var(--error)'
        sol.onclick = null;
    } else {
        sol.onclick = solve
    }

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

                    cell.className = 'cell-container';
                    const content = document.createElement('div')
                    content.className = 'cell';

                    const sectionRow = i;
                    const sectionCol = j;
                    const cellRow = k;
                    const cellCol = l;

                    const globalRow = sectionRow * 3 + cellRow;
                    const globalCol = sectionCol * 3 + cellCol;
                    const index = globalRow * 9 + globalCol;

                    content.id = data[index * 3] + data[index * 3 + 1]
                    content.style.fontSize = '0em'

                    if (data[index * 3 + 2] != '0') {
                        content.classList.add('static');
                        content.innerHTML = data[index * 3 + 2];
                    } else {
                        content.innerHTML = '\u00A0';
                    }

                    setTimeout(h => {
                        content.animate([{ fontSize: '1em' }], {
                            duration: 100,
                            fill: 'forwards',
                        });
                    }, Math.ceil(Math.pow((Math.random() * 20), 2)));
                    cell.appendChild(content);
                    row.appendChild(cell);
                }
                boxTable.appendChild(row);
            }
            box.appendChild(boxTable);
            gameRow.appendChild(box);
        }
        table.appendChild(gameRow);
    }

    let current = -1;
    let focusedCell = '';



    document.getElementById('verify').addEventListener('click', async function (e) {

        focusedCell = ''

        let isReady = true;

        let str = ""

        let pulseAnimation = { direction: "normal", duration: 2000, iterations: 1, fill: 'backwards' }

        let keyframes = [{
            backgroundColor: 'var(--primary)',
            borderRadius: '2em',
            color: 'var(--secondary)'
        }, {
            backgroundColor: 'var(--error)',
            color: 'var(--secondary)',
            borderRadius: '2em',
        }, {
            backgroundColor: 'var(--primary)',
            borderRadius: '2em',
            color: 'var(--secondary)'
        }]
        Array.from(document.getElementsByClassName('cell')).forEach(
            function (e) {
                if (!Number(e.innerHTML)) {

                    e.animate(keyframes, pulseAnimation)
                    //e.classList.add('error');
                    isReady = false;
                    str += e.id + "0"
                } else {
                    str += e.id + e.innerHTML
                }
            })


        if (isReady) {
            try {
                const response = await fetch('/api/validate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ raw: str })
                });

                const data = await response.json();

                if (data.success) {
                    let success = true;
                    const values = data.result;
                    for (let i = 0; i < values.length; i += 3) {

                        console.log(values[i] + values[i + 1] + " - " + (values[i + 2]))
                        if (values[i + 2] == '0') {
                            success = false;

                            const cell = document.getElementById(values[i] + values[i + 1])

                            if (!cell.classList.contains('static')) {
                                cell.animate(keyframes, pulseAnimation)
                            }
                        }
                    }
                    if (success) {
                        document.getElementById('verify').animate([{
                            backgroundColor: 'var(--alternative)',
                            color: 'var(--secondary)'
                        }, {
                            backgroundColor: 'var(--success)',
                            color: 'var(--secondary)',
                        }, {
                            backgroundColor: 'var(--alternative)',
                            color: 'var(--secondary)'
                        }], { direction: "normal", duration: 500, iterations: 1, fill: 'backwards' })
                    }
                }
            } catch (error) {
                console.error("Error verifying Sudoku:", error);
            }
        }
    })

    async function solve (e) {

        focusedCell = ''

        try {
            const response = await fetch('/api/solve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    raw: document.getElementById('data-container1').getAttribute("data-message")
                })
            });

            const responseJson = await response.json();

            if (responseJson.success) {
                const values = responseJson.result;
                for (let i = 0; i < values.length; i += 3) {

                    console.log(values[i] + values[i + 1] + " - " + (values[i + 2]))
                    const cell = document.getElementById(values[i] + values[i + 1])

                    if (!cell.classList.contains('static')) {
                        cell.style.fontSize = '0em'
                        setTimeout(h => {
                            cell.innerHTML = values[i + 2];

                            cell.animate([{ fontSize: '1em' }], {
                                duration: 100,
                                fill: 'forwards',
                            });

                        }, Math.ceil(Math.pow((Math.random() * 20), 2)));
                    }
                }
            }
            else throw new Error(responseJson.message);
        } catch (error) {
            showDialog(`Oops. ${error.message}`);
        }
    }

    function showDialog(message) {
        const dialog = document.getElementById('dialog');
        dialog.innerHTML = `${message}`;
        dialog.style.display = 'block';
        dialog.animate([{ opacity: 0, offset: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1, offset: 0.8 }, { opacity: 0, offset: 0.9 }], { fill: 'forwards', duration: 5000, iterations: 1, direction: 'normal' })
        setTimeout(h => dialog.style.display = 'none', 5000);
    }

    Array.from(document.getElementsByClassName('cell')).forEach(
        function (el) {
            el.addEventListener('click', function (e) {
                if (!e.target.classList.contains('focus')) {
                    focusedCell = el.id
                    e.target.classList.remove('error');
                } else {
                    focusedCell = ''
                }

                if (!e.target.classList.contains('static')) {
                    if (current > 0) {
                        e.target.innerText = current;
                    } else if (current == 0) {
                        e.target.innerText = "\u00A0"
                        e.target.classList.remove('error');
                    }
                }

                Array.from(document.getElementsByClassName('cell')).forEach(
                    function (eg) {
                        eg.classList.remove('focus')

                        if ((eg.innerText == e.target.innerText
                            && Number(e.target.innerText) > 0
                        ) && ((current == Number(e.target.innerText)
                            && current > 0) || (focusedCell != '' && current <= 0))) {
                            eg.classList.add('hover');
                        } else {
                            eg.classList.remove('hover')
                        }
                    }
                )

                if (el.id == focusedCell) {
                    e.target.classList.add('focus')
                    e.target.classList.remove('hover');
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
        btn.className = 'btn'
        panel.appendChild(btn)
        btn.addEventListener('click', handleClick)
    }

    function handleClick(event) {
        const old = current;
        const value = event.target.innerText

        if (isNaN(value)) {
            current = 0;
        } else {
            current = Number(value)
        }
        if (old != current) {
            if (old >= 0) {
                document.getElementById(`btn-${old}`).className = 'btn'
            }
            document.getElementById(`btn-${current}`).className = 'btn-active'
            if (focusedCell) {
                if (current == 0) {
                    document.getElementById(focusedCell).innerHTML = '\u00A0'
                    document.getElementById(focusedCell).classList.remove('error');
                } else {
                    document.getElementById(focusedCell).innerHTML = current
                    document.getElementById(focusedCell).classList.remove('error');
                }
                document.getElementById(`btn-${current}`).className = 'btn-active'
                document.getElementById(`btn-${current}`).className = 'btn'
            }

        } else if (current >= 0 && old == current) {
            document.getElementById(`btn-${current}`).className = 'btn'
        }

        Array.from(document.getElementsByClassName('cell')).forEach(
            function (e) {
                if (!(document.getElementById(focusedCell)?.innerHTML == e.innerHTML && Number(e.innerHTML) > 0))
                    e.classList.remove('hover');
            }
        )

        current = document.getElementById(`btn-${current}`).className == 'btn' ? -1 : current

        Array.from(document.getElementsByClassName('cell')).forEach(
            function (e) {
                if ((e.innerText == current && current > 0) || (document.getElementById(focusedCell)?.innerHTML == e.innerHTML && Number(e.innerHTML) > 0)) {
                    e.classList.add('hover');
                } else {
                    e.classList.remove('hover');
                }
            }
        )
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