let habbits = [
	{
		"id": 1,
		"icon": "strong",
		"name": "Гантеля",
		"header": "Отжимания",
		"days": [
			{
				comment: 'Первый подход всегда даётся тяжело'
			},
			{
				comment: 'Второй подход всегда даётся тяжело'
			},
		],
		"target": 10
	},
	{
		"id": 2,
		"icon": "water",
		"name": "Вода",
		"header": "Плаванье",
		"days": [
			{
				comment: 'Первый подход всегда даётся тяжело'
			},
			{
				comment: 'Второй подход всегда даётся тяжело'
			},
		],
		"target": 10
	},
	{
		"id": 3,
		"icon": "food",
		"name": "Еда",
		"header": "Правильное питание",
		"days": [
			{
				comment: 'Первый подход всегда даётся тяжело'
			},
			{
				comment: 'Второй подход всегда даётся тяжело'
			},
			{
				comment: 'Третий подход всегда даётся тяжело'
			}
		],
		"target": 10
	}
]

const HABBIT_KEY = 'HABBIT_KEY'
let globalActiveHabbitId = 1

const page = {
	menu: document.querySelector('.menu__list'),
	header: {
		h1: document.querySelector('.h1'),
		progressNum: document.querySelector('.progress__text_procent'),
		progressBar: document.querySelector('.progress__bar_cover')
	},
	content: {
		daysContainer: document.querySelector('#days'),
		nextDay: document.querySelector('.tasks__day')
	}
}

function loadData() {
	const habbitsString = localStorage.getItem(HABBIT_KEY)
	const habbitArr = JSON.parse(habbitsString)
	if (Array.isArray(habbitArr)) {
		habbits = habbitArr
	}
}

function saveData() {
	localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits))
}

function rerenderMenu(activeHabbit) {
	for (const habbit of habbits) {
		const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`)
		if (!existed) {
			const element = document.createElement('button')
			element.setAttribute('menu-habbit-id', habbit.id)
			element.classList.add('menu__item')
			element.addEventListener('click', () => rerender(habbit.id))
			element.innerHTML = `<img src="./img/${habbit.icon}.svg" alt="${habbit.name}" />`
			if (activeHabbit.id === habbit.id) {
				element.classList.add('menu__item_active')
			}
			page.menu.append(element)
			continue
		}
		if (activeHabbit.id === habbit.id) {
			existed.classList.add('menu__item_active')
		} else existed.classList.remove('menu__item_active')
	}
	localStorage.setItem('active', globalActiveHabbitId)
	document.querySelector('.comment__text').classList.remove('error')
}

function rerenderHead(activeHabbit) {
	page.header.h1.textContent = activeHabbit.header
	const progress = activeHabbit.days.length / activeHabbit.target > 1
		? 100
		: activeHabbit.days.length / activeHabbit.target * 100
	page.header.progressNum.textContent = progress.toFixed(0) + '%'
	page.header.progressBar.style.width = `${progress}%`
}

function rerenderContent(activeHabbit) {
	page.content.daysContainer.innerHTML = ''
	for (const index in activeHabbit.days) {
		const element = document.createElement('div')
		element.classList.add('tasks')
		element.innerHTML = `
		<div class="tasks__day">День ${Number(index) + 1}</div>
		<div class="tasks__info">
			<div class="tasks__info_text">
				${activeHabbit.days[index].comment}
			</div>
		<img 
			class="delete" 
			src="./img/delete.svg" 
			alt="удалить" 
			onclick="deleteTask(${index})"
		/>
		</div>
		`
		page.content.daysContainer.append(element)

	}
	page.content.nextDay.textContent = `День ${activeHabbit.days.length + 1}`

}

function addDays(e) {
	e.preventDefault()
	const form = e.target
	const data = new FormData(form)
	const comment = data.get('comment')
	form['comment'].classList.remove('error')
	if (!comment) {
		form['comment'].classList.add('error')
		return
	}
	habbits = habbits.map(habbit => {
		if (habbit.id === globalActiveHabbitId) {
			return {
				...habbit,
				days: habbit.days.concat([{ comment }])
			}
		}
		return habbit
	})
	form['comment'].value = ''
	rerender(globalActiveHabbitId)
	saveData()
}

function deleteTask(index) {
	habbits = habbits.map(habbit => {
		if (habbit.id === globalActiveHabbitId) {
			habbit.days.splice(index, 1)
			return {
				...habbit,
				days: habbit.days
			}
		}
		return habbit
	})
	rerender(globalActiveHabbitId)
	saveData()
}

function rerender(activeHabbitId) {
	globalActiveHabbitId = activeHabbitId
	const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId)
	if (!activeHabbit) {
		return
	}
	rerenderMenu(activeHabbit)
	rerenderHead(activeHabbit)
	rerenderContent(activeHabbit)
}

(() => {
	loadData()
	rerender(localStorage.getItem('active') ? Number(localStorage.getItem('active')) : 1)
})()