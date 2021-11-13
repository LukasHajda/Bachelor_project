cy.on('tap', function(event){
    let evtTarget = event.target;

    if( evtTarget === this ){
        let xPos = event.position.x;
        let yPos = event.position.y;
        console.log(xPos, yPos);
        this.add([{
            group: "nodes",
            data: { id: 'new' + Math.round( Math.random() * 100 ), label: 'new' + Math.round( Math.random() * 100 )},
            position: {
                x: xPos,
                y: yPos,
            },
        }]);
    }
});
