cy.on('tap', function(event){
    // target holds a reference to the originator
    // of the event (core or element)
    let evtTarget = event.target;

    if( evtTarget === this ){
        let xPos = event.position.x;
        let yPos = event.position.y;
        console.log(xPos, yPos);
        // this.add([{
        //     group: "nodes",
        //     id: "testid",
        //     renderedPosition: {
        //         x: xPos,
        //         y: yPos,
        //     },
        // }]);
    }
});
