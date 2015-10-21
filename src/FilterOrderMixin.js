
export default Base => class FilterOrderStore extends Base {
    constructor(...props) {
        super(...props)
        this.filters = {}
        this.defaultComparator = this.defaultComparator.bind(this)
        this.order = this.defaultComparator
        this.checkItem = this.checkItem.bind(this)
        this.cached = false
        this._sync = false
    }

    get sync() {
        return this._sync
    }

    set sync(value) {
        this._sync = value
        if (!value) {
            this.emit('change')
        }
    }

    addFilter(name, callback) {
        this.filters[name] = callback
        this.sync = false
    }

    insert(...props) {
        super.insert(...props)
        this.sync = false
    }

    update(...props) {
        super.update(...props)
        this.sync = false
    }

    delete(...props) {
        super.delete(...props)
        this.sync = false
    }

    setState(...props) {
        super.setState(props)
    }

    removeFilter(nane) {
        delete this.filters[name]
        this.sync = false
    }

    setOrder(callback) {
        this.order = callback
        this.sync = false
    }

    resetOrder() {
        this.order = this.defaultComparator
        this.sync = false
    }

    getData() {
        if (!this.cached || !this.sync) {
            this.data = this.state.slice().filter(this.checkItem).sort(this.order)
            this.sync = true
        }

        return this.data
    }

    checkItem(item) {
        let needed = true
        Object.keys(this.filters).forEach(key => {
            if (needed) {
                needed = this.filters[key](item)
            }
        })
        return needed
    }

    defaultComparator(obj1, obj2) {
        if (obj1[this.idProperty] < obj2[this.idProperty]) {
            return -1;
        }
        if (obj1[this.idProperty] < obj2[this.idProperty]) {
            return 1;
        }
        // a must be equal to b
        return 0;
    }
}