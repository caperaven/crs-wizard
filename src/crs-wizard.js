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
        delete this.getNextId;

        this._btnNext.removeEventListener("click", this.nextHandler);
        this._btnPrevious.removeEventListener("click", this.previousHandler);

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
        this._heading.innerText = this._currentPage.getAttribute("caption") || "";

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