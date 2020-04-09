# react-routing-conundrum

This app demonstrates an issue with a functional component with inputs where changes to the input are meant to 
update the URL search query.  The search query is meant to be the source of truth for the state of the app, so someone
could theoretically deep link to a given state.  

This is a simplified version of a component I built for a production site.  I thought I made the right choices - 
functional component with hooks instead of a `React.Component` class and using `<Redirect>` for declaratively setting the URL parms.  
When I combined all of the pieces however, the inputs lost focus any time I made changes to the state.  That's because 
changes to the state resulted in a `<Redirect>` which resulted in a new instance of this functional component.  Once the 
new instance rendered, the previous inputs that had focus no longer existed, so focus reverted to `body`.  That means you 
couldn't type in the input field and you couldn't tab through the checkboxes while making changes along the way.  

The mechanism I worked out to keep the focus involved two things: 

1. whenever the state changes, keep track of the id of the item with focus
2. after re-render, use the `useEffect` hook to set the focus again on the new element with the same id.  

Is there a better way to deal with this?  Would I still have this problem if I used a `React.Component` class instead 
of a functional component?  
