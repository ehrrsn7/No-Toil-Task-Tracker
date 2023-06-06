# No Toil Task Tracker

## version `1.1-beta-01`

*Beta release #01 of version 1.1*

---

# Version Notes

### Stack Changes

With this version, the tech stack is changing. Instead of locally hosting the database and using redis to implement live updates through django channels, we will use firebase to host the data.

Firebase uses a document style live-update by default system, as opposed to the relational database + signals implementation from before. It essentially does the same thing but with better encapsulation.

### Live updates

Since firebase works with live updates out of the box as opposed to the `connected/disconnected` paradigm, we'll remove the connected message at the top. It's aesthetically pleasing, but not super necessary right now; it probably will come back but will be different functionally.

### New Styles

The stylesheets for the old system were a mess. I decided to do an overhaul to avoid running into walls later on down the line (and use my new components -- I will be using these more down the line as well so might as well put it into practice). The new styles are cleaner and more modular but still follows the same basic layout.

### Masonry Layout

We will be using my custom react component library to re-implement certain components. I tested and re-did certain components in the library, specifically the sidebar. I also added a pinterest-style masonry layout, so the `show more` section will be updated to use this.

### Export to csv

We will be adding imports/exports to csv. This is a feature previously thought about, but is now necessary due to different versions needed to be used in parallel (for now). We will need to export the data and import it into the previous system in order to fall back in case of bugs in the new system.

### Toast

Something we didn't implement before (because of the stylesheets mess) was toasts. Now, it should be set up so that you can just call the "toast()" function from the react-toastify library and a toast will be displayed. For example, when you lose connection, an important alert needs to be displayed, etc.

## Potential bugs

Since we are just doing a quick port from the old ui to the new with these changes without thorough testing, I am going ahead and marking this as a beta release. We will host this server alongside the other for testing in case we need to roll back.

## TODO: post screenshots demonstrating the stack here.
