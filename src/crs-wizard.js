class Wizard extends HTMLElement {
    get body() {
        return this.getProperty("body", ".body");
    }

    set body(newValue) {
        this._body = newValue;
    }

    get heading() {
        return this.getProperty("heading", "h1");
    }

    set heading(newValue) {
        this._heading = newValue;
    }

    get btnNext() {
        return this.getProperty("btnNext", "#btnNext");
    }

    set btnNext(newValue) {
        this._btnNext = newValue;
    }

    get btnPrevious() {
        return this.getProperty("btnPrevious", "#btnPrevious");
    }

    set btnPrevious(newValue) {
        this._btnPrevious = newValue;
    }

    getProperty(property, query) {
        const field = `_${property}`;
        if (this[field] == null){
            this[field] = this.querySelector(query);
        }
        return this[field];
    }

    async connectedCallback() {
        this._previousId = [];

        const content = this.innerHTML;
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());

        this.body.innerHTML = content;

        this.nextHandler = this._next.bind(this);
        this.previousHandler = this._previous.bind(this);

        this.btnNext.addEventListener("click", this.nextHandler);
        this.btnPrevious.addEventListener("click", this.previousHandler);

        setTimeout(() => {
            requestAnimationFrame(() => this.gotoView(0));
        }, 0);
    }

    async disconnectedCallback() {
        delete this._previousId;

        this.body = null;
        this.heading = null;
        delete this.getNextId;

        this.btnNext.removeEventListener("click", this.nextHandler);
        this.btnPrevious.removeEventListener("click", this.previousHandler);

        this.btnNext = null;
        this.btnPrevious = null;

        this.nextHandler = null;
        this.previousHandler = null;
    }

    gotoView(id) {
        const target = this._body.querySelector(`[data-id="${id}"]`);
        if (target == null) return false;

        if (this._currentPage != null) {
            this._currentPage.setAttribute("hidden", "hidden");
        }

        this._currentPage = target;

        this._currentPage.removeAttribute("hidden");
        this.heading.innerText = this._currentPage.getAttribute("caption") || "";

        this._currentId = id;
        return true;
    }

    _next() {
        const currentId = this._currentId || 0;

        if (this.allowNext != null && this.allowNext(currentId) == false) return;

        const nextId = this.getNextId != null ? this.getNextId(currentId) : currentId + 1;

        if (nextId == -1 && this._isDialog == true) {
            delete this._isDialog;
            this.closeDialog();
            this.dispatchEvent(new CustomEvent("done"));
        }

        if (this.gotoView(nextId) == true) {
            this._previousId.push(currentId);
        }
        else {
            this.dispatchEvent(new CustomEvent("done"));
        }
    }

    _previous() {
        if (this.allowPrevious != null && this.allowPrevious(this._currentId) == false) return;

        if (this._previousId.length == 0) return;
        const nextId = this._previousId.pop();
        this.gotoView(nextId);
    }

    showAsDialog(width, height, getNextId) {
        this._isDialog = true;
        this.getNextId = getNextId;

        width = width || 420;
        height = height || 300;
        this.style.position = "fixed";
        this.style.left = `${(document.documentElement.offsetWidth / 2) - (width / 2)}px`;
        this.style.top = `${(document.documentElement.offsetHeight / 2) - (height / 2)}px`;
        this.style.width = `${width}px`;
        this.style.height = `${height}px`;

        this.removeAttribute("hidden");
        this.gotoView(0);
    }

    closeDialog() {
        delete this._isDialog;
        this._previousId.length = 0;
        this.setAttribute("hidden", "hidden");
    }
}

customElements.define("crs-wizard", Wizard);