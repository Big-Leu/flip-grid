function isDate(val) {
    // Cross realm comptatible
    return Object.prototype.toString.call(val) === '[object Date]'
}

function isObj(val) {
    return typeof val === 'object'
}

function stringifyValue(val) {
    if (isObj(val) && !isDate(val)) {
        return JSON.stringify(val)
    } else {
        return val
    }
}

function buildForm({ action, params }) {
    const form = document.createElement('form')
    form.setAttribute('method', 'post')
    form.setAttribute('action', action)

    Object.keys(params).forEach(key => {
        const input = document.createElement('input')
        input.setAttribute('type', 'hidden')
        input.setAttribute('name', key)
        input.setAttribute('value', stringifyValue(params[key]))
        form.appendChild(input)
    })

    return form
}

export function post(details) {
    console.log("posting")
    try{
        const form = buildForm(details)
    document.body.appendChild(form)
    form.submit();
    form.remove()
    } catch(e) {
        console.log('got an error',e);
    }
}