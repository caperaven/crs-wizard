# CRS Wizard

## Introduction

This is a small webcomponent that allows you some wizard functionality.

## Usage

```html 
<crs-wizard>
    <div caption="Page 1" data-id="0" hidden>
        Page 1
    </div>

    <div caption="Page 2" data-id="1" hidden>
        Page 2
    </div>

    <div caption="Page 3" data-id="2" hidden>
        Page 3
    </div>

    <div caption="Page 4" data-id="3" hidden>
        Page 4
    </div>
</crs-wizard>

<script type="module" src="src/crs-wizard.js"></script>
```

The pages are the child elements in the root of the component.  
Each child must have three attributes:  

1. caption // what is the heading you want to show when that page is showing
1. data-id // what is the unique id of that page used for navigation. This must be a number value.
1. hidden // hide this page until it is used

The natural progression would be from 0 to N.

There are times when you don't want to navigate in a given order but have better control over what the next page must be.  
You can do this by assigning the function "getNextId" to the element.

```html
    <script>
        const wizard = document.querySelector("crs-wizard");
        wizard.getNextId = (currentId) => {
            if (currentId == 0) return 2;
            if (currentId == 2) return 1;
            if (currentId == 1) return 3;
            if (currentId == 3) return 0;
        }
    </script>
```

The styling is fairly simple and tries not to assume too much allowing you freedom on how you want to stile it.  
Please note the following.

1. The styles are prefixed in the selector with the component name to prevent bleeding. e.g. "crs-wizard .toolbar"
1. There are five css variables you can set.  
2.1 --c-header // header color  
2.2 --c-body // body color  
2.3 --c-footer // footer color  
2.4 --width // the width of crs-wizard, defaults to 100%  
2.5 --height // the height of crs-wizard, defaults to 100%  

## Dialog
If you don't want to use the wizard right away but rather as a dialog add the hidden attribute on the element.

```html
<crs-wizard hidden>
```

When you are ready to show it as a dialog you can call the element's "showAsDialog" function.  
This function takes the following parameters:

1. width numeric value to be used in pixel size
1. height numeric value to be used in pixel size
1. getNextId: optionally the function to call if you want to get the next Id.

The getNextId is useful to enable custom close conditions.  
If the component is used as a dialog and the nextId is -1 the dialog will close.

## Done
When the wizard navigation is complete it raises a "done" event.

```js
document.querySelector("button").addEventListener("click", () => {
    const fn = () => {
        console.log("done");
        wizard.removeEventListener("done", fn);
    };

    wizard.addEventListener("done", fn);
    wizard.showAsDialog(320, 200, getNextId);
});
```

## Background as a dialog
The component does not try and assume too much about the environment that it is being used in.  
Because of this it does not by default add a back layer like some modal designs use.
You can however easily add this if this is something you want.

```js
document.querySelector("button").addEventListener("click", () => {
    const background = document.createElement("div");
    background.style.position = "fixed";
    background.style.top = "0";
    background.style.left = "0";
    background.style.width = "100vw";
    background.style.height = "100vh";
    background.style.background = "black";
    background.style.opacity = "0.5";
    background.style.zIndex = "10";
    document.documentElement.appendChild(background);

    const fn = () => {
        console.log("done");
        wizard.removeEventListener("done", fn);
        document.documentElement.removeChild(background);
    };

    wizard.addEventListener("done", fn);
    wizard.showAsDialog(320, 200, getNextId);
    wizard.style.zIndex = "100";
});
```

## Prevent navigation
There are cases when you don't want the user to move forward or backward until they are done with a task.
You can prevent navigation by adding these functions:

1. allowNext
1. allowPrevious

```js
wizard.allowNext = (currentId) => currentId == 2 ? false : true;
wizard.allowPrevious = (currentId) => currentId == 2 ? false : true;
```

If they are not there, the wizard will assume it can just navigate unhindered.  
Technically the wizard will assume navigation unless you provide a false value from the above functions.

