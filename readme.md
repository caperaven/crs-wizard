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

