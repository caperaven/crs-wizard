class Wizard extends HTMLElement {
    async connectedCallback() {
        this._previousId = [];

        const content = this.innerHTML;
        this.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(result => result.text());

        this._body = this.querySelector(".body");
        this._heading = this.querySelector("h1");

        this._btnNext = this.querySelector("#btnNext");
        this._btnPrevious = this.querySelector("#btnPrevious");

        this._body.innerHTML = content;

        requestAnimationFrame(() => this.gotoView(0));

        this.nextHandler = this._next.bind(this);
        this.previousHandler = this._previous.bind(this);

        this._btnNext.addEventListener("click", this.nextHandler);
        this._btnPrevious.addEventListener("click", this.previousHandler);
    }

    async disconnectedCallback() {
        delete this._previousId;
        delete this._body;
        delete this._heading;

        this._btnNext.removeEventListener("click", this.nextHandler);
        this._btnPrevious.removeEventListener("click", this.previousHandler);

        this.nextHandler = null;
        this.previousHandler = null;
    }

    gotoView(id) {
        //todo: add animation hooks
        const target = this._body.querySelector(`[data-id="${id}"]`);
        if (target == null) return false;

        if (this._currentPage != null) {
            this._currentPage.setAttribute("hidden", "hidden");
        }

        this._currentPage = target;

        this._currentPage.removeAttribute("hidden");
        this._heading.innerText = this._currentPage.getAttribute("caption") || "";

        this._currentId = id;
        return true;
    }

    _next() {
        const currentId = this._currentId || 0;
        const nextId = this.getNextId != null ? this.getNextId(currentId) : currentId + 1;

        if (this.gotoView(nextId) == true) {
            this._previousId.push(currentId);
        }
    }

    _previous() {
        if (this._previousId.length == 0) return;
        const nextId = this._previousId.pop();
        this.gotoView(nextId);
    }
}

customElements.define("crs-wizard", Wizard);